const { spawn } = require("child_process");

exports.analyzeSymptoms = (req, res) => {
  const { symptoms } = req.body;

  const python = spawn(
    "C:\\Users\\Savid\\AppData\\Local\\Programs\\Python\\Python313\\python.exe",
    ["./ai-model/model.py", JSON.stringify(symptoms)]
  );
  /*const python = spawn("python", [
  "./ai-model/model.py",
  JSON.stringify(symptoms),
]);
*/

  let result = "";
  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  python.on("close", (code) => {
    return res.json({ prediction: result.trim() });
  });
};
