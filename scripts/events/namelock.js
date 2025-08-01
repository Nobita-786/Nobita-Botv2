const fs = require("fs-extra");
const path = __dirname + "/../cache/nicknamelock.json";

module.exports.config = {
  name: "nicknamelock",
  eventType: ["log:user-nickname"],
  version: "1.0.0",
  credits: "Raj",
  description: "Locks nickname in group unless allowed UID"
};

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;
  const { participantID, nickname } = event.logMessageData;

  if (!fs.existsSync(path)) return;

  const data = JSON.parse(fs.readFileSync(path, "utf-8"));
  const threadData = data[threadID];

  if (!threadData || !threadData.enabled) return;

  const whitelist = threadData.whitelist || [];

  if (whitelist.includes(participantID)) return;

  try {
    await api.changeNickname("", threadID, participantID);
  } catch (e) {
    console.log("Failed to revert nickname:", e.message);
  }
};