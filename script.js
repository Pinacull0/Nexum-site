const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const DEBUG_LOGS = false;
const dbg = (...args) => {
  if (!DEBUG_LOGS) return;
  console.log("[NEXUM-DEBUG]", ...args);
};
dbg("script loaded", { prefersReduced });

const revealElements = document.querySelectorAll(".reveal");
const counterElements = document.querySelectorAll("[data-counter]");
const tiltCards = document.querySelectorAll(".tilt-card:not(.partner-item)");
const navLinks = document.querySelectorAll(".nav-link");
const mosaicMotionElements = document.querySelectorAll(".mosaic-a, .mosaic-b, .mosaic-c, .mosaic-d, .mosaic-e");
const logoChips = document.querySelectorAll(".logo-chip");
const partnerItems = document.querySelectorAll(".partner-item");
const faqItems = document.querySelectorAll(".faq-item");
const largeTextTargets = document.querySelectorAll(
  ".app-process-head h2, .partners-head h2, .integrations-head h2, .faq-head h2, .single-cta-section h2, .operate-head h2, .mosaic-card h3"
);
const cursorGlow = document.querySelector(".cursor-glow");
const heroDarkStage = document.querySelector(".hero-dark-stage");
const heroDarkTitle = document.querySelector(".hero-dark-title");
const siteHeader = document.querySelector(".site-header");
const heroRef = document.querySelector(".hero-ref");
const featureParallaxSection = document.querySelector(".features-parallax-section");
const featuresParallaxLayout = document.querySelector(".features-parallax-layout");
const featureFlipCard = document.getElementById("feature-flip-card");
const featureFlipInner = document.getElementById("feature-flip-inner");
const featureFrontImg = document.getElementById("feature-front-img");
const featureBackImg = document.getElementById("feature-back-img");
const featureStepKicker = document.getElementById("feature-step-kicker");
const featureStepTitle = document.getElementById("feature-step-title");
const featureStepCopy = document.getElementById("feature-step-copy");
const partnersSection = document.querySelector(".partners-section");
const solutionsSection = document.querySelector("#solucoes");
const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
const mobileNavClose = document.querySelector(".mobile-nav-close");
const mobileNavPanel = document.getElementById("mobile-nav-panel");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");
const countdownDays = document.getElementById("countdown-days");
const countdownHours = document.getElementById("countdown-hours");
const countdownMinutes = document.getElementById("countdown-minutes");
const countdownSeconds = document.getElementById("countdown-seconds");
const countdownNote = document.getElementById("countdown-note");
const demoModal = document.getElementById("demo-modal");
const openDemoModalButtons = document.querySelectorAll("[data-open-demo-modal]");
const closeDemoModalButtons = document.querySelectorAll("[data-close-demo-modal]");
dbg("dom refs", {
  revealElements: revealElements.length,
  counterElements: counterElements.length,
  tiltCards: tiltCards.length,
  navLinks: navLinks.length,
  partnerItems: partnerItems.length,
  faqItems: faqItems.length,
  hasFeatureParallaxSection: !!featureParallaxSection,
  hasPartnersSection: !!partnersSection,
  hasSolutionsSection: !!solutionsSection
});

const getScrollTop = () =>
  Math.max(
    window.pageYOffset || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0
  );

const updateNavCompact = () => {
  if (!siteHeader) return;
  const threshold = window.innerHeight * 0.7;
  const isCompact = getScrollTop() >= threshold;
  if (getScrollTop() >= threshold) {
    siteHeader.classList.add("nav-compact");
  } else {
    siteHeader.classList.remove("nav-compact");
  }
};

