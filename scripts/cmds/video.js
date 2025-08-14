const axios = require("axios");
const yts = require("yt-search");

// 🔗 Base API URL fetch
const baseApiUrl = async () => {
    const base = await axios.get(`https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`);
    return base.data.api;
};

(async () => {
    global.apis = {
        diptoApi: await baseApiUrl()
    };
})();

// 🔍 YouTube Video ID extract function
function getVideoID(url) {
    const regex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))((\w|-){11})(?:\S+)?$/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

module.exports.config = {
    name: "video",
    version: "1.1.0",
    role: 0, // 0 = sab use kar sakte hain
    author: "Mesbah Saxx ( Convert  by Raj)",
    description: "YouTube video ko URL ya name se download karein",
    category: "media",
    guide: {
        en: "{pn} [YouTube URL ya song ka naam]"
    }
};

module.exports.onStart = async function ({ api, args, event, utils }) {
    try {
        let videoID, searchMsg;
        const url = args[0];

        // Agar YouTube link diya hai
        if (url && (url.includes("youtube.com") || url.includes("youtu.be"))) {
            videoID = getVideoID(url);
            if (!videoID) {
                return api.sendMessage("❌ Galat YouTube URL!", event.threadID, event.messageID);
            }
        } 
        // Agar naam diya hai
        else {
            const query = args.join(" ");
            if (!query) return api.sendMessage("❌ Song ka naam ya YouTube link do!", event.threadID, event.messageID);

            searchMsg = await api.sendMessage(`🔍 Searching: "${query}"`, event.threadID);
            const result = await yts(query);
            const videos = result.videos.slice(0, 30);
            const selected = videos[Math.floor(Math.random() * videos.length)];
            videoID = selected.videoId;
        }

        // 🔗 API se download link fetch
        const { data: { title, quality, downloadLink } } = await axios.get(`${global.apis.diptoApi}/ytDl3?link=${videoID}&format=mp4`);

        if (searchMsg?.messageID) api.unsendMessage(searchMsg.messageID);

        // Short link
        const shortLink = (await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(downloadLink)}`)).data;

        // 📩 Video send karo
        return api.sendMessage({
            body: `🎬 Title: ${title}\n📺 Quality: ${quality}\n📥 Download: ${shortLink}`,
            attachment: await utils.getStreamFromURL(downloadLink, `${title}.mp4`)
        }, event.threadID, event.messageID);

    } catch (err) {
        console.error(err);
        return api.sendMessage("⚠️ Error: " + (err.message || "Kuch galat ho gaya!"), event.threadID, event.messageID);
    }
};