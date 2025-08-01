const fs = require("fs-extra");
const path = __dirname + "/../../cache/nicknamelock.json";

module.exports.config = {
  name: "nicknamelock",
  version: "1.0",
  author: "Raj",
  description: "Lock group nickname and name",
  usage: "[on/off/addadmin/removeadmin]",
  cooldown: 5,
  role: 1
};

module.exports.onStart = async function ({ api, event, args }) {
  const threadID = event.threadID;
  let data = {};
  if (fs.existsSync(path)) {
    data = JSON.parse(fs.readFileSync(path));
  }

  if (!data[threadID]) {
    data[threadID] = {
      nicknameLock: false,
      lockedNicknames: {},
      lockedGroupName: null,
      adminWhitelist: []
    };
  }

  const action = args[0];
  const mention = Object.keys(event.mentions || {});

  if (action === "on") {
    data[threadID].nicknameLock = true;
    data[threadID].lockedGroupName = (await api.getThreadInfo(threadID)).name;
    const userInfo = await api.getThreadInfo(threadID);
    for (const user of userInfo.userInfo) {
      data[threadID].lockedNicknames[user.id] = user.nickname || null;
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return api.sendMessage("✅ Nickname & group name lock is ON", threadID);
  }

  if (action === "off") {
    data[threadID].nicknameLock = false;
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return api.sendMessage("❌ Nickname & group name lock is OFF", threadID);
  }

  if (action === "addadmin" && mention.length > 0) {
    data[threadID].adminWhitelist.push(...mention);
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return api.sendMessage("✅ Added to nickname lock admin whitelist", threadID);
  }

  if (action === "removeadmin" && mention.length > 0) {
    data[threadID].adminWhitelist = data[threadID].adminWhitelist.filter(id => !mention.includes(id));
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return api.sendMessage("✅ Removed from nickname lock admin whitelist", threadID);
  }

  return api.sendMessage("⚠️ Usage: nicknamelock on | off | addadmin @tag | removeadmin @tag", threadID);
};