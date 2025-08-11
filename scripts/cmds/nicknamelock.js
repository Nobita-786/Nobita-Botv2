const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "nicknamelock",
    author: "Raj",
    role: 2,
    shortDescription: "Lock/unlock nicknames",
    longDescription: "Locks the current nicknames of all members so they can't be changed.",
    category: "group",
    guide: "{p}nicknamelock on\n{p}nicknamelock off"
  },

  onStart: async function ({ message, api, event, args }) {
    const filePath = path.join(__dirname, "cache", "nicknamelock.json");
    if (!fs.existsSync(path.join(__dirname, "cache"))) fs.mkdirSync(path.join(__dirname, "cache"));

    let data = {};
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    const threadID = event.threadID;

    if (!args[0]) {
      return message.reply("Use: nicknamelock on/off");
    }

    if (args[0].toLowerCase() === "on") {
      const threadInfo = await api.getThreadInfo(threadID);
      const nicknames = {};
      for (const mem of threadInfo.participantIDs) {
        nicknames[mem] = threadInfo.nicknames?.[mem] || threadInfo.userInfo.find(u => u.id === mem)?.name || "";
      }
      data[threadID] = { enabled: true, nicknames };
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      message.reply("✅ Nickname lock enabled for this group.");
    }

    else if (args[0].toLowerCase() === "off") {
      if (data[threadID]) {
        data[threadID].enabled = false;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        message.reply("❌ Nickname lock disabled for this group.");
      } else {
        message.reply("❌ Nickname lock was not enabled for this group.");
      }
    }

    else {
      message.reply("Use: nicknamelock on/off");
    }
  }
};