function initNavLinkCloneEffect() {
  if (!navLinks.length) return;
  dbg("initNavLinkCloneEffect:start");
  navLinks.forEach((link) => {
    if (link.dataset.cloned === "true") return;
    const raw = (link.textContent || "").trim();
    if (!raw) return;
    link.innerHTML =
      `<span class="nav-link-clone" aria-hidden="true"><span>${raw}</span><span>${raw}</span></span>` +
      `<span class="sr-only">${raw}</span>`;
    link.dataset.cloned = "true";
    dbg("nav link cloned", { text: raw });
  });
  dbg("initNavLinkCloneEffect:done");
}

function startHeroContentReveal(delay = 0) {
  if (!heroRef || heroRef.dataset.heroReady === "true") return;
  dbg("startHeroContentReveal", { delay });
  heroRef.classList.add("hero-prep");

  const reveal = () => {
    heroRef.classList.add("hero-ready");
    heroRef.dataset.heroReady = "true";
    dbg("hero content revealed");
  };

  if (prefersReduced || delay <= 0) {
    window.requestAnimationFrame(reveal);
    return;
  }

  window.setTimeout(() => {
    window.requestAnimationFrame(reveal);
  }, delay);
}


if (siteHeader) {
  dbg("siteHeader bootstrap:start");
  updateNavCompact();

  if (prefersReduced) {
    siteHeader.classList.add("nav-ready");
    startHeroContentReveal(0);
  } else {
    siteHeader.classList.add("nav-boot");
    startHeroContentReveal(250);
    window.setTimeout(() => {
      siteHeader.classList.remove("nav-boot");
      siteHeader.classList.add("nav-ready");
      updateNavCompact();
    }, 2250);
  }

  window.addEventListener("scroll", updateNavCompact, { passive: true });
  document.addEventListener("scroll", updateNavCompact, { passive: true });
  document.body.addEventListener("scroll", updateNavCompact, { passive: true });
  window.addEventListener("load", updateNavCompact);
  window.addEventListener("resize", updateNavCompact);
  dbg("siteHeader bootstrap:done");
} else {
  startHeroContentReveal(0);
}

initNavLinkCloneEffect();

largeTextTargets.forEach((el) => el.classList.add("scroll-title-reveal"));
logoChips.forEach((chip, index) => {
  chip.style.setProperty("--logo-delay", `${Math.min(index * 28, 420)}ms`);
});

const scrollAnimatedElements = [
  ...mosaicMotionElements,
  ...logoChips,
  ...partnerItems,
  ...largeTextTargets
];

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.classList.add("in-view");
      if (entry.target.hasAttribute("data-counter")) animateCounter(entry.target);
      entry.target.querySelectorAll?.("[data-counter]").forEach(animateCounter);
      io.unobserve(entry.target);
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach((el) => io.observe(el));
counterElements.forEach((el) => io.observe(el));
scrollAnimatedElements.forEach((el) => io.observe(el));

let sectionSnapBusy = false;
let sectionSnapUntil = 0;
let partnersAutoSnapped = false;
let lastScrollTop = getScrollTop();

function snapToPartnersSection() {
  if (!partnersSection) return;
  dbg("snapToPartnersSection");
  sectionSnapBusy = true;
  sectionSnapUntil = Date.now() + (prefersReduced ? 80 : 900);

  partnersSection.scrollIntoView({
    behavior: prefersReduced ? "auto" : "smooth",
    block: "center"
  });

  window.setTimeout(() => {
    sectionSnapBusy = false;
  }, prefersReduced ? 90 : 920);
}

