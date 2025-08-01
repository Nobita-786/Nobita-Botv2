const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "war",
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
  "MUMMY KE BHOSDE MEIN NAGIN DANCE KAR RAHA HU 🐍💃",
  "TERI BEHEN KI CHUT MEIN DHOOP LAGA KE KHA RAHA HU 🍑☀️",
  "BAAP KE SAMNE BAITH KE MAA CHOD DIYA TERA 💥👨‍👩‍👧‍👦",
  "TERI MAA KO CHOD KE USKE AADHAR CARD PE SIGN KIYA MAINE ✍️🪪",
  "BEHEN KE BHOSDE MEIN REEL BANA RAHA HU 🎥🍑",
  "TERI MAA SE ITNA CHODA KI USKE GOOGLY MEIN SPINNER GHUM GAYA 🌀😂",
  "CHUTIYE TU TO AAJ TAK PALAK PANER MEIN PALAK DHUND RAHA HAI 🥬👀",
  "TERI MAA KA SANDAS SAF KAR KE USME CHAI BANAYA ☕🚽",
  "BEHEN KE BHOSDE MEIN WHATSAPP GROUP BANAYA AUR ADMIN BHI HU 📱👑",
  "MUMMY KO ITNA CHODA KI AB WOH DAILY TUJHE BHI DEKHTE ROTE HAIN 😭",
  "TERI BEHEN KO LOG SPOTIFY PE SEARCH KARTE HAIN ABUSIVE CONTENT KE LIYE 🔍🎶",
  "BHOSDIKE, TERI MAA KO AI-GENERATED CHOD DIYA 🤖🍑",
  "TERI MAA AUR BEHEN DONO KO EK SAATH PIZZA BANAYA 🍕👩‍👧",
  "TERA BAAP MUJHSE TRAINING LETA HAI KAISA CHODTE HAIN 🏋️‍♂️🍑",
  "MADARCHOD, TERI FAMILY MEIN MERA DNA MILTA HAI 🔬🧬",
  "BEHEN KE BHOSDE MEIN IPL MATCH CHALA RAHA HU 🏏🍑",
  "TERI MAA KO LAST NIGHT 4K RESOLUTION MEIN CHODA 📸💦",
  "CHUTIYE, TERI ZINDAGI KA TUTORIAL BHI FAIL HO GAYA 📉🎓",
  "TERI MAA KA BHOSDA GOOGLE MAPS PE VISIBLE HAI 🗺️🔍",
  "BEHEN KO ITNA CHODA KI USKI GALLI KA NAAM MERA RAKH DIYA 🚏🍑",
  "MUMMY KO CHODNE KE BAAD PANI PURI KHILAYA 😋💦",
  "BEHEN KE BHOSDE MEIN FLIPKART KA WAREHOUSE KHOLA 📦🍑",
  "TERA BAAP BHI KEHTA HAI BETA THIK CHODTA HAI 👨‍👦💥",
  "TERI MAA KO PDF FORMAT MEIN CHOD DIYA 📄🍑",
  "TERI BEHEN KO MAINE NASA BEJ DIYA, AB SPACE MEIN BHI CHODUNGA 🚀🍑",
  "CHUTIYE, TERI MAA KO MERA DAILY DOSE MILTA HAI 💊🍆",
  "MUMMY KE BHOSDE MEIN WIFI LAGA DIYA, AB SAB CONNECT HO RAHE HAIN 📶🍑",
  "BEHEN KE BHOSDE MEIN ADVERTISEMENT AATA HAI AB 💰📺",
  "TERI MAA SE POORA CITY PASS HO GAYA 🏙️🍑",
  "TERI BEHEN KO GOOGLE FORM BANAYA AUR SABKO BHARNE DIYA 📝🍑",
  "CHUTIYA FAMILY PACK WITH MAA BEHEN BHOSDA INCLUDED 🎁🍑",
  "TERI MAA KO CHOD KE SWIGGY MEIN RATING DIYA ⭐🍑",
  "BEHEN KO DAALO TO BOSS MUSIC BAJTA HAI 🔊🍆",
  "TERA BAAP MERA CAMERA MAN HAI 🎥👨‍👦",
  "TERI MAA KI CHUT PE SNAPCHAT FILTER LAGAYA 📸🍑",
  "BEHEN KO AI TRAINING KE LIYE CHODA 🤖🍆",
  "TERI MAA KI CHUT KA POSTER LAGA DIYA MOHALLA MEIN 📢🍑",
  "BEHEN KE BHOSDE MEIN GOOGLE ADS CHALA DIYE 📢🍑",
  "MUMMY KE BHOSDE MEIN AMAZON PRIME CHALA RAHA HU 🎥🍑",
  "TERI MAA KO PHOTOSHOP KIA, PHIR REAL MEIN CHODA 💻🍑",
  "TERA PURE FAMILY TREE MERA BHOSDA PAKAD KE BANAYA 🌳💥",
  "BEHEN KO GOOGLE DOCS BANAYA, SAB EDIT KAR RAHE HAIN 📝🍑",
  "MUMMY KI CHUT MEIN XML CODE LIKHA HU 💻🍑",
  "TERI MAA KO DJ BANA KE CHOD DIYA 🎧🍆",
  "BEHEN KO MAINE FREEFIRE KE LOBBY MEIN LE LIYA 🎮🍑",
  "TERI MAA SE CHUD CHUD KE BHAIYA BHI MERA HO GAYA 😭🍆",
  "BEHEN KE BHOSDE MEIN PYTHON CODE LIKHA HU 🐍💻",
  "MUMMY KO BLOCKCHAIN ME REGISTER KIA CRYPTO ME 💰🍑",
  "TERI BEHEN KO DATA PACK BANA DIYA, SAB USE KAR RAHE HAIN 📶🍑",
  "MUMMY SE POOCHA: TUMHARA BETA CHUTIYA KYU HAI? USNE KAHA GENE 👶💩",
  "BEHEN KI CHUT SE WIFI MIL RAHA, PASSWORD: MADARCHOD 💻📶",
  "TERA PAPA MERA STUDENT, MUMMY TO DEMO THI 📚🍑",
  "TERI MAA KO EK DIN ME 69 STYLE MEIN 69 BAAR CHODA 🔄🍆",
  "BEHEN KO CLOUD STORAGE BANA DIYA, SABKA DATA USME HAI ☁️🍑",
  "TERI MAA KO CHOD KE GOOGLE REVIEW DIYA: ‘TOO TIGHT’ ⭐🍆",
  "BEHEN KO MULTIPLAYER GAME BANA DIYA, SAB KHEL RAHE HAIN 🎮🍑",
  "TERI MAA SE CHOD KE WHATSAPP STATUS LAGAYA 📱💦",
  "BEHEN KE BHOSDE MEIN ANIME CHARACTER FIT KAR DIYA 🎌🍑",
  "MUMMY KO NETFLIX ORIGINAL BANAYA, SAB BINGE KAR RAHE HAIN 📺🍆",
  "TERA PAPA MERE PICHHE LINE ME KHADA THA 👨‍👦🪑",
  "BEHEN KI CHUT MEIN PYROTECHNICS LAGA DIYE DIWALI ME 🎇🍑",
  "TERI MAA KO DISNEY CHARACTER BANA DIYA, AB BACHHE USPE CRUSH KARTE HAIN 🧚🍑",
  "BEHEN KO NFT BANAYA, AB SAB USPE BID LAGA RAHE HAIN 🖼️💰",
  "TERI MAA SE POOCHA ‘KAISE LAGE HUM?’ USNE KAHA ‘HAR ROZ KE HERO’ 🎥🔥",
  "BEHEN KO API ENDPOINT BANA DIYA, SAB REQUEST BEJ RAHE HAIN 📡🍑",
  "TERA PURE CLAN MERA FAN HAI 🛡️💥",
  "MUMMY KO PAST TENSE ME CHOD DIYA: CHOD GAYA THA 🍆⌛",
  "BEHEN KE BHOSDE MEIN GOOGLE SEARCH BAR LAGA DIYA 🔍🍑",
  "TERI MAA KA BHOSDA RECHARGE CENTER BAN GAYA 💳🍆",
  "BEHEN KO MALL BANAYA, SAB SHOPPING KAR RAHE HAIN 🛍️🍑",
  "TERI MAA SE QR CODE SCAN KIA, LINK NIKLA: ‘CHOD LO’ 🔗🍑",
  "BEHEN KO TINDER ME SWIPE RIGHT KIA, MATCH HO GAYA 🔥🍑",
  "TERA BAAP MERE COMMENT ME ‘NICE BETA’ LIKH RAHA HAI 👨‍👦💬",
  "MUMMY KO SERVER BANAYA, SAB CONNECT HO RAHE HAIN 🌐🍆",
  "TERI BEHEN KO EXCEL SHEET BANA DIYA, SAB USME INPUT DE RAHE HAIN 📊🍑",
  "TERI MAA KO ALPHABET ORDER ME CHODA A TO Z 🔤🍑",
  "BEHEN KO PROGRAM BANAYA, LOOP MEIN CHOD RAHE HAIN 🔁🍑",
  "MUMMY KO ADOBE PREMIERE ME EDIT KIYA, SLOW MOTION CHOD DIYA 🎬💥",
  "TERA PURA GHAR MERE CHODNE SE ELECTRIFIED HO GAYA ⚡🍆"
]
      // ➕ बाकी गालियाँ भी यहीं पर रखें (आपके list से)
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
