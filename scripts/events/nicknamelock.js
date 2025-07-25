const fs = require("fs");
const path = require("path");
const lockPath = path.join(__dirname, "../data/nicknamelock.json");

module.exports = {
  config: {
    name: "nicknamelock",
    version: "1.0",
    author: "Raj",
    category: "events"
  },

  onStart: async ({ api, event, threadsData }) => {
    if (event.logMessageType !== "log:thread-name" && event.logMessageType !== "log:user-nickname") return;
    if (!fs.existsSync(lockPath)) fs.writeFileSync(lockPath, "{}");

    const data = JSON.parse(fs.readFileSync(lockPath));
    const tid = event.threadID;

    // If nickname lock not enabled in this thread, ignore
    if (!data[tid]) return;

    try {
      const threadInfo = await api.getThreadInfo(tid);
      const users = threadInfo.userInfo;
      const nicknames = threadInfo.nicknames;

      for (const user of users) {
        const uid = user.id;
        const correctNick = nicknames[uid] || "";

        // If nickname differs, reset it
        if (correctNick && threadInfo.nicknames[uid] !== correctNick) {
          await api.changeNickname(correctNick, tid, uid);
        }
      }
    } catch (e) {
      console.error("Nickname lock error:", e);
    }
  }
};