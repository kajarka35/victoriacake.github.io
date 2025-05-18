// File: scripts.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js';
import { getFirestore, collection, getDocs, orderBy, query } from 'https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      initScrollAnimations();
      initScrollTopButton();
      initThemeToggle();
      cargarProductosDesdeFirestore();
    });
  } else {
    setTimeout(() => {
      initScrollAnimations();
      initScrollTopButton();
      initThemeToggle();
      cargarProductosDesdeFirestore();
    }, 0);
  }
});

function cargarProductosDesdeFirestore() {
  const contenedor = document.getElementById('catalogo-productos');
  if (!contenedor) return;

  const q = query(collection(db, 'productos'), orderBy('creado', 'desc'));

  getDocs(q)
    .then(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        const articulo = document.createElement('article');
        articulo.className = 'producto animate-on-scroll';
        articulo.innerHTML = `
          <picture>
            <img src="${data.imagen}" alt="${data.nombre}" loading="lazy" />
          </picture>
          <h3>${data.nombre}</h3>
          <p>${data.descripcion} – $${Number(data.precio).toLocaleString()}</p>
          <a class="btn" href="https://wa.me/573126589467?text=Hola,%20quiero%20más%20información%20sobre%20${encodeURIComponent(data.nombre)}.">PEDIR</a>
        `;
        contenedor.appendChild(articulo);
      });
      initScrollAnimations();
    })
    .catch(error => {
      console.error('Error cargando productos desde Firestore:', error);
    });
}

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
  btn.addEventListener("touchstart", scrollToTop);

  btn.addEventListener("keydown", (event) => {
    if (["Enter", " ", "Spacebar"].includes(event.key)) {
      event.preventDefault();
      scrollToTop();
    }
  });

  toggleVisibility();
}

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
    e.preventDefault();
    toggleTheme();
  });

  themeBtn.addEventListener("keydown", (event) => {
    if (["Enter", " ", "Spacebar"].includes(event.key)) {
      event.preventDefault();
      toggleTheme();
    }
  });
}
