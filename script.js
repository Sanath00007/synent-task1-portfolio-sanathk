// ===== LOADING =====
(function() {
  let percent = 0;
  const percentEl = document.getElementById('loadPercent');
  const loadingWrap = document.getElementById('loadingWrap');
  const loadingContent = document.getElementById('loadingContent');
  const loadingContent2 = document.getElementById('loadingContent2');
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');
  const bikeLoaderContainer = document.getElementById('bikeLoaderContainer');
  const bikeWrapper = document.getElementById('bikeWrapper');
  const bikeProgressLine = document.getElementById('bikeProgressLine');
  const statusEl = document.getElementById('loadingStatusText');

  const statusMessages = [
    { max: 20, text: "Initialising core system modules..." },
    { max: 40, text: "Compiling layout aesthetics..." },
    { max: 65, text: "Loading custom project coordinates..." },
    { max: 85, text: "Establishing interactive behaviors..." },
    { max: 99, text: "Finalising user interface rendering..." },
    { max: 100, text: "Core sequence complete. Welcome." }
  ];

  function updateProgress(value) {
    const clamped = Math.min(value, 100);
    percentEl.textContent = clamped + '%';
    
    // Drive the bike position smoothly from left (0%) to right (100%)
    if (bikeWrapper) {
      bikeWrapper.style.left = `calc(${clamped}% - ${(clamped / 100) * 50}px)`;
    }
    
    // Drive the glowing track line width
    if (bikeProgressLine) {
      bikeProgressLine.style.width = clamped + '%';
    }

    // Drive technical booting log ticker text
    if (statusEl) {
      const match = statusMessages.find(m => clamped <= m.max);
      if (match && statusEl.textContent !== match.text) {
        statusEl.textContent = match.text;
      }
    }
  }

  // Simulate loading progress
  let interval = setInterval(() => {
    if (percent < 50) {
      percent += Math.round(Math.random() * 5);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent += Math.round(Math.random());
        if (percent > 91) { clearInterval(interval); }
        updateProgress(percent);
      }, 2000);
    }
    updateProgress(percent);
  }, 100);

  // Complete after 1.8s
  setTimeout(() => {
    clearInterval(interval);
    const complete = setInterval(() => {
      percent++;
      updateProgress(percent);
      if (percent >= 100) {
        clearInterval(complete);
        // Show welcome
        setTimeout(() => {
          loadingContent.style.maxHeight = '0';
          loadingContent.style.overflow = 'hidden';
          loadingContent.style.transition = 'max-height 0.4s ease';
          loadingContent2.style.display = 'flex';
          if (bikeLoaderContainer) {
            bikeLoaderContainer.classList.add('loader-out');
          }
          // Auto-launch
          setTimeout(() => { triggerEnter(); }, 600);
        }, 300);
      }
    }, 20);
  }, 1800);

  function triggerEnter() {
    loadingWrap.classList.add('loading-clicked');
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      mainContent.style.opacity = '1';
      mainContent.style.transition = 'opacity 0.5s ease';
      setTimeout(() => { loadingScreen.style.display = 'none'; }, 600);
    }, 700);
  }

  // Mouse glow on loading button
  loadingWrap.addEventListener('mousemove', (e) => {
    const rect = loadingWrap.getBoundingClientRect();
    loadingWrap.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
    loadingWrap.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
  });
})();

// ===== CURSOR =====
(function() {
  const cursor = document.getElementById('cursor');
  const mousePos = { x: 0, y: 0 };
  const cursorPos = { x: 0, y: 0 };
  let hover = false;

  document.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX; mousePos.y = e.clientY;
  });

  (function loop() {
    if (!hover) {
      cursorPos.x += (mousePos.x - cursorPos.x) / 6;
      cursorPos.y += (mousePos.y - cursorPos.y) / 6;
      cursor.style.transform = `translate(${cursorPos.x}px, ${cursorPos.y}px)`;
    }
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .what-content, .resume-button').forEach(el => {
    el.addEventListener('mouseover', () => cursor.classList.add('cursor-disable'));
    el.addEventListener('mouseout', () => cursor.classList.remove('cursor-disable'));
  });
})();

// ===== SMOOTH SCROLL (nav) =====
document.querySelectorAll('.header ul a, .nav-logo').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== HORIZONTAL SCROLL (Work) =====
(function() {
  const workSection = document.getElementById('work');
  const workFlex = document.getElementById('workFlex');
  if (!workSection || !workFlex) return;

  function isDesktop() { return window.innerWidth > 1024; }

  function initHorizontal() {
    if (!isDesktop()) return;

    // Pin the work section and scroll horizontally via wheel
    let scrollX = 0;
    const maxScroll = () => workFlex.scrollWidth - workSection.clientWidth + 160;

    workSection.style.overflow = 'hidden';
    workSection.style.position = 'sticky';

    // We'll do a proper scroll-linked approach
    const workScrollStart = workSection.offsetTop;
    const totalTravel = maxScroll();

    function updateWorkScroll() {
      const scrollY = window.scrollY;
      const progress = Math.max(0, Math.min(1, (scrollY - workScrollStart) / totalTravel));
      workFlex.style.transform = `translateX(${-progress * totalTravel}px)`;
    }

    window.addEventListener('scroll', updateWorkScroll, { passive: true });
    updateWorkScroll();
  }

  if (isDesktop()) {
    // Set body height to accommodate horizontal scroll
    const boxes = workFlex.querySelectorAll('.work-box');
    let totalW = 0;
    boxes.forEach((b, idx) => {
      // Include offsetWidth (580px) + left/right margins (40px)
      totalW += b.offsetWidth + (idx < boxes.length - 1 ? 40 : 0);
    });
    // Add extra travel distance with a beautiful 160px padding cushion
    const extra = totalW - window.innerWidth + 160;

    // Wrap in a scroll spacer approach
    const spacer = document.createElement('div');
    spacer.style.height = (window.innerHeight + extra) + 'px';
    spacer.style.pointerEvents = 'none';

    // Simple GSAP-like pinned approach using position:sticky
    workSection.style.position = 'sticky';
    workSection.style.top = '0';
    workSection.style.height = '100vh';

    const wrapper = document.createElement('div');
    wrapper.style.height = (window.innerHeight + extra + 200) + 'px';
    workSection.parentNode.insertBefore(wrapper, workSection);
    wrapper.appendChild(workSection);

    let animFrame;
    function onScroll() {
      if (animFrame) cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(() => {
        const rect = wrapper.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / (wrapper.offsetHeight - window.innerHeight)));
        workFlex.style.transform = `translateX(${-progress * extra}px)`;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();

// ===== SCROLL REVEAL =====
(function() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => observer.observe(el));
})();

// ===== CAREER TIMELINE ANIMATION =====
(function() {
  const timeline = document.getElementById('careerTimeline');
  if (!timeline) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { timeline.classList.add('active'); }
    });
  }, { threshold: 0.2 });
  observer.observe(timeline.parentElement);
})();

