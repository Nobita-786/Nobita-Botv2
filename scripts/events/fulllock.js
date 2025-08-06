const fs = require("fs");
const path = __dirname + "/../cache/nicknamelock.json";

module.exports = async function ({ api, event }) {
  if (!["log:thread-name", "log:thread-nickname"].includes(event.logMessageType)) return;
  if (!fs.existsSync(path)) return;

  const data = JSON.parse(fs.readFileSync(path));
  const threadID = event.threadID;

  if (!data[threadID] || !data[threadID].status) return;

  const { author, logMessageData, logMessageType } = event;
  const whitelist = data[threadID].whitelist || [];

  // nickname change
  if (logMessageType === "log:thread-nickname") {
    const targetID = logMessageData.participant_id;
    const newNick = logMessageData.nickname;
    if (whitelist.includes(author) || whitelist.includes(targetID)) return;

    const originalNicknames = data[threadID].originalNicknames || {};
    const lockedNick = originalNicknames[targetID] ?? "";

    if (newNick !== lockedNick) {
      api.changeNickname(lockedNick, threadID, targetID, (err) => {
        if (!err) {
          api.sendMessage(`⛔ ${newNick ? `"${newNick}"` : "नया"} nickname बदलना मना है!`, threadID);
        }
      });
    }
  }

  // group name change
  if (logMessageType === "log:thread-name") {
    if (whitelist.includes(author)) return;

    const originalName = data[threadID].originalName;
    const newName = logMessageData.name;

    if (originalName && originalName !== newName) {
      api.setTitle(originalName, threadID, (err) => {
        if (!err) {
          api.sendMessage(`⛔ Group name बदलना allowed नहीं है! वापस "${originalName}" कर दिया गया।`, threadID);
        }
      });
    }
  }
};