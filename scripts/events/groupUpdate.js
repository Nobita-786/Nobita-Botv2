const fs = require('fs');
const path = require('path');

const cacheFolder = path.join(__dirname, '../cache');
const dataPath = path.join(cacheFolder, 'antichange.json');

if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);
if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify({}));

module.exports.config = {
  name: "groupUpdate",
  eventType: ["log:thread-name", "log:thread-image", "log:user-nickname"]
};

module.exports.run = async ({ api, event }) => {
  const { threadID, logMessageType } = event;
  const data = JSON.parse(fs.readFileSync(dataPath));

  if (!data[threadID]) return;

  try {
    if (logMessageType === "log:thread-name") {
      const info = await api.getThreadInfo(threadID);
      await api.setTitle(info.name, threadID);
    }

    if (logMessageType === "log:thread-image") {
      await api.sendMessage("⚠️ Group image change is locked.", threadID);
    }

    if (logMessageType === "log:user-nickname") {
      await api.sendMessage("⚠️ Nickname change is locked.", threadID);
    }
  } catch (e) {
    console.error(e);
  }
};
