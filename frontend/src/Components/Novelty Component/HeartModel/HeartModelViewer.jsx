import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const SYMPTOM_DETAILS = {
  "Chest Pain": {
    meshName: "Heart_Main",
    description: "Chest pain may indicate reduced blood flow to heart muscle (angina or heart attack).",
  },
  "Left Arm Pain": {
    meshName: "Artery_Left",
    description: "Pain in the left arm is commonly referred from the heart during cardiac events.",
  },
  "Jaw Pain": {
    meshName: "Aorta",
    description: "Jaw pain can be part of heart attack symptoms due to shared nerve pathways.",
  },
  "Shortness of Breath": {
    meshName: "Pulmonary_Vein",
    description: "Shortness of breath can result from fluid buildup when the heart pumps inefficiently.",
  },
};

function HeartMesh({ affectedSymptoms = [], focusPart, cameraRef }) {
  const { scene } = useGLTF("/models/heart/heart.glb");
  const pulseRefs = useRef([]);
  const originalColors = useRef(new Map());

  useEffect(() => {
    pulseRefs.current = [];
    scene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        const shouldHighlight = affectedSymptoms.some((symptom) =>
          name.includes(symptom.toLowerCase().replace(/\s/g, ""))
        );

        if (!originalColors.current.has(child.uuid)) {
          originalColors.current.set(child.uuid, child.material.emissive.clone());
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
  }, [scene, affectedSymptoms]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    pulseRefs.current.forEach((mesh) => {
      mesh.material.emissiveIntensity = 0.3 + Math.sin(t * 4) * 0.2;
    });
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

  return <primitive object={scene} scale={2.5} />;
}

export default function HeartModelViewer({ affectedSymptoms = [] }) {
  const cameraRef = useRef();
  const [focusPart] = useState(null); // no buttons to set focusPart anymore

  return (
    <div className="w-full p-4 bg-white border shadow-md rounded-xl">
      <div className="w-full h-[600px] overflow-hidden border shadow-lg rounded-xl">
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <Suspense fallback={<Html>Loading 3D Heart...</Html>}>
            <HeartMesh
              affectedSymptoms={affectedSymptoms}
              focusPart={focusPart}
              cameraRef={cameraRef}
            />
          </Suspense>
          <OrbitControls ref={cameraRef} enableZoom enablePan enableRotate />
        </Canvas>
      </div>
    </div>
  );
}