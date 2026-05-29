/* ========== COSMIC MAIN JS ========== */

/* --- Star Field --- */
function initStarfield() {
  var canvas = document.getElementById('starfield');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var stars = [];
  var STAR_COUNT = 200;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < stars.length; i++) {
      var star = stars[i];
      var twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
      var alpha = star.opacity * (0.6 + 0.4 * twinkle);
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + alpha + ')';
      ctx.fill();
      star.y -= star.speed;
      if (star.y < -5) {
        star.y = canvas.height + 5;
        star.x = Math.random() * canvas.width;
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', function() { resize(); createStars(); });
  resize();
  createStars();
  requestAnimationFrame(draw);
}

/* --- Typing Animation --- */
function initTypingAnimation() {
  var phrases = [
    'building the future...',
    'analyzing classroom behavior with AI...',
    'exploring the infinite cosmos...',
    'coding new worlds from scratch...',
    'generating stories with neural networks...'
  ];
  var element = document.getElementById('typing-text');
  if (!element) return;
  var phraseIndex = 0, charIndex = 0, isDeleting = false;

  function type() {
    var current = phrases[phraseIndex];
    if (isDeleting) {
      element.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }
    var delay = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 500;
    }
    setTimeout(type, delay);
  }
  setTimeout(type, 1000);
}

/* --- Scroll Reveal --- */
function initScrollReveal() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(function(el) {
    observer.observe(el);
  });
}

/* --- Nav Scroll --- */
function initNavScroll() {
  var nav = document.querySelector('.cosmic-nav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* --- Star Rating --- */
function initStarRating() {
  var container = document.querySelector('.star-rating');
  if (!container) return;
  var stars = container.querySelectorAll('.star');
  var hiddenInput = document.querySelector('input[name="rating"]');
  var currentRating = 0;

  stars.forEach(function(star, index) {
    star.addEventListener('mouseenter', function() {
      stars.forEach(function(s, i) {
        s.classList.toggle('hover', i <= index);
      });
    });
    star.addEventListener('click', function() {
      currentRating = index + 1;
      if (hiddenInput) hiddenInput.value = currentRating;
      stars.forEach(function(s, i) {
        s.classList.toggle('active', i < currentRating);
        s.classList.remove('hover');
      });
    });
  });
  container.addEventListener('mouseleave', function() {
    stars.forEach(function(s) { s.classList.remove('hover'); });
  });
  // Set default
  if (hiddenInput) hiddenInput.value = 5;
  stars.forEach(function(s, i) { s.classList.toggle('active', i < 5); });
}

function resetStarRating() {
  var container = document.querySelector('.star-rating');
  if (!container) return;
  var stars = container.querySelectorAll('.star');
  var hiddenInput = document.querySelector('input[name="rating"]');
  if (hiddenInput) hiddenInput.value = 5;
  stars.forEach(function(s, i) { s.classList.toggle('active', i < 5); });
}

/* --- Review Monster --- */
function initReviewMonster() {
  var PHASES = {
    idle:  'assets/monster/idle_no_bad_reviews.svg',
    alert: 'assets/monster/alert_found_bad_review.svg',
    eat:   'assets/monster/eat_bad_review.svg',
    happy: 'assets/monster/happy_satisfied.svg'
  };
  var PHASE_LABELS = { idle: 'Idle', alert: 'Alert!', eat: 'Eating...', happy: 'Satisfied!' };
  var monsterImg = document.getElementById('monster-img');
  var monsterWrap = document.getElementById('monster-display');
  var phaseBadge = document.getElementById('phase-badge');
  var currentTimers = [];

  function clearTimers() {
    currentTimers.forEach(clearTimeout);
    currentTimers = [];
  }

  function setPhase(phase) {
    if (monsterImg) monsterImg.src = PHASES[phase];
    if (monsterWrap) {
      monsterWrap.classList.toggle('alert', phase === 'alert');
      monsterWrap.classList.toggle('eating', phase === 'eat');
    }
    if (phaseBadge) phaseBadge.textContent = PHASE_LABELS[phase];
  }

  function triggerEatAnimation(reviewElement) {
    clearTimers();
    setPhase('alert');
    currentTimers.push(setTimeout(function() {
      reviewElement.classList.add('eating');
      setPhase('eat');
    }, 800));
    currentTimers.push(setTimeout(function() {
      setPhase('happy');
    }, 2300));
    currentTimers.push(setTimeout(function() {
      reviewElement.style.display = 'none';
      setPhase('idle');
    }, 4000));
  }

  // Expose for form handler
  window.triggerEatAnimation = triggerEatAnimation;
  window.setPhase = setPhase;

  // Form submission
  var form = document.getElementById('comment-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]').value || 'Anonymous';
      var rating = parseInt(form.querySelector('[name="rating"]').value) || 5;
      var text = form.querySelector('[name="comment"]').value;
      if (!text.trim()) return;

      var review = { name: name, rating: rating, text: text, date: new Date().toISOString(), id: Date.now() };
      saveReview(review);
      var el = renderReview(review);
      var list = document.getElementById('reviews-list');
      if (list) list.insertBefore(el, list.firstChild);

      if (rating <= 2) {
        triggerEatAnimation(el);
      }
      form.reset();
      resetStarRating();
    });
  }

  setPhase('idle');
}

/* --- localStorage Reviews --- */
var STORAGE_KEY = 'cosmic-reviews';

function getDefaultReviews() {
  return [
    { id: 1, name: 'Cosmic Explorer', rating: 5, text: 'Amazing universe theme! The stars are beautiful.', date: '2026-05-29T10:00:00Z' },
    { id: 2, name: 'Space Traveler', rating: 5, text: 'Love the project showcase, especially Kaction!', date: '2026-05-29T11:00:00Z' },
    { id: 3, name: 'Grumpy Alien', rating: 1, text: 'Too many stars, my eyes hurt. Needs dark mode.', date: '2026-05-29T12:00:00Z' },
    { id: 4, name: 'Nebula Fan', rating: 4, text: 'Great design but could use more nebula effects.', date: '2026-05-29T13:00:00Z' },
    { id: 5, name: 'Random Critic', rating: 2, text: 'Loading is slow on my potato computer.', date: '2026-05-29T14:00:00Z' }
  ];
}

function getReviews() {
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : getDefaultReviews();
  } catch(e) {
    return getDefaultReviews();
  }
}

function saveReview(review) {
  var reviews = getReviews();
  reviews.unshift(review);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews)); } catch(e) {}
}

function renderReview(review) {
  var div = document.createElement('div');
  div.className = 'review-item';
  div.dataset.id = review.id;
  div.innerHTML =
    '<div class="review-header">' +
      '<span class="review-author">' + escapeHtml(review.name) + '</span>' +
      '<span class="review-stars">' + '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating) + '</span>' +
    '</div>' +
    '<p class="review-text">' + escapeHtml(review.text) + '</p>' +
    '<div class="review-date">' + new Date(review.date).toLocaleString() + '</div>';
  return div;
}

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function loadExistingReviews() {
  var reviews = getReviews();
  var list = document.getElementById('reviews-list');
  if (!list) return;
  reviews.forEach(function(review) {
    list.appendChild(renderReview(review));
  });
}

/* --- Init --- */
document.addEventListener('DOMContentLoaded', function() {
  initStarfield();
  initTypingAnimation();
  initScrollReveal();
  initNavScroll();
  initStarRating();
  initReviewMonster();
  loadExistingReviews();
});
