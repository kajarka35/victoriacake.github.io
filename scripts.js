document.addEventListener("DOMContentLoaded", () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      initScrollAnimations();
      initScrollTopButton();
    });
  } else {
    // Fallback si no está disponible
    setTimeout(() => {
      initScrollAnimations();
      initScrollTopButton();
    }, 0);
  }
});

// === Animaciones al hacer scroll ===
function initScrollAnimations() {
  const elements = document.querySelectorAll(".animate-on-scroll");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Evita observar elementos ya animados
      }
    }
  }, {
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px" // Aparece un poco antes
  });

  elements.forEach(el => observer.observe(el));
}

// === Botón de scroll hacia arriba ===
function initScrollTopButton() {
  const btn = document.getElementById("scroll-top-btn");
  if (!btn) return;

  const onScroll = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    btn.classList.toggle("visible", scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  btn.addEventListener("click", scrollToTop);

  btn.addEventListener("keydown", (event) => {
    const isTriggerKey = ["Enter", " ", "Spacebar"].includes(event.key);
    if (isTriggerKey) {
      event.preventDefault();
      scrollToTop();
    }
  });
}
