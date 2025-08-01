const fs = require("fs");
const path = __dirname + "/../../cache/nicknamelock.json";

module.exports.config = {
  name: "nicknamelock",
  eventType: ["log:user-nickname", "log:thread-name"],
  version: "1.0.0",
  credits: "Raj",
  description: "Reverts nickname/group name if lock is enabled"
};

module.exports.run = async function ({ api, event, Threads }) {
  if (!fs.existsSync(path)) return;
  const data = JSON.parse(fs.readFileSync(path));
  if (!data.enabled) return;

  const threadInfo = await Threads.getData(event.threadID);
  const groupName = threadInfo.threadName;

  // Lock nickname
  if (event.logMessageType === "log:user-nickname") {
    const userID = event.logMessageData.participant_id;
    if (!data.allowed.includes(userID)) {
      api.changeNickname(event.logMessageData.nickname || "", event.threadID, userID);
    }
  }

  // Lock group name
  if (event.logMessageType === "log:thread-name") {
    if (!data.allowed.includes(event.author)) {
      api.setTitle(data.groupName || groupName, event.threadID);
    }
  }
};
