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

module.exports = {
  config: {
    name: "shayari",
    aliases:["shyari","sayari"],
    version: "1.2",
    author: "Raj ",
    countDown: 5,
    role: 0,
    shortDescription: "Random Shayari भेजें",
    longDescription: "API से Shayari fetch करके DP image के साथ भेजती है।",
    category: "fun",
    guide: "{p}shayari"
  },

  onStart: async function ({ api, event }) {
    try {
      // Random image choose karo
      const randomImage = images[Math.floor(Math.random() * images.length)];

      // Shayari fetch karo
      const response = await axios.get("https://api.princetechn.com/api/fun/shayari?apikey=prince");
      const shayari = response.data.result || "कोई Shayari नहीं मिली 😅";

      // Image ko stream banao
      const imgStream = (await axios.get(randomImage, { responseType: "stream" })).data;

      // Send message
      await api.sendMessage(
        {
          body: `💌 𝗔𝗮𝗽 𝗞𝗶 𝗦𝗵𝗮𝘆𝗮𝗿𝗶:\n\n${shayari}`,
          attachment: imgStream
        },
        event.threadID,
        event.messageID
      );
    } catch (err) {
      console.log(err);
      await api.sendMessage("😢 Shayari लाने में समस्या हुई।", event.threadID, event.messageID);
    }
  }
};
