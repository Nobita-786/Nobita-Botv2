const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "nicknamelock",
    eventType: ["log:user-nickname"],
    author: "Raj",
    description: "Reverts nickname changes if locked."
  },

  onStart: async function ({ event, api }) {
    const filePath = path.join(__dirname, "..", "cmds", "cache", "nicknamelock.json");
    if (!fs.existsSync(filePath)) return;

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const threadID = event.threadID;
    const uid = event.logMessageData.participant_id;

    if (data[threadID] && data[threadID].enabled) {
      const lockedNick = data[threadID].nicknames[uid];
      if (lockedNick !== undefined) {
        await api.changeNickname(lockedNick, threadID, uid);
      }
    }
  }
};