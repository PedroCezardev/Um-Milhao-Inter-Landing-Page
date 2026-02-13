// lucide icons
lucide.createIcons();

// scroll behavior
const nav = document.getElementById("navbar");
const navContent = document.getElementById("navbar-content");

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY > 10;
  nav.classList.toggle("top-4", scrolled);
  nav.classList.toggle("top-8", !scrolled);

  navContent.className =
    "relative flex justify-between items-center px-6 lg:px-10 py-4 rounded-full transition-all duration-500 " +
    (scrolled
      ? "bg-white/75 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-white/40"
      : "bg-gradient-to-r from-white/90 via-gray-100/70 to-white/90 backdrop-blur-xl border border-white/30 shadow-sm");
});

// mobile menu toggle
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.onclick = () => {
  const open = mobileMenu.classList.contains("translate-x-full");
  mobileMenu.classList.toggle("translate-x-0", open);
  mobileMenu.classList.toggle("translate-x-full", !open);
  menuBtn.innerHTML = open
    ? '<i data-lucide="x"></i>'
    : '<i data-lucide="menu"></i>';
  lucide.createIcons();
};

// reveal animation
document.querySelectorAll(".blur-in").forEach((el, i) => {
  setTimeout(() => el.classList.add("show"), 150 + i * 200);
});

// color animation
setInterval(() => {
  const el = document.getElementById("anim-color");
  el.style.color = el.style.color === "rgb(255, 85, 0)" ? "#FF7A00" : "#FF5500";
}, 1500);

document.addEventListener("DOMContentLoaded", function () {
  const benefitsSection = document.querySelector(".benefits-section");
  const benefitsLabel = document.querySelector(".benefits-label");
  const benefitsTitle = document.querySelector(".benefits-title");
  const benefitsDescription = document.querySelector(".benefits-description");
  const benefitItems = document.querySelectorAll(".benefit-item");
  const benefitsCta = document.querySelector(".benefits-cta");
  const timelineProgress = document.getElementById("timeline-progress");

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  if (benefitsLabel) observer.observe(benefitsLabel);
  if (benefitsTitle) observer.observe(benefitsTitle);
  if (benefitsDescription) observer.observe(benefitsDescription);
  if (benefitsCta) observer.observe(benefitsCta);

  // Timeline + items
  if (benefitsSection && benefitItems.length > 0 && timelineProgress) {
    animateTimelineProgress(benefitItems, timelineProgress);

    benefitItems.forEach((item) => {
      const itemObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in", "active");
              itemObserver.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.3,
          rootMargin: "0px 0px -100px 0px",
        },
      );

      itemObserver.observe(item);
    });
  }
});

/* --- SCROLL VELOCITY COMPONENT --- */
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const tracks = document.querySelectorAll('.velocity-track');
  
  if (tracks.length > 0) {
    let scrollVelocity = 0;
    const baseSpeed = 1.5; // Velocidade do texto quando você NÃO está scrollando

    // 1. Rastreador de Velocidade do Scroll
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // Captura a velocidade do scroll e suaviza o número
        scrollVelocity = self.getVelocity() / 300; 
      }
    });

    // 2. Loop de Animação (Ticker)
    tracks.forEach((track) => {
      const direction = parseFloat(track.getAttribute('data-direction')); // 1 ou -1
      let xPos = 0;
      
      // Duplicamos o conteúdo para criar a ilusão de loop infinito sem buracos
      const originalContent = track.innerHTML;
      track.innerHTML = originalContent + originalContent + originalContent;
      
      gsap.ticker.add(() => {
        // Damping: faz a velocidade extra do scroll desacelerar suavemente
        scrollVelocity *= 0.9; 
        
        // A velocidade de movimento do frame atual
        let move = (baseSpeed + Math.abs(scrollVelocity)) * direction;
        
        // Se a pessoa rolar rápido para CIMA, inverte o sentido temporariamente
        if (scrollVelocity < -0.1) {
          move = (baseSpeed + Math.abs(scrollVelocity)) * -direction;
        }

        xPos += move;

        // Lógica de reset para o loop infinito
        // Usa 1/3 do tamanho pois triplicamos o conteúdo
        let thirdWidth = track.scrollWidth / 3;
        
        if (xPos < -thirdWidth) {
          xPos = 0;
        } else if (xPos > 0) {
          xPos = -thirdWidth;
        }
        
        gsap.set(track, { x: xPos });
      });
    });
  }
});
/* FIM DO BLOCO DE CODIGO */

