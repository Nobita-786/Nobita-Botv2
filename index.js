const { spawn } = require("child_process");
const log = require("./logger/log.js");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Yeh Render ko batata hai ki bot chal raha hai
app.get("/", (req, res) => {
  res.send("🟢 Raj Bot is running!");
});

app.listen(PORT, () => {
  console.log(`✅ Express server chal raha hai port ${PORT} par`);
});

// ✅ Yeh extra info console me dikhayega
console.log("🧠 ENVIRONMENT:", process.env.NODE_ENV);
console.log("📂 Current Folder:", __dirname);

// ✅ Ab Goat.js ko launch karte hain aur error bhi pakadte hain
function startProject() {
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit", // Isse sab console me dikhai dega
    shell: true
  });

  child.on("close", (code) => {
    console.log(`⚠️ Goat.js band ho gaya, code: ${code}`);
    if (code == 2) {
      log.info("🔄 Dubara start ho raha hai...");
      startProject();
    }
  });

  child.on("error", (err) => {
    console.error("❌ Goat.js start karte waqt error:", err);
  });
}

startProject();