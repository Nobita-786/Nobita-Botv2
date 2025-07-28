const axios = require("axios");

module.exports.config = {
  name: "war",
  version: "1.2.0",
  hasPermssion: 1,
  credits: "Raj",
  description: "Auto gali on UID's messages (trigger by war command)",
  commandCategory: "fun", // ✅ category fixed
  usages: "[on] <tag or uid> <langCode>/ off",
  cooldowns: 3
};

const fs = require("fs-extra");
const path = __dirname + "/cache/war_uid.json";
const galis = [
  "MADARCHOD TU ZINDA KYU HAI AB TAK? 🤡🔥",
  "TERI MAA KI CHUT MEIN WIFI ROUTER FIT KARKE SIGNAL BEJUN? 📶😂",
  "BEHEN KE LAUDE, DUNIYA MEIN AA KE KYU GAND FAILA RAHA HAI TU? 💩🚮",
  "TERI MAA KO ITNA CHODA KI USKA AADHA SHARE BSE MEIN LISTED HAI 📈💀",
  "CHUTIYE, TERA IQ TO GOBAR SE BHI KAM HAI 💩📉",
  "TERE JAISA TO CONDOM BREAK HONE KA RESULT HOTA HAI 🧬💥",
  "MADARCHOD, TU TO GALIYON KA LIVE STREAM HAI 📺💣",
  "TERI BEHEN KO GOOGLY DAAL DI, AB TAK SEARCH RESULT NAHI AAYA 😭🔍",
  "BHOSDIKE, TERI MAA KI CHUT MEIN YOUTUBE PREMIUM, AD FREE CHOD RAHA HU 🍑📺",
  "TU TO ITNA GANDA HAI KI SANITIZER BHI TERI SHAKAL DEKH KE BHAAG JAYE 🧴🚫",
  // Add more lines here up to 100 total
];

if (!fs.existsSync(path)) fs.writeJsonSync(path, []);

module.exports.run = async ({ api, event, args }) => {
  const data = fs.readJsonSync(path);

  if (args[0] == "on") {
    if (!args[1]) return api.sendMessage("⚠️ कृपया किसी को टैग करें या UID दें।", event.threadID);
    const uid = Object.keys(event.mentions)[0] || args[1];
    const lang = args[2] || "hi";

    if (data.includes(uid)) return api.sendMessage("⚠️ पहले से ही गाली मोड में है!", event.threadID);
    data.push({ uid, lang });
    fs.writeJsonSync(path, data);
    return api.sendMessage(`✅ WAR MODE ON हो गया है UID: ${uid} के लिए [भाषा: ${lang}]`, event.threadID);
  }

  if (args[0] == "off") {
    fs.writeJsonSync(path, []);
    return api.sendMessage("✅ WAR MODE बंद कर दिया गया है।", event.threadID);
  }

  return api.sendMessage("⚠️ सही उपयोग करें:\n👉 war on @mention <lang>\n👉 war off", event.threadID);
};

module.exports.handleEvent = async ({ api, event }) => {
  const data = fs.readJsonSync(path);
  const user = data.find(i => i.uid == event.senderID);
  if (!user) return;

  const rand = galis[Math.floor(Math.random() * galis.length)];

  try {
    const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=hi&tl=${user.lang}&dt=t&q=${encodeURIComponent(rand)}`);
    const translated = res.data[0].map(i => i[0]).join(" ");
    api.sendMessage(`💢 ${translated}`, event.threadID);
  } catch (e) {
    api.sendMessage(`😡 ERROR IN TRANSLATION: ${rand}`, event.threadID);
  }
};