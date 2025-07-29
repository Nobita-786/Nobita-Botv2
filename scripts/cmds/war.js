module.exports = {
‎  config: {
‎    name: "war",
‎    version: "2.1",
‎    author: "Hamim",
‎    description: "war fight ",
‎    category: "tag name",
‎    cooldown: 3
‎  },

  onStart: async function ({ message, args, event }) {
    let data = [];
    if (fs.existsSync(path)) data = fs.readJsonSync(path);

    if (args[0] === "on") {
      const uid = Object.keys(event.mentions || {})[0] || args[1];
      if (!uid) return message.reply("⚠️ कृपया किसी को टैग करें या UID दें।");

      const lang = args[2] || "hi";

      if (data.find(i => i.uid === uid)) {
        return message.reply("⚠️ पहले से चालू है!");
      }

      data.push({ uid, lang });
      await fs.ensureFile(path);
      fs.writeJsonSync(path, data, { spaces: 2 });

      return message.reply(`✅ WAR चालू हो गया है UID: ${uid} [भाषा: ${lang}]`);
    }

    if (args[0] === "off") {
      await fs.ensureFile(path);
      fs.writeJsonSync(path, []);
      return message.reply("✅ WAR बंद कर दिया गया है।");
    }

    return message.reply("⚠️ सही उपयोग:\n👉 war on @mention <lang>\n👉 war off");
  },

  onChat: async function ({ message, event }) {
    if (!fs.existsSync(path)) return;

    const data = fs.readJsonSync(path);
    const target = data.find(i => i.uid === event.senderID);
    if (!target) return;

    const galis = [
      "MADARCHOD TU ZINDA KYU HAI AB TAK? 🤡🔥",
      "TERI MAA KI CHUT MEIN WIFI ROUTER FIT KARKE SIGNAL BEJUN? 📶😂",
      "TERA PURA GHAR MERE CHODNE SE ELECTRIFIED HO GAYA ⚡🍆"
      // Add more insults as needed
    ];

    const gali = galis[Math.floor(Math.random() * galis.length)];

    try {
      const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=hi&tl=${target.lang}&dt=t&q=${encodeURIComponent(gali)}`);
      const translated = res.data[0].map(i => i[0]).join(" ");
      return message.send(`💢 ${translated}`);
    } catch (err) {
      console.error("Translation error:", err.message);
      return message.send(`😡 ERROR: ${gali}`);
    }
  }
};