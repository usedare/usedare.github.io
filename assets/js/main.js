/* ========== 宇宙无垠 MAIN JS ========== */

/* --- Star Field --- */
function initStarfield() {
  var canvas = document.getElementById('starfield');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var stars = [];
  var STAR_COUNT = 250;

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  function createStars() {
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.3, opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        hue: Math.random() * 60 + 190
      });
    }
  }
  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var twinkle = Math.sin(time * s.twinkleSpeed + s.twinklePhase);
      var alpha = s.opacity * (0.6 + 0.4 * twinkle);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + s.hue + ', 80%, 90%, ' + alpha + ')';
      ctx.fill();
      s.y -= s.speed;
      if (s.y < -5) { s.y = canvas.height + 5; s.x = Math.random() * canvas.width; }
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', function() { resize(); createStars(); });
  resize(); createStars(); requestAnimationFrame(draw);
}

/* --- Click Sparkle Effect --- */
function initClickSparkle() {
  var canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var particles = [];

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  var starChars = ['✦', '✧', '★', '✶', '⋆', '✫', '✬', '·'];
  var colors = ['#75f1ff', '#ff7cf2', '#7967ff', '#ffd700', '#ffed4a', '#fff'];

  document.addEventListener('click', function(e) {
    for (var i = 0; i < 12; i++) {
      var angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
      var speed = 2 + Math.random() * 4;
      particles.push({
        x: e.clientX, y: e.clientY,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 1, decay: 0.015 + Math.random() * 0.01,
        char: starChars[Math.floor(Math.random() * starChars.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 10 + Math.random() * 14,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2
      });
    }
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.08; // gravity
      p.vx *= 0.98;
      p.life -= p.decay;
      p.rotation += p.rotSpeed;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.life;
      ctx.font = p.size + 'px serif';
      ctx.fillStyle = p.color;
      ctx.textAlign = 'center';
      ctx.fillText(p.char, 0, 0);
      ctx.restore();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* --- Custom Cursor --- */
function initCustomCursor() {
  var cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.innerHTML = '<span class="cursor-star">✦</span>';
  document.body.appendChild(cursor);

  var trail = document.createElement('div');
  trail.className = 'cursor-trail';
  document.body.appendChild(trail);

  var mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', function(e) { mx = e.clientX; my = e.clientY; });

  function updateCursor() {
    cx += (mx - cx) * 0.15;
    cy += (my - cy) * 0.15;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    trail.style.left = cx + 'px';
    trail.style.top = cy + 'px';
    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  // Enlarge on hover over interactive elements
  document.addEventListener('mouseover', function(e) {
    if (e.target.closest('a, button, .glass-card, .star, .skill-badge')) {
      cursor.classList.add('cursor-hover');
      trail.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', function(e) {
    if (e.target.closest('a, button, .glass-card, .star, .skill-badge')) {
      cursor.classList.remove('cursor-hover');
      trail.classList.remove('cursor-hover');
    }
  });
}

/* --- Typing Animation --- */
function initTypingAnimation() {
  var phrases = [
    '探索人工智能的边界...',
    '构建智能课堂的未来...',
    '用代码书写科幻小说...',
    '在3D世界里自由漫游...',
    '仰望星空，脚踏实地...'
  ];
  var element = document.getElementById('typing-text');
  if (!element) return;
  var pi = 0, ci = 0, del = false;
  function type() {
    var cur = phrases[pi];
    if (del) { element.textContent = cur.substring(0, ci - 1); ci--; }
    else { element.textContent = cur.substring(0, ci + 1); ci++; }
    var d = del ? 40 : 90;
    if (!del && ci === cur.length) { d = 2000; del = true; }
    else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; d = 400; }
    setTimeout(type, d);
  }
  setTimeout(type, 800);
}

/* --- Scroll Reveal --- */
function initScrollReveal() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
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
  var hidden = document.querySelector('input[name="rating"]');
  var current = 0;
  stars.forEach(function(star, idx) {
    star.addEventListener('mouseenter', function() {
      stars.forEach(function(s, i) { s.classList.toggle('hover', i <= idx); });
    });
    star.addEventListener('click', function() {
      current = idx + 1;
      if (hidden) hidden.value = current;
      stars.forEach(function(s, i) { s.classList.toggle('active', i < current); s.classList.remove('hover'); });
    });
  });
  container.addEventListener('mouseleave', function() { stars.forEach(function(s) { s.classList.remove('hover'); }); });
  if (hidden) hidden.value = 5;
  stars.forEach(function(s, i) { s.classList.toggle('active', i < 5); });
}
function resetStarRating() {
  var c = document.querySelector('.star-rating');
  if (!c) return;
  var stars = c.querySelectorAll('.star');
  var h = document.querySelector('input[name="rating"]');
  if (h) h.value = 5;
  stars.forEach(function(s, i) { s.classList.toggle('active', i < 5); });
}

/* --- Review Monster with Star Shatter --- */
function initReviewMonster() {
  var IDLE_SVGS = [
    'assets/monster/idle_no_bad_reviews.svg',
    'assets/monster/idle_lie_down.svg',
    'assets/monster/idle_play_ball.svg',
    'assets/monster/idle_sleep.svg',
    'assets/monster/idle_stretch.svg'
  ];
  var IDLE_LABELS = ['待命中', '趴着歇会儿', '玩球中', '飘着睡...', '伸个懒腰'];
  // Decoration mapping: which deco elements to show for each idle state
  var IDLE_DECOS = [
    ['deco-pulse'],        // 0: 待命 → 地面光晕
    [],                    // 1: 趴着 → 无装饰
    ['deco-ball'],         // 2: 玩球 → 弹跳球
    ['deco-z1', 'deco-z2', 'deco-z3'],  // 3: 飘着睡 → Z字
    ['deco-star1', 'deco-star2']        // 4: 伸懒腰 → 小星星
  ];
  var PHASES = {
    alert: 'assets/monster/alert_found_bad_review.svg',
    eat:   'assets/monster/eat_bad_review.svg',
    happy: 'assets/monster/happy_satisfied.svg'
  };
  var LABELS = { alert: '发现差评！', eat: '吞噬中...', happy: '满足 ✨' };
  var monsterImg = document.getElementById('monster-img');
  var monsterWrap = document.getElementById('monster-display');
  var phaseBadge = document.getElementById('phase-badge');
  var timers = [];
  var idleTimer = null;
  var currentIdleIdx = 0;

  function clearT() { timers.forEach(clearTimeout); timers = []; }

  function stopIdleRotation() {
    if (idleTimer) { clearInterval(idleTimer); idleTimer = null; }
  }

  function startIdleRotation() {
    stopIdleRotation();
    // Pick a random starting idle
    currentIdleIdx = Math.floor(Math.random() * IDLE_SVGS.length);
    showIdle(currentIdleIdx);
    // Rotate every 4-6 seconds
    idleTimer = setInterval(function() {
      // Fade out
      if (monsterImg) monsterImg.style.opacity = '0';
      setTimeout(function() {
        currentIdleIdx = (currentIdleIdx + 1) % IDLE_SVGS.length;
        showIdle(currentIdleIdx);
        // Fade in
        if (monsterImg) monsterImg.style.opacity = '1';
      }, 400);
    }, 4000 + Math.random() * 2000);
  }

  function showIdle(idx) {
    if (monsterImg) { monsterImg.src = IDLE_SVGS[idx]; }
    if (phaseBadge) phaseBadge.textContent = IDLE_LABELS[idx];
    // Show/hide decorations
    var allDecos = document.querySelectorAll('.idle-deco');
    allDecos.forEach(function(d) { d.style.opacity = '0'; });
    var activeDecos = IDLE_DECOS[idx] || [];
    activeDecos.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.style.opacity = '1';
    });
  }

  function setPhase(p) {
    if (p === 'idle') {
      startIdleRotation();
      return;
    }
    stopIdleRotation();
    if (monsterImg) monsterImg.src = PHASES[p];
    if (phaseBadge) phaseBadge.textContent = LABELS[p];
    if (monsterWrap) {
      monsterWrap.classList.remove('alert', 'eating', 'happy', 'idle-float');
      if (p === 'alert') monsterWrap.classList.add('alert');
      if (p === 'eat') monsterWrap.classList.add('eating');
      if (p === 'happy') monsterWrap.classList.add('happy');
    }
    // Hide all decorations during non-idle phases
    document.querySelectorAll('.idle-deco').forEach(function(d) { d.style.opacity = '0'; });
  }

  function spawnStars(x, y, count) {
    var container = monsterWrap || document.body;
    for (var i = 0; i < count; i++) {
      var star = document.createElement('span');
      star.className = 'flying-star';
      star.textContent = ['✦', '✧', '★', '⭐', '🌟'][Math.floor(Math.random() * 5)];
      star.style.left = (x || 50) + '%';
      star.style.top = (y || 30) + '%';
      var angle = Math.random() * Math.PI * 2;
      var dist = 30 + Math.random() * 60;
      star.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      star.style.setProperty('--ty', Math.sin(angle) * dist - 40 + 'px');
      star.style.animationDelay = (Math.random() * 0.3) + 's';
      container.appendChild(star);
      setTimeout(function(el) { el.remove(); }, 1500, star);
    }
  }

  function triggerEat(el) {
    clearT();
    setPhase('alert');
    // Phase 1: shake the card and spawn losing-stars from the review
    timers.push(setTimeout(function() {
      el.classList.add('shaking');
      spawnStars(30, 40, 8);
    }, 400));
    // Phase 2: card shrinks and flies toward monster
    timers.push(setTimeout(function() {
      el.classList.remove('shaking');
      el.classList.add('eating');
      setPhase('eat');
    }, 1000));
    // Phase 3: card gone, shatter into stars at monster position
    timers.push(setTimeout(function() {
      el.style.display = 'none';
      spawnStars(50, 50, 20);
      setPhase('happy');
    }, 2000));
    // Phase 4: back to idle
    timers.push(setTimeout(function() { setPhase('idle'); }, 4000));
  }

  // Form submission
  var form = document.getElementById('comment-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]').value || '匿名宇宙人';
      var rating = parseInt(form.querySelector('[name="rating"]').value) || 5;
      var text = form.querySelector('[name="comment"]').value;
      if (!text.trim()) return;
      var review = { name: name, rating: rating, text: text, date: new Date().toISOString(), id: Date.now() };
      saveReview(review);
      var el = renderReview(review);
      var list = document.getElementById('reviews-list');
      if (list) list.insertBefore(el, list.firstChild);
      if (rating <= 2) { triggerEat(el); }
      form.reset();
      resetStarRating();
    });
  }

  setPhase('idle');
  window._monsterSpawnStars = spawnStars;
}

