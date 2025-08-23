const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "upload",
    aliases:["imgurl"],
    version: "3.0",
    author: "Raj",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Upload image/video or all attachments to Catbox"
    },
    longDescription: {
      en: "Upload any replied image/video or use 'upload all' to upload multiple attachments at once to Catbox.moe (permanent URLs)"
    },
    category: "tools",
    guide: {
      en: "Reply to image/video and type: {pn}\nOr use: {pn} all"
    }
  },

  onStart: async function ({ message, event, args }) {
    const isAll = args[0] === "all";
    const reply = event.messageReply;

    if (!reply || !reply.attachments || reply.attachments.length === 0)
      return message.reply("❌ Please reply to one or more images/videos.");

    const attachments = reply.attachments;
    const validTypes = ["photo", "video", "animated_image"];
    const uploads = [];

    const workingAttachments = isAll ? attachments : [attachments[0]];

    message.reply(`📤 Uploading ${workingAttachments.length} file(s), please wait...`);

    for (let i = 0; i < workingAttachments.length; i++) {
      const file = workingAttachments[i];
      if (!validTypes.includes(file.type)) {
        uploads.push(`❌ File ${i + 1}: Not supported type (${file.type})`);
        continue;
      }

      // Determine extension
      let ext = ".jpg";
      if (file.type === "video") ext = ".mp4";
      else if (file.type === "animated_image") ext = ".gif";
      else if (file.url.includes(".png")) ext = ".png";

      const tempPath = path.join(__dirname, "cache", `upload_${Date.now()}_${i}${ext}`);
      try {
        const res = await axios.get(file.url, { responseType: "arraybuffer" });
        fs.writeFileSync(tempPath, res.data);

        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", fs.createReadStream(tempPath));

        const uploadRes = await axios.post("https://catbox.moe/user/api.php", form, {
          headers: form.getHeaders()
        });

        fs.unlinkSync(tempPath);

        if (uploadRes.data.includes("https://"))
          uploads.push(`✅ File ${i + 1}: ${uploadRes.data}`);
        else
          uploads.push(`❌ File ${i + 1}: Upload failed.`);

      } catch (err) {
        console.error(err);
        uploads.push(`❌ File ${i + 1}: Error uploading.`);
      }
    }

    return message.reply(uploads.join("\n"));
  }
};