/* --- Sticky Scroll Carousel --- */
(function() {
    // Array de palavras adaptado para vendas do banco Inter
    const words = [
      "Digital",
      "Seguro",
      "Inovador",
      "Sem Taxas",
      "O Super App"
    ];

    const track = document.getElementById('stScrollTrack');
    const wordList = document.getElementById('stWordList');
    const wrapper = document.getElementById('stDynamicWrapper');
    const widthTester = document.getElementById('stWidthTester');

    if(!track || !wordList) return;

    // 1. Configuração Inicial
    let maxWordWidth = 0;

    words.forEach(word => {
      const div = document.createElement('div');
      div.className = 'st-word-item';
      div.innerText = word;
      wordList.appendChild(div);

      widthTester.textContent = word;
      const w = widthTester.offsetWidth;
      if (w > maxWordWidth) maxWordWidth = w;
    });

    // Ajusta a largura para não dar soco no layout
    setTimeout(() => {
      wrapper.style.width = (maxWordWidth + 20) + 'px';
    }, 100);

    const items = wordList.querySelectorAll('.st-word-item');
    const total = words.length;

    // 2. Lógica do Scroll
    function handleScroll() {
      const rect = track.getBoundingClientRect();
      const trackHeight = rect.height;
      const windowHeight = window.innerHeight;
      
      const scrolled = -rect.top;
      const scrollableDistance = trackHeight - windowHeight;

      let progress = scrolled / scrollableDistance;
      progress = Math.max(0, Math.min(1, progress));

      const rawIndex = progress * (total - 1);
      const activeIndex = Math.round(rawIndex);

      const itemHeight = items[0].offsetHeight;
      wordList.style.transform = `translateY(-${activeIndex * itemHeight}px)`;

      items.forEach((item, index) => {
        if (index === activeIndex) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    
    // Atualiza os ícones do Lucide para a setinha aparecer
    if (window.lucide) {
      window.lucide.createIcons();
    }
  })();
/* FIM DO BLOCO DE CODIGO */

function animateTimelineProgress(items, progressBar) {
  const totalItems = items.length;
  let activeItems = 0;

  items.forEach((item) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeItems++;
            const progress = (activeItems / totalItems) * 100;
            progressBar.style.height = `${progress}%`;
            item.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(item);
  });

  const updateProgressOnScroll = () => {
    const section = document.querySelector(".benefits-section");
    const timeline = document.querySelector(".benefits-timeline");
    if (!section || !timeline) return;

    const sectionTop = section.offsetTop;
    const windowHeight = window.innerHeight;
    const scrollTop = window.pageYOffset;
    const timelineTop = timeline.offsetTop + sectionTop;
    const timelineBottom = timelineTop + timeline.offsetHeight;

    const progressStart = timelineTop - windowHeight * 0.5;
    const progressEnd = timelineBottom - windowHeight * 0.5;
    const totalDistance = progressEnd - progressStart;

    let scrollProgress = (scrollTop - progressStart) / totalDistance;
    scrollProgress = Math.max(0, Math.min(1, scrollProgress));

    progressBar.style.height = `${scrollProgress * 100}%`;
  };

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgressOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateProgressOnScroll();
}

const logos = [
  { name: "NRV Projetos", text: "NRV" },
  { name: "Azul Viagens", text: "Azul" },
  { name: "Instituto Claro", text: "Instituto Claro" },
  { name: "Tempo", text: "Tempo" },
  { name: "Insper", text: "Insper" },
  { name: "Techlab", text: "TechLab" },
  { name: "Innovate", text: "Innovate" },
  { name: "GlobalNet", text: "GlobalNet" },
];

const track = document.getElementById("carousel-track");

// adicionar duas vezes para looping contínuo
function render() {
  for (let i = 0; i < 2; i++) {
    logos.forEach((logo) => {
      const span = document.createElement("span");
      span.classList.add("carousel-item");
      span.textContent = logo.text;
      track.appendChild(span);
    });
  }
}

render();

document.addEventListener("DOMContentLoaded", () => {
  gsap.set("#navbar", {
    y: -60,
    opacity: 0,
    filter: "blur(8px)",
  });

  gsap.set("#navbar-content > *", {
    y: 20,
    opacity: 0,
  });

  const headerTl = gsap.timeline({
    defaults: {
      ease: "power4.out",
    },
  });

  headerTl
    .to("#navbar", {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1,
    })
    .to(
      "#navbar-content > *",
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.12,
      },
      "-=0.4",
    );
});
gsap.to("#navbar", {
  scrollTrigger: {
    trigger: "body",
    start: "top -10",
    toggleActions: "play none none reverse",
  },
  scale: 0.96,
  duration: 0.4,
  ease: "power2.out",
});

document.addEventListener("DOMContentLoaded", () => {
  // ===== HERO SETUP =====
  gsap.set(".hero-video", {
    scale: 1.15,
    filter: "blur(10px)",
    opacity: 0,
  });

  gsap.set(".hero-badge", {
    y: 20,
    opacity: 0,
  });

  gsap.set(".hero-title", {
    y: 80,
    opacity: 0,
  });

  gsap.set(".hero-sub", {
    y: 30,
    opacity: 0,
  });

  gsap.set(".hero-cta a", {
    y: 20,
    opacity: 0,
  });

  gsap.set(".hero-cards .card", {
    y: 60,
    opacity: 0,
    scale: 0.92,
    willChange: "transform, opacity",
  });

  // ===== HERO TIMELINE =====
  const heroTl = gsap.timeline({
    delay: 0.3,
    defaults: { ease: "power4.out" },
  });

  heroTl
    // Video cinematic entrance
    .to(".hero-video", {
      scale: 1,
      filter: "blur(0px)",
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
    })

    // Badge
    .to(
      ".hero-badge",
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
      },
      "-=0.6",
    )

    // Title (impact)
    .to(
      ".hero-title",
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
      },
      "-=0.4",
    )

    // Subtitle
    .to(
      ".hero-sub",
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
      },
      "-=0.5",
    )

    // CTA buttons
    .to(
      ".hero-cta a",
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.12,
      },
      "-=0.3",
    )

    // Cards
    .to(
      ".hero-cards .card",
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.15,
      },
      "-=0.25",
    );
});

