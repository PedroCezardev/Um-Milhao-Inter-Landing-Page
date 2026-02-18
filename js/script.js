// =============================================================================
// CONFIGURAÇÃO (SÓ GSAP - NATIVE SCROLL)
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Registra plugins
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Inicializa ícones
  if (window.lucide) window.lucide.createIcons();

  // Inicializa Módulos
  initPreloader();  
  initMobileMenu();
  initHeroAnimations();
  initVelocityScroll();
  initPartnersCarousel();
  initMockupSection();
  initAnimatedCardsSection();
  initStickyScrollReveal();
  initBenefitsTimeline();
  initGlobalReveals();
});

// =============================================================================
// PRELOADER PREMIUM
// =============================================================================
function initPreloader() {
  const preloader = document.getElementById("preloader");
  const counter = document.getElementById("preloader-counter");
  const bar = document.getElementById("preloader-bar");
  const text = document.getElementById("preloader-text");

  if (!preloader) {
    initNavbar(); // Se não tiver preloader, roda direto
    initHeroAnimations(); 
    return;
  }

  document.body.style.overflow = 'hidden';

  const tl = gsap.timeline(); // Apague qualquer onComplete que estiver solto aqui dentro
  let cont = { val: 0 };

  tl.to(cont, {
    val: 100,
    duration: 2.2,
    ease: "power4.inOut",
    onUpdate: () => {
      counter.innerHTML = Math.round(cont.val) + "%";
    }
  }, 0)
  .to(bar, { width: "100%", duration: 2.2, ease: "power4.inOut" }, 0)
  .to(text, { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" }, 1.8)
  .to(counter, { opacity: 0, y: -40, duration: 0.5, ease: "power2.in" }, 1.9)
  .to(preloader, {
    yPercent: -100,
    duration: 1.2, // Deixei um tiquinho mais suave (1.2 em vez de 1)
    ease: "expo.inOut",
    onStart: () => {
      // === A MÁGICA ESTÁ AQUI ===
      // Dispara as animações junto com o movimento da cortina
      initNavbar();
      initHeroAnimations();
    },
    onComplete: () => {
      preloader.style.display = 'none';
      document.body.style.overflow = '';
      document.body.style.overflowX = 'hidden';
    }
  }, "+=0.1"); // "+=0.1" dá um respiro de 100ms no 100% antes de ejetar a tela
}

// =============================================================================
// 1. NAVBAR
// =============================================================================
function initNavbar() {
  const nav = document.getElementById("navbar");
  const navContent = document.getElementById("navbar-content");

  if (!nav || !navContent) return;

  // Entrada
  gsap.set(nav, { y: -60, opacity: 0 });
  gsap.set(navContent.children, { y: 20, opacity: 0 });

  gsap.timeline({ defaults: { ease: "power4.out" } })
    .to(nav, { y: 0, opacity: 1, duration: 1 })
    .to(navContent.children, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, "-=0.4");

  // Scroll Behavior (Leve)
  ScrollTrigger.create({
    start: "top -10",
    onUpdate: (self) => {
      const scrolled = self.scroll() > 10;
      if (scrolled && !nav.classList.contains("top-4")) {
        nav.classList.replace("top-8", "top-4");
        navContent.className = "relative flex justify-between items-center px-6 lg:px-10 py-4 rounded-full transition-all duration-500 bg-white/75 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-white/40";
      } else if (!scrolled && nav.classList.contains("top-4")) {
        nav.classList.replace("top-4", "top-8");
        navContent.className = "relative flex justify-between items-center px-6 lg:px-10 py-4 rounded-full transition-all duration-500 bg-gradient-to-r from-white/90 via-gray-100/70 to-white/90 backdrop-blur-xl border border-white/30 shadow-sm";
      }
    }
  });
}

function initMobileMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuBtn && mobileMenu) {
    menuBtn.onclick = () => {
      const open = mobileMenu.classList.contains("translate-x-full");
      mobileMenu.classList.toggle("translate-x-0", open);
      mobileMenu.classList.toggle("translate-x-full", !open);
      menuBtn.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
      if (window.lucide) lucide.createIcons();
    };
  }
}

