const fs = require("fs");
const path = __dirname + "/../cmds/cache/fulllock.json";

module.exports = {
  config: {
    name: "fulllock",
    eventType: ["log:thread-name", "log:user-nickname"],
    category: "group"
  },

  onEvent: async function ({ event, api }) {
    if (!fs.existsSync(path)) return;
    let data = JSON.parse(fs.readFileSync(path));
    if (!data[event.threadID]) return;

    const allowed = data[event.threadID].allowed || [];
    const author = String(event.author);
    
    // ✅ Group Name Revert
    if (event.logMessageType === "log:thread-name") {
      if (allowed.includes(author)) return;
      const oldName = data[event.threadID].groupName;
      if (!oldName) return;

      try {
        await api.setTitle(oldName, event.threadID);
      } catch (e) {}
    }

    // ✅ Nickname Revert
    if (event.logMessageType === "log:user-nickname") {
      if (allowed.includes(author)) return;
      const nickData = data[event.threadID].nicknames || {};
      const target = Object.keys(event.logMessageData).find(k => k !== "nickname");
      const originalNick = nickData[target];

      if (originalNick) {
        try {
          await api.changeNickname(originalNick, event.threadID, target);
        } catch (e) {}
      }
    }
  }
};