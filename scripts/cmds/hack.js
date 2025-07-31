const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { loadImage, createCanvas, registerFont } = require("canvas");

// Optional: If you want custom font, use below and place TTF in fonts folder
// registerFont(path.join(__dirname, 'fonts', 'your-font.ttf'), { family: 'CustomFont' });

module.exports = {
  config: {
    name: "hack",
    version: "1.2",
    author: "Raj",
    countDown: 5,
    role: 0,
    shortDescription: "Fake hacking image",
    longDescription: "Sends a fake hacking template with tagged user's DP & name",
    category: "fun",
    guide: {
      en: "{pn} @mention"
    }
  },

  onStart: async function ({ message, event }) {
    const mention = Object.keys(event.mentions);
    if (!mention[0]) return message.reply("тЭМ рдХреГрдкрдпрд╛ рдХрд┐рд╕реА рдХреЛ рдЯреИрдЧ рдХрд░реЗрдВ!");

    const uid = mention[0];
    const name = event.mentions[uid].replace("@", "");

    try {
      const backgroundUrl = "https://files.catbox";
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

      // тЬЕ Draw user DP (adjust y = 500 to move upward)
      ctx.drawImage(avatarImg, 85, 570, 130, 110); // x, y, width, height

      // тЬЕ Draw user name next to DP
      ctx.font = "bold 30px Arial";
      ctx.fillStyle = "#000000";
      ctx.fillText(name, 235, 635); // x, y

      const outputPath = path.join(__dirname, "cache", `hack_${uid}.jpg`);
      const buffer = canvas.toBuffer("image/jpeg");
      fs.writeFileSync(outputPath, buffer);

      message.reply({
        body: "ЁЯза Hacking started... ЁЯТ╗",
        attachment: fs.createReadStream(outputPath)
      }, () => fs.unlinkSync(outputPath));

    } catch (err) {
      console.error(err);
      message.reply("✅ 𝙎𝙪𝙘𝙘𝙚𝙨𝙨𝙛𝙪𝙡𝙡𝙮 𝙃𝙖𝙘𝙠𝙚𝙙 𝙏𝙝𝙞𝙨 𝙐𝙨𝙚𝙧! My Lord, Please Check Your Inbox.");
    }
  }
};
