const fs = require("fs");
const path = __dirname + "/../data/nicknamelock.json";

module.exports = {
  config: {
    name: "nicknamelock",
    version: "1.0",
    author: "Raj",
    type: "event"
  },

  async run({ event, api }) {
    if (event.logMessageType !== "log:thread-nickname") return;

    const data = JSON.parse(fs.readFileSync(path));
    const threadID = event.threadID;

    if (!data[threadID]) return;

    const changedID = event.logMessageData.participant_id;
    const oldNickname = event.logMessageData.oldNickname || "";
    const currentBotID = api.getCurrentUserID();

    if (changedID === currentBotID) return;

    try {
      await api.changeNickname(oldNickname || "", threadID, changedID);
    } catch (e) {
      console.log("Failed to revert nickname:", e.message);
    }
  }
};
