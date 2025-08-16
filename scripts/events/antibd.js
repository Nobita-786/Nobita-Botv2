const axios = require("axios");

module.exports = {
    config: {
        name: "antibd",
        version: "2.0",
        author: "Raj",
        description: "Lock bot's nickname and auto-revert if someone changes it",
        eventType: ["log:user-nickname"]
    },

    onEvent: async function ({ api, event }) {
        try {
            const botID = api.getCurrentUserID();
            const threadID = event.threadID;
            const author = event.author;

            const lockedNickname = global.config.nickNameBot || "Bot";
            const adminList = global.config.adminBot || [];

            if (event.logMessageData?.participant_id == botID && author != botID) {
                const newNick = event.logMessageData.nickname;

                if (newNick !== lockedNickname && !adminList.includes(author)) {
                    // Direct Graph API call
                    await axios.post(
                        `https://graph.facebook.com/v1.0/${threadID}/participants/${botID}`,
                        { nickname: lockedNickname },
                        { headers: { Authorization: `Bearer ${api.getAppState().access_token || api.getAccessToken()}` } }
                    );

                    return api.sendMessage(
                        `❌ Nickname revert ho gaya. Locked nickname hai "${lockedNickname}".`,
                        threadID
                    );
                }
            }
        } catch (err) {
            console.error("Antibd Event Error:", err);
        }
    }
};
