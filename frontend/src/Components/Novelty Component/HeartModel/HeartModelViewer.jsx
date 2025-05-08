import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  useGLTF,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// Keep all existing SYMPTOM_DETAILS unchanged
const SYMPTOM_DETAILS = {
  "Chest Pain": {
    meshName: "Heart_Main",
    description:
      "Chest pain may indicate reduced blood flow to heart muscle (angina or heart attack).",
  },
  "Left Arm Pain": {
    meshName: "Artery_Left",
    description:
      "Pain in the left arm is commonly referred from the heart during cardiac events.",
  },
  "Jaw Pain": {
    meshName: "Aorta",
    description:
      "Jaw pain can be part of heart attack symptoms due to shared nerve pathways.",
  },
  "Shortness of Breath": {
    meshName: "Pulmonary_Vein",
    description:
      "Shortness of breath can result from fluid buildup when the heart pumps inefficiently.",
  },
};

// Heart Mesh component preserved exactly as original - no color changes
function HeartMesh({ affectedSymptoms = [], focusPart, cameraRef }) {
  const { scene } = useGLTF("/models/heart/heart.glb");
  const pulseRefs = useRef([]);
  const originalColors = useRef(new Map());
  const heartRef = useRef();
  const groupRef = useRef();

  useEffect(() => {
    pulseRefs.current = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        const shouldHighlight = affectedSymptoms.some((symptom) =>
          name.includes(symptom.toLowerCase().replace(/\s/g, ""))
        );

        if (!originalColors.current.has(child.uuid)) {
          originalColors.current.set(
            child.uuid,
            child.material.emissive.clone()
          );
        }

        child.material = child.material.clone();
        child.material.emissive = shouldHighlight
          ? new THREE.Color("#e6317d")
          : originalColors.current.get(child.uuid) || new THREE.Color("#111");

        if (shouldHighlight) {
          pulseRefs.current.push(child);
        }
      }
    });

    // Improved centering logic
    if (heartRef.current && groupRef.current) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());

      // Apply centering to the group instead of the scene
      groupRef.current.position.x = -center.x;
      groupRef.current.position.y = -center.y;
      groupRef.current.position.z = -center.z;

      // Adjust vertical position (slightly up)
      groupRef.current.position.y += 0.2;
    }
  }, [scene, affectedSymptoms]);

  // Rest of the HeartMesh component remains unchanged
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    pulseRefs.current.forEach((mesh) => {
      mesh.material.emissiveIntensity = 0.3 + Math.sin(t * 4) * 0.2;
    });

    // Add subtle rotation for visual interest when not being controlled
    if (heartRef.current && !focusPart) {
      heartRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
    }
  });

  useEffect(() => {
    if (focusPart && cameraRef?.current?.object) {
      const meshName = SYMPTOM_DETAILS[focusPart]?.meshName;
      const target = scene.getObjectByName(meshName);
      if (target) {
        const pos = new THREE.Vector3();
        target.getWorldPosition(pos);
        gsap.to(cameraRef.current.object.position, {
          duration: 1,
          x: pos.x + 1,
          y: pos.y + 1,
          z: pos.z + 3,
          onUpdate: () => cameraRef.current.object.lookAt(pos),
        });
      }
    }
  }, [focusPart, cameraRef, scene]);

  return (
    <group ref={groupRef}>
      <primitive ref={heartRef} object={scene} scale={1.5} />
    </group>
  );
}

export default function HeartModelViewer({
  affectedSymptoms = [],
  compact = false,
  autoRotate = true, // Added new prop with default true
}) {
  const cameraRef = useRef();
  const [focusPart] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <div className="w-full">
      {/* Clean, simple frame that properly contains the heart model */}
      <div className="w-full overflow-hidden bg-white rounded-lg shadow">
        {/* Main 3D viewer container with clean design */}
        <div
          className={`w-full ${compact ? "h-48" : "h-[400px]"} relative`}
          style={{
            background: "#ffffff",
          }}
        >
          {/* Loading indicator that shows before canvas loads */}
          <div className="absolute inset-0 z-0 flex items-center justify-center bg-white">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
              <p className="mt-3 font-medium text-gray-600">
                Loading 3D Heart...
              </p>
            </div>
          </div>

          <Canvas
            camera={{ position: [0, 0, compact ? 5 : 4.5], fov: 40 }}
            shadows
          >
            <color attach="background" args={["#ffffff"]} />
            <fog attach="fog" args={["#ffffff", 8, 30]} />

            {/* Lighting setup - preserving original colors */}
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1.2}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight
              position={[-5, 5, -5]}
              intensity={0.6}
              color="#fee"
            />
            <directionalLight
              position={[0, -5, 0]}
              intensity={0.3}
              color="#eef"
            />

            {/* Environment map for realistic reflections */}
            <Environment preset="city" />

            <Suspense fallback={<Html center>Loading 3D Heart...</Html>}>
              <HeartMesh
                affectedSymptoms={affectedSymptoms}
                focusPart={focusPart}
                cameraRef={cameraRef}
                isInteracting={isInteracting}
              />
            </Suspense>

            <OrbitControls
              ref={cameraRef}
              enableZoom={!compact}
              enablePan={!compact}
              enableRotate
              autoRotate={autoRotate && !isInteracting} // Enable auto-rotation by default
              autoRotateSpeed={2} // Reduced for smoother rotation
              minDistance={3}
              maxDistance={10}
              dampingFactor={0.1}
              rotateSpeed={0.7}
              target={[0, 0, 0]}
              onStart={() => setIsInteracting(true)}
              onEnd={() => setTimeout(() => setIsInteracting(false), 1500)} // Resume rotation after interaction
            />

            <PerspectiveCamera
              makeDefault
              position={[0, 0, compact ? 5 : 4.5]}
              fov={40}
              near={0.1}
              far={100}
            />
          </Canvas>

          {/* Information overlay */}
          {!compact && (
            <div className="absolute px-3 py-2 text-xs text-gray-700 bg-white rounded-md pointer-events-none bottom-2 left-2 right-2 bg-opacity-80">
              Click and drag to rotate | Scroll to zoom
              {autoRotate && " | Auto-rotating"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
