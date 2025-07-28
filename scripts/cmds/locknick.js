const fs = require("fs-extra");
const path = require("path");

const lockNickDataPath = path.join(__dirname, "..", "cache", "locknick.json");
let lockNickData = fs.existsSync(lockNickDataPath) ? JSON.parse(fs.readFileSync(lockNickDataPath)) : {};

function saveLockData() {
  fs.ensureDirSync(path.dirname(lockNickDataPath));
  fs.writeFileSync(lockNickDataPath, JSON.stringify(lockNickData, null, 2));
}

module.exports = {
  config: {
    name: "lockname",
    version: "1.0",
    author: "Raj",
    countDown: 5,
    role: 1,
    shortDescription: "Lock nicknames of all group members",
    longDescription: "Locks all nicknames in the group, reverting any change automatically",
    category: "group",
    guide: {
      en: "{pn} on/off"
    }
  },

  onStart: async function ({ api, event, args }) {
    const threadID = event.threadID;

    if (!args[0]) return api.sendMessage("⚠️ इस्तेमाल करें: lockname on/off", threadID);

    if (args[0].toLowerCase() === "on") {
      const threadInfo = await api.getThreadInfo(threadID);
      const nicknames = {};

      for (const user of threadInfo.userInfo) {
        nicknames[user.id] = user.nickname || "";
      }

      lockNickData[threadID] = nicknames;
      saveLockData();

      return api.sendMessage(`🔒 सभी members के nicknames लॉक कर दिए गए।`, threadID);
    }

    if (args[0].toLowerCase() === "off") {
      if (!lockNickData[threadID]) return api.sendMessage("⚠️ Nickname पहले से unlocked हैं!", threadID);

      delete lockNickData[threadID];
      saveLockData();
      return api.sendMessage("✅ Nickname lock हटा दिया गया।", threadID);
    }

    return api.sendMessage("❌ Invalid option! Use: lockname on/off", threadID);
  },

  onEvent: async function ({ event, api }) {
    const { threadID, logMessageType, logMessageData } = event;

    if (!lockNickData[threadID]) return;
    if (logMessageType !== "log:thread-nickname") return;

    const userID = logMessageData.participant_id;
    const lockedNick = lockNickData[threadID][userID] || "";

    if ((logMessageData.nickname || "") !== (lockedNick || "")) {
      await api.changeNickname(lockedNick, threadID, userID);
      api.sendMessage(`🔄 "${logMessageData.nickname || "Blank"}" nickname detect हुआ था।\nपुराना nickname वापस set कर दिया गया।`, threadID);
    }
  }
};