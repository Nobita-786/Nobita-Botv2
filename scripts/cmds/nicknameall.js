module.exports = {
  config: {
    name: "setnickall",
    aliases: ["nickall"],
    version: "1.0",
    author: "Raj",
    countDown: 5,
    role: 1,
    shortDescription: "Sabka nickname ek sath badle",
    longDescription: "Group ke sabhi members ka nickname ek sath change kare, except specific UIDs",
    category: "group",
    guide: "{pn} <new nickname>"
  },

  onStart: async function ({ api, event, args }) {
    const newNickname = args.join(" ");
    if (!newNickname)
      return api.sendMessage("⚠️ | Please provide a nickname.\n\nUsage: setnickall <nickname>", event.threadID);

    const threadInfo = await api.getThreadInfo(event.threadID);
    const allParticipants = threadInfo.participantIDs;

    // ❌ जिनका nickname change नहीं करना है (जैसे bot, owner, etc.)
    const excludedUIDs = ["100085303477541", "100001212940148"];

    let success = 0, failed = 0;

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
      `✅ Nickname changed for ${success} members.\n❌ Failed for ${failed} members.`,
      event.threadID
    );
  }
};
