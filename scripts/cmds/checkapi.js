const axios = require("axios");

module.exports = {
  config: {
    name: "checkapi",
    aliases: ["check"],
    version: "1.0",
    author: "Raj",
    countDown: 5,
    role: 0,
    shortDescription: "Check API status",
    longDescription: "Checks if a music API endpoint is working or returning error.",
    category: "tools",
    guide: "{pn} [API URL]"
  },

  onStart: async function ({ message, args }) {
    const defaultUrl = "https://nobita-music-orm2.onrender.com/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ&type=audio";
    const apiUrl = args[0] || defaultUrl;

    if (!args[0]) {
      message.reply("🔎Please Wait..........🙂\n⏳ Checking API status...");
    } else {
      message.reply("🔎 Checking API status...");
    }

    try {
      const response = await axios.get(apiUrl);
      if (response.data && response.data.file_url) {
        return message.reply("✅ API is working!");
      } else {
        return message.reply("⚠️ API responded but no file_url found.");
      }
    } catch (error) {
      const statusCode = error.response?.status || "Unknown";
      const statusText = error.response?.statusText || error.message;
      return message.reply(`❌ API Error!\n📍 Status: ${statusCode} - ${statusText}`);
    }
  }
};