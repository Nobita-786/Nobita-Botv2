const fs = require("fs");
const axios = require("axios");
const path = __dirname + "/../cmds/cache/fulllock.json";

module.exports = {
  config: {
    name: "fulllock",
    version: "1.0",
    author: "Raj",
    description: "Event handler for full lock"
  },

  handleEvent: async function ({ api, event }) {
    if (!fs.existsSync(path)) return;
    const data = JSON.parse(fs.readFileSync(path));
    if (!data.status) return;

    const { threadID, senderID, type } = event;
    const isWhitelisted = data.whitelist?.includes(senderID);

    // Ignore all messages and commands from non-whitelisted users
    if (!isWhitelisted && type === "message") {
      return api.setMessageReaction("❌", event.messageID, () => {}, true);
    }

    // Revert nickname if changed
    if (type === "event" && event.logMessageType === "log:thread-name") {
      if (!isWhitelisted && data.groupName) {
        await api.setTitle(data.groupName, threadID);
        return api.sendMessage("❌ Group name change not allowed!", threadID);
      }
    }

    // Revert group image if changed
    if (type === "event" && event.logMessageType === "log:thread-image") {
      if (!isWhitelisted && data.groupImage) {
        try {
          const img = (await axios.get(data.groupImage, { responseType: "stream" })).data;
          await api.changeGroupImage(img, threadID);
          return api.sendMessage("❌ Group image change not allowed!", threadID);
        } catch (e) {
          return;
        }
      }
    }

    // Revert nicknames if changed
    if (type === "event" && event.logMessageType === "log:user-nickname") {
      const changedID = event.logMessageData?.participant_id;
      const originalNick = data.nicknames?.[changedID] || "";

      if (!isWhitelisted && changedID && originalNick !== undefined) {
        await api.changeNickname(originalNick, threadID, changedID);
        return api.sendMessage("❌ Nickname change not allowed!", threadID);
      }
    }
  }
};