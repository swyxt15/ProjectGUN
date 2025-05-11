document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('.cell a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      let overlay = document.createElement('div');
      overlay.id = 'transition-overlay';
      document.body.appendChild(overlay);
      overlay.classList.add('active');

      setTimeout(() => {
        window.location.href = link.href;
      }, 500);
    });
  });

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
