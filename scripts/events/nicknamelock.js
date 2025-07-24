const fs = require("fs");
const path = require("path");
const dataPath = path.join(__dirname, "..", "data", "savednicks.json");

module.exports = {
  config: {
    name: "nicknamelock",
    eventType: ["change_nickname"]
  },

  onEvent: async function ({ event, api }) {
    const threadID = event.threadID;
    const userID = event.participantID;

    if (!fs.existsSync(dataPath)) return;

    const data = JSON.parse(fs.readFileSync(dataPath));
    if (!data[threadID] || !data[threadID].locked) return;

    const savedNick = data[threadID].nicks?.[userID] || "";

    // Only change if not already same
    if (event.nick !== savedNick) {
      await api.changeNickname(savedNick, threadID, userID);
    }
  }
};