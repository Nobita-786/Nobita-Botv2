const fs = require("fs");
const nickLockPath = __dirname + "/../data/nicknamelock.json";
const savedNicksPath = __dirname + "/../data/savednicks.json";

if (!fs.existsSync(nickLockPath)) fs.writeFileSync(nickLockPath, "{}");
if (!fs.existsSync(savedNicksPath)) fs.writeFileSync(savedNicksPath, "{}");

module.exports = {
  config: {
    name: "nicknamelock",
    version: "1.0",
    author: "Raj",
    description: "Automatically reverts nickname changes if locked",
    eventType: ["change_thread_nickname"]
  },

  async run({ api, event }) {
    const { threadID, participantID, nickname } = event;
    const nickLocks = JSON.parse(fs.readFileSync(nickLockPath));
    const savedNicks = JSON.parse(fs.readFileSync(savedNicksPath));

    if (!nickLocks[threadID]) return;

    // agar saved nickname nahi hai, pehle save karo
    if (!savedNicks[threadID]) savedNicks[threadID] = {};
    if (!savedNicks[threadID][participantID]) {
      savedNicks[threadID][participantID] = nickname || null;
      fs.writeFileSync(savedNicksPath, JSON.stringify(savedNicks, null, 2));
      return;
    }

    const originalNick = savedNicks[threadID][participantID];

    // agar nickname badal gaya, to wapas karo
    if (nickname !== originalNick) {
      api.changeNickname(originalNick || "", threadID, participantID);
    }
  }
};