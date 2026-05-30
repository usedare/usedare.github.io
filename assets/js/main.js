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

/* --- Layered Review Monster with GSAP Star Shatter --- */
function initReviewMonster() {
  var monsterWrap = document.getElementById('monster-display');
  var stage = document.getElementById('monster-stage');
  var rig = document.getElementById('monster-rig');
  var phaseBadge = document.getElementById('phase-badge');
  if (!monsterWrap || !stage || !rig) return;

  var gsapLib = window.gsap;
  var tail = stage.querySelector('[data-layer="tail"]');
  var backLegs = stage.querySelector('[data-layer="back-legs"]');
  var body = stage.querySelector('[data-layer="body"]');
  var frontPaws = stage.querySelector('[data-layer="front-paws"]');
  var orb = document.getElementById('bad-comment-orb');
  var swallow = document.getElementById('swallow-effect');
  var shardBox = document.getElementById('monster-shards');
  var bubbles = Array.prototype.slice.call(stage.querySelectorAll('.bubble'));
  var twinkles = Array.prototype.slice.call(stage.querySelectorAll('.twinkle'));
  var headNodes = Array.prototype.slice.call(stage.querySelectorAll('[data-head]'));
  var heads = {};
  headNodes.forEach(function(node) { heads[node.dataset.head] = node; });

  var idleTl = null;
  var eatTl = null;
  var shardChars = ['✦', '✧', '★', '✶', '⋆'];

  if (!gsapLib) {
    window.eatBadComment = function(targetEl) {
      if (targetEl) targetEl.classList.add('eating');
      if (phaseBadge) phaseBadge.textContent = 'GSAP 未加载';
    };
    return;
  }

  function setPhase(label, phaseClass) {
    if (phaseBadge) phaseBadge.textContent = label;
    monsterWrap.classList.remove('alert', 'eating', 'happy');
    if (phaseClass) monsterWrap.classList.add(phaseClass);
  }

  // 五个头部是同一画布的透明 PNG，只切换透明度即可保持精确对齐。
  function setHead(name) {
    headNodes.forEach(function(node) {
      var active = node.dataset.head === name;
      node.classList.toggle('is-active', active);
      gsapLib.set(node, { autoAlpha: active ? 1 : 0 });
    });
  }

  function killIdleTimeline() {
    if (idleTl) {
      idleTl.kill();
      idleTl = null;
    }
  }

  function killEatTimeline() {
    if (eatTl) {
      eatTl.kill();
      eatTl = null;
    }
  }

  function clearShards() {
    if (!shardBox) return;
    Array.prototype.slice.call(shardBox.children).forEach(function(node) {
      gsapLib.killTweensOf(node);
      node.remove();
    });
  }

  // 把所有可动部件拉回中性姿态，避免连续触发时继承上一轮形变。
  function resetLayerPose() {
    gsapLib.killTweensOf([rig, tail, backLegs, body, frontPaws, orb, swallow].concat(headNodes, bubbles, twinkles));
    gsapLib.set([rig, tail, backLegs, body, frontPaws].concat(headNodes), {
      x: 0,
      y: 0,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      rotation: 0
    });
    gsapLib.set([orb, swallow], { autoAlpha: 0, x: 0, y: 0, scale: 1, rotation: 0 });
    gsapLib.set(bubbles, { autoAlpha: 0, x: 0, y: 0, scale: 0.7 });
    gsapLib.set(twinkles, { autoAlpha: 0, scale: 0.2, rotation: 0 });
  }

  // 待机是多个独立部件的呼吸式循环：整体漂浮、尾巴轻摆、前爪晃动、气泡和星光随机错峰出现。
  function buildIdleTimeline() {
    killIdleTimeline();
    setPhase('睡眠巡航', null);
    setHead('sleep');

    idleTl = gsapLib.timeline({ defaults: { ease: 'sine.inOut' } });
    idleTl.to(rig, { y: -12, rotation: -1.3, duration: 2.3, repeat: -1, yoyo: true }, 0);
    idleTl.to(body, { scale: 1.018, duration: 2.2, repeat: -1, yoyo: true }, 0.1);
    idleTl.to(tail, { rotation: 7, x: 3, duration: 1.45, repeat: -1, yoyo: true }, 0);
    idleTl.to(frontPaws, { y: -5, rotation: -4, duration: 1.7, repeat: -1, yoyo: true }, 0.22);
    idleTl.to(backLegs, { y: 3, rotation: 1.6, duration: 2.1, repeat: -1, yoyo: true }, 0.08);
    idleTl.to(heads.sleep, { scale: 1.016, y: 2, duration: 2.35, repeat: -1, yoyo: true }, 0.12);

    bubbles.forEach(function(bubble, index) {
      idleTl.fromTo(bubble,
        { autoAlpha: 0, y: 0, x: 0, scale: 0.58 },
        {
          autoAlpha: 0,
          y: -72 - index * 8,
          x: (index % 2 === 0 ? -16 : 18),
          scale: 1.15,
          duration: 2.8,
          repeat: -1,
          ease: 'power1.out',
          keyframes: [
            { autoAlpha: 0, duration: 0.08 },
            { autoAlpha: 0.72, duration: 0.55 },
            { autoAlpha: 0, duration: 0.7 }
          ]
        },
        index * 0.68
      );
    });

    twinkles.forEach(function(star, index) {
      idleTl.to(star, {
        autoAlpha: 0.95,
        scale: 1 + (index % 3) * 0.16,
        rotation: index % 2 === 0 ? 45 : -45,
        duration: 0.62,
        repeat: -1,
        yoyo: true,
        repeatDelay: 1.15 + (index % 4) * 0.22,
        ease: 'power1.inOut'
      }, index * 0.27);
    });

    return idleTl;
  }

  function spawnShardStars(count, happyBurst) {
    if (!shardBox) return;
    for (var i = 0; i < count; i++) {
      var shard = document.createElement('span');
      var angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.65;
      var distance = (happyBurst ? 62 : 44) + Math.random() * (happyBurst ? 90 : 82);
      var tx = Math.cos(angle) * distance;
      var ty = Math.sin(angle) * distance - (happyBurst ? 20 : 36);
      shard.className = 'monster-shard';
      shard.textContent = shardChars[Math.floor(Math.random() * shardChars.length)];
      shardBox.appendChild(shard);
      gsapLib.fromTo(shard,
        { autoAlpha: 1, x: 0, y: 0, scale: 0.18, rotation: 0 },
        {
          autoAlpha: 0,
          x: tx,
          y: ty,
          scale: 0.8 + Math.random() * 0.9,
          rotation: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 240),
          duration: 0.85 + Math.random() * 0.55,
          ease: 'power3.out',
          onComplete: function(node) { node.remove(); },
          onCompleteParams: [shard]
        }
      );
    }
  }

  function restoreIdleState() {
    eatTl = null;
    clearShards();
    resetLayerPose();
    buildIdleTimeline();
  }

  function buildEatTimeline(targetEl) {
    killEatTimeline();
    killIdleTimeline();
    clearShards();
    resetLayerPose();
    setHead('normal');
    setPhase('发现差评', 'alert');

    eatTl = gsapLib.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: restoreIdleState
    });

    // 如果外部传入评论卡片，先让卡片颤抖并淡化，再由差评球接手飞向小龙。
    if (targetEl && targetEl.nodeType === 1) {
      eatTl.add(function() { targetEl.classList.add('shaking'); }, 0);
      eatTl.to(targetEl, { x: 7, rotation: 1.2, duration: 0.08, repeat: 5, yoyo: true, ease: 'power1.inOut' }, 0.04);
      eatTl.to(targetEl, { opacity: 0.36, scale: 0.96, filter: 'blur(1px)', duration: 0.28, ease: 'power2.out' }, 0.56);
      eatTl.add(function() { targetEl.classList.remove('shaking'); }, 0.78);
    }

    eatTl.to(rig, { x: 8, y: -7, rotation: 4, duration: 0.36, ease: 'back.out(1.9)' }, 0.18);
    eatTl.to(tail, { rotation: -13, x: -5, duration: 0.34, ease: 'power3.out' }, 0.2);
    eatTl.to(frontPaws, { y: -7, rotation: 5, duration: 0.34, ease: 'power2.out' }, 0.2);
    eatTl.add(function() { setHead('alert'); }, 0.36);

    // 差评球从右侧飞来，分两段形成抛物线：先向上飘，再快速坠入口中。
    eatTl.set(orb, { autoAlpha: 1, x: 230, y: -62, scale: 0.22, rotation: -35 }, 0.62);
    eatTl.to(orb, { x: 128, y: -116, scale: 0.34, rotation: 75, duration: 0.48, ease: 'power2.out' }, 0.62);
    eatTl.add(function() { setPhase('捕获中', 'eating'); setHead('mouth'); }, 1.02);
    eatTl.to(orb, { x: 30, y: -22, scale: 0.18, rotation: 235, duration: 0.56, ease: 'power3.in' }, 1.03);
    eatTl.to(rig, { x: 17, y: -2, rotation: 6, scale: 1.035, duration: 0.36, ease: 'power3.out' }, 1.03);
    eatTl.to(frontPaws, { x: 18, y: -20, rotation: -9, scale: 1.06, duration: 0.34, ease: 'back.out(2.4)' }, 1.04);

    // 碰到嘴巴的瞬间：隐藏光球、点亮吞噬特效，并把差评粉碎成星屑。
    eatTl.add(function() {
      if (targetEl && targetEl.nodeType === 1) targetEl.style.display = 'none';
      gsapLib.set(orb, { autoAlpha: 0 });
      spawnShardStars(26, false);
    }, 1.58);
    eatTl.fromTo(swallow,
      { autoAlpha: 0, scale: 0.42, rotation: -12 },
      { autoAlpha: 0.96, scale: 1.14, rotation: 18, duration: 0.34, ease: 'expo.out' },
      1.58
    );
    eatTl.to(swallow, { autoAlpha: 0, scale: 1.38, rotation: 34, duration: 0.46, ease: 'power2.in' }, 1.88);

    // 咀嚼不是换图硬切，而是头、身子、爪子做几次短促弹性压缩。
    eatTl.to(heads.mouth, { y: 5, scaleX: 1.04, scaleY: 0.94, duration: 0.13, repeat: 5, yoyo: true, ease: 'power1.inOut' }, 1.72);
    eatTl.to(rig, { x: 5, y: 4, rotation: -2, duration: 0.13, repeat: 5, yoyo: true, ease: 'sine.inOut' }, 1.72);
    eatTl.to(frontPaws, { x: 4, y: -6, rotation: 8, duration: 0.13, repeat: 5, yoyo: true, ease: 'sine.inOut' }, 1.72);

    eatTl.add(function() {
      setPhase('吞噬完成', 'happy');
      setHead('happy');
      spawnShardStars(18, true);
    }, 2.64);
    eatTl.to(rig, { x: 0, y: -10, rotation: 0, scale: 1.06, duration: 0.32, ease: 'back.out(2)' }, 2.66);
    eatTl.to(tail, { x: 0, rotation: 9, duration: 0.34, ease: 'power2.out' }, 2.68);
    eatTl.to(frontPaws, { x: 0, y: -3, rotation: 0, scale: 1, duration: 0.42, ease: 'power2.out' }, 2.76);
    eatTl.add(function() { setPhase('满足待机', 'happy'); }, 3.05);
    eatTl.to(rig, { y: -6, scale: 1.025, duration: 1.18, ease: 'sine.inOut' }, 3.05);
    eatTl.to([tail, frontPaws], { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.55, ease: 'power2.inOut' }, 3.72);
    eatTl.add(function() { setPhase('睡眠巡航', null); setHead('sleep'); }, 4.22);

    return eatTl.restart();
  }

  function resetMonsterState() {
    killEatTimeline();
    killIdleTimeline();
    clearShards();
    resetLayerPose();
    buildIdleTimeline();
  }

  window.eatBadComment = function(targetEl) {
    return buildEatTimeline(targetEl);
  };
  window._monsterSpawnStars = spawnShardStars;

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
      if (rating <= 2) { window.eatBadComment(el); }
      form.reset();
      resetStarRating();
    });
  }

  resetMonsterState();
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
