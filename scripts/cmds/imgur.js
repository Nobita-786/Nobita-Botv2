const axios = require("axios");

module.exports = {
  config: {
    name: "imgur",
    aliases: [],
    version: "1.1",
    author: "Nazrul(fixed by Raj)",
    countDown: 5,
    role: 0,
    shortDescription: "Upload media to Imgur",
    longDescription: "Upload one or more images/videos to Imgur. Use 'imgur all' to upload multiple.",
    category: "tools",
    guide: {
      en: "{pn} (reply to image/video)\n{pn} all (reply to multiple attachments)"
    }
  },

  onStart: async function ({ api, event, args }) {
    const attachments = event.messageReply?.attachments || event.attachments;

    if (!attachments || attachments.length === 0) {
      return api.sendMessage("❌ | Please reply to one or more images/videos.", event.threadID, event.messageID);
    }

    // Get API URL
    let apiUrl;
    try {
      const { data } = await axios.get("https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json");
      apiUrl = data.csb;
    } catch (e) {
      return api.sendMessage("❌ | Failed to fetch Imgur API URL.", event.threadID, event.messageID);
    }

    // If user typed "imgur all"
    if (args[0] === "all") {
      const links = [];

      for (const item of attachments) {
        if (!item.url) continue;

        try {
          const res = await axios.get(`${apiUrl}/nazrul/imgur?link=${encodeURIComponent(item.url)}`);
          if (res.data?.uploaded?.image) {
            links.push(res.data.uploaded.image);
          } else {
            links.push("❌ Failed to upload one item.");
          }
        } catch (err) {
          links.push("❌ Error uploading one item.");
        }
      }

      const resultText = links.map((l, i) => `${i + 1}. ${l}`).join("\n");
      return api.sendMessage(`✅ Uploaded to Imgur:\n\n${resultText}`, event.threadID, event.messageID);

    } else {
      // Default: only first image
      const one = attachments[0];
      try {
        const res = await axios.get(`${apiUrl}/nazrul/imgur?link=${encodeURIComponent(one.url)}`);
        if (res.data?.uploaded?.image) {
          return api.sendMessage(`✅ | Uploaded to Imgur:\n${res.data.uploaded.image}`, event.threadID, event.messageID);
        } else {
          return api.sendMessage("❌ | Failed to upload to Imgur.", event.threadID, event.messageID);
        }
      } catch (e) {
        console.error("Imgur error:", e);
        return api.sendMessage("⚠️ | Error occurred while uploading.", event.threadID, event.messageID);
      }
    }
  }
};