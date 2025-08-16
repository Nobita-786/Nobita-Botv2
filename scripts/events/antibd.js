module.exports = {
    config: {
        name: "antibd",
        version: "1.4",
        author: "Raj",
        description: "Prevent others from changing the bot's nickname",
        eventType: ["log:user-nickname"]
    },

    onEvent: async function({ api, event, Users }) {
        try {
            const botID = api.getCurrentUserID();
            const threadID = event.threadID;
            const author = event.author;

            console.log("[antibd] Event triggered:", event.logMessageData);

            // Config.json ke values
            const botNickname = global.config.nickNameBot || "Bot";
            const adminList = global.config.adminBot || [];

            // Agar kisi ne bot ka nickname change kiya
            if (event.logMessageData?.participant_id == botID && author != botID) {
                const newNick = event.logMessageData.nickname;
                console.log(`[antibd] ${author} tried to change nickname to: ${newNick}`);

                // Sirf non-admin ke liye revert karo
                if (!adminList.includes(author) && newNick !== botNickname) {
                    await api.changeNickname(botNickname, threadID, botID);

                    let name = author;
                    try {
                        const userData = await Users.getData(author);
                        name = userData.name || author;
                    } catch (e) {
                        console.error("[antibd] Error getting user name:", e);
                    }

                    return api.sendMessage(
                        `${name} ❌ Tum bot ka nickname change nahi kar sakte 😹`,
                        threadID
                    );
                }
            }
        } catch (err) {
            console.error("Antibd Event Error:", err);
        }
    }
};