const fs = require("fs");
const path = require("path");
const lockFile = path.join(__dirname, "../data/nicknamelock.json");
const saveFile = path.join(__dirname, "../data/savednicks.json");

module.exports = {
  config: {
    name: "nicknamelock",
    type: "event"
  },

  async onEvent({ event, api }) {
    if (event.logMessageType !== "log:user-nickname") return;

    const threadID = event.threadID;
    const changedUID = Object.keys(event.logMessageData.nicknames || {})[0];
    if (!changedUID) return;

    if (!fs.existsSync(lockFile) || !fs.existsSync(saveFile)) return;

    const locks = JSON.parse(fs.readFileSync(lockFile));
    const saved = JSON.parse(fs.readFileSync(saveFile));

    if (!locks[threadID] || !saved[threadID] || !saved[threadID][changedUID]) return;

    const originalNick = saved[threadID][changedUID];

    try {
      await api.changeNickname(originalNick, threadID, changedUID);
      console.log(`[NicknameLock] Reverted nickname for ${changedUID}`);
    } catch (e) {
      console.log("[NicknameLock] Error changing nickname:", e.message);
    }
  }
};
