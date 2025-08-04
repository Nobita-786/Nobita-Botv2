const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../cache/antichange.json');
if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify({}));

module.exports.config = {
  name: "antichange",
  version: "1.0.0",
  hasPermssion: 1, // Admin only
  credits: "Raj",
  description: "Lock or unlock group name, image, and nicknames",
  commandCategory: "group",
  usages: "[on/off]",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  const data = JSON.parse(fs.readFileSync(dataPath));

  if (!args[0] || !["on", "off"].includes(args[0].toLowerCase()))
    return api.sendMessage("🛡️ Usage: antichange on/off", threadID, messageID);

  const status = args[0].toLowerCase();
  if (status === "on") {
    data[threadID] = true;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    api.sendMessage("🔒 Full lock mode enabled.\n\n- Group name is locked\n- Group image is locked\n- All nicknames are locked\n- Only bot owner, admin, or supporter can use commands", threadID, messageID);
  } else {
    delete data[threadID];
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    api.sendMessage("🔓 Full lock mode disabled.", threadID, messageID);
  }
};
