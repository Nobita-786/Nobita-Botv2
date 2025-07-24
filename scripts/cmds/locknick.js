const fs = require("fs");
const path = __dirname + "/../data/nicknamelock.json";

module.exports = {
  config: {
    name: "locknick",
    version: "1.0",
    author: "Raj",
    role: 1,
    shortDescription: "Nickname lock on/off",
    longDescription: "Enable or disable nickname lock in group",
    category: "group",
    guide: { en: "{p}locknick on/off" }
  },

  onStart({ message, event, args }) {
    if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");

    const data = JSON.parse(fs.readFileSync(path));
    const threadID = event.threadID;

    if (args[0] === "on") {
      data[threadID] = true;
      message.reply("✅ Nickname lock enabled!");
    } else if (args[0] === "off") {
      delete data[threadID];
      message.reply("❌ Nickname lock disabled!");
    } else {
      return message.reply("⚠️ Use: locknick on/off");
    }

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  }
};
