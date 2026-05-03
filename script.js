document.addEventListener("DOMContentLoaded", () => {
  
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
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  };

  // Combine scroll events for performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        checkReveals();
        ticking = false;
      });
      ticking = true;
    }
  });
  
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
