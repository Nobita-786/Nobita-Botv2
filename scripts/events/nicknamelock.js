const fs = require("fs");
const nickLockPath = __dirname + "/../data/nicknamelock.json";
const savedNickPath = __dirname + "/../data/savednicks.json";

module.exports = {
  config: {
    name: "nicknamelock",
    eventType: ["log:user-nickname"],
    version: "1.0",
    credits: "Raj",
    category: "group" // ✅ Yeh line add karo
  },

  run: async function ({ api, event }) {
    const tid = event.threadID;
    const uid = event.logMessageData.participant_id;

    if (!fs.existsSync(nickLockPath)) fs.writeFileSync(nickLockPath, "{}");
    if (!fs.existsSync(savedNickPath)) fs.writeFileSync(savedNickPath, "{}");

    const nickLockData = JSON.parse(fs.readFileSync(nickLockPath));
    const savedNickData = JSON.parse(fs.readFileSync(savedNickPath));

    if (!nickLockData[tid]) return;

    const currentNick = event.logMessageData.nickname;

    if (!savedNickData[tid]) savedNickData[tid] = {};
    if (!savedNickData[tid][uid]) {
      savedNickData[tid][uid] = currentNick || "";
      fs.writeFileSync(savedNickPath, JSON.stringify(savedNickData, null, 2));
      return;
    }

    const lockedNick = savedNickData[tid][uid];
    if (currentNick !== lockedNick) {
      api.changeNickname(lockedNick, tid, uid);
    }
  }
};