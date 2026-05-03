document.addEventListener("DOMContentLoaded", () => {
  
  // Scroll to top on page refresh
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  
  // Font loading animation for Lagn Patrika
  const patrikaEnvelope = document.getElementById('envelope');
  if (patrikaEnvelope && !patrikaEnvelope.classList.contains('open')) {
    patrikaEnvelope.classList.add('font-loading');
    
    // Check if fonts are loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(() => {
          patrikaEnvelope.classList.remove('font-loading');
        }, 1500);
      });
    } else {
      // Fallback for browsers without font loading API
      setTimeout(() => {
        patrikaEnvelope.classList.remove('font-loading');
      }, 2000);
    }
  }
  
  // Store event listeners for cleanup
  const eventListeners = [];
  
  // Section scroll navigation
  const sections = document.querySelectorAll('section');
  let isScrolling = false;
  let currentSectionIndex = 0;
  
  const scrollToSection = (index) => {
    if (index >= 0 && index < sections.length && !isScrolling) {
      isScrolling = true;
      sections[index].scrollIntoView({ behavior: 'smooth' });
      currentSectionIndex = index;
      setTimeout(() => { isScrolling = false; }, 1000);
    }
  };
  
  const handleWheel = (e) => {
    if (body.classList.contains('locked') || isScrolling) return;
    
    // Allow natural scrolling with smooth behavior
    // CSS scroll-snap will handle section proximity snapping
  };
  
  const updateCurrentSection = () => {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentSectionIndex = index;
      }
    });
  };
  
  // Parallax Animation
  const parallaxItems = document.querySelectorAll('.parallax-item');
  
  const updateParallax = () => {
    const scrollY = window.scrollY;
    parallaxItems.forEach(item => {
      const speed = item.getAttribute('data-speed');
      // Adding a slight lag/smoothness could be done here, but native transform is usually smooth enough
      item.style.transform = `translateY(${scrollY * speed}px)`;
    });
  };

  // Envelope Open Animation
  const openBtn = document.getElementById('open-btn');
  const envelope = document.getElementById('envelope');
  const body = document.body;

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      envelope.classList.add('open');
      setTimeout(() => {
        body.classList.remove('locked');
        window.scrollTo(0, 0); // Reset to top
        currentSectionIndex = 0; // Reset section index
        checkReveals(); // Trigger initial reveals
      }, 800);
    });
  }

  // Scroll Reveal Animation
  const reveals = document.querySelectorAll('.reveal');
  const checkReveals = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;
    
    reveals.forEach(reveal => {
      const elementTop = reveal.getBoundingClientRect().top;
      const elementBottom = reveal.getBoundingClientRect().bottom;
      
      // Add active class when element is in view
      if (elementTop < windowHeight - elementVisible && elementBottom > elementVisible) {
        reveal.classList.add('active');
      } else {
        // Remove active class when element is out of view
        reveal.classList.remove('active');
      }
    });
  };

  // Combine scroll events for performance
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        checkReveals();
        updateCurrentSection();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll);
  eventListeners.push({ element: window, event: 'scroll', handler: handleScroll });
  
  // Add wheel event for section navigation
  window.addEventListener('wheel', handleWheel, { passive: true });
  eventListeners.push({ element: window, event: 'wheel', handler: handleWheel });
  
  // Check animations on page load and resize
  const handleLoad = () => {
    if (!body.classList.contains('locked')) {
      checkReveals();
      updateCurrentSection();
    }
  };
  
  const handleResize = () => {
    if (!body.classList.contains('locked')) {
      checkReveals();
      updateCurrentSection();
    }
  };
  
  window.addEventListener('load', handleLoad);
  window.addEventListener('resize', handleResize);
  
  eventListeners.push({ element: window, event: 'load', handler: handleLoad });
  eventListeners.push({ element: window, event: 'resize', handler: handleResize });
  
  // Cleanup function for page unload
  const cleanup = () => {
    eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
  };
  
  window.addEventListener('beforeunload', cleanup);

  // Wedding Countdown Timer
  const targetDate = new Date('2026-05-06T13:40:00+05:30').getTime();
  
  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) return;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('days');
    if (daysEl) {
      daysEl.innerText = days.toString().padStart(2, '0');
      document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
      document.getElementById('mins').innerText = minutes.toString().padStart(2, '0');
      document.getElementById('secs').innerText = seconds.toString().padStart(2, '0');
    }
  };

  setInterval(updateCountdown, 1000);
  updateCountdown();
});
