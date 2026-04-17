/* ===== Utils ===== */
const lerp = (a, b, t) => a * (1 - t) + b * t;
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

/* ===== Project Data ===== */
const PROJECTS = [
  {
    title: "Gucci",
    role: "Dirección de Arte & Desarrollo",
    desc: "Una exploración de diseño integral que desafía los límites de la narrativa visual a través de interacciones cuidadosamente elaboradas.",
    img2: "./img/gucci/gucci-1",
    img3: "./img/gucci/gucci-2.jpg",
  },
  {
    title: "Activia",
    role: "Desarrollo Creativo",
    desc: "Una plataforma digital inmersiva que fusiona tecnología y visión artística para crear experiencias de usuario memorables.",
    img2: "./img/activia/activia-1.jpg",
    img3: "./img/activia/activia-2.jpg",
  },
  {
    title: "Saeco",
    role: "Diseño & Desarrollo",
    desc: "Desarrollo creativo full-stack para una experiencia web de nueva generación con interacciones personalizadas.",
    img2: "./img/saeco/saeco-1.jpg",
    img3: "./img/saeco/saeco-2.jpg",
  },
  {
    title: "Rituals",
    role: "Diseño UI/UX",
    desc: "Sistema de diseño mobile-first creado con precisión y atención a las micro-interacciones.",
    img2: "./img/rituals/rituals-1.jpg",
    img3: "./img/rituals/rituals-2.jpg",
  },
];

/* ===== State ===== */
const CARD_W = 340;
const CARD_GAP = 24;
const CARD_STEP = CARD_W + CARD_GAP;

let currentPage = "home";

const homeScroll = { target: 0, current: 0 };
const workScroll = { target: 0, current: 0 };

/* ===== DOM ===== */
const header = document.querySelector("header");
const gallery = document.querySelector("main");
const track = document.getElementById("gallery-track");
const cards = document.querySelectorAll(".card");
const workPage = document.getElementById("work-page");
const workContent = document.getElementById("work-content");
const progressBar = document.getElementById("work-progress-bar");

const maxHomeScroll = (cards.length - 1) * CARD_STEP;
const prlxNorm = window.innerWidth / 2 + CARD_W / 2;

/* ===== Scroll Input ===== */
window.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();

    if (currentPage === "home") {
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      homeScroll.target = clamp(homeScroll.target + delta, 0, maxHomeScroll);
    }

    if (currentPage === "work") {
      const max = workContent.scrollHeight - window.innerHeight;
      workScroll.target = clamp(workScroll.target + e.deltaY, 0, max);
    }
  },
  { passive: false },
);

/* Touch */
let touchX = 0,
  touchY = 0;

window.addEventListener(
  "touchstart",
  (e) => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  },
  { passive: true },
);

window.addEventListener(
  "touchmove",
  (e) => {
    if (currentPage === "home") {
      const dx = touchX - e.touches[0].clientX;
      touchX = e.touches[0].clientX;
      homeScroll.target = clamp(homeScroll.target + dx * 2, 0, maxHomeScroll);
    }
    if (currentPage === "work") {
      const dy = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      const max = workContent.scrollHeight - window.innerHeight;
      workScroll.target = clamp(workScroll.target + dy * 2, 0, max);
    }
  },
  { passive: true },
);

/* ===== Gallery Update ===== */
function updateGallery() {
  track.style.transform = `translateX(${-homeScroll.current}px)`;

  cards.forEach((card, i) => {
    const img = card.querySelector("img");
    const offset = homeScroll.current - CARD_STEP * i;

    /* Parallax */
    const norm = clamp(offset / prlxNorm, -1, 1);
    img.style.transform = `translateX(${norm * -0.3 * CARD_W}px)`;

    /* Opacity */
    const dist = Math.abs(offset);
    card.style.opacity = 0.4 + 0.6 * Math.max(0, 1 - dist / (CARD_STEP * 2.5));
  });

  header.style.opacity = Math.max(0.9, 1 - homeScroll.current / 800);
}

/* ===== Work Page Update ===== */
function updateWork() {
  const y = workScroll.current;
  workContent.style.transform = `translateY(${-y}px)`;

  /* Progress bar */
  const max = workContent.scrollHeight - window.innerHeight;
  progressBar.style.height = `${(max > 0 ? clamp(y / max, 0, 1) : 0) * 100}%`;

  /* Hero parallax */
  const heroImg = document.getElementById("work-hero-img");
  heroImg.style.transform = `scale(${1.05 + y * 0.0003}) translateY(${y * 0.3}px)`;

  /* Trigger animations on scroll */
  if (y > 50) {
    document.getElementById("work-role").classList.add("visible");
    document.getElementById("work-desc").classList.add("visible");
  }
  if (y > 200) {
    document.getElementById("work-img-1").classList.add("visible");
  }
  if (y > 280) {
    document.getElementById("work-img-2").classList.add("visible");
  }
  if (y > 30) {
    document.getElementById("work-scroll-hint").classList.remove("visible");
  }
}

/* ===== Open / Close Work ===== */
function openWork(index) {
  const p = PROJECTS[index];
  const cardImg = cards[index].querySelector("img").src;

  currentPage = "work";
  workScroll.target = 0;
  workScroll.current = 0;

  /* Fill content */
  document.getElementById("work-hero-img").src = p.img2;
  document.getElementById("work-title").textContent = p.title;
  document.getElementById("work-role").textContent = p.role;
  document.getElementById("work-desc").textContent = p.desc;
  document.querySelector("#work-img-1 img").src = p.img3;
  document.querySelector("#work-img-2 img").src = p.img3;

  /* Show / hide */
  workPage.classList.add("visible");
  gallery.classList.add("hidden");
  header.classList.add("hide-up");

  /* Animate in */
  setTimeout(() => {
    document.getElementById("work-title").classList.add("visible");
    document.getElementById("work-scroll-hint").classList.add("visible");
    document.getElementById("work-back").classList.add("visible");
  }, 100);
}

function closeWork() {
  currentPage = "home";

  workPage.classList.remove("visible");
  gallery.classList.remove("hidden");
  header.classList.remove("hide-up");

  /* Reset all animations */
  document.getElementById("work-title").classList.remove("visible");
  document.getElementById("work-scroll-hint").classList.remove("visible");
  document.getElementById("work-back").classList.remove("visible");
  document.getElementById("work-role").classList.remove("visible");
  document.getElementById("work-desc").classList.remove("visible");
  document.getElementById("work-img-1").classList.remove("visible");
  document.getElementById("work-img-2").classList.remove("visible");
}

/* ===== Events ===== */
cards.forEach((card) => {
  card.addEventListener("click", () => openWork(parseInt(card.dataset.index)));
});

document.getElementById("work-back").addEventListener("click", closeWork);

/* ===== Loop ===== */
function loop() {
  if (currentPage === "home") {
    homeScroll.current = lerp(homeScroll.current, homeScroll.target, 0.065);
    updateGallery();
  }

  if (currentPage === "work") {
    workScroll.current = lerp(workScroll.current, workScroll.target, 0.08);
    updateWork();
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
