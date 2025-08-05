const fs = require("fs");
const path = __dirname + "/../cmds/cache/fulllock.json";

module.exports = {
  config: {
    name: "fulllock",
    eventType: ["log:thread-name", "log:thread-nickname"]
  },

  onStart: async function ({ event, api, threadsData, usersData }) {
    const threadID = event.threadID;
    const senderID = event.author;

    // File check
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    const data = JSON.parse(fs.readFileSync(path));

    if (!data[threadID] || data[threadID].status !== true) return;

    const threadInfo = await api.getThreadInfo(threadID);

    // Nickname change
    if (event.logMessageType === "log:thread-nickname") {
      const changedID = event.logMessageData.participant_id;

      let oldNick = threadInfo.nicknames?.[changedID];

      if (!oldNick) {
        const user = await usersData.get(changedID);
        oldNick = user.name;
      }

      await api.changeNickname(oldNick, threadID, changedID);
    }

    // Group name change
    if (event.logMessageType === "log:thread-name") {
      const oldName = data[threadID].groupName || threadInfo.threadName;
      await api.setTitle(oldName, threadID);
    }
  }
};