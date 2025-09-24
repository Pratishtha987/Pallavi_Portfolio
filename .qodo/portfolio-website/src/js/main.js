// Detailed interactions in vanilla JS
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    // Loader fade-out
    requestAnimationFrame(() => {
      document.body.classList.add('loaded');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Contact form handler with email sending via FormSubmit
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const statusEl = document.getElementById('contact-status');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
        if (statusEl) { statusEl.textContent = ''; }
        try {
          const fd = new FormData(form);
          fd.append('_subject', 'New message from portfolio contact form');
          fd.append('_captcha', 'false');
          fd.append('_template', 'box');
          const resp = await fetch('https://formsubmit.co/ajax/pratishthaverma2000@gmail.com', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: fd
          });
          if (!resp.ok) throw new Error('Request failed');
          const data = await resp.json();
          if (data.success === 'true' || data.message) {
            if (statusEl) { statusEl.textContent = 'Message sent successfully!'; }
            else { alert('Message sent successfully!'); }
            form.reset();
          } else {
            throw new Error('Unexpected response');
          }
        } catch (err) {
          if (statusEl) { statusEl.textContent = 'Failed to send message. Please try again later.'; }
          else { alert('Failed to send message. Please try again later.'); }
          console.error(err);
        } finally {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send'; }
        }
      });
    }

    // Reveal on scroll
    const els = document.querySelectorAll('.animate-on-scroll');
    const io = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));

    // Typing effect for hero
    const typedEl = document.getElementById('typed');
    const phrases = [
      'Frontend Developer',
      'Frontend Designer',
      'Problem Solver'
    ];
    if (typedEl) {
      let pi = 0, ci = 0, deleting = false;
      const type = () => {
        const phrase = phrases[pi];
        if (!deleting) {
          typedEl.textContent = phrase.slice(0, ++ci);
          if (ci === phrase.length) { deleting = true; setTimeout(type, 1200); return; }
        } else {
          typedEl.textContent = phrase.slice(0, --ci);
          if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
        }
        setTimeout(type, deleting ? 50 : 80);
      };
      type();
    }

    // Project filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        cards.forEach(card => {
          const cat = card.dataset.category || 'all';
          const show = filter === 'all' || filter === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });

    // Testimonials carousel
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial');
    const prev = document.querySelector('.carousel-btn.prev');
    const next = document.querySelector('.carousel-btn.next');
    let idx = 0;
    const update = () => {
      const w = track ? track.clientWidth : 0;
      if (track) track.style.transform = `translateX(${-idx * w}px)`;
    };
    const clampIdx = (val) => {
      if (val < 0) return slides.length - 1;
      if (val >= slides.length) return 0;
      return val;
    };
    if (prev && next && track) {
      prev.addEventListener('click', () => { idx = clampIdx(idx - 1); update(); });
      next.addEventListener('click', () => { idx = clampIdx(idx + 1); update(); });
      window.addEventListener('resize', update);
      update();
    }

    // Theme toggle (persisted)
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const applyTheme = (mode) => { root.setAttribute('data-theme', mode); localStorage.setItem('theme', mode); themeToggle.textContent = mode === 'dark' ? '☀️' : '🌙'; };
    const saved = localStorage.getItem('theme');
    applyTheme(saved || 'light');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const nextMode = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextMode);
      });
    }
  });
})();