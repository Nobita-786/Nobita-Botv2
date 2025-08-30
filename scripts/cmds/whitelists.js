const { writeFileSync } = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
  config: {
    name: "whitelists",
    aliases: ["wlonly", "onlywlst", "onlywhitelist", "wl"],
    version: "1.6",
    author: "Raj (fix by Nobita)",
    countDown: 5,
    role: 0,
    description: {
      en: "Add, remove, list whitelist user IDs, or set whitelist mode",
    },
    category: "owner",
    guide: {
      en:
        "   {pn} add <uid|@tag|reply>\n" +
        "   {pn} remove <uid|@tag|reply>\n" +
        "   {pn} list\n" +
        "   {pn} mode [on|off]\n" +
        "   {pn} mode noti [on|off]",
    },
  },

  langs: {
    en: {
      added: `✅ Added %1 user(s):\n%2`,
      alreadyAdded: `⚠️ Already in whitelist %1 user(s):\n%2`,
      missingIdAdd: "⚠️ Please enter UID, tag or reply to add whitelist role",
      removed: `✅ Removed %1 user(s):\n%2`,
      notAdded: `⚠️ These %1 user(s) were not in whitelist:\n%2`,
      missingIdRemove: "⚠️ Please enter UID, tag or reply to remove whitelist role",
      listAdmin: `✨ Whitelisted Users:\n%1`,
      turnedOn: "✅ Whitelist mode enabled (only whitelist can use bot)",
      turnedOff: "❎ Whitelist mode disabled",
      turnedOnNoti: "✅ Notification ON when non-whitelisted user tries bot",
      turnedOffNoti: "❎ Notification OFF when non-whitelisted user tries bot",
    },
  },

  onStart: async function ({ message, args, usersData, event, getLang }) {
    const permission = global.GoatBot.config.adminBot;
    if (!permission.includes(event.senderID)) {
      return message.reply("❌ You are not allowed to use this command.");
    }

    switch (args[0]) {
      // -------------------- ADD --------------------
      case "add":
      case "-a":
      case "+": {
        let uids = [];
        if (Object.keys(event.mentions).length > 0)
          uids = Object.keys(event.mentions);
        else if (event.messageReply)
          uids = [event.messageReply.senderID];
        else
          uids = args.slice(1).filter((arg) => !isNaN(arg));

        if (uids.length === 0)
          return message.reply(getLang("missingIdAdd"));

        const notWLIds = [];
        const alreadyWL = [];
        for (const uid of uids) {
          if (config.whiteListMode.whiteListIds.includes(uid))
            alreadyWL.push(uid);
          else
            notWLIds.push(uid);
        }

        config.whiteListMode.whiteListIds.push(...notWLIds);
        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

        const getNames = await Promise.all(
          uids.map((uid) =>
            usersData.getName(uid).then((name) => ({ uid, name }))
          )
        );

        return message.reply(
          (notWLIds.length > 0
            ? getLang(
                "added",
                notWLIds.length,
                getNames
                  .filter(({ uid }) => notWLIds.includes(uid))
                  .map(({ uid, name }) => `• ${name} (${uid})`)
                  .join("\n")
              )
            : "") +
            (alreadyWL.length > 0
              ? "\n" +
                getLang(
                  "alreadyAdded",
                  alreadyWL.length,
                  getNames
                    .filter(({ uid }) => alreadyWL.includes(uid))
                    .map(({ uid, name }) => `• ${name} (${uid})`)
                    .join("\n")
                )
              : "")
        );
      }

      // -------------------- REMOVE --------------------
      case "remove":
      case "rm":
      case "-r":
      case "-": {
        let uids = [];
        if (Object.keys(event.mentions).length > 0)
          uids = Object.keys(event.mentions);
        else if (event.messageReply)
          uids = [event.messageReply.senderID];
        else
          uids = args.slice(1).filter((arg) => !isNaN(arg));

        if (uids.length === 0)
          return message.reply(getLang("missingIdRemove"));

        const removed = [];
        const notInList = [];
        for (const uid of uids) {
          if (config.whiteListMode.whiteListIds.includes(uid)) {
            removed.push(uid);
            config.whiteListMode.whiteListIds =
              config.whiteListMode.whiteListIds.filter((id) => id !== uid);
          } else {
            notInList.push(uid);
          }
        }

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

        const getNames = await Promise.all(
          uids.map((uid) =>
            usersData.getName(uid).then((name) => ({ uid, name }))
          )
        );

        return message.reply(
          (removed.length > 0
            ? getLang(
                "removed",
                removed.length,
                getNames
                  .filter(({ uid }) => removed.includes(uid))
                  .map(({ uid, name }) => `• ${name} (${uid})`)
                  .join("\n")
              )
            : "") +
            (notInList.length > 0
              ? "\n" +
                getLang(
                  "notAdded",
                  notInList.length,
                  notInList.map((uid) => `• ${uid}`).join("\n")
                )
              : "")
        );
      }

      // -------------------- LIST --------------------
      case "list":
      case "-l": {
        const getNames = await Promise.all(
          config.whiteListMode.whiteListIds.map((uid) =>
            usersData.getName(uid).then((name) => ({ uid, name }))
          )
        );
        return message.reply(
          getLang(
            "listAdmin",
            getNames
              .map(({ uid, name }) => `• ${name} (${uid})`)
              .join("\n") || "No users in whitelist."
          )
        );
      }

      // -------------------- MODE --------------------
      case "m":
      case "mode":
      case "-m": {
        let isNoti = false;
        let value;
        let index = 1;

        if (args[1] === "noti") {
          isNoti = true;
          index = 2;
        }

        if (args[index] === "on") value = true;
        else if (args[index] === "off") value = false;
        else return message.reply("⚠️ Use: mode [on|off] or mode noti [on|off]");

        if (isNoti) {
          config.hideNotiMessage.whiteListMode = !value;
          message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
        } else {
          config.whiteListMode.enable = value;
          message.reply(getLang(value ? "turnedOn" : "turnedOff"));
        }

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
        break;
      }

      // -------------------- DEFAULT --------------------
      default: {
        return message.reply(
          "⚠️ Wrong usage!\nTry:\n" +
            "• wl add <uid|@tag|reply>\n" +
            "• wl remove <uid|@tag|reply>\n" +
            "• wl list\n" +
            "• wl mode [on|off]\n" +
            "• wl mode noti [on|off]"
        );
      }
    }
  },
};
