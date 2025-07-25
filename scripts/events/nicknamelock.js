const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/nicknamelock.json");
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "{}");

module.exports = async function ({ api, event }) {
  try {
    if (event.logMessageType !== "log:user-nickname") return;

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const threadID = event.threadID;

    if (!data[threadID]) return;

    const userID = event.logMessageData.participant_id;
    const userInfo = await api.getUserInfo(userID);

    if (!userInfo || !userInfo[userID] || !userInfo[userID].name) {
      console.warn(`[⚠️] User info not found for UID: ${userID}`);
      return;
    }

    const originalName = userInfo[userID].name;
    await api.changeNickname(originalName, threadID, userID);
    console.log(`🔁 Nickname reset for ${originalName}`);
    
  } catch (err) {
    console.error("❌ Nickname lock event error:", err);
  }
};