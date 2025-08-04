const fs = require("fs");
const path = __dirname + "/../../cache/fulllock.json";

module.exports = {
  config: {
    name: "fulllock",
    version: "1.0",
    author: "Raj",
    countDown: 5,
    role: 1,
    category: "events" // ✅ fix
  },

  onStart: async function ({ message, args, event }) {
    const data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, "utf-8")) : {};
    const threadID = event.threadID;

    if (args[0] === "on") {
      data[threadID] = true;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      message.reply("✅ Full Lock Mode enabled for this group.");
    } else if (args[0] === "off") {
      delete data[threadID];
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      message.reply("❎ Full Lock Mode disabled for this group.");
    } else {
      message.reply("📌 Usage:\nfullLock on\nfullLock off");
    }
  },

  onEvent: async function ({ event, api }) {
    const data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, "utf-8")) : {};
    const threadID = event.threadID;
    const senderID = event.senderID;

    if (!data[threadID]) return;

    if (event.logMessageType === "log:thread-name") {
      const threadInfo = await api.getThreadInfo(threadID);
      const oldName = threadInfo.name || "Locked Group";
      api.setTitle(oldName, threadID);
    }

    if (event.logMessageType === "log:thread-nickname") {
      const { nickname, participant_id } = event.logMessageData;
      if (nickname && participant_id)
        api.changeNickname("⛔", threadID, participant_id);
    }

    if (event.logMessageType === "log:thread-icon") {
      api.changeThreadIcon("🎯", threadID);
    }
  }
};