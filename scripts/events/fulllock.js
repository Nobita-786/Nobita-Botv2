const fs = require("fs-extra");
const path = __dirname + "/../../cache/fulllock.json";

// अगर cache file नहीं है तो create कर दो
if (!fs.existsSync(path)) fs.writeJsonSync(path, {});

module.exports = {
  config: {
    name: "fulllock",
    eventType: ["log:thread-name", "log:thread-image", "log:user-nickname"],
    version: "1.0",
    author: "Raj",
    description: "Locks group name, image and nicknames.",
    category: "events" // ✅ यही important था
  },

  onStart: async function ({ message, event, threadsData }) {
    const threadID = event.threadID;
    const data = fs.readJsonSync(path);

    if (!data[threadID]) {
      const threadInfo = await threadsData.get(threadID);
      data[threadID] = {
        name: threadInfo.threadName,
        image: threadInfo.threadImage,
        nicknames: {}
      };
      fs.writeJsonSync(path, data, { spaces: 2 });
      return message.reply("✅ Full lock enabled for this group. Now name, dp, and nicknames are locked.");
    } else {
      delete data[threadID];
      fs.writeJsonSync(path, data, { spaces: 2 });
      return message.reply("🔓 Full lock disabled for this group.");
    }
  },

  onEvent: async function ({ api, event }) {
    const threadID = event.threadID;
    const data = fs.readJsonSync(path);

    if (!data[threadID]) return;

    // Group Name change revert
    if (event.logMessageType === "log:thread-name") {
      const oldName = data[threadID].name;
      if (event.logMessageData?.name && event.logMessageData.name !== oldName) {
        api.setTitle(oldName, threadID);
      }
    }

    // DP change revert
    if (event.logMessageType === "log:thread-image") {
      const oldImage = data[threadID].image;
      if (oldImage) {
        const imgStream = await global.utils.getStreamFromURL(oldImage);
        api.changeGroupImage(imgStream, threadID);
      }
    }

    // Nickname change revert
    if (event.logMessageType === "log:user-nickname") {
      const changedID = event.logMessageData.participant_id;
      const nickname = data[threadID].nicknames[changedID];
      if (nickname) {
        api.changeNickname(nickname, threadID, changedID);
      }
    }
  }
};