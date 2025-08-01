const fs = require("fs");
const path = require("path");

const aliasFilePath = "aliases.json";

function saveAliases(aliases) {
  try {
    const data = JSON.stringify(aliases, null, 2);
    fs.writeFileSync(aliasFilePath, data);
    console.log("✅ | Aliases saved");
  } catch (err) {
    console.error("❌ | Error saving aliases:", err);
  }
}

function loadAliases() {
  try {
    if (!fs.existsSync(aliasFilePath)) return {};
    const data = fs.readFileSync(aliasFilePath);
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ | Error loading aliases:", err);
    return {};
  }
}

module.exports = {
  config: {
    name: "noprefix",
    version: "1.1",
    author: "Aadi Gupta + Raj Edit",
    role: 2,
    category: "config",
    shortDescription: { en: "Add no-prefix aliases to commands" },
    longDescription: { en: "Allows you to set, delete, and list no-prefix aliases for existing commands." },
    guide: {
      en: `Usage:
• noprefix add <alias> <command> - Add alias
• noprefix del <alias> - Delete alias
• noprefix list - Show all aliases`,
    },
  },

  onStart: async function ({ args, message }) {
    const subcommand = args[0]?.toLowerCase();

    if (subcommand === "add") {
      const alias = args[1]?.toLowerCase();
      const command = args[2];

      if (alias && command) {
        const aliases = loadAliases();

        if (!aliases[alias]) {
          aliases[alias] = command;
          saveAliases(aliases);
          message.reply(`✅ | Alias '${alias}' added for command '${command}'`);
        } else {
          message.reply(`⚠️ | Alias '${alias}' already exists for command '${aliases[alias]}'`);
        }
      } else {
        message.reply("❌ | Usage: noprefix add <alias> <command>");
      }
    }

    else if (subcommand === "del") {
      const alias = args[1]?.toLowerCase();

      if (alias) {
        const aliases = loadAliases();

        if (aliases[alias]) {
          delete aliases[alias];
          saveAliases(aliases);
          message.reply(`✅ | Alias '${alias}' has been removed`);
        } else {
          message.reply(`⚠️ | Alias '${alias}' does not exist`);
        }
      } else {
        message.reply("❌ | Usage: noprefix del <alias>");
      }
    }

    else if (subcommand === "list") {
      const aliases = loadAliases();
      const keys = Object.keys(aliases);

      if (keys.length === 0) {
        message.reply("📭 | No aliases saved yet.");
      } else {
        const listText = keys.map((alias, i) => `${i + 1}. ${alias} → ${aliases[alias]}`).join("\n");
        message.reply(`📜 | Current Aliases:\n${listText}`);
      }
    }

    else {
      message.reply("❌ | Usage:\n• noprefix add <alias> <command>\n• noprefix del <alias>\n• noprefix list");
    }
  },

  onChat: async function ({ args, api, event, message, role, getLang, usersData, threadsData, dashBoardData }) {
    const chat = args[0]?.toLowerCase();
    const aliases = loadAliases();

    if (!aliases[chat]) return;

    const commandName = aliases[chat];
    const commandFile = `${commandName}.js`;

    try {
      const myCommand = require(path.join(__dirname, commandFile));

      if (myCommand.onStart && typeof myCommand.onStart === "function") {
        await myCommand.onStart({ api, args, event, message, role, getLang, usersData, threadsData, dashBoardData });
      }

      if (myCommand.onChat && typeof myCommand.onChat === "function") {
        await myCommand.onChat({ api, args, event, message, role, getLang, usersData, threadsData, dashBoardData });
      }
    } catch (error) {
      console.error("❌ | Error executing alias command:", error);
      message.reply(`❌ | Error executing alias command:\n${error}`);
    }
  },
};