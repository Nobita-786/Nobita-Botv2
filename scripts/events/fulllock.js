const fs = require("fs");
const axios = require("axios");
const path = __dirname + "/../cmds/cache/fulllock.json";

module.exports = {
  config: {
    name: "fulllock",
    version: "1.0",
    author: "Raj",
    description: "Event to enforce full group lock",
    dependencies: {}
  },

  onEvent: async function ({ event, api, usersData, threadsData }) {
    if (!fs.existsSync(path)) return;
    const data = JSON.parse(fs.readFileSync(path));
    const threadID = event.threadID;
    if (!data[threadID]) return;

    // Get thread info
    let threadInfo;
    try {
      threadInfo = await api.getThreadInfo(threadID);
    } catch (e) {
      return;
    }

    const admins = threadInfo.adminIDs.map(a => a.id);
    const isAdmin = admins.includes(event.senderID);

    // 🔒 Block non-admin messages
    if (event.body && !isAdmin) {
      return api.sendMessage("🔒 Group is in full lock. You cannot send messages.", threadID, event.messageID);
    }

    // 🔁 Revert Nickname Change
    if (event.logMessageType === "log:thread-nickname") {
      const changedID = event.logMessageData.participant_id;
      const oldNicknames = data[threadID].nicknames || {};
      const oldName = oldNicknames[changedID] || (await usersData.get(changedID)).name;
      try {
        api.changeNickname(oldName, threadID, changedID);
      } catch (e) {}
    }

    // 🔁 Revert Group Name Change
    if (event.logMessageType === "log:thread-name") {
      const originalName = data[threadID].groupName || threadInfo.threadName;
      try {
        setTimeout(() => api.setTitle(originalName, threadID), 2000);
      } catch (e) {}
    }

    // 🔁 Revert Group Image (DP) Change
    if (event.logMessageType === "log:thread-image") {
      const imageUrl = data[threadID].groupImage;
      if (!imageUrl) return;
      try {
        const imageStream = await axios.get(imageUrl, { responseType: "stream" });
        api.changeGroupImage(imageStream.data, threadID);
      } catch (e) {}
    }
  }
};