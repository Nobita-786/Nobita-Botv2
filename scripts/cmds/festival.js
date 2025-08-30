const axios = require("axios");
const moment = require("moment-timezone");
const ical = require("node-ical");

async function getFestivalImage(query) {
  try {
    const url = `https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&iax=images&ia=images`;
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    if (res.data && res.data.results && res.data.results.length > 0) {
      const random = res.data.results[Math.floor(Math.random() * res.data.results.length)];
      return random.image;
    }
  } catch (e) {
    return null;
  }
  return null;
}

// Function to make bold Unicode text (𝗕𝗼𝗹𝗱)
function toBold(text) {
  const map = {
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚",
    H: "𝗛", I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡",
    O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨",
    V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
    a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴",
    h: "𝗵", i: "𝗶", j: "𝗷", k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻",
    o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁", u: "𝘂",
    v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
    0: "𝟬", 1: "𝟭", 2: "𝟮", 3: "𝟯", 4: "𝟰", 5: "𝟱", 6: "𝟲",
    7: "𝟳", 8: "𝟴", 9: "𝟵"
  };
  return text.split("").map(ch => map[ch] || ch).join("");
}

module.exports = {
  config: {
    name: "festival",
    version: "3.1.0",
    author: "Raj",
    countDown: 2,
    role: 0,
    shortDescription: "Show today's festival with bold font + image",
    longDescription: "Fetches Indian festivals and sends in bold Unicode font with image from DuckDuckGo",
    category: "info",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const now = moment().tz("Asia/Kolkata");
    const todayDate = now.format("YYYY-MM-DD");
    const fullDate = now.format("dddd, DD MMMM YYYY");
    const time = now.format("hh:mm:ss A");

    let festival = null;
    let festivalImage = null;

    try {
      const icsUrl = "https://calendar.google.com/calendar/ical/en.indian%23holiday%40group.v.calendar.google.com/public/basic.ics";
      const res = await axios.get(icsUrl);
      const data = ical.parseICS(res.data);

      for (let k in data) {
        const ev = data[k];
        if (ev.type === "VEVENT" && ev.start) {
          const eventDate = moment(ev.start).tz("Asia/Kolkata").format("YYYY-MM-DD");
          if (eventDate === todayDate) {
            festival = ev.summary;
            break;
          }
        }
      }
    } catch (e) {
      festival = null;
    }

    if (!festival) {
      festival = "Aaj Koi Festival Nahi Hai 🥰🎉";
    } else {
      festivalImage = await getFestivalImage(`${festival} festival India`);
    }

    const message = {
      body: `${toBold("🕒 Time: " + time)}\n${toBold("📅 Date: " + fullDate)}\n${toBold("🎊 Festival: " + festival)}`
    };

    if (festivalImage) {
      try {
        const imgStream = (await axios.get(festivalImage, { responseType: "stream" })).data;
        message.attachment = imgStream;
      } catch (e) {}
    }

    return api.sendMessage(message, event.threadID, event.messageID);
  }
};
