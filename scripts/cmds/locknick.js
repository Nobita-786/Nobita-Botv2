const fs = require("fs");
const path = __dirname + "/../data/nicknamelock.json";

module.exports = {
  config: {
    name: "locknick",
    version: "1.0",
    author: "Raj",
    role: 1,
    shortDescription: "Lock nicknames in group",
    category: "group",
    guide: "{p}locknick on / off"
  },

  onStart({ event, message, args }) {
    const threadID = event.threadID;
    if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");
    const data = JSON.parse(fs.readFileSync(path));

    if (args[0] === "on") {
      data[threadID] = true;
      message.reply("✅ Nickname lock is now ON.");
    } else if (args[0] === "off") {
      delete data[threadID];
      message.reply("❌ Nickname lock is now OFF.");
    } else {
      return message.reply("⚠️ Use: locknick on / off");
    }

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  }
};