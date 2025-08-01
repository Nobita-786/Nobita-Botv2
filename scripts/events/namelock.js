module.exports.config = {
  name: "antiname",
  eventType: ["log:user-nickname"],
  version: "1.0",
  author: "PREM BABU",
  description: "Prevent users from changing the bot's nickname"
};

module.exports.run = async function ({ api, event, usersData, threadsData }) {
  const { logMessageData, threadID, author } = event;
  const botID = api.getCurrentUserID();
  const config = global.GoatBot.config;
  const BOTNAME = config.BOTNAME || "Bot";
  const ADMINBOT = config.ADMINBOT || [];

  // Only trigger if bot's nickname is changed
  if (logMessageData.participant_id === botID && author !== botID && !ADMINBOT.includes(author)) {
    // Get saved nickname for bot in this thread
    const threadData = await threadsData.get(threadID);
    const lockedName = threadData?.data?.nickname || BOTNAME;

    // Revert nickname
    await api.changeNickname(lockedName, threadID, botID);

    // Get name of the person who changed it
    const name = (await usersData.getName(author)) || "User";

    return api.sendMessage(`⚠️ Sorry ${name}, आप बॉट का नाम नहीं बदल सकते 🤖`, threadID);
  }
};