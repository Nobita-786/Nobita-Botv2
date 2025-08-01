const fs = require("fs");
const path = require("path");

const lockFile = path.join(__dirname, "..", "events", "namelock.json");

function loadData() {
  try {
    if (!fs.existsSync(lockFile)) return {};
    return JSON.parse(fs.readFileSync(lockFile));
  } catch (e) {
    return {};
  }
}

function saveData(data) {
  fs.writeFileSync(lockFile, JSON.stringify(data, null, 2));
}

module.exports = {
  config: {
    name: "namelock",
    version: "1.0",
    author: "Raj",
    role: 1,
    category: "group",
    shortDescription: { en: "Lock group name and member nicknames" },
    longDescription: { en: "Prevent changes to group name and nicknames. Auto-restore if changed." },
    guide: { en: "namelock on / namelock off" }
  },

  onStart: async function ({ api, event, args, threadsData, message }) {
    const threadID = event.threadID;
    const data = loadData();

    const sub = args[0]?.toLowerCase();

    if (sub === "on") {
      const threadInfo = await api.getThreadInfo(threadID);

      data[threadID] = {
        threadName: threadInfo.threadName,
        nicknames: {}
      };

      for (const user of threadInfo.userInfo) {
        const uid = user.id;
        const nickname = threadInfo.nicknames?.[uid] || "";
        data[threadID].nicknames[uid] = nickname;
      }

      saveData(data);
      message.reply("✅ | Group name & member nicknames locked.");
    }

    else if (sub === "off") {
      if (data[threadID]) {
        delete data[threadID];
        saveData(data);
        message.reply("🔓 | Name lock disabled for this group.");
      } else {
        message.reply("ℹ️ | Name lock was not enabled in this group.");
      }
    }

    else {
      message.reply("❌ | Usage: namelock on / namelock off");
    }
  }
};