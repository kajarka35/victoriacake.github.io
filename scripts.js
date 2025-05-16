document.addEventListener("DOMContentLoaded", () => {
  // Inicialización ociosa si es posible
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      initScrollAnimations();
      initScrollTopButton();
      initThemeToggle();
    });
  } else {
    setTimeout(() => {
      initScrollAnimations();
      initScrollTopButton();
      initThemeToggle();
    }, 0);
  }
});

// === Animaciones al hacer scroll ===
function initScrollAnimations() {
  const elements = document.querySelectorAll(".animate-on-scroll");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });

  elements.forEach(el => observer.observe(el));
}

// === Botón de scroll hacia arriba ===
function initScrollTopButton() {
  const btn = document.getElementById("scroll-top-btn");
  if (!btn) return;

  const toggleVisibility = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    btn.classList.toggle("visible", scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });
  btn.addEventListener("click", scrollToTop);
  btn.addEventListener("touchstart", scrollToTop); // Soporte táctil

  btn.addEventListener("keydown", (event) => {
    if (["Enter", " ", "Spacebar"].includes(event.key)) {
      event.preventDefault();
      scrollToTop();
    }
  });

  toggleVisibility();
}

// === Toggle tema claro/oscuro con soporte táctil ===
function initThemeToggle() {
  const themeBtn = document.getElementById("toggle-theme");
  if (!themeBtn) return;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");
  const currentTheme = savedTheme || (prefersDark ? "dark" : "light");

  document.body.classList.toggle("dark", currentTheme === "dark");
  themeBtn.textContent = currentTheme === "dark" ? "☀️" : "🌙";

  const toggleTheme = () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeBtn.textContent = isDark ? "☀️" : "🌙";
  };

  themeBtn.addEventListener("click", toggleTheme);
  themeBtn.addEventListener("touchstart", (e) => {
    e.preventDefault(); // evita doble ejecución en iOS
    toggleTheme();
  });

  themeBtn.addEventListener("keydown", (event) => {
    if (["Enter", " ", "Spacebar"].includes(event.key)) {
      event.preventDefault();
      toggleTheme();
    }
  });
}
