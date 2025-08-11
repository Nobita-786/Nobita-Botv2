const { existsSync, readFileSync, writeFileSync } = require("fs-extra");
const { join } = require("path");

module.exports = {
	config: {
		name: "autosetname2",
		version: "1.0.1",
		author: "Raj",
		countDown: 5,
		role: 1,
		shortDescription: "Automatic setname for new members",
		longDescription: "Configure a prefix for new members' nicknames in the group",
		category: "boxchat",
		guide: "{pn} add <prefix>\n{pn} remove"
	},

	onStart: async function ({ event, api, args, usersData }) {
		const { threadID, senderID } = event;

		// Path to autosetname.json inside scripts/cmds/cache
		const pathData = join(__dirname, "cache", "autosetname.json");

		// Create file if it doesn't exist
		if (!existsSync(pathData)) writeFileSync(pathData, "[]", "utf-8");

		// Read data
		let dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
		let thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };

		// Commands
		switch (args[0]) {
			case "add": {
				const content = args.slice(1).join(" ");
				if (!content) return api.sendMessage("⚠️ New member name prefix cannot be empty!", threadID);
				if (thisThread.nameUser.length > 0)
					return api.sendMessage("⚠️ Please remove the old name configuration before adding a new one.", threadID);

				thisThread.nameUser.push(content);
				const name = (await usersData.get(senderID)).name || "Member";
				api.sendMessage(`✅ New member name prefix set successfully!\nPreview: ${content} ${name}`, threadID);
				break;
			}

			case "rm":
			case "remove":
			case "delete": {
				if (thisThread.nameUser.length === 0)
					return api.sendMessage("⚠️ Your group hasn't configured a new member name yet!", threadID);

				thisThread.nameUser = [];
				api.sendMessage(`✅ New member name prefix removed successfully.`, threadID);
				break;
			}

			default: {
				api.sendMessage(`📌 Usage:\n${this.config.guide.replace(/{pn}/g, this.config.name)}`, threadID);
				return;
			}
		}

		// Save config
		if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
		writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
	}
};
