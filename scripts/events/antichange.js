const fs = require("fs");
const path = require("path");

const cachePath = path.join(__dirname, "../../cache/antichange.json");

module.exports = {
  config: {
    name: "antichange"
  },

  onUpdateNickname: async function ({ event, api }) {
    const data = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath)) : {};
    if (!data[event.threadID]) return;

    const userID = event.participant;
    const oldNickname = event.oldNickname || "";
    const newNickname = event.nickname || "";

    // Only act if nickname is changed
    if (oldNickname !== newNickname) {
      try {
        await api.changeNickname(oldNickname, event.threadID, userID);
        api.sendMessage(`🚫 Nickname change is locked!`, event.threadID);
      } catch (err) {
        console.error("Failed to revert nickname:", err);
      }
    }
  },

  onChangeThreadName: async function ({ event, api }) {
    const data = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath)) : {};
    if (!data[event.threadID]) return;

    const oldName = event.oldGroupName || "";
    const newName = event.groupName || "";

    if (oldName !== newName) {
      try {
        await api.setTitle(oldName, event.threadID);
        api.sendMessage(`🚫 Group name change is locked!`, event.threadID);
      } catch (err) {
        console.error("Failed to revert group name:", err);
      }
    }
  }
};