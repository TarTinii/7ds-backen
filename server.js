const express = require("express");
const puppeteer = require("puppeteer-core");
const cors = require("cors");

const app = express();
app.use(cors());

let cache = [];

function clean(text) {
  return text.replace(/\s+/g, " ").trim();
}

async function scrapeNews() {
  try {
    console.log("🚀 Puppeteer scraping...");

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: "/usr/bin/chromium-browser",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto("https://7origin.netmarble.com/fr", {
      waitUntil: "networkidle2"
    });

    await page.waitForTimeout(4000);

    const news = await page.evaluate(() => {
      let results = [];

      document.querySelectorAll("li").forEach(el => {
        const title = el.querySelector("h3")?.innerText || "";
        const desc = el.querySelector("p")?.innerText || "";
        const image = el.querySelector("img")?.src || "";

        if (title.length > 5) {
          results.push({ title, desc, image });
        }
      });

      return results;
    });

    cache = news.slice(0, 8);

    await browser.close();

    console.log("✅ News:", cache.length);

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
