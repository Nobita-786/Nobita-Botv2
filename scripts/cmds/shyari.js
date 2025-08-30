const axios = require("axios");

const images = [
  "https://i.ibb.co/KxBqKCMD/1755944202493-0-5154647769363978.jpg",
  "https://i.ibb.co/nMp3sVqB/1755944203527-0-6844357499391724.jpg",
  "https://i.ibb.co/9mybjRXR/1755944204633-0-8237185596125263.jpg",
  "https://i.ibb.co/CqDK9tp/1755944205593-0-15451265481144683.jpg",
  "https://i.ibb.co/NgvhwTHb/1755944206713-0-9248399418413817.jpg",
  "https://i.ibb.co/1fJVfkW0/1755944207548-0-8771376215258824.jpg",
  "https://i.ibb.co/ZR11HLYW/1755944208450-0-8410728131461191.jpg",
  "https://i.ibb.co/xqx5dYHz/1755944209281-0-09026138149100027.jpg",
  "https://i.ibb.co/zWQ1XnjB/image.jpg"
];

// Dark stylish font converter
function toDarkFont(text) {
  const map = {
    A:"𝗔",B:"𝗕",C:"𝗖",D:"𝗗",E:"𝗘",F:"𝗙",G:"𝗚",H:"𝗛",I:"𝗜",J:"𝗝",K:"𝗞",L:"𝗟",M:"𝗠",
    N:"𝗡",O:"𝗢",P:"𝗣",Q:"𝗤",R:"𝗥",S:"𝗦",T:"𝗧",U:"𝗨",V:"𝗩",W:"𝗪",X:"𝗫",Y:"𝗬",Z:"𝗭",
    a:"𝗮",b:"𝗯",c:"𝗰",d:"𝗱",e:"𝗲",f:"𝗳",g:"𝗴",h:"𝗵",i:"𝗶",j:"𝗷",k:"𝗸",l:"𝗹",m:"𝗺",
    n:"𝗻",o:"𝗼",p:"𝗽",q:"𝗾",r:"𝗿",s:"𝘀",t:"𝘁",u:"𝘂",v:"𝘃",w:"𝘄",x:"𝘅",y:"𝘆",z:"𝘇"
  };
  return text.split("").map(c => map[c] || c).join("");
}

// Simple Romanizer (demo ke liye basic conversion)
function toRomanHindi(hindiText) {
  return hindiText
    .replace(/कोई/g, "koi")
    .replace(/प्यार/g, "pyaar")
    .replace(/नहीं/g, "nahi")
    .replace(/हुआ/g, "hua")
    .replace(/शायरी/g, "shayari")
    .replace(/ /g, " "); // aur rules add karte jaa sakte ho
}

module.exports = {
  config: {
    name: "shayari",
    aliases: ["shyari", "sayari"],
    version: "2.0",
    author: "Raj",
    countDown: 5,
    role: 0,
    shortDescription: "Random Shayari bheje Dark Font Roman Hindi me",
    longDescription: "API se Shayari fetch karke Roman Hindi me convert karke dark font me image ke sath bhejta hai.",
    category: "fun",
    guide: "{p}shayari"
  },

  onStart: async function ({ api, event }) {
    try {
      const randomImage = images[Math.floor(Math.random() * images.length)];

      const response = await axios.get("https://api.princetechn.com/api/fun/shayari?apikey=prince");
      let shayari = response.data.result || "Koi shayari nahi mili 😅";

      // Hindi → Roman Hindi
      const romanShayari = toRomanHindi(shayari);

      // Dark font apply
      const heading = toDarkFont("💌 Aapke liye Shayari");
      const darkShayari = toDarkFont(romanShayari);

      const imgStream = (await axios.get(randomImage, { responseType: "stream" })).data;

      await api.sendMessage(
        {
          body: `${heading}\n\n${darkShayari}`,
          attachment: imgStream
        },
        event.threadID,
        event.messageID
      );
    } catch (err) {
      console.log(err);
      await api.sendMessage("😢 Shayari laane me dikkat hui.", event.threadID, event.messageID);
    }
  }
};