function maybeSnapPartnersOnApproach() {
  if (!partnersSection || !solutionsSection || sectionSnapBusy || partnersAutoSnapped) return;
  if (Date.now() < sectionSnapUntil) return;

  const currentScrollTop = getScrollTop();
  const scrollingDown = currentScrollTop > lastScrollTop;
  lastScrollTop = currentScrollTop;
  if (!scrollingDown) return;

  const partnersRect = partnersSection.getBoundingClientRect();
  const solutionsRect = solutionsSection.getBoundingClientRect();
  const viewportH = window.innerHeight || 1;
  const featureProgress = featureParallaxSection
    ? clamp(
        (getScrollTop() - featureParallaxSection.offsetTop) /
          Math.max(featureParallaxSection.offsetHeight - window.innerHeight, 1),
        0,
        1
      )
    : 1;

  const comingFromSolutions = solutionsRect.bottom <= viewportH * 0.45;
  const featuresFinished = featureProgress >= 0.985;
  const nearPartners = partnersRect.top <= viewportH * 0.78 && partnersRect.top >= -viewportH * 0.15;
  if (!comingFromSolutions || !featuresFinished || !nearPartners) return;

  snapToPartnersSection();
  partnersAutoSnapped = true;
}

if (partnersSection && solutionsSection) {
  window.addEventListener("scroll", maybeSnapPartnersOnApproach, { passive: true });
  document.addEventListener("scroll", maybeSnapPartnersOnApproach, { passive: true });
  document.body.addEventListener("scroll", maybeSnapPartnersOnApproach, { passive: true });
  window.addEventListener("resize", maybeSnapPartnersOnApproach, { passive: true });
}

function closeMobileNav() {
  document.body.classList.remove("mobile-nav-open");
  if (mobileNavToggle) mobileNavToggle.setAttribute("aria-expanded", "false");
  if (mobileNavPanel) mobileNavPanel.setAttribute("aria-hidden", "true");
}

if (mobileNavToggle && mobileNavPanel) {
  mobileNavToggle.addEventListener("click", () => {
    const willOpen = !document.body.classList.contains("mobile-nav-open");
    document.body.classList.toggle("mobile-nav-open", willOpen);
    mobileNavToggle.setAttribute("aria-expanded", String(willOpen));
    mobileNavPanel.setAttribute("aria-hidden", String(!willOpen));
  });
}

if (mobileNavClose) {
  mobileNavClose.addEventListener("click", closeMobileNav);
}

if (mobileNavLinks.length) {
  mobileNavLinks.forEach((link) => link.addEventListener("click", closeMobileNav));
}

function openDemoModal() {
  if (!demoModal) return;
  demoModal.classList.add("is-open");
  demoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  const firstInput = demoModal.querySelector("input");
  firstInput?.focus();
}

