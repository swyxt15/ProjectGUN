document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".cell a");

  links.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      sessionStorage.setItem("pageTransition", "true");

      const overlay = document.createElement('div');
      overlay.id = 'transition-overlay';
      document.body.appendChild(overlay);
      overlay.classList.add('active');

      setTimeout(() => {
        window.location.href = link.href;
      }, 500);
    });
  });

  if (sessionStorage.getItem("pageTransition") === "true") {
    sessionStorage.removeItem("pageTransition");
  }
});
