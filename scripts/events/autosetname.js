const { readFileSync } = require("fs-extra");
const { join } = require("path");

module.exports = {
	config: {
		name: "autosetname",
		eventType: ["log:subscribe"],
		version: "1.0.0",
		author: "Raj",
		description: "Automatically set nickname for new members"
	},

	onEvent: async function ({ api, event }) {
		const { threadID, logMessageData } = event;
		const memJoin = logMessageData.addedParticipants.map(info => info.userFbId);

		// Path to autosetname.json (scripts/cmds/cache)
		const pathData = join(__dirname, "..", "cmds", "cache", "autosetname.json");

		// Read config
		let dataJson;
		try {
			dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
		} catch {
			return; // File not found or invalid JSON
		}

		// Get prefix for this group
		const thisThread = dataJson.find(item => item.threadID == threadID) || { nameUser: [] };
		if (!thisThread.nameUser.length) return;

		const setNamePrefix = thisThread.nameUser[0];

		// Change nickname for each new member
		for (let idUser of memJoin) {
			try {
				await new Promise(res => setTimeout(res, 1000)); // Delay to avoid spam
				const userInfo = await api.getUserInfo(idUser);
				const realName = userInfo[idUser]?.name || "New Member";
				await api.changeNickname(`${setNamePrefix} ${realName}`, threadID, idUser);
			} catch (err) {
				console.error(`Nickname change failed for ${idUser}:`, err);
			}
		}

		api.sendMessage(`✅ Nickname set for new member(s).`, threadID);
	}
};
