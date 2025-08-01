const fs = require("fs-extra");
const path = __dirname + "/../cache/nicknamelock.json";

module.exports.config = {
  name: "nicknamelock",
  version: "1.0.0",
  author: "Raj",
  description: "Lock or unlock nickname change in group",
  usage: "[on/off/whitelist add/remove UID]",
  cooldowns: 3,
  hasPermission: 1,
  category: "group"
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const subCmd = args[0];

  let data = {};
  if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path));
  if (!data[threadID]) data[threadID] = { enabled: false, whitelist: [] };

  const threadData = data[threadID];

  if (subCmd === "on") {
    threadData.enabled = true;
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return api.sendMessage("✅ Nickname lock has been ENABLED.", threadID);
  }

  if (subCmd === "off") {
    threadData.enabled = false;
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return api.sendMessage("❌ Nickname lock has been DISABLED.", threadID);
  }

  if (subCmd === "whitelist") {
    const action = args[1];
    const uid = args[2];

    if (!["add", "remove"].includes(action) || !uid) {
      return api.sendMessage("⚠️ Usage:\n• nicknamelock whitelist add <uid>\n• nicknamelock whitelist remove <uid>", threadID);
    }

    if (action === "add") {
      if (!threadData.whitelist.includes(uid)) {
        threadData.whitelist.push(uid);
      }
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return api.sendMessage(`✅ UID ${uid} added to whitelist.`, threadID);
    }

    if (action === "remove") {
      threadData.whitelist = threadData.whitelist.filter(x => x !== uid);
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return api.sendMessage(`✅ UID ${uid} removed from whitelist.`, threadID);
    }
  }

  return api.sendMessage("⚠️ Invalid usage. Try:\n• nicknamelock on\n• nicknamelock off\n• nicknamelock whitelist add/remove <uid>", threadID);
};