function closeDemoModal() {
  if (!demoModal) return;
  demoModal.classList.remove("is-open");
  demoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

if (openDemoModalButtons.length) {
  openDemoModalButtons.forEach((button) => {
    button.addEventListener("click", openDemoModal);
  });
}

if (closeDemoModalButtons.length) {
  closeDemoModalButtons.forEach((button) => {
    button.addEventListener("click", closeDemoModal);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !demoModal?.classList.contains("is-open")) return;
  closeDemoModal();
});

function initNeonCountdown() {
  if (!countdownDays || !countdownHours || !countdownMinutes || !countdownSeconds) return;

  const targetDateMs = new Date("2026-03-31T15:00:00-03:00").getTime();
  if (Number.isNaN(targetDateMs)) return;

  const pad2 = (value) => String(Math.max(0, value)).padStart(2, "0");
  let intervalId = 0;

  const updateCountdown = () => {
    const nowMs = Date.now();
    const distanceMs = targetDateMs - nowMs;

    if (distanceMs <= 0) {
      countdownDays.textContent = "00";
      countdownHours.textContent = "00";
      countdownMinutes.textContent = "00";
      countdownSeconds.textContent = "00";
      if (countdownNote) countdownNote.textContent = "A contagem terminou.";
      if (intervalId) window.clearInterval(intervalId);
      return;
    }

    const totalSeconds = Math.floor(distanceMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdownDays.textContent = pad2(days);
    countdownHours.textContent = pad2(hours);
    countdownMinutes.textContent = pad2(minutes);
    countdownSeconds.textContent = pad2(seconds);
  };

  updateCountdown();
  intervalId = window.setInterval(updateCountdown, 1000);
}

initNeonCountdown();

if (faqItems.length) {
  dbg("faq accordion init", { items: faqItems.length });
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      dbg("faq toggle", { open: item.open, summary: item.querySelector("summary")?.textContent?.trim() });
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other === item) return;
        other.open = false;
      });
    });
  });
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const featureSteps = [
  {
    kicker: "DASHBOARD",
    title: "Controle total do Trafego organico",
    text: "Centralize SEO, conteudo, redes sociais e funis de captacao em um unico fluxo operacional para acompanhar alcance, engajamento, conversoes, retencao e receita recorrente em tempo real, com alertas inteligentes, leitura por canal e decisao rapida baseada em contexto completo.",
    frontImage: "./imgs-pages/img11.png",
    backImage: "./imgs-pages/img11.png",
    sideStart: 0,
    sideEnd: 0,
    transition: "none"
  },
  {
    kicker: "AUTOMACAO",
    title: "Controle total do Trafego Pago",
    text: "Gerencie campanhas, orcamentos, criativos e performance em uma unica plataforma para otimizar investimento, reduzir CAC, aumentar ROAS e acelerar ciclos de teste com governanca, historico de alteracoes, comparativos entre periodos e priorizacao automatica dos melhores conjuntos de anuncios.",
    frontImage: "./imgs-pages/img22.png",
    backImage: "./imgs-pages/img22.png",
    sideStart: 0,
    sideEnd: 0,
    transition: "flip"
  },
  {
    kicker: "COMERCIAL",
    title: "Integracao com IA para automacao",
    text: "Ative fluxos com IA para automatizar tarefas operacionais, classificar oportunidades, gerar insights continuos e acelerar a execucao comercial sem aumentar a complexidade da equipe, conectando marketing, vendas e atendimento em uma rotina orientada por prioridade, impacto e previsibilidade.",
    frontImage: "./imgs-pages/img33.png",
    backImage: "./imgs-pages/img33.png",
    sideStart: 0,
    sideEnd: 1,
    transition: "flip-slide"
  },
  {
    kicker: "INTELIGENCIA",
    title: "Dashboards Absolutos",
    text: "Visualize midia, vendas, funil e resultados financeiros em dashboards completos e personalizaveis para identificar gargalos, antecipar riscos, acompanhar metas por squad e agir no momento certo com profundidade analitica, filtros dinâmicos e leitura executiva pronta para tomada de decisao.",
    frontImage: "./imgs-pages/img11.png",
    backImage: "./imgs-pages/img11.png",
    sideStart: 1,
    sideEnd: 1,
    transition: "flip"
  }
];

let featureCurrentStep = -1;
let featureWordNodes = [];

function mountFeatureWords(text) {
  if (!featureStepCopy) return;
  dbg("mountFeatureWords", { text });
  featureStepCopy.innerHTML = "";
  const words = text.trim().split(/\s+/);
  const fragment = document.createDocumentFragment();

  featureWordNodes = words.map((word, index) => {
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = word + (index === words.length - 1 ? "" : " ");
    fragment.appendChild(span);
    return span;
  });

  featureStepCopy.appendChild(fragment);
}

