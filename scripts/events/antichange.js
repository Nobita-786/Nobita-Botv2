const fs = require("fs");
const file = __dirname + "/../cache/antichange.json";

module.exports = {
  config: {
    name: "antichange",
    eventType: ["log:user-nickname", "log:thread-name"],
    version: "1.0",
    author: "Raj"
  },

  onEvent: async function ({ event, api }) {
    if (!fs.existsSync(file)) return;
    const data = JSON.parse(fs.readFileSync(file));
    const tid = event.threadID;

    if (!data[tid]) return;

    // Revert nickname change
    if (event.logMessageType === "log:user-nickname") {
      const { participantID, logMessageData } = event;
      const oldNick = logMessageData.oldNickname || "";
      await api.changeNickname(oldNick, tid, participantID);
    }

    // Revert group name change
    if (event.logMessageType === "log:thread-name") {
      const { logMessageData } = event;
      const oldName = logMessageData.oldName || "Group";
      await api.setTitle(oldName, tid);
    }
  }
};
