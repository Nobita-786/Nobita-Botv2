const axios = require("axios");
const request = require("request");
const fs = require("fs");

module.exports = {
  config: {
    name: "kill",
    version: "1.0.0",
    author: "Raj",
    countDown: 5,
    role: 0,
    shortDescription: "Slap the tagged friend",
    longDescription: "Tag someone and the bot will slap them with a funny gif",
    category: "fun",
    guide: {
      en: "{pn} @mention"
    }
  },

  onStart: async function ({ message, event, api }) {
    if (!event.mentions || Object.keys(event.mentions).length === 0) {
      return message.reply("Please tag someone!");
    }

    try {
      const res = await axios.get("https://api.waifu.pics/sfw/slap");
      const getURL = res.data.url;
      const ext = getURL.substring(getURL.lastIndexOf(".") + 1);
      const mentionID = Object.keys(event.mentions)[0];
      const tag = event.mentions[mentionID].replace("@", "");

      const path = `${__dirname}/cache/slap.${ext}`;
      const fileStream = fs.createWriteStream(path);

      request(getURL).pipe(fileStream).on("close", () => {
        api.setMessageReaction("✅", event.messageID, () => {}, true);

        message.reply({
          body: `Slapped! ${tag}\n\n*sorry, I thought there's a mosquito*`,
          mentions: [{ tag: tag, id: mentionID }],
          attachment: fs.createReadStream(path)
        }).then(() => fs.unlinkSync(path));
      });
    } catch (err) {
      console.error("❌ Error in kill.js:", err);
      message.reply("❌ Failed to generate GIF, please try again later.");
      api.setMessageReaction("☹️", event.messageID, () => {}, true);
    }
  }
};
