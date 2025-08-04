const fs = require("fs-extra");
const path = __dirname + "/../../cache/fulllock.json";

if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");

module.exports = {
  config: {
    name: "fulllock",
    version: "1.0",
    description: "Lock group name, nickname, and image",
    category: "events"
  },

  onStart({ api, event, threadsData, message }) {
    const { threadID, senderID, body } = event;
    const data = JSON.parse(fs.readFileSync(path));
    const isLocked = data[threadID];

    if (body === "#fulllock on") {
      data[threadID] = true;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply("✅ Full lock enabled for this group.");
    }

    if (body === "#fulllock off") {
      delete data[threadID];
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply("❌ Full lock disabled for this group.");
    }
  },

  async onEvent({ api, event }) {
    const { threadID, logMessageType, logMessageData, senderID } = event;
    const fullLockData = JSON.parse(fs.readFileSync(path));

    if (!fullLockData[threadID]) return;

    const threadInfo = await api.getThreadInfo(threadID);
    const admins = threadInfo.adminIDs.map(e => e.id);
    const isAdmin = admins.includes(senderID);

    if (isAdmin) return;

    // Lock nickname
    if (logMessageType === "log:user-nickname") {
      const targetID = logMessageData.participant_id;
      const oldName = logMessageData.nickname || " ";
      api.changeNickname(oldName, threadID, targetID);
    }

    // Lock group name
    if (logMessageType === "log:thread-name") {
      const oldName = threadInfo.threadName;
      api.setTitle(oldName, threadID);
    }

    // Lock group image
    if (logMessageType === "log:thread-image") {
      api.removeUserFromGroup(senderID, threadID);
    }
  }
};