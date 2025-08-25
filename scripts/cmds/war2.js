const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "war2",
    version: "1.2.0",
    author: "Raj",
    description: "Auto gali on UID's messages (trigger by war command)",
    category: "fun",
    usages: "[on] <tag or uid> <langCode>/ off",
    cooldowns: 3
  },

  onStart({ api, event, args }) {
    const path = __dirname + "/cache/war_uid.json";
    if (!fs.existsSync(path)) fs.writeJsonSync(path, []);
    const data = fs.readJsonSync(path);

    if (args[0] == "on") {
      const uid = Object.keys(event.mentions)[0] || args[1];
      if (!uid) return api.sendMessage("⚠️ कृपया किसी को टैग करें या UID दें।", event.threadID);
      const lang = args[2] || "hi";

      if (data.find(i => i.uid === uid)) return api.sendMessage("⚠️ पहले से चालू है!", event.threadID);

      data.push({ uid, lang });
      fs.writeJsonSync(path, data);
      return api.sendMessage(`✅ WAR चालू हो गया है UID: ${uid} [भाषा: ${lang}]`, event.threadID);
    }

    if (args[0] == "off") {
      fs.writeJsonSync(path, []);
      return api.sendMessage("✅ WAR बंद कर दिया गया है।", event.threadID);
    }

    return api.sendMessage("⚠️ सही उपयोग:\n👉 war on @mention <lang>\n👉 war off", event.threadID);
  },

  async onChat({ api, event, usersData }) {
    const path = __dirname + "/cache/war_uid.json";
    if (!fs.existsSync(path)) return;

    const data = fs.readJsonSync(path);
    const found = data.find(i => i.uid == event.senderID);
    if (!found) return;

    const galis = [
  "TERIIIIIIIII BHENN KAA BHOSDDA MADERJAAT TERII AMMAA KA NADAA KHOLU🤣🤣🤣",
  "ABEE DHHIILLE LOWDE K BALLL TERII AAMMA MERE PASS AATII THIII😂",
  "TERII BHENN CHODD DUNGAA BSDKK LOWDE MADERJAAT AUKAAATTT LESS TATTA🤪",
  "TERII BHENN KII JHAATT MEE LANDD DAALUU MADERCHODDD K PILLE 😂",
  "TERII AMMAA KO CHHODD K AATE HAII ROJJ LOWDAAA UKHAAD LO BSDKKK 🫣",
  "TERII BHEN KII JADAA MAAR LI KHOON AA GYAA BSDKK 😞",
  "AREE JAA TERII AMMAA KAA ITNAA BDAA BHOSSDAA BRO🫣",
  "TORII AAMAA KI PUDII MEE LAAADO RANDII K BEEJ😈",
  "LOWDEE K BAAAL AISA CHODUNGAAA NAA 7 DINN TAKK PAANI NHI MANGEGAA BHAAN K LODEE 😈",
  "EK BARR TERII BHEN KO BHEJ DE MERE PAASS TUJHE MAMA BNAA DUNGAA 8 MONTH ME😁😁😁",
  "AAJAA LANDD CHUSSS LO MERAAA EK DUM TIGHT KHDAA HAII🥰",
  "ARE BETAA MNE ACHHO ACHHO KI AAMMA CHODI HAI TBHI YAHA TAK POHCHA HU AB TERI BHI CHOD DENGEE😂",
  "HAWABAAZI TATTE APNI MUMMY KAA DOODH PIKE AAA TB FYT KRNAA TERII MUMMY K DOODH ME HAI 100 LOWDO KA DUM🥰",
  "THAKK GYAA KYAA BSDKK TYPP KARR NAA😵‍💫",
  "ON VIDEO CHAL RHI HAU BSDKK BHAGNAA MATT😂",
  "TERI AMMA KI BUR ME ICE CREAM DAAL DUNGA BARF LGAA K 😂",
  "BETAA YAAD RAKHNAA RAJ PAPA SE PANGEE MATT LENA AB KBHI JAO KHUS RAHO 🤣🤣",
  "TERI BHEN KO BINNA LICANCE KE CHODUNGA SAALE MADARCHOD RANDI KE PILLE",
  "TERI BHEN KI KAKI CHUT CHODTE CHODTE THAKKKK GAYA 😋😋😋😴",
  "TERI BHEN KI CHUT ME MIRCHI LAGA KAR CHODU TERI BHEN CHILAYE AHHHHHH MAI CHODTA RAHUU AHHHHHHH MAHJA ARAHA HAI TERI BHEN KI CHUT MADT HAI 😗😋😋🤤🤤",
  "TERI BHEN KE KALI GAND ME LUND DALUGA PHIR CHUT SE LUND NIKALUNGA😋😋😋🤤",
  "TERI BHEN KI CHUT KO CHODYE CHODTE MAJJA AAGAYA SACH ME TERI BHEN KI CHUTT TASTY HAI 😋 😋 😋 YAMMI 😗",
  "TERI MAA KA BOOBS DABA DABA KAR BADA KAR DU 😋😋🤤🤤",
  "TERI BHEN KI BOOBS SACH ME TASTY HAI 😋🤤🤤🤤",
  "MADARCHOD TU ZINDA KYU HAI AB TAK? 🤡🔥",
  "BHENCHOD TERI MAA MERI LUND SE ROZ PREGNANT HOTI HAI 💦👶",
  "RANDI KI AULAAD, TERI BHEN KO NIHURATE NIHURATE THAK GAYA HU TERII MAA KI CHUT SACH ME MOTI HAI🥵",
  "GAANDU TERI MAA KO LODI KE UPPAR BETHA KE GHOOMA DIYA AUTO ME MAR JAIYEGI SAALI 🚕",
  "CHUTIYE TERI BHEN MERE ROOM ME AKE BOLTI — BABILUNAHI DENA? CHUT😩",
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
  "TERI MAA CHODNE KE BAAD BOLI LAG GAYA SWARG JAISA😇",
  "BHOSDIKE TERI BHEN MERE ROOM ME AAKE KEHTI — BHAIYA, MERA BHI WAR KARO 😍",
  "TERI MAA KI CHUT KA SCREENSHOT LEKAR DP LAGA DIYA 🖼️",
  "MADARCHOD TU JI RAHA HAI — YEHI SABSE BADI GALI HAI 💀",
  "RANDI TERI MAA KO THOK KE BOL DIYA: NEXT TIME DEEPER PLEASE 🥵",
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
  "TERI BHEN KO LADDU JAISA GAAND HONE PAR BINA SAANSE LIYE CHOD DIYA AHHHHHHH AHHHHHHHH 🎯🔥",
  "TERI BHENNN KO KUTTI KI TRAH NIHURA MAR CHODDU 🤤🤤🤤😋😋😋🥦🍆🥵",
  "TERI BHEN KO NIHURATE HUYE DEKH KAR PURA MOHALLA LINE ME LAG GAYA 🤤🔥",
  "TERI MAA KE BHOSDE ME FULL HD KA MOVIE PROJECTOR DAAL DIYA 📽️🍑🔥",
  "TERI BHEN KI CHUT ITNI GANDI HAI KI USME LUND DALNE SE PEHLE VACCINE LAGWANA PADTA HAI 💉🥵",
  "TERI MAA KE UTERUS ME DJ LAGA DIYA, BEAT DROP KE SAATH CHODTA HU 🔊💃🍑",
  "TERI BHEN KO CHODTE CHODTE MERA HAATH DARD KARNE LAGA 💦💪, FIR GAAND 🍑 ME LODA 🍆 PHANSA KE CHODNA PADA 😤",
  "TERI MAA KIIIIIII GULABI CHUTTTTT ME UMMMHHHHAAA UMMMMHAAA😘😘😘🤤🏥😵‍💫",
  "TERI BHEN KE BHOSDE 🐱 KO BAR BAR CHODTE CHODTE 💦 MERE LUNDE 🍆 NE BHI BOL DIYA — AUR NAHI HOTA 🫠🙏",
  "TERI MAA KI KALI CHUT 🌑 ME 3 LODA 🍆🍆🍆 EK SAATH DAALA, MERE KNEE KE LIGAMENT FAT GAYE 🦵⚠️",
  "TERI BHEN KO NIHURA KE ITNA CHODA KI CHUT 🐱 NE MUJHE BOL DIYA — AB BAS KAR BHAI CHUT BHI FATNE WALA HAI 😭🚫",
  "TERI MAA KO CHODNE KE LIYE MAINE LODA 🍆 ICE ❄️ ME DUBOYA FIR FIRE 🔥 MODE PE DAALA — OVERHEAT HO GAYA TERI BHEN KI CHUTTT ICECREAM BANN GAYI😵‍🔥",
  "TERI BHEN KI GAAND 🍑 KA PRESSURE ITNA ZYADA THA KE LODA 🍆 KHUD ANDAR CHALA GAYA 😨🔩",
  "TERI MAA BHEN KO 69 STYLE 🔄 ME NIHURATE HUYE FULL NIGHT RECORDING 🎥 CHALI, EDIT KARTE KARTE YOUTUBE CHUTTT BANNA DIYA MADARCHOD 🔥👅"
];

    const rand = galis[Math.floor(Math.random() * galis.length)];

    try {
      const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=hi&tl=${found.lang}&dt=t&q=${encodeURIComponent(rand)}`);
      const translated = res.data[0].map(i => i[0]).join(" ");
      const name = await usersData.getName(event.senderID);
      api.sendMessage(`💢 ${name} ➤ ${translated}`, event.threadID);
    } catch (e) {
      const name = await usersData.getName(event.senderID);
      api.sendMessage(`💢 ${name} ➤ ${rand}`, event.threadID);
    }
  }
};
