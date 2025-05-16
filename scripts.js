document.addEventListener("DOMContentLoaded", () => {
  // Inicializa todo de forma ociosa
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

function initScrollAnimations() {
  const elements = document.querySelectorAll(".animate-on-scroll");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });

  elements.forEach(el => observer.observe(el));
}

function initScrollTopButton() {
  const btn = document.getElementById("scroll-top-btn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    btn.classList.toggle("visible", scrollY > 300);
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  btn.addEventListener("keydown", (event) => {
    if (["Enter", " ", "Spacebar"].includes(event.key)) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

function initThemeToggle() {
  const themeBtn = document.getElementById("toggle-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");
  const currentTheme = savedTheme || (prefersDark ? "dark" : "light");

  document.body.classList.toggle("dark", currentTheme === "dark");
  if (themeBtn) themeBtn.textContent = currentTheme === "dark" ? "☀️" : "🌙";

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      themeBtn.textContent = isDark ? "☀️" : "🌙";
    });
  }
}
