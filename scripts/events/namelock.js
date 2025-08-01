const fs = require("fs");
const path = require("path");

const lockFile = path.join(__dirname, "namelock.json");

function loadData() {
  try {
    if (!fs.existsSync(lockFile)) return {};
    return JSON.parse(fs.readFileSync(lockFile));
  } catch (e) {
    return {};
  }
}

module.exports = {
  config: {
    name: "namelock",
    version: "1.0",
    author: "Raj",
    description: "Locks group name and nicknames if changed",
    dependencies: {}
  },

  onEvent: async function ({ event, api }) {
    const data = loadData();
    const threadID = event.threadID;

    if (!data[threadID]) return;

    const lockData = data[threadID];

    // Handle thread name change
    if (event.logMessageType === "log:thread-name") {
      const oldName = lockData.threadName;
      if (event.logMessageData?.name !== oldName) {
        await api.setTitle(oldName, threadID);
      }
    }

    // Handle nickname change
    if (event.logMessageType === "log:user-nickname") {
      const uid = event.logMessageData?.participant_id;
      const oldNick = lockData.nicknames?.[uid] || "";

      if (event.logMessageData?.nickname !== oldNick) {
        await api.changeNickname(oldNick, threadID, uid);
      }
    }
  }
};