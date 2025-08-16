module.exports.config = {
    name: "antibd",
    version: "1.0",
    author: "Raj",
    description: "Prevents changing the bot's nickname",
    eventType: ["log:user-nickname"]
};

module.exports.run = async function({ api, event, Threads, Users }) {
    try {
        const botID = api.getCurrentUserID();
        const threadID = event.threadID;
        const author = event.author;

        const { BOTNAME, ADMINBOT } = global.config;

        // Thread data me bot ka nickname
        let threadData = await Threads.getData(threadID) || {};
        let botNickname = (threadData[botID] && threadData[botID].nickname) || BOTNAME;

        // Check ki event me bot ka nickname change hua
        if (event.logMessageData?.participant_id == botID && author != botID && !ADMINBOT.includes(author)) {
            const newNick = event.logMessageData.nickname;

            if (newNick !== botNickname) {
                // Revert nickname
                await api.changeNickname(botNickname, threadID, botID);

                // Author ka name
                let name = author;
                try {
                    const userData = await Users.getData(author);
                    name = userData.name || author;
                } catch (e) {}

                return api.sendMessage(
                    `${name} - 𝙏𝙐𝙈 𝘽𝙊𝙏 𝙆𝘼 𝙉𝙄𝘾𝙆𝙉𝘼𝙈𝙀 𝘾𝙃𝘼𝙉𝙂𝙀 𝙉𝙄 𝙆𝘼𝙍 𝙎𝘼𝙆𝙏𝘼𝙔 😹🖐`,
                    threadID
                );
            }
        }
    } catch (err) {
        console.log("Antibd Event Error:", err);
    }
};