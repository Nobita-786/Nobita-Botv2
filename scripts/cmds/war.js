const axios = require("axios");
const fs = require("fs-extra");
const path = require("path").join(__dirname, "cache", "war_uid.json");

module.exports.config = {
‎name: "war",
‎version: "1.0.1",
‎role: 2,
‎author: "HAMIMX2", 
‎description: "tag gali",
‎   category: "media",
‎usages: "taggali",
‎countDowns: 5,
‎dependencies: {
‎"request":  ""
‎}
‎};

  onStart: async function ({ message, args, event }) {
    let data = [];
    if (fs.existsSync(path)) {
      try {
        data = fs.readJsonSync(path);
      } catch (err) {
        console.error("Failed to read JSON:", err);
        data = [];
      }
    }

    if (args[0] === "on") {
      const uid = Object.keys(event.mentions || {})[0] || args[1];
      if (!uid) return message.reply("       UID ");

      const lang = args[2] || "hi";

      if (data.find(i => i.uid === uid)) {
        return message.reply("    !");
      }

      data.push({ uid, lang });
      await fs.ensureFile(path);
      fs.writeJsonSync(path, data, { spaces: 2 });

      return message.reply(` WAR     UID: ${uid} [: ${lang}]`);
    }

    if (args[0] === "off") {
      await fs.ensureFile(path);
      fs.writeJsonSync(path, []);
      return message.reply(" WAR     ");
    }

    return message.reply("  :\n war on @mention <lang>\n war off");
  },

  onChat: async function ({ message, event }) {
    if (!fs.existsSync(path)) return;

    let data;
    try {
      data = fs.readJsonSync(path);
    } catch (err) {
      console.error("Failed to read JSON:", err);
      return;
    }

    const target = data.find(i => i.uid === event.senderID);
    if (!target) return;

    const galis = [
      "MADARCHOD TU ZINDA KYU HAI AB TAK? ",
      "TERI MAA KI CHUT MEIN WIFI ROUTER FIT KARKE SIGNAL BEJUN? ",
      "TERA PURA GHAR MERE CHODNE SE ELECTRIFIED HO GAYA "
    ];

    const gali = galis[Math.floor(Math.random() * galis.length)];

    try {
      const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=hi&tl=${target.lang}&dt=t&q=${encodeURIComponent(gali)}`);
      const translated = res.data[0].map(i => i[0]).join(" ");
      return message.send(` ${translated}`);
    } catch (err) {
      console.error("Translation error:", err.message);
      return message.send(` ERROR: ${gali}`);
    }
  }
};