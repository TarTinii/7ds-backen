const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

let cache = [];

function clean(text) {
  return text.replace(/\s+/g, " ").trim();
}

async function scrapeNews() {
  try {
    console.log("🚀 Scraping HTML...");

    const { data } = await axios.get(
      "https://7origin.netmarble.com/fr",
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const $ = cheerio.load(data);

    let news = [];

    // 🔥 ciblage intelligent
    $("li").each((i, el) => {
      const title = clean($(el).find("h3").text());
      const desc = clean($(el).find("p").text());

      let image = $(el).find("img").attr("src") || "";

      if (image.startsWith("/")) {
        image = "https://7origin.netmarble.com" + image;
      }

      // 🔥 filtre propre
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

    cache = news.slice(0, 6);

    console.log("✅ News trouvées:", cache.length);

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
