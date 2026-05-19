const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const themeToggle = document.querySelector("[data-theme-toggle]");
const yearTarget = document.querySelector("[data-year]");
const root = document.documentElement;

const applyTheme = (theme, shouldPersist = true) => {
  root.dataset.theme = theme;
  themeToggle?.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
  );

  if (!shouldPersist) {
    return;
  }

  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Ignore storage errors so the toggle still works for the current page.
  }
};

const closeMenu = () => {
  navToggle?.setAttribute("aria-expanded", "false");
  navMenu?.classList.remove("is-open");
  header?.classList.remove("menu-open");
};

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navMenu?.classList.toggle("is-open", !isOpen);
  header?.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

themeToggle?.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

applyTheme(root.dataset.theme || "light", false);

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0,
  },
);

sections.forEach((section) => observer.observe(section));
