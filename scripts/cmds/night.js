const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

let lastSentIndex = -1; // Pehle se koi GIF send nahi hua

module.exports = {
  config: {
    name: "night",
    version: "1.8",
    author: "Mr Perfect",
    countDown: 5,
    role: 0,
    shortDescription: "no-prefix",
    longDescription: "Good night funny video/gif sender",
    category: "no prefix",
    guide: { en: "{p}{n}" }
  },

  onStart: async function () { },

  onChat: async function ({ api, event }) {
    const { threadID, messageID, body } = event;
    if (!body) return;
    const messageText = body.toLowerCase().trim();

    const triggers = [
      "good night",
      "good nini",
      "goodnight",
      "gud night",
      "शुभ रात्रि",
      "gn"
    ];

    const replies = [
      "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 🌙💤\n🖤 𝐌𝐞𝐞𝐭𝐡𝐞 𝐬𝐚𝐩𝐧𝐨 𝐦𝐞 𝐦𝐚𝐭 𝐣𝐚𝐨, 𝐰𝐚𝐡𝐚 𝐛𝐡𝐢 𝐦𝐚𝐢𝐧 𝐡𝐮 😜🖤",
      "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 🌙💤\n🖤 𝐀𝐛 𝐭𝐮𝐦𝐡𝐞 𝐬𝐚𝐩𝐧𝐞 𝐦𝐞 𝐛𝐡𝐢 𝐭𝐚𝐧𝐠 𝐤𝐚𝐫𝐮𝐧𝐠𝐚 😂🖤",
      "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 🌙💤\n🖤 𝐒𝐨𝐲𝐚 𝐦𝐚𝐭 𝐤𝐚𝐫𝐨, 𝐯𝐚𝐫𝐧𝐚 𝐦𝐚𝐢𝐧 𝐦𝐢𝐬𝐬 𝐡𝐨 𝐣𝐚𝐮𝐧𝐠𝐚 😏🖤",
      "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 🌙💤\n🖤 𝐑𝐚𝐚𝐭 𝐤𝐞 𝐬𝐚𝐩𝐧𝐨 𝐦𝐞 𝐟𝐫𝐞𝐞 𝐞𝐧𝐭𝐫𝐲 𝐦𝐢𝐥𝐭𝐢 𝐡𝐚𝐢, 𝐚𝐚 𝐣𝐚𝐨 😁🖤",
      "𝐆𝐨𝐨𝐝 𝐍𝐢𝐠𝐡𝐭 🌙💤\n🖤 𝐒𝐚𝐩𝐧𝐨 𝐦𝐞 𝐛𝐡𝐢 𝐭𝐮𝐦𝐡𝐚𝐫𝐚 𝐰𝐚𝐢𝐭 𝐤𝐚𝐫𝐮𝐧𝐠𝐚 😉🖤"
    ];

    const mediaUrls = [
      "https://files.catbox.moe/ig69gc.gif",
      "https://files.catbox.moe/bfzol7.gif"
    ];

    if (triggers.includes(messageText)) {
      // Random index generate karo jo lastSentIndex se different ho
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * mediaUrls.length);
      } while (newIndex === lastSentIndex && mediaUrls.length > 1);
      lastSentIndex = newIndex;

      const selectedUrl = mediaUrls[newIndex];
      const cacheDir = path.join(__dirname, "cache");
      const filePath = path.join(cacheDir, "night.gif");

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
          api.sendMessage("❌ Video/GIF laane me dikkat aayi!", threadID, messageID);
        });

      } catch (error) {
        console.error("Error:", error);
        api.sendMessage("❌ Video/GIF laane me dikkat aayi!", threadID, messageID);
      }
    }
  }
};