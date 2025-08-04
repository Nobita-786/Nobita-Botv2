const fs = require("fs-extra");
const path = __dirname + "/../../cache/fulllock.json";

if (!fs.existsSync(path)) fs.writeJsonSync(path, {});

module.exports = {
  config: {
    name: "fulllock",
    version: "1.0",
    author: "Raj",
    description: "Enable or disable full lock in group.",
    usage: "#fulllock on | off",
    cooldown: 3,
    permissions: [1],
    category: "group"
  },

  onStart: async function ({ api, event, args, message }) {
    const threadID = event.threadID;
    const data = fs.readJsonSync(path) || {};

    if (args[0] === "on") {
      const info = await api.getThreadInfo(threadID);
      const nicknames = {};
      for (const user of info.userInfo) {
        const id = user.id;
        nicknames[id] = info.nicknames?.[id] || "";
      }

      data[threadID] = {
        name: info.threadName,
        image: info.imageSrc || null,
        nicknames
      };

      fs.writeJsonSync(path, data, { spaces: 2 });
      return message.reply("✅ Full Lock is now ON. Name, DP, and nicknames will be reverted.");
    }

    if (args[0] === "off") {
      delete data[threadID];
      fs.writeJsonSync(path, data, { spaces: 2 });
      return message.reply("🔓 Full Lock is now OFF.");
    }

    return message.reply("❗Usage: #fulllock on | off");
  }
};
