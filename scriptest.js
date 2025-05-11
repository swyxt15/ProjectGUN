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