function updateFeatureParallax() {
  if (
    !featureParallaxSection ||
    !featuresParallaxLayout ||
    !featureFlipCard ||
    !featureFlipInner ||
    !featureFrontImg ||
    !featureBackImg ||
    !featureStepKicker ||
    !featureStepTitle ||
    !featureStepCopy
  ) {
    return;
  }

  const sectionTop = featureParallaxSection.offsetTop;
  const totalScrollable = Math.max(featureParallaxSection.offsetHeight - window.innerHeight, 1);
  const progress = clamp((getScrollTop() - sectionTop) / totalScrollable, 0, 0.9999);

  const stageFloat = progress * featureSteps.length;
  const stageIndex = clamp(Math.floor(stageFloat), 0, featureSteps.length - 1);
  const stageProgress = stageFloat - stageIndex;
  const stage = featureSteps[stageIndex];

  if (stageIndex !== featureCurrentStep) {
    featureCurrentStep = stageIndex;
    featureStepKicker.textContent = stage.kicker;
    featureStepTitle.textContent = stage.title;
    featureFrontImg.src = stage.frontImage;
    featureBackImg.src = stage.backImage;
    mountFeatureWords(stage.text);
  }

  // Timeline por etapa:
  // 1) transicao da imagem (se houver)
  // 2) reveal de palavras
  // 3) hide de palavras
  const hasTransition = stage.transition !== "none";
  const transitionSpan = hasTransition ? 0.24 : 0;
  const revealSpan = 0.52;
  const holdSpan = 0.14;
  const hideSpan = 0.18;
  const contentStart = transitionSpan;
  const revealEnd = contentStart + revealSpan;
  const hideStart = revealEnd + holdSpan;
  const hideEnd = hideStart + hideSpan;

  let visibleWords = 0;
  const wordsTotal = featureWordNodes.length;
  if (stageProgress <= contentStart) {
    visibleWords = 0;
  } else if (stageProgress <= revealEnd) {
    const revealRatio = clamp((stageProgress - contentStart) / (revealEnd - contentStart), 0, 1);
    visibleWords = Math.floor(wordsTotal * revealRatio);
  } else if (stageProgress <= hideStart) {
    visibleWords = wordsTotal;
  } else if (stageProgress <= hideEnd) {
    const hideRatio = clamp((stageProgress - hideStart) / (hideEnd - hideStart), 0, 1);
    visibleWords = Math.floor(wordsTotal * (1 - hideRatio));
  } else {
    visibleWords = 0;
  }

  featureWordNodes.forEach((node, index) => {
    node.classList.toggle("visible", index < visibleWords);
  });

  const transitionProgress = hasTransition
    ? clamp(stageProgress / Math.max(transitionSpan, 0.0001), 0, 1)
    : 0;
  const completedTransitionsBefore = Math.max(stageIndex - 1, 0); // etapa 0 nao flipa
  const rotateY = completedTransitionsBefore * 180 + transitionProgress * 180;
  featureFlipInner.style.transform = `rotateY(${rotateY.toFixed(2)}deg)`;

  const sideStart = stage.sideStart ?? 0;
  const sideEnd = stage.sideEnd ?? sideStart;
  const sideProgress =
    stage.transition === "flip-slide"
      ? sideStart + (sideEnd - sideStart) * transitionProgress
      : sideEnd;
  const isDesktopFeatureLayout = window.innerWidth > 860;
  const isOnRightSide = isDesktopFeatureLayout && sideProgress >= 0.5;
  const cardShift = isDesktopFeatureLayout ? sideProgress * 108 : 0;

  featureFlipCard.style.transform = `translateX(${cardShift.toFixed(2)}%)`;
  featuresParallaxLayout.classList.toggle("reverse", isOnRightSide);

  // Movimento do gradiente de fundo sincronizado com o card
  const direction = stageIndex % 2 === 0 ? 1 : -1;
  const sweep = (stageProgress * 2 - 1) * direction; // alterna esquerda/direita por etapa
  const bgX = clamp(50 + sweep * 30 + (sideProgress - 0.5) * 22, 12, 88);
  const bgY = clamp(52 + Math.sin(progress * Math.PI * 2) * 6, 40, 64);
  const bgRotate = sweep * 7;

  featureParallaxSection.style.setProperty("--feature-bg-x", `${bgX.toFixed(2)}%`);
  featureParallaxSection.style.setProperty("--feature-bg-y", `${bgY.toFixed(2)}%`);
  featureParallaxSection.style.setProperty("--feature-bg-rotate", `${bgRotate.toFixed(2)}deg`);
}
if (featureParallaxSection) {
  dbg("feature parallax init");
  let featureRaf = 0;

  const queueFeatureUpdate = () => {
    if (featureRaf) return;
    featureRaf = requestAnimationFrame(() => {
      updateFeatureParallax();
      featureRaf = 0;
    });
  };

  updateFeatureParallax();
  window.addEventListener("scroll", queueFeatureUpdate, { passive: true });
  document.addEventListener("scroll", queueFeatureUpdate, { passive: true });
  document.body.addEventListener("scroll", queueFeatureUpdate, { passive: true });
  window.addEventListener("resize", queueFeatureUpdate, { passive: true });
}

