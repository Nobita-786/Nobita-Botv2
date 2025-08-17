module.exports = {
  config: {
    name: "setnickall",
    aliases: ["nickall"],
    version: "2.0",
    author: "Raj",
    countDown: 5,
    role: 1,
    shortDescription: "Sabka nickname ek sath badle ya remove kare",
    longDescription: "Group ke sabhi members ka nickname ek sath change kare, ya sabka nickname remove kare (except specific UIDs).",
    category: "group",
    guide: "{pn} <new nickname>\n{pn} remove"
  },

  onStart: async function ({ api, event, args }) {
    if (!args[0])
      return api.sendMessage("⚠️ | Please provide a nickname.\n\nUsage:\n- setnickall <nickname>\n- setnickall remove", event.threadID);

    const mode = args[0].toLowerCase();
    const newNickname = (mode === "remove") ? "" : args.join(" ");

    let threadInfo;
    try {
      threadInfo = await api.getThreadInfo(event.threadID);
    } catch (err) {
      return api.sendMessage("❌ | Failed to fetch group info.", event.threadID);
    }

    const allParticipants = threadInfo.participantIDs;

    // ❌ जिनका nickname change नहीं करना है (bot, owner, etc.)
    const excludedUIDs = ["100085303477541", "100001212940148"];

    let success = 0, failed = 0;

    api.sendMessage(
      mode === "remove"
        ? `⏳ Removing nicknames for ${allParticipants.length - excludedUIDs.length} members...`
        : `⏳ Changing nicknames for ${allParticipants.length - excludedUIDs.length} members...`,
      event.threadID
    );

    for (const userID of allParticipants) {
      if (excludedUIDs.includes(userID)) continue;

      try {
        await api.changeNickname(newNickname, event.threadID, userID);
        success++;
      } catch (e) {
        failed++;
      }
    }

    return api.sendMessage(
      mode === "remove"
        ? `✅ Nickname removed for ${success} members.\n❌ Failed for ${failed} members.`
        : `✅ Nickname changed for ${success} members.\n❌ Failed for ${failed} members.`,
      event.threadID
    );
  }
};
