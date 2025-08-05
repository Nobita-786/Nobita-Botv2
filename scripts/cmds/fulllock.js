const fs = require("fs");
const path = __dirname + "/cache/fulllock.json";

module.exports = {
  config: {
    name: "fulllock",
    version: "1.0",
    author: "Raj",
    countDown: 0,
    role: 1,
    shortDescription: "Lock group name and nicknames",
    longDescription: "Prevents group name and nicknames from being changed",
    category: "group",
    guide: "{pn} on/off"
  },

  onStart: async function ({ message, event, args, api }) {
    const threadID = event.threadID;

    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));
    const data = JSON.parse(fs.readFileSync(path));

    if (args[0] === "on") {
      const info = await api.getThreadInfo(threadID);
      data[threadID] = {
        status: true,
        groupName: info.threadName
      };
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      message.reply("✅ Full lock is now ON. Group name and nicknames will be protected.");
    }

    else if (args[0] === "off") {
      delete data[threadID];
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      message.reply("❌ Full lock is now OFF. Group and nicknames are no longer locked.");
    }

    else {
      message.reply("⚙️ Usage: fulllock on/off");
    }
  }
};