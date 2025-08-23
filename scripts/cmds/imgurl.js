const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "imgur",
    aliases:["url"],
    version: "2.1",
    author: "Raj",
    countDown: 5,
    role: 0,
    shortDescription: "Convert image(s) to URL",
    longDescription: "Reply to one image (imgurl) or multiple images (imgurl all) and get their public URLs using ImgBB",
    category: "utility",
    guide: { en: "{pn} [all] (reply to image(s))" }
  },

  onStart: async function ({ message, event, args }) {
    try {
      if (!event.messageReply || !event.messageReply.attachments.length) {
        return message.reply("⚠️ Please reply to one or more images.");
      }

      const attachments = event.messageReply.attachments.filter(a => a.type === "photo");
      if (attachments.length === 0) {
        return message.reply("⚠️ No photos found in reply.");
      }

      const apiKey = "8d665b55e90728d42c559884fb3a52a9"; // Tumhara ImgBB API Key
      let urls = [];

      // Check if user wants all images
      const uploadAll = args[0] && args[0].toLowerCase() === "all";
      const toUpload = uploadAll ? attachments : [attachments[0]]; // first image only if not 'all'

      for (const attachment of toUpload) {
        const imgUrl = attachment.url;
        const imgPath = path.join(__dirname, "cache", `${Date.now()}_${Math.random()}.jpg`);

        // Download image
        const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));

        // Upload via FormData
        const form = new FormData();
        form.append("image", fs.createReadStream(imgPath));
        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, form, {
          headers: form.getHeaders()
        });

        fs.unlinkSync(imgPath);

        if (res.data && res.data.data && res.data.data.url) {
          urls.push(res.data.data.url);
        }
      }

      if (urls.length > 0) {
        return message.reply(`✅ Uploaded ${urls.length} image(s):\n\n${urls.join("\n")}`);
      } else {
        return message.reply("❌ Upload failed, no URL received.");
      }

    } catch (err) {
      console.error("Upload Error:", err.response ? err.response.data : err.message);
      return message.reply("❌ Error during upload. Check console for details.");
    }
  }
};