const express = require("express");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();

// Healthcheck endpoint (Render ke liye)
app.get("/", (req, res) => {
  res.send("✅ GoatBot is running fine on Render!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Healthcheck server running on port ${PORT}`);
});

// ---- GoatBot start ----
function startProject() {
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });

  // Agar Goat.js crash kare to restart
  child.on("close", (code) => {
    if (code === 2) {
      console.log("♻️ Restarting GoatBot...");
      startProject();
    } else {
      console.log(`❌ GoatBot exited with code ${code}`);
    }
  });

  // Agar Goat.js update kare appstate.json, to usko auto-save rakho
  child.on("exit", () => {
    const appStateFile = path.join(__dirname, "appstate.json");
    if (fs.existsSync(appStateFile)) {
      try {
        const appState = JSON.parse(fs.readFileSync(appStateFile, "utf8"));
        fs.writeFileSync(appStateFile, JSON.stringify(appState, null, 2));
        console.log("💾 appstate.json refreshed");
      } catch (err) {
        console.error("⚠️ Failed to refresh appstate.json:", err.message);
      }
    }
  });
}

startProject();
