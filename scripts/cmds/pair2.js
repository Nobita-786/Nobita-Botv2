const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
  config: {
    name: "pair2",
    aliases: ["call"],
    version: "1.0",
    author: "Raj",
    countDown: 2,
    role: 0,
    shortDescription: "make calling image",
    longDescription: "",
    category: "18+",
    guide: {
      vi: "{pn} @tag ",
      en: "{pn} @tag "
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

    bal(one, two).then(ptth => {
      const captions = [
        "❤️ True love is when two souls call each other even in silence ❤️",
        "💞 Your smile is my favorite ringtone 💞",
        "✨ Love is not about distance, it’s about connection ✨",
        "🥰 When you call me, my heart skips a beat 🥰",
        "🌸 Every call with you feels like a lifetime of happiness 🌸",
        "💕 No network problem in love, our hearts are always connected 💕",
        "📞 Love is the best signal, and you are my strongest connection 📞"
      ];
      const randomCaption = captions[Math.floor(Math.random() * captions.length)];
      
      message.reply({ body: randomCaption, attachment: fs.createReadStream(ptth) });
    });
  }
};

async function bal(one, two) {
  let avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  avone.circle();
  let avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  avtwo.circle();
  let pth = "abcd.png";
  let img = await jimp.read("https://i.ibb.co/VY0nV5CT/1756358916567-0-38773420001392234.jpg");
  img.resize(1280, 1380)
     .composite(avone.resize(250, 250), 235, 605)
     .composite(avtwo.resize(250, 250), 770, 560);
  await img.writeAsync(pth);
  return pth;
}