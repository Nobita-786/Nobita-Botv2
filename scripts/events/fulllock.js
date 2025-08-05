const fs = require("fs");
const axios = require("axios");
const path = __dirname + "/../cmds/cache/fulllock.json";

module.exports = {
  config: {
    name: "fulllock",
    version: "1.0",
    author: "Raj",
    description: "Full lock: revert name, nick, image, block messages",
    category: "event"
  },

  onEvent: async function ({ event, api, usersData }) {
    if (!fs.existsSync(path)) return;

    const data = JSON.parse(fs.readFileSync(path));
    const threadID = event.threadID;
    if (!data[threadID]) return;

    const threadInfo = await api.getThreadInfo(threadID);
    const admins = threadInfo.adminIDs.map(a => a.id);
    const isAdmin = admins.includes(event.senderID);

    // 🚫 Block messages from non-admins
    if (event.body && !isAdmin) {
      return api.sendMessage("🔒 Group is in full lock. You cannot send messages.", threadID, event.messageID);
    }

    // 🔁 Revert nickname change
    if (event.logMessageType === "log:thread-nickname") {
      const changedID = event.logMessageData.participant_id;
      const oldName = threadInfo.nicknames?.[changedID] || (await usersData.get(changedID)).name;
      api.changeNickname(oldName, threadID, changedID);
    }

    // 🔁 Revert group name
    if (event.logMessageType === "log:thread-name") {
      const oldName = data[threadID].groupName || "Locked Group";
      setTimeout(() => api.setTitle(oldName, threadID), 1000);
    }

    // 🔁 Revert group image
    if (event.logMessageType === "log:thread-image") {
      const oldImageURL = data[threadID].groupImage;
      if (oldImageURL) {
        try {
          const image = await axios.get(oldImageURL, { responseType: "stream" });
          api.changeGroupImage(image.data, threadID);
        } catch (err) {
          console.error("Image revert failed:", err);
        }
      }
    }
  }
};