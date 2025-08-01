const fs = require("fs");
const path = __dirname + "/../../cache/nicknamelock.json";

module.exports.config = {
  name: "nicknamelock",
  version: "1.0.0",
  hasPermssion: 1,
  author: "Raj",
  description: "Nickname lock on/off",
  commandCategory: "system",
  usages: "[on/off]",
  cooldowns: 5
};

module.exports.onStart = async function ({ api, event, args }) {
  if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
  const data = JSON.parse(fs.readFileSync(path));
  const threadID = event.threadID;
  const mode = args[0];

  if (mode === "on") {
    data[threadID] = true;
    api.sendMessage("✅ Nickname lock enabled.", threadID);
  } else if (mode === "off") {
    delete data[threadID];
    api.sendMessage("❌ Nickname lock disabled.", threadID);
  } else {
    return api.sendMessage("⚙️ Use: nicknamelock on / off", threadID);
  }

  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};