// ===== SOCIAL ICONS LIQUID MAGNET =====
(function() {
  const social = document.getElementById('social');
  if (!social) return;
  social.querySelectorAll('span').forEach(span => {
    const link = span.querySelector('a');
    const rect = span.getBoundingClientRect();
    let mouseX = rect.width / 2, mouseY = rect.height / 2;
    let currentX = rect.width / 2, currentY = rect.height / 2;

    const update = () => {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      link.style.setProperty('--siLeft', currentX + 'px');
      link.style.setProperty('--siTop', currentY + 'px');
      requestAnimationFrame(update);
    };
    update();

    document.addEventListener('mousemove', (e) => {
      const r = span.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (x > 5 && x < 45 && y > 5 && y < 45) { mouseX = x; mouseY = y; }
      else { mouseX = rect.width / 2; mouseY = rect.height / 2; }
    });
  });
})();

// ===== FUTURISTIC CERTIFICATES DRAG & AUTO-SCROLL =====
(function() {
  const container = document.querySelector('.certificates-marquee-container');
  const inner = document.querySelector('.certificates-marquee-inner');
  if (!container || !inner) return;

  let isDown = false;
  let startX;
  let scrollLeftVal;
  let autoScrollSpeed = 0.6; // pixels per frame
  let autoScrollActive = true;
  let animationFrameId;
  let isHovered = false;
  let dragMoved = false; // Tracks if actual drag movement occurred to prevent accidental link clicks

  // Seamless auto scrolling loop
  function autoScrollStep() {
    if (autoScrollActive && !isDown) {
      container.scrollLeft += autoScrollSpeed;
      
      const halfWidth = inner.scrollWidth / 2;
      // Seamless wrap around when reaching the half width
      if (container.scrollLeft >= halfWidth - 10) {
        container.scrollLeft = 0;
      }
    }
    animationFrameId = requestAnimationFrame(autoScrollStep);
  }

  // Only run auto scroll on desktop viewports (touch swipe takes over on mobile/tablet)
  function startMarquee() {
    if (window.innerWidth > 1024) {
      autoScrollActive = true;
      if (!animationFrameId) {
        autoScrollStep();
      }
    } else {
      autoScrollActive = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }
  }

  // Initialize scrolling marquee
  startMarquee();
  window.addEventListener('resize', startMarquee);

  // Pause scrolling on hover
  container.addEventListener('mouseenter', () => {
    isHovered = true;
    if (window.innerWidth > 1024) {
      autoScrollActive = false;
    }
  });
  container.addEventListener('mouseleave', () => {
    isHovered = false;
    if (window.innerWidth > 1024 && !isDown) {
      autoScrollActive = true;
    }
  });

  // Desktop click & drag (grab-to-scroll) logic
  container.addEventListener('mousedown', (e) => {
    if (window.innerWidth <= 1024) return; // Let touch events handle mobile swiping
    isDown = true;
    dragMoved = false; // Reset drag movement flag
    container.classList.add('grabbing');
    autoScrollActive = false;
    startX = e.pageX - container.offsetLeft;
    scrollLeftVal = container.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      container.classList.remove('grabbing');
      autoScrollActive = !isHovered && window.innerWidth > 1024;
    }
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown || window.innerWidth <= 1024) return;
    e.preventDefault();
    
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity multiplier
    
    // If user dragged more than 5 pixels, mark it as drag movement
    if (Math.abs(x - startX) > 5) {
      dragMoved = true;
    }
    
    container.scrollLeft = scrollLeftVal - walk;
    
    // Wrap around gracefully while dragging to preserve infinite loop
    const halfWidth = inner.scrollWidth / 2;
    if (container.scrollLeft >= halfWidth - 10) {
      container.scrollLeft = 0;
      startX = x; // Re-align anchor positions to prevent jumping
      scrollLeftVal = container.scrollLeft;
    } else if (container.scrollLeft <= 0) {
      container.scrollLeft = halfWidth - 10;
      startX = x;
      scrollLeftVal = container.scrollLeft;
    }
  });

  // Prevent default HTML5 drag-and-drop ghost image from blocking mouse movements
  container.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  // Suppress link click redirection if the user was actively dragging the carousel
  container.addEventListener('click', (e) => {
    if (dragMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true); // Capturing phase to intercept click before reaching the child links
})();