function animateCounter(el) {
  if (el.dataset.counted === "true") return;
  el.dataset.counted = "true";
  dbg("animateCounter:start", { target: el.dataset.counter });

  const target = Number(el.dataset.counter || 0);
  const duration = 1400;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(target * eased);
    el.textContent = formatCounter(value, target);
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

function formatCounter(value, target) {
  if (target >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (target >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return String(value);
}

if (!prefersReduced) {
  dbg("motion mode: full");
  document.addEventListener("mousemove", (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });

  if (heroDarkStage && heroDarkTitle) {
    heroDarkStage.addEventListener("mousemove", (e) => {
      const rect = heroDarkStage.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const py = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      heroDarkTitle.style.transform = `translate(${px.toFixed(2)}px, ${py.toFixed(2)}px)`;
    });

    heroDarkStage.addEventListener("mouseleave", () => {
      heroDarkTitle.style.transform = "translate(0px, 0px)";
    });
  }

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (0.5 - y) * 10;
      const tiltY = (x - 0.5) * 12;

      card.style.transform = `perspective(900px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  });

  if (partnersSection && partnerItems.length) {
    dbg("partners hover motion init", { items: partnerItems.length });
    let rafId = 0;
    let pointerX = 0;
    let pointerY = 0;

    const resetPartners = () => {
      dbg("partners reset");
      partnerItems.forEach((item) => {
        const badge = item.querySelector(".partner-badge");
        const shadow = item.querySelector(".partner-shadow");
        if (badge) badge.style.transform = "translate3d(0px, 0px, 0px)";
        if (shadow) shadow.style.transform = "translate3d(0px, 0px, 0px) scale(1)";
      });
    };

    const updatePartners = () => {
      partnerItems.forEach((item) => {
        const badge = item.querySelector(".partner-badge");
        const shadow = item.querySelector(".partner-shadow");
        if (!badge || !shadow) return;

        const rect = item.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const nx = clamp((pointerX - cx) / 180, -1, 1);
        const ny = clamp((pointerY - cy) / 180, -1, 1);

        const tx = nx * 3.2;
        const ty = ny * 3.1;

        badge.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
        shadow.style.transform = `translate3d(${(tx * 1.55).toFixed(2)}px, ${(Math.abs(ty) + 2).toFixed(2)}px, 0) scale(1.02)`;
      });
    };

    partnersSection.addEventListener("mousemove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        updatePartners();
        rafId = 0;
      });
    });

    partnersSection.addEventListener("mouseleave", () => {
      dbg("partners mouseleave");
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      resetPartners();
    });
  }
} else {
  dbg("motion mode: reduced");
  cursorGlow.style.display = "none";
}

const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  dbg("resizeCanvas", { w: window.innerWidth, h: window.innerHeight });
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = Array.from({ length: Math.max(36, Math.floor(window.innerWidth / 32)) }, createParticle);
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.7 + 0.6
  };
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i += 1) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(167, 139, 250, 0.55)";
    ctx.fill();

    for (let j = i + 1; j < particles.length; j += 1) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 92) {
        const alpha = (1 - dist / 92) * 0.16;
        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}

if (!prefersReduced) {
  resizeCanvas();
  drawParticles();
  window.addEventListener("resize", resizeCanvas);
  dbg("particles started");
} else {
  canvas.style.display = "none";
  dbg("particles disabled by reduced motion");
}



