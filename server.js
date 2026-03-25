function showTab(tabId, btn){
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");

  if(btn){
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
  }
}

function openPopup(content){
  document.getElementById("popup-body").innerHTML = content;
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup(){
  document.getElementById("popup").classList.add("hidden");
}

const char = "https://placehold.co/70";

// 🔥 TON API
const API = "https://sevens-backen.onrender.com/news";

// 🔥 IMAGE AUTO (fallback stylé)
function getImage(title){
  return `https://source.unsplash.com/500x300/?anime,game,${encodeURIComponent(title)}`;
}

// LOAD NEWS
async function loadNews(){
  try {
    const res = await fetch(API);
    const data = await res.json();

    const container = document.getElementById("news");
    container.innerHTML = "";

    data.forEach(n => {

      const img = getImage(n.title);

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${n.title}</h3>
        <img src="${img}">
        <p>${n.desc}</p>
      `;

      card.onclick = () => {
        openPopup(`
          <h2>${n.title}</h2>
          <img src="${img}">
          <p>${n.desc}</p>
        `);
      };

      container.appendChild(card);
    });

  } catch (err) {
    console.log("Erreur API :", err);
  }
}

// TEAMS
function addTeam(name){
  const container = document.getElementById("teams");

  const card = document.createElement("div");
  card.className = "card";

  let charsHTML = `<div class="team">`;

  for(let i=0;i<3;i++){
    charsHTML += `<div class="char"><img src="${char}"></div>`;
  }

  charsHTML += `</div>`;

  card.innerHTML = `<h3>${name}</h3>${charsHTML}`;

  card.onclick = () => {
    openPopup(`<h2>${name}</h2><p>Détails de la team</p>`);
  };

  container.appendChild(card);
}

// GUIDES
function addGuide(title, desc){
  const container = document.getElementById("guides");

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `<h3>${title}</h3><p>${desc}</p>`;

  card.onclick = () => {
    openPopup(`<h2>${title}</h2><p>${desc}</p>`);
  };

  container.appendChild(card);
}

// INIT
loadNews();

addTeam("Team Débutant");
addTeam("Team PvP");

addGuide("Guide débutant","Comment bien commencer");

// refresh auto
setInterval(loadNews, 300000);
