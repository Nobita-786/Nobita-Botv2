const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../cmds/nix/fullLock.json");

module.exports = {
  config: {
    name: "groupLock",
    eventType: ["log:thread-name", "log:thread-image", "log:thread-nickname"],
    version: "1.0.0",
    author: "ArYAN"
  },

  run: async function ({ api, event }) {
    if (!fs.existsSync(filePath)) return;
    const fullLock = JSON.parse(fs.readFileSync(filePath));
    const threadID = event.threadID;

    if (!fullLock[threadID]) return;

    const adminIDs = ["100074525696138",
"100001200784032",
"61575494292207"];

    if (adminIDs.includes(event.author)) return;

    try {
      if (event.logMessageType === "log:thread-name") {
        await api.setTitle(fullLock[threadID].name || "Locked Group", threadID);
      }

      if (event.logMessageType === "log:thread-image") {
        await api.changeGroupImage(null, threadID);
      }

      if (event.logMessageType === "log:thread-nickname") {
        const { participantId, oldNickname } = event.logMessageData;
        if (oldNickname) {
          await api.changeNickname(oldNickname, threadID, participantId);
        }
      }
    } catch {}
  }
};