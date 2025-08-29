const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "pair",
    aliases: ["pair"],
    version: "1.0",
    author: "Aayusha Shrestha", // if you change credit you are doggie of aayusha
    countDown: 2,
    role: 0,
    shortDescription: "make calling image",
    longDescription: "",
    category: "18+",
    guide: {
      vi: "{pn} @tag",
      en: "{pn} @tag"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    const mention = Object.keys(event.mentions);
    if (mention.length == 0) return message.reply("Please mention someone");
    
    let one, two;
    if (mention.length == 1) {
      one = event.senderID;
      two = mention[0];
    } else {
      one = mention[1];
      two = mention[0];
    }

    try {
      const ptth = await bal(one, two);
      const captions = [
        "❤️ True love is when two souls call each other even in silence ❤️",
        "💞 Your smile is my favorite ringtone 💞",
        "✨ Love is not about distance, it's about connection ✨",
        "🥰 When you call me, my heart skips a beat 🥰",
        "🌸 Every call with you feels like a lifetime of happiness 🌸",
        "💕 No network problem in love, our hearts are always connected 💕",
        "📞 Love is the best signal, and you are my strongest connection 📞",
        "💌 Even if we're miles apart, your call reaches my heart 💌",
        "🔔 Your voice is the sweetest melody in my day 🔔",
        "❤️ Every ring brings me closer to you ❤️",
        "💖 Distance may exist, but your calls erase it 💖",
        "🎶 My favorite sound is your 'Hello' 🎶",
        "🌹 A single call from you brightens my entire day 🌹",
        "✨ Connection stronger than Wi-Fi, powered by love ✨",
        "💞 Your call is my daily dose of happiness 💞",
        "📱 Even in silence, your presence is felt with every call 📱",
        "💓 Hearts synced, calls eternal 💓",
        "🥰 Love doesn’t need words, just your call 🥰",
        "💌 Calling you is like sending a piece of my heart 💌",
        "💫 Every call is a spark that lights up my soul 💫"
      ];
      const randomCaption = captions[Math.floor(Math.random() * captions.length)];
      
      message.reply({ 
        body: randomCaption, 
        attachment: fs.createReadStream(ptth) 
      }, () => {
        if (fs.existsSync(ptth)) fs.unlinkSync(ptth);
      });
    } catch (error) {
      console.error(error);
      message.reply("❌ Sorry, couldn't create the image. Please try again later.");
    }
  }
};

async function bal(one, two) {
  try {
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    async function getProfilePicture(uid) {
      const methods = [
        `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
        `https://graph.facebook.com/${uid}/picture?width=512&height=512`,
        `https://graph.facebook.com/${uid}/picture?type=large`
      ];

      for (let i = 0; i < methods.length; i++) {
        try {
          const response = await axios.get(methods[i], { 
            responseType: "arraybuffer",
            timeout: 10000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
          });
          const cachePath = path.join(cacheDir, `${uid}_${Date.now()}.jpg`);
          fs.writeFileSync(cachePath, Buffer.from(response.data, "binary"));
          const img = await jimp.read(cachePath);
          return { img, cachePath };
        } catch (error) { continue; }
      }

      const placeholder = await createPlaceholder();
      return { img: placeholder, cachePath: null };
    }

    const [result1, result2] = await Promise.all([getProfilePicture(one), getProfilePicture(two)]);

    let avone = result1.img;
    let avtwo = result2.img;

    avone.circle();
    avtwo.circle();
    
    const timestamp = Date.now();
    const pth = path.join(cacheDir, `pair_${timestamp}.png`);

    let img;
    try {
      const response = await axios.get("https://i.ibb.co/VY0nV5CT/1756358916567-0-38773420001392234.jpg", {
        responseType: "arraybuffer",
        timeout: 15000,
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'image/*,*/*;q=0.8' }
      });
      img = await jimp.read(Buffer.from(response.data));
    } catch {
      try { img = await jimp.read("https://i.ibb.co/VY0nV5CT/1756358916567-0-38773420001392234.jpg"); }
      catch { img = await createCallingBackground(); }
    }
    
    img.resize(1280, 1380)
       .composite(avone.resize(250, 250), 235, 605)
       .composite(avtwo.resize(250, 250), 770, 560);
    
    await img.writeAsync(pth);

    if (result1.cachePath && fs.existsSync(result1.cachePath)) fs.unlinkSync(result1.cachePath);
    if (result2.cachePath && fs.existsSync(result2.cachePath)) fs.unlinkSync(result2.cachePath);

    return pth;
  } catch (error) {
    throw error;
  }
}

async function createCallingBackground() {
  const width = 1280;
  const height = 1380;
  const bg = new jimp(width, height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const factor = y / height;
      const red = Math.floor(10 * (1 - factor));
      const green = Math.floor(20 * (1 - factor));
      const blue = Math.floor(80 * (1 - factor) + 20);
      bg.setPixelColor(jimp.rgbaToInt(red, green, blue, 255), x, y);
    }
  }

  const glowRadius = 150;

  for (let x = 185; x < 335; x++) {
    for (let y = 555; y < 705; y++) {
      const distance = Math.sqrt(Math.pow(x - 260, 2) + Math.pow(y - 630, 2));
      if (distance < glowRadius) {
        const intensity = (glowRadius - distance) / glowRadius * 0.3;
        bg.setPixelColor(jimp.rgbaToInt(
          Math.min(255, 50 + intensity * 100),
          Math.min(255, 50 + intensity * 100),
          Math.min(255, 100 + intensity * 100),
          255
        ), x, y);
      }
    }
  }

  for (let x = 720; x < 870; x++) {
    for (let y = 510; y < 660; y++) {
      const distance = Math.sqrt(Math.pow(x - 795, 2) + Math.pow(y - 585, 2));
      if (distance < glowRadius) {
        const intensity = (glowRadius - distance) / glowRadius * 0.3;
        bg.setPixelColor(jimp.rgbaToInt(
          Math.min(255, 50 + intensity * 100),
          Math.min(255, 50 + intensity * 100),
          Math.min(255, 100 + intensity * 100),
          255
        ), x, y);
      }
    }
  }

  return bg;
}

async function createPlaceholder() {
  return new jimp(250, 250, 0xff0000ff);
}