gsap.registerPlugin(ScrollTrigger);

// Animação da section inteira
gsap.from(".features-section", {
  opacity: 0,
  y: 60,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".features-section",
    start: "top 80%",
  },
});

// Título
gsap.from(".section-title", {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".features-section",
    start: "top 75%",
  },
});

// Cards com stagger
gsap.from(".feature-card", {
  opacity: 0,
  y: 40,
  duration: 0.8,
  ease: "power3.out",
  stagger: 0.15,
  scrollTrigger: {
    trigger: ".features-grid",
    start: "top 80%",
  },
});

gsap.from(".feature-card", {
  opacity: 0,
  y: 50,
  scale: 0.95,
  duration: 0.9,
  ease: "expo.out",
  stagger: 0.2,
  scrollTrigger: {
    trigger: ".features-grid",
    start: "top 80%",
  },
});

gsap.registerPlugin(ScrollTrigger);

// ===== HEADER =====
gsap.fromTo(
  ".cards-header > *",
  {
    autoAlpha: 0,
    yPercent: 30,
  },
  {
    autoAlpha: 1,
    yPercent: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.15,
    force3D: true,
    scrollTrigger: {
      trigger: ".cards-section",
      start: "top 75%",
      once: true,
    },
  },
);

// ===== CARDS =====
gsap.fromTo(
  ".card-anim",
  {
    autoAlpha: 0,
    yPercent: 20,
  },
  {
    autoAlpha: 1,
    yPercent: 0,
    duration: 0.7,
    ease: "power3.out",
    stagger: {
      each: 0.12,
      from: "start",
    },
    force3D: true,
    scrollTrigger: {
      trigger: ".cards-grid",
      start: "top 80%",
      once: true,
    },
  },
);

