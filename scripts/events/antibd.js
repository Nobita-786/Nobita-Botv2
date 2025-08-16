const botNickLock = {};

module.exports.config = {
    name: "antibd",
    version: "2.0",
    author: "Raj",
    description: "Lock bot's nickname (auto revert if changed)",
    eventType: [],
    category: "events"
};

module.exports.onLoad = function({ api }) {
    const botID = api.getCurrentUserID();
    const lockedNick = global.config.nickNameBot || "Bot";

    // Har 10s me nickname check
    setInterval(async () => {
        try {
            const threads = global.data.allThreadID || [];
            for (const threadID of threads) {
                const threadInfo = await api.getThreadInfo(threadID);
                const userInfo = threadInfo.nicknames || {};
                const currentNick = userInfo[botID] || null;

                if (currentNick !== lockedNick) {
                    await api.changeNickname(lockedNick, threadID, botID);
                    api.sendMessage("❌ Bot ka nickname lock hai, change mat karo!", threadID);
                }
            }
        } catch (e) {
            // ignore errors
        }
    }, 10000); // 10s
};