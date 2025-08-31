const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "1.9",
    author: "Raj",
    countDown: 5,
    role: 0, // sabhi dekh sakte hain, par change sirf admin karega
    description: "View or change prefix (only bot admin can change)",
    category: "config",
    guide: {
      en: "   {pn}: view current prefix\n"
        + "   {pn} <new prefix>: change thread prefix (bot admin only)\n"
        + "   {pn} <new prefix> -g: change global prefix (bot admin only)\n"
        + "   {pn} reset: reset thread prefix to default (bot admin only)"
    }
  },

  langs: {
    en: {
      reset: "✅ Thread prefix reset to default: %1",
      onlyAdmin: "❌ Only bot admin can change prefix",
      confirmGlobal: "⚠️ React to confirm changing global prefix",
      confirmThisThread: "⚠️ React to confirm changing thread prefix",
      successGlobal: "🌐 Global prefix changed to: %1",
      successThisThread: "📌 Thread prefix changed to: %1",
      myPrefix: "🔮 System prefix: %1\n🔮 Thread prefix: %2"
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0]) {
      return message.SyntaxError();
    }

    // 🔒 Only bot admin can change anything
    if (role < 2) {
      return message.reply(getLang("onlyAdmin"));
    }

    // Reset thread prefix
    if (args[0] == 'reset') {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix,
      role
    };

    if (args[1] === "-g") {
      formSet.setGlobal = true;
    } else {
      formSet.setGlobal = false;
    }

    return message.reply(
      args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"),
      (err, info) => {
        formSet.messageID = info.messageID;
        global.GoatBot.onReaction.set(info.messageID, formSet);
      }
    );
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal, role } = Reaction;
    if (event.userID !== author)
      return;

    // 🔒 Only admin can apply changes
    if (role < 2) {
      return message.reply(getLang("onlyAdmin"));
    }

    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    } else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onChat: async function ({ event, message, getLang }) {
    if (event.body && event.body.toLowerCase() === "prefix") {
      return () => {
        return message.reply(getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID)));
      };
    }
  }
};