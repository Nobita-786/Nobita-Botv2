const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "war",
  version: "2.0.0",
  hasPermssion: 1,
  credits: "Raj",
  description: "Start war with UID or tag (supports language)",
  commandCategory: "fun",
  usages: "war on @mention <langCode> | war off",
  cooldowns: 5
};

const dataPath = path.join(__dirname, "warUID.json");

module.exports.onLoad = () => {
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify({}));
};

module.exports.onStart = async function ({ message, event, args }) {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const threadID = event.threadID;

  if (args[0]?.toLowerCase() === "off") {
    delete data[threadID];
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return message.reply("✅ | War disabled for this group.");
  }

  if (args[0]?.toLowerCase() === "on") {
    let uid;
    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } else if (Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    } else {
      return message.reply("⚠️ | Please reply to a message or mention a user.");
    }

    const lang = args[1]?.toLowerCase() || "hi";

    data[threadID] = { uid, lang };
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return message.reply(`💣 | War started with ${uid} in "${lang.toUpperCase()}" language.`);
  }

  return message.reply("❌ | Invalid command. Use:\n- war on @mention <langCode>\n- war off");
};

module.exports.onChat = async function ({ event, message, api }) {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const threadID = event.threadID;
  const entry = data[threadID];

  if (!entry || event.senderID != entry.uid) return;

  const galis = [
    "MADARCHOD TU ZINDA KYU HAI AB TAK? 🤡🔥",
    "BHENCHOD TERI MAA MERI LUND SE ROZ PREGNANT HOTI HAI 💦👶",
    "RANDI KI AULAAD, TERI BHEN KO NIHURATE NIHURATE THAK GAYA HU 🥵",
    "GAANDU TERI MAA KO LODI KE UPPAR BETHA KE GHOOMA DIYA AUTO ME 🚕",
    "CHUTIYE TERI BHEN MERE ROOM ME AKE BOLTI — 'BHAIYA NAHI DENA? 😩'",
    "MADARCHOD TERI MAA MERI CUM KI MACHINE BAN CHUKI HAI 🍦",
    "BHENCHOD TERI GAAND FODNE KA LICENSE MIL GAYA MUJHE 🧨",
    "TERI RANDI BHEN KO BINA VASELINE KE CHOD DIYA, GAAND PHAT GAYI 💣",
    "MADARCHOD TERA BAAP BHI MERA FAN HAI — TERI MAA KE VIDEO DEKHTA HAI 📲",
    "TERI MAA BHEN KO COMBO ME NIHURATE HUYE INSTAGRAM LIVE KARA 💻📷",
    "BHOSDIKE, TERI MAA KO SUTLI BOMB SE CHOD DIYA 🧨💥",
    "MADARCHOD TERE GHAR KA DOOR BELL MERE LUND SE BAJTA HAI 🔔🍆",
    "RANDI KI OLAAD, TERI MAA BHEN DONO KO EK SAATH THOKA GROUP DISCOUNT PE 💸",
    "BHENCHOD TERI CHUTIA BHEN KE BHOSDE ME TIKTOK FILTER LAGA DIYA 🎭",
    "GAANDU TERI MAA ITNI RANDI HAI KI USKA RAKHI KA BHAI BHI CHODTA HAI 🥴",
    "TERI BHEN KE BHOSDE ME LIGHT DAAL KE MOVIE DEKH RAHA HU 📽️",
    "MADARCHOD TU ZINDA HI GALTI HAI 😆",
    "BHENCHOD TERI GAAND ME MERE LUND KA PERMANENT PARKING HAI 🅿️🍆",
    "CHUTIYE TERI MAA KO THOKNE KA TIME TABLE BANAYA HU 📅",
    "TERI RANDI MAA KO RAILWAY STATION PE FREE SERVICE DETE HUE PAKDA 🚉",
    "TERI BHEN MERE LUND KI LIPSTICK LAGA KE GHOOMTI HAI 💄",
    "MADARCHOD TERE GHAR KA WIFI BHI MERA LUND PAKADTA HAI 📶🍆",
    "RANDI KE PILLE TERI BHEN KO PAMPHLET BANA KE SABKO DE DIYA 🗞️",
    "TERI MAA CHODNE KE BAAD BOLI: 'LAG GAYA SWARG JAISA' 😇",
    "BHOSDIKE TERI BHEN MERE ROOM ME AAKE KEHTI — 'BHAIYA, MERA BHI WAR KARO 😍'",
    "TERI MAA KI CHUT KA SCREENSHOT LEKAR DP LAGA DIYA 🖼️",
    "MADARCHOD TU JI RAHA HAI — YEHI SABSE BADI GALI HAI 💀",
    "RANDI TERI MAA KO THOK KE BOL DIYA: 'NEXT TIME DEEPER PLEASE 🥵'",
    "BHENCHOD TERI BHEN KO LODA KA SUBSCRIPTION DE DIYA HU 📦",
    "GAANDU TERA MUKH MANDAL DEKHKE LODA SOOKH GAYA 🥶",
    "TERI BHEN KO NIHURA KAR BED PE CHODUNGA 🔥🥵 USKI CHUT SE DHUAAN NIKALEGA 🤤",
    "TERI MAA KI KALI CHUT MEIN APNA LUND GHUSA KE USSE TANDOORI RANDI BANA DUNGA 🔥🍑",
    "TERI BHEN KO BINNA LICENSE KE NIGHT SHIFT ME CHODUNGA, AUR USKE UPPER CCTV SE CLIP VIRAL KARUNGA 🎥🥵",
    "TERI MAA KE MUNH ME LUND DALKE USSE BULWAUNGA — ‘MERI MAA RANDI HAI’ 🤬🍆",
    "TERI BHEN KO KUTTI KI TARAH GAAND UTHA KE NIHURA KAR CHODUNGA 🐕🍑🔥",
    "TERI MAA KO PUBLIC PARK ME NIHURA KE CHODA, SAB NE TALIAN BAJAI 👏🥵",
    "TERI BHEN KI CHUT MEIN LUND GHUSA KE PAKODA TAL DIYA 🥵🍆🔥",
    "TERI MAA KI KALI CHUT MEIN 2.5 FOOT KA LODA DAALA, USME SE AAG NIKAL GAYI 🔥🔥",
    "TERI BHEN KO NIHURA KAR SUITCASE ME BAND KARKE EXPORT KAR DIYA DUBAI 🧳✈️🥵",
    "TERI MAA BHEN KO CHODTE CHODTE MERA LODA BHI THAK GAYA, FIR ICE PACK LAGA KE FIRSE CHODA 🧊🍑🔥",
    "TERI BHEN KI GAAND KA PRESSURE ITNA THA KE MERE LUNDE NE BOL DIYA — BRO, RETIRE KAR DE 💦🥵",
    "TERI MAA BHEN KE BHOSDE MEH DSLR LAGA DIYA, FULL HD RECORDING CHALU 📸🔥",
    "TERI BHEN KO CHODTE CHODTE MERA HAATH DARD KARNE LAGA 💪🥵 FIR LODA SE TYPE KARNA PADA 🤤",
    "TERI MAA NIHUR KAR ITNI RANDI LAG RAHI THI KI CHOR BHI USKO CHODNE AA GAYE 🥵🔪",
    "TERI BHEN KO LADDU JAISA GAAND HONE PAR BINA SAANSE LIYE CHOD DIYA 🎯🔥",
    "TERI MAA KO NIWALA BANA KE SABZI KI TARAH CHOD DIYA 🥦🍆🥵",
    "TERI BHEN KO NIHURATE HUYE DEKH KAR PURA MOHALLA LINE ME LAG GAYA 🤤🔥",
    "TERI MAA KE BHOSDE ME FULL HD KA MOVIE PROJECTOR DAAL DIYA 📽️🍑🔥",
    "TERI BHEN KI CHUT ITNI GANDI HAI KI USME LUND DALNE SE PEHLE VACCINE LAGWANA PADTA HAI 💉🥵",
    "TERI MAA KE UTERUS ME DJ LAGA DIYA, BEAT DROP KE SAATH CHODTA HU TERI MRANDI MAA KO SAALE MADARCHOD RANDI KE PILLE 🔊💃🍑",
    "TERI BHEN KO CHODTE CHODTE MERA HAATH DARD KARNE LAGA 💦💪, FIR GAAND 🍑 ME LODA 🍆 PHANSA KE CHODNA PADA 😤",
    "TERI MAA KO NIHURA KE ITNA CHODA 🤸‍♂️ KI MERA KANDHA DISLOCATE HO GAYA 🏥😵‍💫",
    "TERI BHEN KE BHOSDE 🐱 KO BAR BAR CHODTE CHODTE 💦 MERE LUNDE 🍆 NE BHI BOL DIYA — AUR NAHI HOTA 🫠🙏",
    "TERI MAA KI KALI CHUT 🌑 ME 3 LODA 🍆🍆🍆 EK SAATH DAALA, MERE KNEE KE LIGAMENT FAT GAYE 🦵⚠️",
    "TERI BHEN KO NIHURA KE ITNA CHODA KI CHUT 🐱 NE MUJHE BOL DIYA — AB BAS KAR BHAI 😭🚫",
    "TERI MAA KO CHODNE KE LIYE MAINE LODA 🍆 ICE ❄️ ME DUBOYA FIR FIRE 🔥 MODE PE DAALA — OVERHEAT HO GAYA 😵‍🔥",
    "TERI BHEN KI GAAND 🍑 KA PRESSURE ITNA ZYADA THA KE LODA 🍆 KHUD ANDAR CHALA GAYA 😨🔩",
    "TERI MAA BHEN KO 69 STYLE 🔄 ME NIHURATE HUYE FULL NIGHT RECORDING 🎥 CHALI, EDIT KARTE KARTE YOUTUBE CHUTTT BANNA DIYA MADARCHOD 🔥👅"
  ];

  let randomGali = galis[Math.floor(Math.random() * galis.length)];

  try {
    const info = await api.getUserInfo(event.senderID);
    const name = info[event.senderID]?.name || "Chutiya";

    const lang = entry.lang || "hi";
    const translated = await translate(randomGali, lang);

    return message.reply({
      body: `@${name} ${translated}`,
      mentions: [{ tag: `@${name}`, id: event.senderID }]
    });
  } catch (e) {
    return message.reply("❌ | Error fetching user info or translating.");
  }
};

async function translate(text, targetLang) {
  try {
    const res = await axios.get(`https://translate.googleapis.com/translate_a/single`, {
      params: {
        client: "gtx",
        sl: "auto",
        tl: targetLang,
        dt: "t",
        q: text
      }
    });
    return res.data[0][0][0];
  } catch (e) {
    return text;
  }
}