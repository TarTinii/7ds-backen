const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

let cache = [];

async function scrapeNews() {
  try {
    console.log("🚀 Google News RSS...");

    const url =
      "https://news.google.com/rss/search?q=Seven+Deadly+Sins+Origin&hl=fr&gl=FR&ceid=FR:fr";

    const { data } = await axios.get(url);

    const $ = cheerio.load(data, { xmlMode: true });

    let news = [];

    $("item").each((i, el) => {
      const title = $(el).find("title").text();
      const desc = $(el).find("description").text();

      if (title) {
        news.push({
          title,
          desc,
          image: "https://placehold.co/500x300"
        });
      }
    });

    cache = news.slice(0, 8);

    console.log("✅ RSS News:", cache.length);

  } catch (err) {
    console.log("❌ erreur:", err.message);
  }
}

setInterval(scrapeNews, 600000);
scrapeNews();

app.get("/news", (req, res) => {
  res.json(cache);
});

app.listen(3000, () => {
  console.log("🔥 serveur lancé");
});