/* --- localStorage Reviews --- */
var STORAGE_KEY = 'cosmic-reviews-v2';
function getDefaultReviews() {
  return [
    { id: 1, name: '宇宙旅人', rating: 5, text: '这个宇宙空间站太酷了！星空背景美到窒息。', date: '2026-05-29T10:00:00Z' },
    { id: 2, name: '星际探索者', rating: 5, text: '知行平台的项目展示很专业，期待更多功能！', date: '2026-05-29T11:00:00Z' },
    { id: 3, name: '暴躁外星人', rating: 1, text: '星星太多了，晃眼睛，建议减少。', date: '2026-05-29T12:00:00Z' },
    { id: 4, name: '星云爱好者', rating: 4, text: '整体设计很棒，如果再加点星云效果就更好了。', date: '2026-05-29T13:00:00Z' },
    { id: 5, name: '挑剔的黑洞', rating: 2, text: '加载有点慢，我这台老爷机快撑不住了。', date: '2026-05-29T14:00:00Z' }
  ];
}
function getReviews() {
  try { var s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : getDefaultReviews(); }
  catch(e) { return getDefaultReviews(); }
}
function saveReview(r) { var list = getReviews(); list.unshift(r); try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch(e) {} }
function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
function renderReview(r) {
  var d = document.createElement('div');
  d.className = 'review-item';
  d.dataset.id = r.id;
  d.innerHTML = '<div class="review-header"><span class="review-author">' + esc(r.name) + '</span><span class="review-stars">' + '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) + '</span></div><p class="review-text">' + esc(r.text) + '</p><div class="review-date">' + new Date(r.date).toLocaleString('zh-CN') + '</div>';
  return d;
}
function loadExistingReviews() {
  var list = document.getElementById('reviews-list');
  if (!list) return;
  getReviews().forEach(function(r) { list.appendChild(renderReview(r)); });
}

/* --- Init --- */
document.addEventListener('DOMContentLoaded', function() {
  initStarfield();
  initClickSparkle();
  initCustomCursor();
  initTypingAnimation();
  initScrollReveal();
  initNavScroll();
  initStarRating();
  initReviewMonster();
  loadExistingReviews();
});
