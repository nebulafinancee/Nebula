/* ─────────────────────────────────────────────────────────────────────────
   NEBULA V2 — INTERACTIVE SCRIPTS & COSMIC CANVAS
   Aesthetic: Quiet Confidence, Premium, Editorial, Minimal, Timeless
   ───────────────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // Store typewriter content and clear early to prevent flash of text
  const typewriterTarget = document.querySelector('.typewriter-target');
  if (typewriterTarget) {
    typewriterTarget.setAttribute('data-typewriter-raw', typewriterTarget.innerHTML.trim());
    typewriterTarget.innerHTML = '';
    typewriterTarget.style.opacity = '0';
  }

  // Initialize all modules
  initNebulaBackground();
  initNavigation();
  initRevealAnimations();
  initContactModal();
});

/* ── COSMIC BACKGROUND SYSTEM (HTML5 CANVAS) ── */
function initNebulaBackground() {
  const canvas = document.getElementById('nebula-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Re-calculate sizes on window resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Nebula Gas Orb Config
  const orbs = [
    {
      x: width * 0.7,
      y: height * 0.3,
      radius: Math.max(width, height) * 0.45,
      color: 'rgba(109, 74, 255, 0.08)',
      targetX: width * 0.7,
      targetY: height * 0.3,
      speed: 0.0005,
      angleX: Math.random() * Math.PI * 2,
      angleY: Math.random() * Math.PI * 2,
      amplitudeX: 80,
      amplitudeY: 120,
    },
    {
      x: width * 0.2,
      y: height * 0.8,
      radius: Math.max(width, height) * 0.5,
      color: 'rgba(140, 108, 255, 0.06)',
      targetX: width * 0.2,
      targetY: height * 0.8,
      speed: 0.0003,
      angleX: Math.random() * Math.PI * 2,
      angleY: Math.random() * Math.PI * 2,
      amplitudeX: 120,
      amplitudeY: 80,
    },
    {
      x: width * 0.5,
      y: height * 0.5,
      radius: Math.max(width, height) * 0.35,
      color: 'rgba(74, 109, 255, 0.04)',
      targetX: width * 0.5,
      targetY: height * 0.5,
      speed: 0.0004,
      angleX: Math.random() * Math.PI * 2,
      angleY: Math.random() * Math.PI * 2,
      amplitudeX: 100,
      amplitudeY: 100,
    }
  ];

  // Drifting Star Dust Particles
  const particles = [];
  const particleCount = Math.min(60, Math.floor((width * height) / 25000));

  class DustParticle {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // Start at random Y initially
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + 10;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedY = -(Math.random() * 0.3 + 0.1);
      this.speedX = (Math.random() * 0.2 - 0.1);
      this.maxOpacity = Math.random() * 0.4 + 0.1;
      this.opacity = 0;
      this.fadeInSpeed = 0.01;
      this.fadeOutHeight = Math.random() * height * 0.8; // Fade out before reaching top
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      // Handle Fade In / Out
      if (this.y > this.fadeOutHeight) {
        if (this.opacity < this.maxOpacity) {
          this.opacity += this.fadeInSpeed;
        }
      } else {
        this.opacity -= 0.005;
      }

      // Reset when off screen or invisible
      if (this.y < -10 || this.opacity <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 168, 179, ${this.opacity})`;
      ctx.shadowBlur = this.size * 2;
      ctx.shadowColor = '#8C6CFF';
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow blur
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new DustParticle());
  }

  // Canvas Render Loop
  function animate(timestamp) {
    ctx.clearRect(0, 0, width, height);
    
    // Set composite operation for soft blending
    ctx.globalCompositeOperation = 'screen';

    // 1. Draw Shifting Nebula Gas Orbs
    orbs.forEach((orb) => {
      // Shifting position using smooth sine wave angles
      orb.angleX += orb.speed;
      orb.angleY += orb.speed;

      const currentX = orb.targetX + Math.sin(orb.angleX) * orb.amplitudeX;
      const currentY = orb.targetY + Math.cos(orb.angleY) * orb.amplitudeY;

      const gradient = ctx.createRadialGradient(
        currentX,
        currentY,
        0,
        currentX,
        currentY,
        orb.radius
      );
      
      gradient.addColorStop(0, orb.color);
      gradient.addColorStop(0.5, rgbaTransition(orb.color, 0.4));
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(currentX, currentY, orb.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Reset composite operation for normal drawing
    ctx.globalCompositeOperation = 'source-over';

    // 2. Draw Dust Particles
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  // Helper function to extract and adjust alpha of rgba strings
  function rgbaTransition(rgbaStr, factor) {
    // Basic parser for rgba(r,g,b,a)
    const matches = rgbaStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (matches) {
      const r = matches[1];
      const g = matches[2];
      const b = matches[3];
      const a = parseFloat(matches[4]) * factor;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    return rgbaStr;
  }

  requestAnimationFrame(animate);
}

/* ── NAVIGATION & SCROLL SYSTEM ── */
function initNavigation() {
  const header = document.querySelector('header');
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navLinksContainer = document.getElementById('nav-links-container');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  // 1. Scroll-induced Header Style Shift
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Drawer Navigation Toggle
  if (mobileNavToggle && navLinksContainer) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNavToggle.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
    });

    // Close mobile menu on click of nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileNavToggle.classList.remove('open');
        navLinksContainer.classList.remove('open');
      });
    });
  }

  // 3. Smooth Scroll Navigation Target Matching
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      
      // If it is an external/different page link, let it proceed
      if (!targetId.startsWith('#')) return;

      e.preventDefault();
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const headerOffset = 90;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4. Scroll Spy: Active Link Highlighting
  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 150; // offset for detection line

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = '#' + section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      if (link.getAttribute('href') === currentSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });
}

/* ── REVEAL-ON-SCROLL ANIMATION SYSTEM ── */
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12 // Trigger when 12% of the element is visible
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Trigger typewriter if this element contains a typewriter target
        const typewriterEl = entry.target.querySelector('.typewriter-target');
        if (typewriterEl) {
          triggerTypewriter(typewriterEl);
        }
        
        // Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });
}

/* ── TYPEWRITER ANIMATION FOR ABOUT SECTION ── */
function triggerTypewriter(element) {
  const htmlContent = element.getAttribute('data-typewriter-raw');
  if (!htmlContent) return;

  element.style.opacity = '1';
  element.innerHTML = '';

  // Split content by HTML tags, keeping the tags as tokens
  const tokens = htmlContent.split(/(<[^>]*>)/g);
  let currentTokenIndex = 0;
  let charIndex = 0;
  let currentHTML = '';

  function type() {
    if (currentTokenIndex >= tokens.length) return;
    const token = tokens[currentTokenIndex];

    if (token.startsWith('<') && token.endsWith('>')) {
      // Append tag instantly
      currentHTML += token;
      element.innerHTML = currentHTML;
      currentTokenIndex++;
      type();
    } else {
      // Type text content character by character
      if (charIndex < token.length) {
        currentHTML += token[charIndex];
        element.innerHTML = currentHTML;
        charIndex++;
        setTimeout(type, 35); // Typing speed (slowed down from 18ms)
      } else {
        charIndex = 0;
        currentTokenIndex++;
        type();
      }
    }
  }

  type();
}

/* ── INTERACTIVE CONTACT MODAL & SUBMIT SYSTEM ── */
function initContactModal() {
  const contactLinks = document.querySelectorAll('[data-contact-trigger]');
  const modalOverlay = document.getElementById('contact-modal');
  const modalClose = document.getElementById('modal-close');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (!modalOverlay || !modalClose || !contactForm) return;

  // Open Modal
  contactLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    });
  });

  // Close Modal (via close button)
  modalClose.addEventListener('click', () => {
    closeModal();
  });

  // Close Modal (via click outside card)
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close Modal (via Escape key)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = ''; // Unlock scroll
    // Reset form states after animation completes
    setTimeout(() => {
      contactForm.style.display = 'block';
      formSuccess.style.display = 'none';
      contactForm.reset();
    }, 500);
  }

  // Handle Form Submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate API request
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Transition to Success message
      contactForm.style.display = 'none';
      formSuccess.style.display = 'block';
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;

      // Automatically close modal after 3 seconds
      setTimeout(() => {
        closeModal();
      }, 3000);
    }, 1500);
  });
}
