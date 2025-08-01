const fs = require("fs-extra");
const path = __dirname + "/../cache/nicknamelock.json";

module.exports.config = {
  name: "nicknamelock",
  eventType: ["log:user-nickname"],
  version: "1.0.0",
  author: "Raj",
  description: "Locks nicknames in group chats unless changed by whitelisted admin(s)"
};

module.exports.run = async function ({ api, event, Threads, Users }) {
  console.log("Nickname change detected:", event); // ✅ Debug log

  const threadID = event.threadID;
  const senderID = event.author;

  // Load cache
  let data = {};
  if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path));
  if (!data[threadID] || data[threadID].status !== true) return;

  const whitelist = data[threadID].whitelist || [];
  if (whitelist.includes(senderID)) return; // allow if in whitelist

  const oldNick = await Threads.getData(threadID).then(res => {
    const oldData = res.nicknames || {};
    return oldData[event.logMessageData.participant_id] || null;
  });

  // Revert nickname
  try {
    await api.changeNickname(oldNick || "", threadID, event.logMessageData.participant_id);
    api.sendMessage(
      `⚠️ Group nickname is locked.\nOnly authorized admins can change it.`,
      threadID
    );
  } catch (e) {
    console.log("Nickname revert failed:", e);
  }
};
