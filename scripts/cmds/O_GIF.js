const axios = require("axios");

module.exports = {
  config: {
    name: "gif",
    aliases: [],
    version: "1.0",
    author: "Raj",
    countDown: 5,
    role: 0,
    shortDescription: "Search GIF from Tenor",
    longDescription: "Search unlimited GIFs ",
    category: "fun",
    guide: {
      en: "{pn} <keyword>"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      if (!args[0]) return api.sendMessage("⚠️ | Please provide a keyword for GIF search.", event.threadID, event.messageID);

      const keyword = encodeURIComponent(args.join(" "));
      const url = `https://g.tenor.com/v1/search?q=${keyword}&key=LIVDSRZULELA&limit=20`;

      const res = await axios.get(url);
      const results = res.data.results;

      if (!results || results.length === 0) {
        return api.sendMessage(`❌ | No GIF found for "${args.join(" ")}".`, event.threadID, event.messageID);
      }

      const randomGif = results[Math.floor(Math.random() * results.length)].media[0].gif.url;

      api.sendMessage({ body: `🎬 GIF for: ${args.join(" ")}`, attachment: await global.utils.getStreamFromURL(randomGif) }, event.threadID, event.messageID);

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | Failed to fetch GIF.", event.threadID, event.messageID);
    }
  }
};
