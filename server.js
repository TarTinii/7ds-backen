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
    // 🔥 URL PLUS STABLE
    const url = "https://7origin.netmarble.com/fr/notice";

    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);

    let news = [];

    $(".list_item, li").each((i, el) => {

      const title = clean($(el).find("strong, .title").text());
      const desc = clean($(el).find("p").text());

      let image =
        $(el).find("img").attr("src") ||
        "https://placehold.co/500x300";

      if (image && image.startsWith("/")) {
        image = "https://7origin.netmarble.com" + image;
      }

      if (title.length > 5 && !news.some(n => n.title === title)) {
        news.push({
          title,
          desc,
          image
        });
      }
    });

    cache = news.slice(0, 10);

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
