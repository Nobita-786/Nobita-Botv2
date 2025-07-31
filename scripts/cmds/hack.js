const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { loadImage, createCanvas, registerFont } = require("canvas");

// Optional: Register a custom font if needed
// registerFont(path.join(__dirname, 'fonts', 'YourFont.ttf'), { family: 'CustomFont' });

module.exports = {
  config: {
    name: "hack",
    version: "1.3",
    author: "Raj Modified by ChatGPT",
    countDown: 5,
    role: 0,
    shortDescription: "Fake hacking image",
    longDescription: "Sends a fake hacking template with tagged user's DP & name. If no tag, sends for sender.",
    category: "fun",
    guide: {
      en: "{pn} @mention (or leave blank to hack yourself)"
    }
  },

  onStart: async function ({ message, event, api }) {
    const mentions = Object.keys(event.mentions);
    const targets = mentions.length > 0 ? mentions : [event.senderID];

    for (const uid of targets) {
      const name = mentions.length > 0 ? event.mentions[uid].replace("@", "") : (await api.getUserInfo(uid))[uid].name;

      try {
        const backgroundUrl = "https://files.catbox.moe/b4y3fr.jpg";
        const avatarUrl = `https://graph.facebook.com/${uid}/picture?height=512&width=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

        const [bgRes, avatarRes] = await Promise.all([
          axios.get(backgroundUrl, { responseType: "arraybuffer" }),
          axios.get(avatarUrl, { responseType: "arraybuffer" })
        ]);

        const bgImg = await loadImage(bgRes.data);
        const avatarImg = await loadImage(avatarRes.data);

        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext("2d");

        // Draw background
        ctx.drawImage(bgImg, 0, 0);

        // Draw user DP
        ctx.drawImage(avatarImg, 85, 570, 130, 110); // Adjust position/size if needed

        // Draw name
        ctx.font = "bold 30px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText(name, 235, 635); // Adjust if needed

        const outputPath = path.join(__dirname, "cache", `hack_${uid}.jpg`);
        const buffer = canvas.toBuffer("image/jpeg");
        fs.writeFileSync(outputPath, buffer);

        await message.reply({
          body: `🖥️ Hacking started for ${name}...`,
          attachment: fs.createReadStream(outputPath)
        });

        fs.unlinkSync(outputPath);

      } catch (err) {
        console.error(err);
        message.reply(`❌ ${name} के लिए hacking image बनाने में error आया`);
      }
    }
  }
};