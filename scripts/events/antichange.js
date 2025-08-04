const fs = require("fs-extra");
const path = __dirname + "/../../cache/fulllock.json";

module.exports = {
  config: {
    name: "fulllock",
    eventType: ["log:thread-name", "log:thread-image", "log:user-nickname"],
    version: "1.0.0",
    author: "Raj",
    description: "Revert group name, image, and nicknames if changed by non-admins"
  },

  onStart: async function ({ event, threadsData, api }) {
    if (!fs.existsSync(path)) return;
    const data = fs.readJsonSync(path);
    const { threadID, author, type } = event;

    if (!data[threadID]) return;

    const threadData = await threadsData.get(threadID);
    const isAdmin = threadData.adminIDs.includes(author);
    if (isAdmin) return;

    // Revert based on event type
    if (type === "log:thread-name") {
      await api.setTitle(threadData.threadName, threadID);
    } else if (type === "log:user-nickname") {
      const nickInfo = event.logMessageData;
      await api.changeNickname(nickInfo.nickname, threadID, nickInfo.participant_id);
    } else if (type === "log:thread-image") {
      await api.removeUserFromGroup(api.getCurrentUserID(), threadID); // Optional: Or revert image if backed up
    }
  }
};
