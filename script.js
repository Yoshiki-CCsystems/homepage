const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");
const menuToggle = document.querySelector("[data-menu-toggle]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const syncHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

const closeMenu = () => {
  if (!nav || !menuToggle) return;
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

menuToggle?.addEventListener("click", () => {
  if (!nav) return;
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeMenu();
  }
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

if (!reduceMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -48px 0px",
    }
  );

  document.querySelectorAll(".fade-in").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".fade-in").forEach((element) => {
    element.classList.add("visible");
  });
}