// ===== CTA =====
gsap.fromTo(
  ".cards-cta",
  {
    autoAlpha: 0,
    yPercent: 20,
  },
  {
    autoAlpha: 1,
    yPercent: 0,
    duration: 0.6,
    ease: "power2.out",
    force3D: true,
    scrollTrigger: {
      trigger: ".cards-cta",
      start: "top 85%",
      once: true,
    },
  },
);

gsap.registerPlugin(ScrollTrigger);

const section = document.querySelector("section.py-12");
const image = section.querySelector("img");
const heading = section.querySelector("h2");
const paragraph = section.querySelector("p");
const features = section.querySelectorAll(".card-feature");
const cta = section.querySelector("a");

// Estado inicial extremamente sutil
gsap.set([heading, paragraph, features, cta], {
  autoAlpha: 0,
  y: 16,
  force3D: true,
});

gsap.set(image, {
  autoAlpha: 0,
  y: 24,
  scale: 1.02,
  force3D: true,
});

// Timeline principal (ritmo editorial)
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top 78%",
    once: true,
  },
});

// Imagem — entra primeiro, lenta e estável
tl.to(image, {
  autoAlpha: 1,
  y: 0,
  scale: 1,
  duration: 1.6,
  ease: "power4.out",
})

  // Título — levemente atrasado
  .to(
    heading,
    {
      autoAlpha: 1,
      y: 0,
      duration: 1.2,
      ease: "power4.out",
    },
    "-=1.1",
  )

  // Parágrafo — acompanha o título
  .to(
    paragraph,
    {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
    },
    "-=0.9",
  )

  // Features — entram em “respiração”, não em cascata
  .to(
    features,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: {
        each: 0.18,
      },
    },
    "-=0.7",
  )

  // CTA — finaliza com presença
  .to(
    cta,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: "power2.out",
    },
    "-=0.6",
  );

