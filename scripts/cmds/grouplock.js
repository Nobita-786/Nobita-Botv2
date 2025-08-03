const fs = require("fs");
const lockPath = __dirname + "/../script/cmds/nix/fullLock.json";

module.exports = {
  config: {
    name: "grouplock",
    version: "2.0",
    author: "ArYAN",
    countDown: 5,
    role: 1,
    shortDescription: "Lock/unlock group name, image, nickname",
    longDescription: "",
    category: "boxchat",
    guide: "{pn} on | off"
  },

  onStart: async function ({ message, event, args, threadsData }) {
    const threadID = event.threadID;
    const status = args[0];

    if (!["on", "off"].includes(status)) {
      return message.reply("⚠️ Use: grouplock on | off");
    }

    let fullLock = fs.existsSync(lockPath) ? JSON.parse(fs.readFileSync(lockPath)) : {};

    if (status === "on") {
      const threadInfo = await threadsData.get(threadID);
      fullLock[threadID] = {
        name: threadInfo.threadName || "Locked Group"
      };
      fs.writeFileSync(lockPath, JSON.stringify(fullLock, null, 2));
      return message.reply("🔒 Group lock is now enabled.");
    }

    if (status === "off") {
      if (fullLock[threadID]) {
        delete fullLock[threadID];
        fs.writeFileSync(lockPath, JSON.stringify(fullLock, null, 2));
        return message.reply("🔓 Group lock is now disabled.");
      } else {
        return message.reply("ℹ️ Lock is already off.");
      }
    }
  }
};
