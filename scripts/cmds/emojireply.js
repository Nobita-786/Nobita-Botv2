module.exports = {
  config: {
    name: "emojiReply",
    version: "2.1",
    author: "Hamim",
    category: "no prefix",
    countDown: 3,
    role: 0,
    shortDescription: " emoji reply",
    longDescription: "reply to any emoji "
  },

  onStart: async function () {
    console.log("EmojiReply command loaded.");
  },

  onChat: async function ({ api, event }) {
    const { threadID, body } = event;
    if (!body) return;

    // Match emoji (works better)
    const emojiMatch = body.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g);
    if (!emojiMatch) return;

    const emoji = emojiMatch[0];

    const emojiReplies = {
      "😘": [
        "Arre babu, itna pyaar! Dil garden garden ho gaya! 🌸😂",
        "Mwah mwah! Yeh kaunsa naye pyaar ka signal hai? 💋😂"
      ],
      "😒": [
        "Ye kya nakhre hai babu? Shahzada mode on hai kya? 👑😂"
      ],
      // ... [Add other emojis as needed]
    };

    if (emojiReplies[emoji]) {
      const replies = emojiReplies[emoji];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      return api.sendMessage(randomReply, threadID);
    }
  }
};