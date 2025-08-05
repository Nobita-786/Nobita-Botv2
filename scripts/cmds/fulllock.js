const fs = require("fs");
const path = __dirname + "/cache/fulllock.json";

module.exports = {
  config: {
    name: "fulllock",
    version: "1.0",
    author: "Raj",
    description: "Enable or disable full group lock",
    category: "group",
    usage: "fulllock on/off",
    cooldown: 3,
    role: 1
  },

  onStart: async function ({ message, args, event }) {
    if (!args[0]) return message.reply("⚠️ Usage: fulllock on/off");

    let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
    const status = args[0].toLowerCase();

    if (status === "on") {
      data.status = true;
      data.groupName = event.threadName;
      data.groupImage = (await global.api.getThreadInfo(event.threadID)).imageSrc;
      data.nicknames = {};
      const threadInfo = await global.api.getThreadInfo(event.threadID);
      threadInfo.userInfo.forEach(user => {
        data.nicknames[user.id] = threadInfo.nicknames[user.id] || "";
      });
      data.whitelist = [event.senderID]; // allow only bot owner
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply("🔒 Full lock mode enabled!");
    }

    if (status === "off") {
      data.status = false;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply("🔓 Full lock mode disabled.");
    }

    message.reply("⚠️ Usage: fulllock on/off");
  }
};