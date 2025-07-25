const { spawn } = require("child_process");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Raj Bot is running!");
});

app.listen(PORT, () => {
  console.log(`[✅] Express server running on port ${PORT}`);
});

function startProject() {
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  child.on("close", (code) => {
    console.log(`[ℹ️] Goat.js process exited with code ${code}`);
    if (code == 2) {
      console.log("[🔄] Restarting Project...");
      startProject();
    }
  });
}

startProject();