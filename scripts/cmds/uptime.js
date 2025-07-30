const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt"],
    version: "1.0",
    author: "Raj",
    role: 0,
    shortDescription: {
      en: "Displays the total number of users of the bot and check uptime"
    },
    longDescription: {
      en: "Displays the total number of users who have interacted with the bot and check uptime."
    },
    category: "system",
    guide: {
      en: "Use {p}uptime to display bot uptime, users, and groups."
    }
  },

  onStart: async function ({ api, event, args, usersData, threadsData }) {
    try {
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();
      const uptime = process.uptime();

      const days = Math.floor(uptime / (3600 * 24));
      const hours = Math.floor((uptime % (3600 * 24)) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const uptimeString = `${days} Days • ${hours} Hrs • ${minutes} Min • ${seconds} Sec`;
      const year = new Date().getFullYear();

      const message =
`╔══════════════ ⌜ 𝗕𝗢𝗧 𝗨𝗣𝗧𝗜𝗠𝗘 ⌟ ══════════════╗
║
║ ♡ ∩⌯⌯⌯∩
║ (｡•ᴗ•｡)っ♡
║     ∪∪
║
║ 🌟 𝗨𝗣𝗧𝗜𝗠𝗘
║ ➤ ${uptimeString}
║
║ 👤 𝗧𝗢𝗧𝗔𝗟 𝗨𝗦𝗘𝗥𝗦
║ ➤ ${allUsers.length}
║
║ 💬 𝗚𝗥𝗢𝗨𝗣𝗦 / 𝗣𝗩
║ ➤ ${allThreads.length}
║
║ 📅 𝗬𝗘𝗔𝗥
║ ➤ ${year}
║
╚════════════════════════════════════╝`;

      // Download and attach the image
      const imgUrl = "https://files.catbox.moe/ui0wzy.jpg";
      const imgPath = __dirname + "/uptime.jpg";
      const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
      await fs.writeFile(imgPath, Buffer.from(response.data, "binary"));

      api.sendMessage({
        body: message,
        attachment: fs.createReadStream(imgPath)
      }, event.threadID, () => fs.unlinkSync(imgPath)); // delete image after sending

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ Error occurred while retrieving data.", event.threadID);
    }
  }
};