const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

let cache = [];

async function scrapeNews() {
  try {
    console.log("🚀 API Netmarble...");

    const { data } = await axios.get(
      "https://7origin.netmarble.com/api/content/list",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json"
        }
      }
    );

    const list = data?.data || [];

    const news = list
      .filter(item => item.title)
      .map(item => ({
        title: item.title,
        desc: item.summary || "",
        image: item.thumbnail || "https://placehold.co/500x300"
      }));

    cache = news.slice(0, 8);

    console.log("✅ News API:", cache.length);

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
