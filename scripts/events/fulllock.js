const fs = require("fs-extra");
const path = __dirname + "/../../cache/fulllock.json"; // ✅ सही path

if (!fs.existsSync(path)) fs.writeJsonSync(path, {});

module.exports = {
  config: {
    name: "fulllock",
    eventType: ["log:thread-name", "log:thread-image", "log:user-nickname"],
    version: "1.0",
    author: "Raj",
    description: "Reverts group name, dp, and nicknames.",
    category: "events"
  },

  onEvent: async function ({ api, event }) {
    const threadID = event.threadID;
    const data = fs.readJsonSync(path);
    const lock = data[threadID];
    if (!lock) return;

    // Group name change revert
    if (event.logMessageType === "log:thread-name") {
      if (event.logMessageData?.name !== lock.name) {
        api.setTitle(lock.name, threadID);
      }
    }

    // Group image change revert
    if (event.logMessageType === "log:thread-image") {
      if (lock.image) {
        try {
          const img = await global.utils.getStreamFromURL(lock.image);
          api.changeGroupImage(img, threadID);
        } catch (e) {
          console.log("❌ Error reverting image:", e.message);
        }
      }
    }

    // Nickname revert
    if (event.logMessageType === "log:user-nickname") {
      const uid = event.logMessageData.participant_id;
      const oldNick = lock.nicknames?.[uid];
      if (typeof oldNick !== "undefined") {
        api.changeNickname(oldNick, threadID, uid);
      }
    }
  }
};