// =============================================================================
// 2. HERO
// =============================================================================
function initHeroAnimations() {
  const heroVideo = document.querySelector(".hero-video");
  const heroTitle = document.querySelector(".hero-title");
  
  if (!heroTitle) return;

  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  if(heroVideo) gsap.set(heroVideo, { scale: 1.15, filter: "blur(10px)", opacity: 0 });
  
  const elements = [".hero-badge", ".hero-title", ".hero-sub", ".hero-cta a", ".hero-cards .card"];
  elements.forEach(sel => {
    const el = document.querySelectorAll(sel);
    if(el.length) gsap.set(el, { y: 30, opacity: 0 });
  });

  if(heroVideo) tl.to(heroVideo, { scale: 1, filter: "blur(0px)", opacity: 1, duration: 1.2, ease: "power3.out" });

  tl.to(".hero-badge", { y: 0, opacity: 1, duration: 0.4 }, "-=0.8")
    .to(".hero-title", { y: 0, opacity: 1, duration: 0.8 }, "-=0.3")
    .to(".hero-sub", { y: 0, opacity: 1, duration: 0.5 }, "-=0.5")
    .to(".hero-cta a", { y: 0, opacity: 1, duration: 0.45, stagger: 0.12 }, "-=0.3")
    .to(".hero-cards .card", { y: 0, opacity: 1, duration: 0.5, stagger: 0.15 }, "-=0.25");
}

// =============================================================================
// 3. VELOCITY SCROLL
// =============================================================================
function initVelocityScroll() {
  const tracks = document.querySelectorAll('.velocity-track');
  if (tracks.length === 0) return;

  let scrollVelocity = 0;
  const baseSpeed = 1.5;

  ScrollTrigger.create({
    trigger: "body",
    onUpdate: (self) => {
      scrollVelocity = self.getVelocity() / 300;
    }
  });

  tracks.forEach((track) => {
    const direction = parseFloat(track.getAttribute('data-direction') || 1);
    const originalContent = track.innerHTML;
    track.innerHTML = originalContent.repeat(3);

    gsap.ticker.add(() => {
      scrollVelocity *= 0.9;
      const moveSpeed = (baseSpeed + Math.abs(scrollVelocity)) * direction;
      const directionFix = (scrollVelocity < -0.1) ? -1 : 1;
      
      const currentX = gsap.getProperty(track, "x");
      let newX = currentX + (moveSpeed * directionFix);

      const thirdWidth = track.scrollWidth / 3;
      if (newX > 0) newX = -thirdWidth;
      if (newX < -thirdWidth) newX = 0;

      gsap.set(track, { x: newX });
    });
  });
}

// =============================================================================
// 4. STICKY SCROLL
// =============================================================================
function initStickyScrollReveal() {
  const track = document.getElementById('stScrollTrack');
  const wordList = document.getElementById('stWordList');
  const widthTester = document.getElementById('stWidthTester');
  const wrapper = document.getElementById('stDynamicWrapper');

  if (!track || !wordList || !wrapper) return;

  const words = ["Digital", "Seguro", "Inovador", "Sem Taxas", "O Super App"];
  let maxWordWidth = 0;

  words.forEach(word => {
    const div = document.createElement('div');
    div.className = 'st-word-item';
    div.innerText = word;
    wordList.appendChild(div);
    
    if(widthTester) {
      widthTester.textContent = word;
      const w = widthTester.offsetWidth;
      if (w > maxWordWidth) maxWordWidth = w;
    }
  });

  wrapper.style.width = (maxWordWidth + 40) + 'px';
  if(widthTester) widthTester.innerHTML = '';

  const items = wordList.querySelectorAll('.st-word-item');
  const total = words.length;
  const itemHeight = items[0] ? items[0].offsetHeight : 0;

  ScrollTrigger.create({
    trigger: track,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.5,
    onUpdate: (self) => {
      const progress = self.progress;
      const activeIndex = Math.min(Math.round(progress * (total - 1)), total - 1);

      gsap.to(wordList, {
        y: -activeIndex * itemHeight,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true
      });

      items.forEach((item, index) => {
        item.classList.toggle('active', index === activeIndex);
      });
    }
  });
}

