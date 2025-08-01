const fs = require("fs-extra");
const path = __dirname + "/../cache/nicknamelock.json";

module.exports = {
  config: {
    name: "nicknameLock",
    eventType: ["log:user-nickname"],
    version: "1.0.0",
    author: "Raj",
    description: "Auto revert nickname changes if locked"
  },

  run: async function ({ event, api }) {
    // Auto create file if missing
    if (!fs.existsSync(path)) return;

    const data = JSON.parse(fs.readFileSync(path));
    if (!data.enabled) return;

    const allowedUIDs = data.allowed || [];
    const changedBy = event.author;

    if (!allowedUIDs.includes(changedBy)) {
      // Revert nickname to default (or blank)
      try {
        await api.changeNickname(null, event.threadID, event.logMessageData.participant_id);
        api.sendMessage("⚠️ Nickname changes are locked. Your change has been reverted.", event.threadID);
      } catch (err) {
        console.error("Failed to revert nickname:", err);
      }
    }
  }
};
