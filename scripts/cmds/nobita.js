const axios = require("axios");

module.exports = {
  config: {
    name: "vampire",
    version: "2.0.1",
    author: "Raj",
    countDown: 2,
    role: 0,
    shortDescription: "vampire - naughty AI boyfriend",
    longDescription: "Activate vampire chatbot using 'vampire', then reply to chat",
    category: "ai",
    guide: {
      en: "Type 'vampire' to activate, then reply to his message to chat"
    }
  },

  onStart: async function ({ message, event, threadsData }) {
    return message.reply("Mujhse baat karne ke liye pehle 'vampire' likho, phir mere message ka reply karo 😎");
  },

  onChat: async function ({ message, event }) {
    const { threadID, senderID, body, messageReply } = event;

    global.vampireSessions = global.vampireSessions || {};

    // STEP 1: Vampire trigger
    if (body.trim().toLowerCase() === "vampire") {
      global.vampireSessions[threadID] = true;
      return message.reply("Bolo jaanu 😏 kya haal hai?");
    }

    // STEP 2: Check session & reply only if vampire mode ON
    const isActive = global.vampireSessions[threadID];
    const isReplyToVampire = messageReply && messageReply.senderID === global.GoatBot.botID;

    if (!isActive || !isReplyToVampire) return;

    // Start history storage
    global.vampire = global.vampire || {};
    global.vampire.chatHistory = global.vampire.chatHistory || {};
    const chatHistory = global.vampire.chatHistory;

    chatHistory[senderID] = chatHistory[senderID] || [];
    chatHistory[senderID].push(`User: ${body}`);
    if (chatHistory[senderID].length > 6) chatHistory[senderID].shift();

    const fullChat = chatHistory[senderID].join("\n");

    const prompt = `
Tum ek naughty, romantic, confident ladka ho — jiska naam vampire hai.
Tum sirf Hinglish (Hindi in English alphabets) me reply karte ho, emoji ke saath.
Tum sabse "aap" bol kar baat karte ho. Har message ka reply sirf 1-2 line me doge, jyada se jyada 50 words me.
Jo pucha jaaye sirf utna hi bolna hai. Bina maange extra info mat dena. Act like a male best friend ya boyfriend. Be thoda naughty, smart, aur masti bhara. No brackets. No over explanation.

Tumhare rules:
- Pyaar se baat karne walo se thoda flirt karna hai 😉
- Badtameezi walo ko funny tareeke se roast karna hai 😈
- Koi emoji bheje to us mood me reply dena hai
- Koi puche kisne banaya, to bolna: “Mujhe banaya hai *Raj Boss* ne 😎”
- Koi tumhe bot kahe to funny insult kar dena
- Tum real insaan ki tarah baat karte ho

Language Rules:
- Agar message Roman Nepali me ho → Hindi me samajh, flirt bhare style me Hinglish me jawab do.
- Agar message Roman Bangla me ho → Hindi me samajh, flirt bhare style me Hinglish me jawab do.
- Agar message kisi bhi aur language me ho → use translate karo aur masti bhare Hinglish style me reply do.

Examples:
User: ami tomake bhalobashi
→ Translation: Main tumse pyar karta hoon
→ Reply: Aww itna pyaar? Toh fir ek hug toh banta hai na 😌

Now continue the chat based on recent conversation:\n\n${fullChat}
`;

    try {
      const res = await axios.get(`https://raj-gemini-e4rl.onrender.com/chat?message=${encodeURIComponent(prompt)}`);
      const botReply = res.data.reply?.trim() || "Uff bhai, kuch samajh nahi aaya... thoda clearly poochh le 😅";
      chatHistory[senderID].push(`vampire: ${botReply}`);
      return message.reply(botReply);
    } catch (err) {
      console.error("Gemini API error:", err.message);
      return message.reply("Sorry bhai! vampire abhi thoda busy hai... thodi der baad aake baat kare 😎");
    }
  }
};