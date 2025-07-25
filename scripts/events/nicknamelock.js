const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/nicknamelock.json");
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "{}");

module.exports = async function ({ api, event }) {
  if (event.logMessageType !== "log:user-nickname") return;

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const threadID = event.threadID;

  if (!data[threadID]) return;

  const changedUser = event.logMessageData.participant_id;

  try {
    const userInfo = await api.getUserInfo(changedUser);
    const originalName = userInfo[changedUser]?.name || "User";
    await api.changeNickname(originalName, threadID, changedUser);
    console.log(`🔒 Nickname reverted for ${originalName}`);
  } catch (err) {
    console.error("Nickname revert failed:", err);
  }
};