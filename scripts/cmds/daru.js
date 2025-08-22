const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

let lastSentIndex = -1; // track last video index

module.exports = {
  config: {
    name: "daru",
    version: "1.2",
    author: "Raj",
    countDown: 5,
    role: 0,
    shortDescription: "no-prefix",
    longDescription: "Funny daru drink video sender",
    category: "no prefix",
    guide: { en: "{p}{n}" }
  },

  onStart: async function () { },

  onChat: async function ({ api, event }) {
    const { threadID, messageID, body } = event;
    if (!body) return;
    const messageText = body.toLowerCase().trim();

    // Trigger words
    const triggers = [
      "daru",
      "drink",
      "sharab",
      "mujhe daru do",
      "let's drink"
    ];

    // Funny daru replies (dark/bold style)
    const replies = [
      "🍻 𝗬𝗲 𝗹𝗼 𝗯𝗮𝗯𝘆 🍾 𝗮𝗮𝗽𝗸𝗶 𝗱𝗮𝗿𝘂 😘\n𝗖𝗵𝗮𝗹𝗼 𝘀𝗮𝗮𝘁𝗵 𝗺𝗲 𝗺𝗶𝗹𝗸𝗮𝗿 𝗽𝗶𝘁𝗲 𝗵𝗮𝗶𝗻 🥂",
      "🥂 𝗔𝗮𝗷𝗮𝗼 𝘀𝗮𝗮𝘁𝗵 𝗺𝗲 𝗻𝗮𝘀𝗵𝗲 𝗸𝗮𝗿𝘁𝗲 𝗵𝗮𝗶𝗻 😏\n𝗗𝘂𝗻𝗶𝘆𝗮 𝗯𝗵𝘂𝗹𝗮 𝗱𝗲𝘁𝗲 𝗵𝗮𝗶𝗻 😜",
      "🍺 𝗔𝗮𝗷𝗮 𝗯𝗲𝘃𝗱𝗲 🤪\n𝗦𝗮𝘁𝗵 𝗺𝗲 𝗽𝗲𝗲𝘁𝗲 𝗵𝗮𝗶𝗻 𝗮𝘂𝗿 𝗺𝗮𝘀𝘁𝗶 𝗸𝗮𝗿𝘁𝗲 𝗵𝗮𝗶𝗻 😂"
    ];

    // Multiple video links
    const mediaUrls = [
      "https://files.catbox.moe/ymhy9u.mp4",
      "https://files.catbox.moe/gzx2gk.mp4"
    ];

    if (triggers.includes(messageText)) {
      // Select next video in sequence
      lastSentIndex = (lastSentIndex + 1) % mediaUrls.length;
      const selectedUrl = mediaUrls[lastSentIndex];

      const cacheDir = path.join(__dirname, "cache");
      const filePath = path.join(cacheDir, "daru.mp4");

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
          api.sendMessage("❌ 𝗗𝗮𝗿𝘂 𝘃𝗶𝗱𝗲𝗼 𝗹𝗮𝗮𝗻𝗲 𝗺𝗲 𝗺𝘂𝘀𝗵𝗸𝗶𝗹!", threadID, messageID);
        });

      } catch (error) {
        console.error("Error:", error);
        api.sendMessage("❌ 𝗗𝗮𝗿𝘂 𝘃𝗶𝗱𝗲𝗼 𝗹𝗮𝗮𝗻𝗲 𝗺𝗲 𝗱𝗶𝗸𝗸𝗮𝘁!", threadID, messageID);
      }
    }
  }
};