// Micro movimento contínuo da imagem (quase imperceptível)
gsap.to(image, {
  y: -8,
  duration: 6,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true,
});


  gsap.registerPlugin(ScrollTrigger);

  // =========================
  // ELEMENTOS
  // =========================
  const sectionContainer = document.querySelector(".animated-section");
  const logoElement = sectionContainer.querySelector(".hero-logo");
  const titleElement = sectionContainer.querySelector(".hero-title");
  const textElement = sectionContainer.querySelector(".hero-text");
  const cardsElements = sectionContainer.querySelectorAll(".glass-card");

  // =========================
  // ESTADO INICIAL (IMPORTANTE PRA NÃO TRAVAR)
  // =========================
  gsap.set([logoElement, titleElement, textElement], {
    opacity: 0,
    y: 30
  });

  gsap.set(cardsElements, {
    opacity: 0,
    y: 40,
    scale: 0.96
  });

  // =========================
  // TIMELINE PRINCIPAL
  // =========================
  const mainTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: sectionContainer,
      start: "top 75%",
      end: "bottom 60%",
      toggleActions: "play none none reverse"
    },
    defaults: {
      ease: "power3.out"
    }
  });

  mainTimeline
    // Logo
    .to(logoElement, {
      opacity: 1,
      y: 0,
      duration: 0.9
    })

    // Título
    .to(titleElement, {
      opacity: 1,
      y: 0,
      duration: 1.1
    }, "-=0.6")

    // Texto
    .to(textElement, {
      opacity: 1,
      y: 0,
      duration: 0.9
    }, "-=0.7")

    // Cards (stagger premium)
    .to(cardsElements, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      stagger: {
        each: 0.12,
        from: "start"
      }
    }, "-=0.4");

  // =========================
  // MICRO INTERAÇÃO (ELEGANTE)
  // =========================
  cardsElements.forEach(card => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        duration: 0.35,
        ease: "power2.out"
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: "power2.out"
      });
    });
  });


  (() => {
    const sectMockupApp = document.querySelector("#sect-moc");
    const mockupPhoneEl = document.querySelector("#phoneMockup");
    const mockupContentEl = document.querySelector("#contentBlock");

    const tlMockupApp = gsap.timeline({
      scrollTrigger: {
        trigger: sectMockupApp,
        start: "top 70%",
      },
    });

    tlMockupApp.from(mockupPhoneEl, {
      opacity: 0,
      y: 60,
      scale: 0.95,
      duration: 1.2,
      ease: "power3.out",
    });

    tlMockupApp.from(
      mockupContentEl.children,
      {
        opacity: 0,
        y: 30,
        stagger: 0.12,
      },
      "-=0.6",
    );
  })();

  
  gsap.registerPlugin(ScrollTrigger);

  // =========================
  // SECTION ESPECÍFICA
  // =========================
  const partnersCarouselSection = document.querySelector(".carousel-section");

  if (partnersCarouselSection) {

    const partnersTitleWrapper = partnersCarouselSection.querySelector(".title-wrapper");
    const partnersTitle = partnersCarouselSection.querySelector("h2");
    const partnersLines = partnersCarouselSection.querySelectorAll(".line");
    const partnersSubtitle = partnersCarouselSection.querySelector(".subtitle");
    const partnersCarouselTrack = partnersCarouselSection.querySelector(".carousel-track");

    // =========================
    // ESTADO INICIAL
    // =========================
    gsap.set(partnersLines, {
      scaleX: 0,
      transformOrigin: "center"
    });

    gsap.set(partnersTitle, {
      opacity: 0,
      y: 30
    });

    gsap.set(partnersSubtitle, {
      opacity: 0,
      y: 20
    });

    gsap.set(partnersCarouselTrack, {
      opacity: 0,
      y: 40
    });

    // =========================
    // TIMELINE DE ENTRADA
    // =========================
    const partnersIntroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: partnersCarouselSection,
        start: "top 75%",
        toggleActions: "play none none none",
        once: true
      },
      defaults: {
        ease: "power3.out"
      }
    });

    partnersIntroTimeline
      // Linhas laterais
      .to(partnersLines, {
        scaleX: 1,
        duration: 0.8,
        stagger: 0.15
      })

      // Título
      .to(partnersTitle, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, "-=0.4")

      // Subtítulo
      .to(partnersSubtitle, {
        opacity: 1,
        y: 0,
        duration: 0.6
      }, "-=0.4")

      // Carrossel
      .to(partnersCarouselTrack, {
        opacity: 1,
        y: 0,
        duration: 0.9
      }, "-=0.3");

    // =========================
    // MICRO FLOAT NO CARROSSEL
    // =========================
    ScrollTrigger.create({
      trigger: partnersCarouselSection,
      start: "top 70%",
      once: true,
      onEnter: () => {
        gsap.to(partnersCarouselTrack, {
          y: -10,
          duration: 3.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        });
      }
    });

  }

  document.addEventListener('DOMContentLoaded', function() {
    const lenis = new Lenis({
        duration: 1.2,
        })

    lenis.on('scroll', (e) => {
      console.log(e)
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  })
