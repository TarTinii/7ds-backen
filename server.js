const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

let cache = [];

// 🔥 NETTOYAGE TEXTE
function clean(text) {
  return text.replace(/\s+/g, " ").trim();
}

// 🔥 SCRAPING PROPRE
async function scrapeNews() {
  try {
    const url = "https://7origin.netmarble.com/fr";

    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);

    let news = [];

    // 🎯 cible plus précise
    $("article, .list_item, .news_item").each((i, el) => {

      const title = clean($(el).find("h3, .title").text());
      const desc = clean($(el).find("p").text());

      let image =
        $(el).find("img").attr("src") ||
        $(el).find("img").attr("data-src") ||
        "";

      // 🔥 FIX URL RELATIVE
      if (image && image.startsWith("/")) {
        image = "https://7origin.netmarble.com" + image;
      }

      // 🔥 FILTRE INTELLIGENT
      if (
        title.length > 10 &&
        desc.length > 20 &&
        !news.some(n => n.title === title)
      ) {
        news.push({
          title,
          desc,
          image: image || "https://placehold.co/500x300"
        });
      }
    });

    // 🔥 limite + tri
    cache = news.slice(0, 8);

    console.log("✅ News propres:", cache.length);

  } catch (err) {
    console.log("❌ erreur scraping:", err.message);
  }
}

// refresh toutes les 10 min
setInterval(scrapeNews, 600000);
scrapeNews();

app.get("/news", (req, res) => {
  res.json(cache);
});

app.listen(3000, () => {
  console.log("🔥 serveur lancé");
});
