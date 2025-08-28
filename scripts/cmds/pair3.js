const axios = require("axios");
const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "pair3",
    aliases: ["paircache"],
    version: "1.6",
    author: "Raj",
    countDown: 5,
    role: 0,
    shortDescription: "Pair photo with cache system (no mention needed)",
    longDescription: "Generate romantic pair photo with DP caching (sender + random member)",
    category: "image",
    guide: "{p}pair3"
  },

  onStart: async function ({ event, message, usersData, api }) {
    try {
      const uid1 = event.senderID;

      // ✅ group members list
      const threadInfo = await api.getThreadInfo(event.threadID);
      const members = threadInfo.participantIDs.filter(id => id !== uid1);

      if (members.length === 0) {
        return message.reply("❌ Group me koi aur member nahi mila pairing ke liye.");
      }

      // ✅ random member pick
      const uid2 = members[Math.floor(Math.random() * members.length)];

      async function getUserName(uid) {
        try {
          let name = await usersData.getName(uid);
          if (!name) {
            const info = await api.getUserInfo(uid);
            if (info && info[uid] && info[uid].name) {
              name = info[uid].name;
            }
          }
          return name || "Unknown";
        } catch {
          return "Unknown";
        }
      }

      const name1 = await getUserName(uid1);
      const name2 = await getUserName(uid2);

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      async function getDP(uid) {
        const filePath = path.join(cacheDir, `${uid}.jpg`);
        if (fs.existsSync(filePath)) {
          return filePath; 
        } else {
          const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
          const response = await axios.get(url, { responseType: "arraybuffer" });
          fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));
          return filePath;
        }
      }

      const dp1 = await getDP(uid1);
      const dp2 = await getDP(uid2);

      const bg = await jimp.read("https://i.ibb.co/pBW6sJvn/1756380534372-0-9829852431279544.jpg");
      const img1 = await jimp.read(dp1);
      const img2 = await jimp.read(dp2);

      img1.resize(300, 300).circle();
      img2.resize(300, 300).circle();

      bg.composite(img1, 100, 100);
      bg.composite(img2, 500, 100);

      // ✅ Shayari list
      const shayaris = [
        "❤️ 𝗧𝗲𝗿𝗶 𝗠𝘂𝘀𝗸𝗮𝗮𝗻 𝗠𝗲𝗿𝗶 𝗭𝗶𝗻𝗱𝗮𝗴𝗶 𝗞𝗮 𝗡𝗮𝘀𝗵𝗮 𝗛𝗮...𝗧𝘂𝗷𝗵𝗲 𝗡𝗮 𝗗𝗲𝗸𝗵𝘂 𝗧𝗼 𝗠𝗲𝗿𝗮 𝗗𝗶𝗹 𝗥𝗼𝘁𝗮 𝗛𝗮𝗶 ❤️",
        "🌹 Tumhari yaadon mein dil bechain rehta hai 🌹",
        "💕 Tere bina har pal adhoora lagta hai 💕",
        "✨ Tera saath hi meri duniya ki roshni hai ✨"
      ];

      // ✅ random shayari
      const shayari = shayaris[Math.floor(Math.random() * shayaris.length)];

      // ✅ naam add karna
      const fontWhite = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
      bg.print(fontWhite, 0, 450, {
        text: `${name1} ❤ ${name2}`,
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
      }, bg.bitmap.width, 50);

      // ✅ shayari add karna (dark font)
      const fontBlack = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
      bg.print(fontBlack, 0, 510, {
        text: shayari,
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
      }, bg.bitmap.width, 50);

      const outputPath = path.join(cacheDir, `pair-${uid1}-${uid2}.jpg`);
      await bg.writeAsync(outputPath);

      message.reply({
        body: `❤️ Cute Couple: ${name1} × ${name2} ❤️\n\n${shayari}`,
        attachment: fs.createReadStream(outputPath)
      });

    } catch (err) {
      console.error(err);
      message.reply("⚠️ Error generating pair image.");
    }
  }
};
