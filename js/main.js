/* Zegen Church — header state, mobile nav, event slider */

/* ---------- sticky header ---------- */
const header = document.getElementById("siteHeader");
const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 40);
onScroll();
addEventListener("scroll", onScroll, { passive: true });

/* ---------- mobile nav ---------- */
const toggle = document.getElementById("navToggle");
const nav = document.querySelector(".site-nav");
if (toggle && nav) toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});

/* ---------- event slider ---------- */
const track = document.getElementById("eventTrack");
const dotsBox = document.getElementById("eventDots");
if (track && dotsBox) {
const cards = [...track.children];

let index = 0;
let pages = 1;
let timer;

const perView = () =>
  Math.max(1, parseInt(getComputedStyle(track).getPropertyValue("--per-view"), 10) || 1);

function render() {
  const card = cards[0];
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const step = card.getBoundingClientRect().width + gap;
  track.style.transform = `translate3d(${-index * step}px, 0, 0)`;
  [...dotsBox.children].forEach((d, i) => {
    d.classList.toggle("is-active", i === index);
    d.setAttribute("aria-selected", String(i === index));
  });
}

function goTo(i) {
  index = (i + pages) % pages;
  render();
}

function buildDots() {
  pages = Math.max(1, cards.length - perView() + 1);
  index = Math.min(index, pages - 1);
  dotsBox.replaceChildren(
    ...Array.from({ length: pages }, (_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.role = "tab";
      b.setAttribute("aria-label", `Go to event slide ${i + 1}`);
      b.addEventListener("click", () => {
        goTo(i);
        restart();
      });
      return b;
    })
  );
  render();
}

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

function restart() {
  clearInterval(timer);
  if (!reduced && pages > 1) timer = setInterval(() => goTo(index + 1), 6000);
}

let resizeId;
addEventListener("resize", () => {
  clearTimeout(resizeId);
  resizeId = setTimeout(buildDots, 150);
});

track.closest(".events").addEventListener("mouseenter", () => clearInterval(timer));
track.closest(".events").addEventListener("mouseleave", restart);

buildDots();
restart();
}

const animatedItems = document.querySelectorAll(".section-heading, .prose, .content-card, .about-visual, .about-text, .event-card, .feature, .leader-card, .featured-post, .sermon-feature, .sermon-response-grid article, .testimonial-inner, .footer-grid > div");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  animatedItems.forEach(item => item.classList.add("will-reveal"));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .14, rootMargin: "0px 0px -40px" });
  animatedItems.forEach(item => revealObserver.observe(item));
}

const leadersToggle = document.getElementById("leadersToggle");
const additionalLeaders = document.getElementById("additional-leaders");

if (leadersToggle && additionalLeaders) leadersToggle.addEventListener("click", () => {
  const expanded = leadersToggle.getAttribute("aria-expanded") === "true";
  additionalLeaders.hidden = expanded;
  leadersToggle.setAttribute("aria-expanded", String(!expanded));
  leadersToggle.textContent = expanded ? "Show More Leaders" : "Show Fewer Leaders";
});

document.querySelectorAll(".bio-toggle").forEach(button => {
  button.addEventListener("click", () => {
    const bio = document.getElementById(button.getAttribute("aria-controls"));
    if (!bio) return;
    const expanded = button.getAttribute("aria-expanded") === "true";
    bio.hidden = expanded;
    button.setAttribute("aria-expanded", String(!expanded));
    button.textContent = expanded ? "Show more" : "Show less";
  });
});

const sermonFilters = document.querySelectorAll("[data-sermon-filter]");
const sermonCards = document.querySelectorAll("[data-sermon-topic]");
const sermonResults = document.getElementById("sermonResults");

sermonFilters.forEach(button => button.addEventListener("click", () => {
  const filter = button.dataset.sermonFilter;
  let visible = 0;
  sermonFilters.forEach(item => {
    const active = item === button;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  sermonCards.forEach(card => {
    const show = filter === "all" || card.dataset.sermonTopic === filter;
    card.hidden = !show;
    if (show) visible += 1;
  });
  if (sermonResults) sermonResults.textContent = filter === "all"
    ? `Showing all ${visible} teaching outlines`
    : `Showing ${visible} ${button.textContent.trim()} teaching ${visible === 1 ? "outline" : "outlines"}`;
}));