// =============================================================================
// 5. TIMELINE BENEFÍCIOS (AQUI ESTAVA O PROBLEMA VISUAL)
// =============================================================================
function initBenefitsTimeline() {
  const section = document.querySelector(".benefits-section");
  const progressLine = document.getElementById("timeline-progress");
  const items = document.querySelectorAll(".benefit-item");

  if (!section || !progressLine) return;

  // Linha de Progresso
  gsap.fromTo(progressLine, 
    { height: "0%" },
    {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".benefits-timeline",
        start: "top center",
        end: "bottom center",
        scrub: true
      }
    }
  );

  // Itens aparecendo
  items.forEach(item => {
    ScrollTrigger.create({
      trigger: item,
      start: "top 80%",
      onEnter: () => {
        item.classList.add('active'); // O CSS novo vai lidar com a animação
      }
    });
  });
}

// =============================================================================
// OUTROS
// =============================================================================
function initAnimatedCardsSection() {
  const section = document.querySelector(".animated-section");
  if (!section) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      toggleActions: "play none none reverse"
    }
  });

  tl.to(".hero-logo", { opacity: 1, y: 0, duration: 0.9 })
    .to(".hero-title", { opacity: 1, y: 0, duration: 1.1 }, "-=0.6")
    .to(".hero-text", { opacity: 1, y: 0, duration: 0.9 }, "-=0.7")
    .to(".glass-card", { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.12 }, "-=0.4");
}

function initMockupSection() {
  const section = document.querySelector("#sect-moc");
  if (!section) return;

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: "top 70%" }
  });

  tl.from("#phoneMockup", { opacity: 0, y: 60, scale: 0.95, duration: 1.2, ease: "power3.out" })
    .from("#contentBlock > *", { opacity: 0, y: 30, stagger: 0.12 }, "-=0.8");
}

function initPartnersCarousel() {
  const section = document.querySelector(".carousel-section");
  const track = document.getElementById("carousel-track");
  if (!section || !track) return;

  const logos = [{ text: "NRV" }, { text: "Azul" }, { text: "Instituto Claro" }, { text: "Tempo" }, { text: "Insper" }];
  
  track.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    logos.forEach(l => {
      const s = document.createElement("span");
      s.className = "carousel-item";
      s.textContent = l.text;
      track.appendChild(s);
    });
  }

  gsap.fromTo([section.querySelectorAll(".line"), section.querySelector("h2"), track], 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, scrollTrigger: { trigger: section, start: "top 80%" } }
  );
}

// =============================================================================
// NOVO: SISTEMA UNIVERSAL DE REVEAL (ENTRADA SUAVE)
// =============================================================================
function initGlobalReveals() {
  // 1. Elementos Isolados (Sobem suavemente um por um)
  const revealUpElements = gsap.utils.toArray('.reveal-up');
  revealUpElements.forEach((el) => {
    gsap.fromTo(el, 
      { opacity: 0, y: 50 }, 
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%", // Dispara quando o elemento atinge 85% da tela
          toggleActions: "play none none none" // Anima só uma vez
        }
      }
    );
  });

  // 2. Grupos com Delay/Stagger (Ex: Grid de Cartões, Listas)
  const revealGroups = gsap.utils.toArray('.reveal-group');
  revealGroups.forEach((group) => {
    const items = group.querySelectorAll('.reveal-item');
    if (!items.length) return;

    gsap.fromTo(items, 
      { opacity: 0, y: 40 }, 
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "power3.out",
        stagger: 0.15, // O SEGREDO DO DELAY: Cada item entra 0.15s depois do outro
        scrollTrigger: {
          trigger: group,
          start: "top 80%",
        }
      }
    );
  });
}