const fs = require("fs-extra");
const path = __dirname + "/../../cache/nicknamelock.json";

module.exports.config = {
  name: "locknickname",
  version: "1.0",
  author: "Raj",
  eventType: ["log:user-nickname", "log:thread-name"],
  description: "Auto revert nickname or group name changes"
};

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;
  const senderID = event.author;
  if (!fs.existsSync(path)) return;
  const data = JSON.parse(fs.readFileSync(path));
  if (!data[threadID] || !data[threadID].nicknameLock) return;

  const threadData = data[threadID];

  // If sender is whitelisted admin, allow changes
  if (threadData.adminWhitelist.includes(senderID)) return;

  // Handle nickname change
  if (event.logMessageType === "log:user-nickname") {
    const userID = event.logMessageData.participant_id;
    const oldNickname = threadData.lockedNicknames[userID] || null;
    api.changeNickname(oldNickname || "", threadID, userID);
  }

  // Handle group name change
  if (event.logMessageType === "log:thread-name") {
    const oldName = threadData.lockedGroupName;
    api.setTitle(oldName, threadID);
  }
};