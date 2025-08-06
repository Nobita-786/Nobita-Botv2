const fs = require("fs");
const path = __dirname + "/../cache/nicknamelock.json";

module.exports = async function ({ api, event }) {
  if (event.logMessageType !== "log:thread-name" && event.logMessageType !== "log:thread-nickname") return;
  if (!fs.existsSync(path)) return;

  const data = JSON.parse(fs.readFileSync(path));
  const threadID = event.threadID;

  if (!data[threadID] || !data[threadID].status) return;

  const { author, logMessageData, logMessageType } = event;
  const whitelist = data[threadID].whitelist || [];

  if (whitelist.includes(author)) return; // skip if author is allowed

  // nickname change
  if (logMessageType === "log:thread-nickname") {
    const targetID = logMessageData.participant_id;
    const oldNick = logMessageData.nickname;

    // revert nickname
    api.changeNickname("", threadID, targetID, err => {
      if (!err) {
        api.sendMessage(`⛔ ${oldNick ? `"${oldNick}"` : "नया"} nickname बदलने की अनुमति नहीं है!`, threadID);
      }
    });
  }

  // group name change
  if (logMessageType === "log:thread-name") {
    const originalName = data[threadID].originalName;
    const newName = logMessageData.name;

    if (originalName && originalName !== newName) {
      api.setTitle(originalName, threadID, err => {
        if (!err) {
          api.sendMessage(`⛔ Group name बदलना allowed नहीं है! वापस "${originalName}" कर दिया गया।`, threadID);
        }
      });
    }
  }
};