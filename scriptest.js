document.addEventListener("DOMContentLoaded", function () {
  // Nettoyage si overlay est resté après retour arrière
  const existingOverlay = document.getElementById('transition-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  document.querySelectorAll('.cell a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      // Créer overlay dynamiquement
      const overlay = document.createElement('div');
      overlay.id = 'transition-overlay';
      document.body.appendChild(overlay);

      // Permet à la transition CSS de se lancer proprement
      requestAnimationFrame(() => {
        overlay.classList.add('active');
      });

      // Après la transition, rediriger
      setTimeout(() => {
        window.location.href = link.href;
      }, 500);
    });
  });

  // Code menu (inchangé)
  const logo = document.querySelector(".logo-header");
  const sideMenu = document.getElementById("side-menu");

  logo.addEventListener("click", function (event) {
    event.stopPropagation();
    sideMenu.classList.toggle("menu-open");
  });

  document.addEventListener("click", function (event) {
    if (!sideMenu.contains(event.target) && !logo.contains(event.target)) {
      sideMenu.classList.remove("menu-open");
    }
  });
});



window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};


const games = [
    { name: "GUN", url: "https://swyxt15.github.io/Gun/" },
    { name: "Tic Tac Toe", url: "Morpion/Morpion.html" },
    { name: "Minesweeper", url: "Minesweeper/Minesweeper.html" },
    { name: "Pong", url: "Pong/Pong.html" },
    { name: "Flappy Bird", url: "https://flappybird.io/" },
    { name: "Puissance 4", url: "https://www.toupty.com/puissance4.html#gsc.tab=0" },
    { name: "Battle Ship War", url: "https://playpager.com/bataille-navale/" },
    { name: "My Little Poney", url: "https://www.jeux123.fr/jeu/les-petits-chevaux" },
    { name: "Geometrulysse", url: "#" },
    { name: "Racing Car", url: "#" }
];

function filterGames() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const suggestionBox = document.getElementById('suggestionsList');
    suggestionBox.innerHTML = "";

    if (input.trim() === "") {
        suggestionBox.style.display = "none";
        return;
    }

    const filtered = games.filter(game => game.name.toLowerCase().includes(input));
    if (filtered.length === 0) {
        suggestionBox.style.display = "none";
        return;
    }

    filtered.forEach(game => {
        const li = document.createElement("li");
        li.textContent = game.name;
        li.onclick = () => window.location.href = game.url;
        suggestionBox.appendChild(li);
    });

    suggestionBox.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("searchInput");
  input.addEventListener("input", filterGames);
});

