const fs = require("fs");
const PDFDocument = require("pdfkit");
const axios = require("axios");

module.exports = {
  config: {
    name: "pdf",//Author Change Mt Karna
    version: "1.0.2",
    author: "Raj",
    countDown: 5,
    role: 0,
    shortDescription: "Text ya Image ko PDF me convert karo",
    longDescription: "Reply me diya gaya text ya image (aur extra text) ko PDF me convert karke bhejta hai",
    category: "utility",
    guide: {
      en: "{p}pdf <text>  (ya kisi msg/image pe reply karke likho #pdf)"
    }
  },

  onStart: async function ({ message, event, args }) {
    let content = "";
    let imagePath = null;

    // Reply handle
    if (event.messageReply) {
      // reply ka text
      if (event.messageReply.body) {
        content += event.messageReply.body;
      }

      // reply ka image
      if (event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        const img = event.messageReply.attachments[0];
        if (img.type === "photo") {
          try {
            const imgUrl = img.url;
            const imgBuffer = (await axios.get(imgUrl, { responseType: "arraybuffer" })).data;
            imagePath = __dirname + "/temp_image.jpg";
            fs.writeFileSync(imagePath, imgBuffer);
          } catch (e) {
            return message.reply("⚠️ Image download karne me error: " + e.message);
          }
        }
      }
    }

    // Agar extra args diye gaye hain
    if (args.length > 0) {
      if (content) content += "\n\n";
      content += args.join(" ");
    }

    if (!content && !imagePath) {
      return message.reply("❌ Kripya text likho ya kisi message/image pe reply karke `pdf` likho.");
    }

    const filePath = __dirname + "/output.pdf";

    try {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(20).text("📄 GoatBot PDF Generator", { align: "center" });
      doc.moveDown();

      // Agar text hai to
      if (content) {
        doc.fontSize(14).text(content, { align: "left" });
        doc.moveDown();
      }

      // Agar image hai to
      if (imagePath) {
        doc.image(imagePath, {
          fit: [400, 400],
          align: "center",
          valign: "center"
        });
      }

      doc.end();

      stream.on("finish", () => {
        message.reply({
          body: "✅ Ye lo aapka PDF ban gaya!",
          attachment: fs.createReadStream(filePath)
        }, () => {
          fs.unlinkSync(filePath);
          if (imagePath && fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        });
      });

    } catch (e) {
      message.reply("⚠️ Error: " + e.message);
    }
  }
};