module.exports.config = {
    name: "antibd",
    version: "1.1",
    author: "Raj",
    description: "Prevents changing the bot's nickname",
    eventType: ["log:user-nickname"]
};

module.exports.run = async function({ api, event, Threads, Users }) {
    try {
        const botID = api.getCurrentUserID();
        const threadID = event.threadID;
        const author = event.author;

        // Config.json ke hisaab se values le lo
        const botNickname = global.config.nickNameBot || "Bot";
        const adminList = global.config.adminBot || [];

        if (event.logMessageData?.participant_id == botID && author != botID && !adminList.includes(author)) {
            const newNick = event.logMessageData.nickname;

            if (newNick !== botNickname) {
                // Nickname revert karo
                await api.changeNickname(botNickname, threadID, botID);

                // Author ka name
                let name = author;
                try {
                    const userData = await Users.getData(author);
                    name = userData.name || author;
                } catch (e) {}

                return api.sendMessage(
                    `${name} - 𝙏𝙐𝙈 𝘽𝙊𝙏 𝙆𝘼 𝙉𝙄𝘾𝙆𝙉𝘼𝙈𝙀 𝘾𝙃𝘼𝙉𝙂𝙀 𝙉𝙄 𝙆𝘼𝙍 𝙎𝘼𝙆𝙏𝘼😹🖐`,
                    threadID
                );
            }
        }
    } catch (err) {
        console.error("Antibd Event Error:", err);
    }
};