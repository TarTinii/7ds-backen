const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());

let cache = [];

function clean(text) {
  return text.replace(/\s+/g, " ").trim();
}

async function scrapeNews() {
  try {
    console.log("🚀 Scraping Puppeteer...");

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto("https://7origin.netmarble.com/fr", {
      waitUntil: "networkidle2"
    });

    // attendre que le contenu charge
    await page.waitForTimeout(3000);

    const news = await page.evaluate(() => {
      let results = [];

      document.querySelectorAll("li, .news, .list_item").forEach(el => {
        const title = el.querySelector("h3")?.innerText || "";
        const desc = el.querySelector("p")?.innerText || "";
        const img = el.querySelector("img")?.src || "";

        if (title.length > 5) {
          results.push({
            title,
            desc,
            image: img
          });
        }
      });

      return results;
    });

    cache = news.slice(0, 8);

    await browser.close();

    console.log("✅ News récupérées:", cache.length);

  } catch (err) {
    console.log("❌ erreur puppeteer:", err.message);
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
