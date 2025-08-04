const fs = require("fs-extra");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../../cache/fulllock.json");

module.exports = {
  config: {
    name: "fulllock",
    eventType: ["log:thread-name", "log:thread-image", "log:user-nickname"],
    version: "1.0",
    author: "Raj",
    description: "Locks group name, image and nicknames."
  },

  onStart: async function ({ message, event, args }) {
    const { threadID } = event;
    const data = fs.existsSync(DATA_PATH) ? fs.readJSONSync(DATA_PATH) : {};

    if (args[0] === "on") {
      const threadInfo = await message.api.getThreadInfo(threadID);
      const nicknames = {};
      threadInfo.userInfo.forEach(u => nicknames[u.id] = u.nickname || "");

      // Save current DP
      const imageBuffer = await global.utils.getStreamFromURL(threadInfo.imageSrc);
      const imagePath = path.join(__dirname, `../../cache/groupDP_${threadID}.jpg`);
      fs.writeFileSync(imagePath, imageBuffer);

      // Save lock data
      data[threadID] = {
        name: threadInfo.threadName,
        image: imagePath,
        nicknames
      };

      fs.writeJSONSync(DATA_PATH, data, { spaces: 2 });
      return message.reply("🔒 Full lock mode is now ON.");
    }

    if (args[0] === "off") {
      delete data[threadID];
      fs.writeJSONSync(DATA_PATH, data, { spaces: 2 });
      return message.reply("🔓 Full lock mode is now OFF.");
    }

    return message.reply("⚠️ Use: #fulllock on | #fulllock off");
  },

  onEvent: async function ({ event, message }) {
    const { threadID, logMessageType, logMessageData } = event;
    const data = fs.existsSync(DATA_PATH) ? fs.readJSONSync(DATA_PATH) : {};
    const lock = data[threadID];
    if (!lock) return;

    const { name, image, nicknames } = lock;

    // Group Name Changed
    if (logMessageType === "log:thread-name") {
      await message.api.setTitle(name, threadID);
      await message.api.removeUserFromGroup(event.author, threadID);
    }

    // Group Image Changed or Removed
    if (logMessageType === "log:thread-image") {
      const imgStream = fs.createReadStream(image);
      await message.api.changeGroupImage(imgStream, threadID);
      await message.api.removeUserFromGroup(event.author, threadID);
    }

    // Nickname Changed
    if (logMessageType === "log:user-nickname") {
      const targetID = logMessageData.participant_id;
      const originalNick = nicknames[targetID] || "";
      await message.api.changeNickname(originalNick, threadID, targetID);
      await message.api.removeUserFromGroup(event.author, threadID);
    }
  }
};