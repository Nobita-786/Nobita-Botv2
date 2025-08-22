const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

let lastSentIndex = -1;

module.exports = {
  config: {
    name: "chocolate",
    version: "1.0",
    author: "Raj",
    countDown: 5,
    role: 0,
    shortDescription: "no-prefix",
    longDescription: "Chocolate funny gif sender",
    category: "no prefix",
    guide: { en: "{p}{n}" }
  },

  onStart: async function () { },

  onChat: async function ({ api, event }) {
    const { threadID, messageID, body } = event;
    if (!body) return;
    const messageText = body.toLowerCase().trim();

    const triggers = [
      "chocolate",
      "choco",
      "🍫",
      "dairy milk",
      "kit ket"
    ];

    const replies = [
      "🍫 Lo chocolate! Sweetness ki shuruaat yahan se hoti hai 😍",
      "🍫 𝐘𝐞 𝐥𝐨 𝐛𝐚𝐛𝐲, 𝐚𝐚𝐣 𝐤𝐢 𝐝𝐚𝐲𝐭 𝐦𝐞 𝐜𝐡𝐨𝐜𝐨 𝐦𝐞𝐫𝐢 𝐭𝐚𝐫𝐚𝐟 𝐬𝐞 😉 💕",
      "🍫 𝐘𝐞 𝐥𝐨 𝐛𝐚𝐛𝐲, 𝐚𝐚𝐩𝐤𝐚 𝐜𝐡𝐨𝐜𝐨𝐥𝐚𝐭𝐞 😚🥰",
      "🍫 𝐂𝐡𝐨𝐜𝐨 𝐭𝐨 𝐦𝐢𝐥𝐠𝐲𝐚, 𝐚𝐛 𝐛𝐨𝐭 𝐤𝐚 𝐝𝐢𝐥 𝐛𝐡𝐢 𝐥𝐞 𝐥𝐨 💝 😘"
    ];

    const mediaUrls = [
      "https://files.catbox.moe/3w8x5c.gif",
      "https://files.catbox.moe/8gqz42.gif",
      "https://files.catbox.moe/p0z3zu.gif"
    ];

    if (triggers.includes(messageText)) {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * mediaUrls.length);
      } while (newIndex === lastSentIndex && mediaUrls.length > 1);
      lastSentIndex = newIndex;

      const selectedUrl = mediaUrls[newIndex];
      const cacheDir = path.join(__dirname, "cache");
      const filePath = path.join(cacheDir, "chocolate.gif");

      try {
        fs.ensureDirSync(cacheDir);

        const res = await axios({ url: selectedUrl, method: "GET", responseType: "stream" });
        const writer = fs.createWriteStream(filePath);
        res.data.pipe(writer);

        writer.on("finish", () => {
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          api.sendMessage({
            body: randomReply,
            attachment: fs.createReadStream(filePath)
          }, threadID, () => fs.unlinkSync(filePath));
        });

        writer.on("error", (err) => {
          console.error("Download Error:", err);
          api.sendMessage("❌ Chocolate GIF laane me dikkat aayi!", threadID, messageID);
        });

      } catch (error) {
        console.error("Error:", error);
        api.sendMessage("❌ Chocolate GIF laane me dikkat aayi!", threadID, messageID);
      }
    }
  }
};