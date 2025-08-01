const fs = require("fs");
const path = __dirname + "/../../cache/nicknamelock.json";

module.exports = {
  config: {
    name: "nicknamelock",
    version: "1.0.0",
    author: "Raj",
    description: "Enable or disable nickname and group name lock",
    category: "box",
    guide: {
      en: "{pn} on/off\n{pn} allow @mention"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({ enabled: false, groupName: "", allowed: [] }, null, 2));
    const data = JSON.parse(fs.readFileSync(path));

    const input = args[0];

    if (input === "on") {
      data.enabled = true;
      const threadInfo = await api.getThreadInfo(event.threadID);
      data.groupName = threadInfo.name || "Locked Group";
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return api.sendMessage("✅ Nickname lock enabled!", event.threadID);
    }

    if (input === "off") {
      data.enabled = false;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return api.sendMessage("❌ Nickname lock disabled.", event.threadID);
    }

    if (input === "allow" && event.mentions) {
      const allowedUIDs = Object.keys(event.mentions);
      data.allowed.push(...allowedUIDs);
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return api.sendMessage("✅ Allowed users updated.", event.threadID);
    }

    return api.sendMessage("⚠️ Usage: nicknamelock on/off or nicknamelock allow @mention", event.threadID);
  }
};
