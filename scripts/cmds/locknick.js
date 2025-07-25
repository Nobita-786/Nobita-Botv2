const fs = require("fs");
const path = __dirname + "/../data/nicknamelock.json";

module.exports = {
  config: {
    name: "locknick",
    version: "1.0",
    author: "Raj",
    role: 1,
    shortDescription: "Lock nicknames",
    longDescription: "Enable or disable nickname locking in this thread",
    category: "group",
    guide: {
      en: "{pn} on/off"
    }
  },

  onStart: async function ({ api, args, event }) {
    if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");

    let data = JSON.parse(fs.readFileSync(path));
    const tid = event.threadID;

    if (args[0] === "on") {
      data[tid] = true;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return api.sendMessage("✅ Nickname lock enabled.", tid);
    }

    if (args[0] === "off") {
      delete data[tid];
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return api.sendMessage("❌ Nickname lock disabled.", tid);
    }

    return api.sendMessage("❗ Use: locknick on/off", tid);
  }
};
