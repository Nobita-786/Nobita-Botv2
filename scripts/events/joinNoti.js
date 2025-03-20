const { getTime } = global.utils;
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "joinNoti",
    version: "2.2",
    author: "NTKhang (Modified by You)",
    category: "events"
  },

  onStart: async ({ threadsData, message, event, api }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const { threadID } = event;
    const { nickNameBot } = global.GoatBot.config;
    const prefix = global.utils.getPrefix(threadID);
    const dataAddedParticipants = event.logMessageData.addedParticipants;

    if (dataAddedParticipants.some(item => item.userFbId == api.getCurrentUserID())) {
      if (nickNameBot) api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
      return message.send(`Thank you for inviting me!\nBot prefix: ${prefix}\nUse ${prefix}help to see commands.`);
    }

    const threadData = await threadsData.get(threadID);
    if (threadData.settings.sendWelcomeMessage === false) return;

    // **Get Group Name**
    let threadInfo;
    try {
      threadInfo = await api.getThreadInfo(threadID);
    } catch (err) {
      console.error("Error fetching thread info:", err);
    }
    const groupName = threadInfo?.name || "this group";

    // **Get New Member Name**
    const newMembers = dataAddedParticipants.map(user => user.fullName).join(", ");

    // **Generate Welcome Message**
    const welcomeMessage = `✨ ★¸.•☆•.¸★ 🅆🄴🄻🄲🄾🄼🄴 🄷🄾 🄶🄰🅈🄰 🄰🄰🄿🄺🄰 ★⡀. *${newMembers}* Injoy Karo😬 *${groupName}* ✨

💝🥀𝐎𝐖𝐍𝐄𝐑:- ☞💕͢͡⃟៚̗̗̗̗̗̗̀̀̀̀̀𝐑𝐚𝐣🙃💔☜ 

✮☸✮
✮┼💞┼✮
☸🕊️━━•🌸•━━🕊️☸
✮☸✮
✮┼🍫┼✮
☸🎀━━•🧸•━━🎀☸
✮┼🦢┼✮
✮☸✮
☸🌈━━•🤍•━━🌈☸
✮☸✮
✮┼❄️┼✮

┏━🕊️━━°❀•°:🎀🧸💙🧸🎀:°•❀°━━💞━┓🌸✦✧✧✧✧✰🍒R⃣A⃣J⃣🌿✰✧✧✧✧✦🌸  
┗━🕊️━━°❀•°:🎀🧸💙🧸🎀:°•❀°━━💞━┛`;

    const form = { body: welcomeMessage };

    // **Folder se random video lena**
    const gifFolder = path.join(__dirname, "cache/joinGif/randomgif");
    const files = fs.readdirSync(gifFolder).filter(file => file.endsWith(".mp4") || file.endsWith(".gif"));

    if (files.length > 0) {
      const randomFile = files[Math.floor(Math.random() * files.length)];
      const filePath = path.join(gifFolder, randomFile);
      form.attachment = fs.createReadStream(filePath);
    }

    message.send(form);
  }
};
