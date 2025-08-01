const fs = require("fs-extra");
const path = __dirname + "/../cache/nicknamelock.json";

module.exports = {
  config: {
    name: "nicknamelock",
    version: "1.0.0",
    author: "Raj",
    description: "Lock nicknames in the group",
    role: 1,
    category: "admin",
    guide: {
      en: "{pn} on/off\n{pn} allow <uid>\n{pn} disallow <uid>\n{pn} status"
    }
  },

  onStart: async function ({ message, event, args }) {
    // Auto create file if missing
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify({
        enabled: false,
        groupName: "",
        allowed: []
      }, null, 2));
    }

    const data = JSON.parse(fs.readFileSync(path));

    const sub = args[0];
    const threadID = event.threadID;
    const senderID = event.senderID;

    if (sub === "on") {
      data.enabled = true;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply("✅ Nickname lock has been enabled.");
    }

    if (sub === "off") {
      data.enabled = false;
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply("❌ Nickname lock has been disabled.");
    }

    if (sub === "status") {
      return message.reply(
        `📌 Nickname Lock Status: ${data.enabled ? "ON ✅" : "OFF ❌"}\n👑 Allowed UID(s): ${data.allowed.length > 0 ? data.allowed.join(", ") : "None"}`
      );
    }

    if (sub === "allow") {
      const uid = args[1];
      if (!uid) return message.reply("❗ Please provide a UID to allow.");
      if (!data.allowed.includes(uid)) data.allowed.push(uid);
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply(`✅ UID ${uid} is now allowed to change nicknames.`);
    }

    if (sub === "disallow") {
      const uid = args[1];
      if (!uid) return message.reply("❗ Please provide a UID to disallow.");
      data.allowed = data.allowed.filter(i => i !== uid);
      fs.writeFileSync(path, JSON.stringify(data, null, 2));
      return message.reply(`❌ UID ${uid} is now disallowed from changing nicknames.`);
    }

    return message.reply("❓ Invalid command. Use: on, off, allow <uid>, disallow <uid>, status");
  }
};
