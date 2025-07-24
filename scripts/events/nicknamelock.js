const fs = require("fs");
const path = __dirname + "/../data/nicknamelock.json";

module.exports = {
  config: {
    name: "nicknamelock",
    version: "1.0",
    author: "Raj",
    type: "event"
  },

  async run({ event, api, Users }) {
    if (event.logMessageType !== "log:thread-nickname") return;

    const threadID = event.threadID;
    const userID = event.logMessageData.participant_id;
    const newNick = event.logMessageData.nickname || "";
    const oldNick = event.logMessageData.oldNickname || "";

    // Only continue if nickname actually changed
    if (newNick === oldNick) return;

    const lockPath = path;
    const nickPath = __dirname + "/../data/savednicks.json";

    if (!fs.existsSync(lockPath)) return;
    const lockData = JSON.parse(fs.readFileSync(lockPath));
    if (!lockData[threadID]) return; // nickname lock is off

    if (!fs.existsSync(nickPath)) fs.writeFileSync(nickPath, "{}");
    const savedNicks = JSON.parse(fs.readFileSync(nickPath));

    // Ensure group and user entry exists
    if (!savedNicks[threadID]) savedNicks[threadID] = {};
    if (!savedNicks[threadID][userID]) {
      savedNicks[threadID][userID] = oldNick;
      fs.writeFileSync(nickPath, JSON.stringify(savedNicks, null, 2));
    }

    const revertNick = savedNicks[threadID][userID];

    // Ignore bot changing its own nick
    const botID = api.getCurrentUserID();
    if (userID === botID) return;

    try {
      await api.changeNickname(revertNick, threadID, userID);
      const user = await Users.getData(userID);
      api.sendMessage(`${user.name}, nickname lock is active. Nickname reverted.`, threadID);
    } catch (err) {
      console.log("Nickname revert failed:", err.message);
    }
  }
};