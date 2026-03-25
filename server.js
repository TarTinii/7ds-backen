const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

let cache = [];

async function scrapeNews() {
  try {
    const url = "https://7origin.netmarble.com/fr";

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(data);

    let news = [];

    $("li").each((i, el) => {
      const title = $(el).find("h3").text().trim();
      const desc = $(el).find("p").text().trim();

      if (title.length > 5) {
        news.push({
          title,
          desc,
          image: "https://placehold.co/500x300"
        });
      }
    });

    cache = news.slice(0, 10);
    console.log("✅ News updated");
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