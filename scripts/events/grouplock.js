const fs = require("fs");
const lockPath = __dirname + "/../script/cmds/nix/fullLock.json";

module.exports = {
  config: {
    name: "groupLock",
    eventType: ["log:thread-name", "log:thread-image", "log:thread-nickname"],
    version: "2.0",
    credits: "ArYAN"
  },

  run: async function ({ api, event }) {
    const threadID = event.threadID;
    if (!fs.existsSync(lockPath)) return;

    const fullLock = JSON.parse(fs.readFileSync(lockPath));
    if (!fullLock[threadID]) return;

    const oldName = fullLock[threadID].name;

    if (event.logMessageType === "log:thread-name") {
      await api.setTitle(oldName, threadID);
      api.sendMessage("🚫 Group name is locked.", threadID);
    }

    if (event.logMessageType === "log:thread-image") {
      await api.changeGroupImage(null, threadID);
      api.sendMessage("🚫 Group image is locked.", threadID);
    }

    if (event.logMessageType === "log:thread-nickname") {
      const uid = event.logMessageData.participantId;
      const oldNickname = event.logMessageData.oldNickname || "";
      await api.changeNickname(oldNickname, threadID, uid);
      api.sendMessage("🚫 Nickname is locked.", threadID);
    }
  }
};
