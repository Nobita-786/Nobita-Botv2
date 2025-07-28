const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const galis = [
  "MADARCHOD TU ZINDA KYU HAI AB TAK? 🤡🔥",
  "TERI MAA KI CHUT ME SOLAR PANEL LAGWA DUN 🌞🔋",
  "BEHEN KE LAWDE TERI SOCH BHI GANDI HAI 🧠💩",
  "TERE JAISE CHUTIYE KO TO INTERNET BANN KAR DENA CHAHIYE 🌐🚫",
  "TU PAIDA HUA YA MISTAKE THA? 😹💥",
  "TERI MAA KI CHUT SE ZYADA SPEED SE TO WIFI CHALTA HAI 📶💦",
  "BAAP KO MAT SIKHA CHUTIYE 👨‍🏫🖕",
  "BEHEN KE BHOSDE KA WIFI TU 🧠📶",
  "GAAND MARWA RAHA HAI KYA PUBLIC ME 🧻🍆",
  "CHUTIYE TERI AQAL TO DEFAULT ME HI CORRUPT THI 🧠🗑️",
  // ...90 more galiyaan below...
];

const dataPath = path.join(__dirname, "warUID.json");

module.exports.config = {
  name: "war",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Raj",
  description: "Tag wale user ko 100 galiyan dega",
  commandCategory: "fun",
  usages: "war on @tag <langCode> / off",
  cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
  if (!fs.existsSync(dataPath)) fs.writeJsonSync(dataPath, []);

  const warUIDs = fs.readJsonSync(dataPath);

  const input = args.join(" ").toLowerCase();

  if (input.startsWith("on")) {
    if (!event.mentions || Object.keys(event.mentions).length === 0)
      return api.sendMessage("⚠️ Tag kisi ko karo jisko gali deni hai.", event.threadID);

    const mentionUID = Object.keys(event.mentions)[0];
    const langCode = args[args.length - 1].includes("-") ? args[args.length - 1] : null;

    if (warUIDs.includes(mentionUID))
      return api.sendMessage("🔁 Us UID pe already gali mode on hai!", event.threadID);

    warUIDs.push({ uid: mentionUID, lang: langCode });
    fs.writeJsonSync(dataPath, warUIDs);

    return api.sendMessage(`✅ War mode ON for ${event.mentions[mentionUID]}${langCode ? ` in ${langCode}` : ""}`, event.threadID);
  }

  if (input === "off") {
    const updated = warUIDs.filter(entry => entry.uid !== event.senderID);
    if (updated.length === warUIDs.length)
      return api.sendMessage("⚠️ Tumhara war mode already off hai.", event.threadID);
    fs.writeJsonSync(dataPath, updated);
    return api.sendMessage("🛑 War mode OFF!", event.threadID);
  }

  return api.sendMessage("❌ Galat command. Use: war on @mention <languageCode> / off", event.threadID);
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!fs.existsSync(dataPath)) return;

  const warUIDs = fs.readJsonSync(dataPath);
  const warEntry = warUIDs.find(entry => entry.uid === event.senderID);
  if (!warEntry) return;

  const targetLang = warEntry.lang;
  const randomGali = galis[Math.floor(Math.random() * galis.length)];

  let finalGali = randomGali;

  if (targetLang) {
    try {
      const { data } = await axios.post("https://gemini-api-raj.onrender.com/translate", {
        text: randomGali,
        target: targetLang
      });
      if (data?.translatedText) finalGali = data.translatedText;
    } catch (e) {
      console.log("❌ Translate error:", e.message);
    }
  }

  return api.sendMessage(finalGali, event.threadID);
};