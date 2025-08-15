module.exports.config = {
    name: "antibd",
    version: "1.0",
    author: "Raj", // Nobita
    description: "Prevents changing the bot's nickname",
    eventType: ["log:user-nickname"]
};

module.exports.run = async function({ api, event, Threads, Users }) {
    const botID = api.getCurrentUserID();
    const threadID = event.threadID;
    const author = event.author;

    // BOTNAME aur ADMINBOT global config me defined hone chahiye
    const { BOTNAME, ADMINBOT } = global.config;

    // Thread ke data me bot ka nickname le lo
    let threadData = (await Threads.getData(threadID)) || {};
    let botNickname = threadData[botID]?.nickname || BOTNAME;

    // Agar bot ke nickname ko author ne change kiya aur wo admin nahi hai
    if (event.logMessageData?.participant_id == botID && author != botID && !ADMINBOT.includes(author)) {
        const newNick = event.logMessageData.nickname;

        if (newNick !== botNickname) {
            // Revert nickname
            api.changeNickname(botNickname, threadID, botID);

            // Author ka naam le lo
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
};
