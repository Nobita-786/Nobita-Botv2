const fs = require("fs-extra");
const path = __dirname + "/../../cache/fulllock.json";

if (!fs.existsSync(path)) fs.writeJsonSync(path, {});

module.exports = {
  config: {
    name: "fulllock",
    eventType: ["log:thread-name", "log:thread-image", "log:user-nickname"],
    version: "1.1",
    author: "Raj",
    description: "Locks group name, image and nicknames.",
    category: "events"
  },

  onStart: async function ({ message, event, threadsData }) {
    const threadID = event.threadID;
    const data = fs.readJsonSync(path);

    if (!data[threadID]) {
      const threadInfo = await threadsData.get(threadID);

      const nicknames = {};
      for (const id in threadInfo.nicknames) {
        nicknames[id] = threadInfo.nicknames[id] || "";
      }

      data[threadID] = {
        name: threadInfo.threadName,
        image: threadInfo.threadImage,
        nicknames
      };

      fs.writeJsonSync(path, data, { spaces: 2 });
      return message.reply("✅ Full lock enabled for this group.\nNow name, DP, and nicknames are locked.");
    } else {
      delete data[threadID];
      fs.writeJsonSync(path, data, { spaces: 2 });
      return message.reply("🔓 Full lock disabled for this group.");
    }
  },

  onEvent: async function ({ api, event }) {
    const threadID = event.threadID;
    const data = fs.readJsonSync(path);
    const lock = data[threadID];
    if (!lock) return;

    // Group Name change revert
    if (event.logMessageType === "log:thread-name") {
      const oldName = lock.name;
      if (event.logMessageData?.name && event.logMessageData.name !== oldName) {
        await api.setTitle(oldName, threadID);
      }
    }

    // DP change revert
    if (event.logMessageType === "log:thread-image") {
      const oldImage = lock.image;
      if (oldImage) {
        try {
          const imgStream = await global.utils.getStreamFromURL(oldImage);
          await api.changeGroupImage(imgStream, threadID);
        } catch (err) {
          console.log("❌ Error reverting group image:", err.message);
        }
      }
    }

    // Nickname change revert
    if (event.logMessageType === "log:user-nickname") {
      const targetID = event.logMessageData.participant_id;
      const oldNick = lock.nicknames[targetID] || "";
      await api.changeNickname(oldNick, threadID, targetID);
    }
  }
};