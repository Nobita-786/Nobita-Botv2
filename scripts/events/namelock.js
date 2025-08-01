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
    version: "1.1",
    author: "Raj",
    description: "Reverts group name and nicknames if changed",
    dependencies: {}
  },

  onEvent: async function ({ event, api }) {
    const data = loadData();
    const threadID = event.threadID;

    if (!data[threadID]) return;

    const lockData = data[threadID];

    // 🔁 Revert group name change
    if (event.logMessageType === "log:thread-name") {
      const currentName = event.logMessageData?.name;
      const originalName = lockData.threadName;

      if (currentName !== originalName) {
        try {
          await api.setTitle(originalName, threadID);
          console.log(`🔒 Group name reverted to '${originalName}'`);
        } catch (err) {
          console.error("❌ Failed to revert group name:", err);
        }
      }
    }

    // 🔁 Revert nickname change
    else if (event.logMessageType === "log:user-nickname") {
      const uid = event.logMessageData?.participant_id;
      const newNick = event.logMessageData?.nickname;
      const originalNick = lockData.nicknames?.[uid] ?? "";

      if (newNick !== originalNick) {
        try {
          await api.changeNickname(originalNick, threadID, uid);
          console.log(`🔒 Nickname of UID ${uid} reverted to '${originalNick}'`);
        } catch (err) {
          console.error("❌ Failed to revert nickname:", err);
        }
      }
    }
  }
};