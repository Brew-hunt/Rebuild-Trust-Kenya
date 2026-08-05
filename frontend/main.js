/**
 * REBUILD TRUST KENYA — Main Application Logic
 * Modules:
 * 1. Mobile Navigation
 * 2. Radial Growth Visualization (SVG Network)
 * 3. GSAP & ScrollTrigger Animations
 * 4. Dynamic Auth & User Greeting
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     1. MOBILE NAVIGATION
     ============================================================ */
  (function initMobileNav() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('nav.links');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  })();

  /* ============================================================
     2. GROWTH NETWORK VISUALIZATION (RADIAL NODE MAP)
     ============================================================ */
  (function initGrowthViz() {
    var svg = document.getElementById('growth-svg');
    if (!svg) return;

    var W = 460, H = 460, cx = W / 2, cy = H / 2;

    var rings = [
      { year: 1, radius: 78,  count: 4,  labels: ['Nairobi', 'Bungoma', 'Kisumu', 'Nakuru'] },
      { year: 2, radius: 138, count: 6,  labels: [] },
      { year: 3, radius: 198, count: 10, labels: [] }
    ];

    var svgNS = 'http://www.w3.org/2000/svg';
    function el(tag, attrs) {
      var e = document.createElementNS(svgNS, tag);
      for (var k in attrs) { e.setAttribute(k, attrs[k]); }
      return e;
    }

    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

    var nodesByYear = { 1: [], 2: [], 3: [] };

    // Draw connecting lines first
    rings.forEach(function (ring, ringIndex) {
      var startAngle = ringIndex % 2 === 0 ? -90 : -90 + (360 / ring.count) / 2;
      for (var i = 0; i < ring.count; i++) {
        var angle = (startAngle + (360 / ring.count) * i) * (Math.PI / 180);
        var x = cx + ring.radius * Math.cos(angle);
        var y = cy + ring.radius * Math.sin(angle);

        var link = el('line', {
          class: 'link', x1: cx, y1: cy, x2: x, y2: y,
          'data-year': ring.year
        });
        svg.appendChild(link);
        nodesByYear[ring.year].push(link);
      }
    });

    // Draw node circles & text labels
    rings.forEach(function (ring, ringIndex) {
      var startAngle = ringIndex % 2 === 0 ? -90 : -90 + (360 / ring.count) / 2;
      for (var i = 0; i < ring.count; i++) {
        var angle = (startAngle + (360 / ring.count) * i) * (Math.PI / 180);
        var x = cx + ring.radius * Math.cos(angle);
        var y = cy + ring.radius * Math.sin(angle);

        var node = el('circle', {
          class: 'node', cx: x, cy: y, r: ring.year === 1 ? 7 : 5,
          fill: ring.year === 1 ? 'var(--rust)' : (ring.year === 2 ? 'var(--ochre)' : 'var(--sage)'),
          'data-year': ring.year
        });
        
        // Interactive node highlight
        node.addEventListener('mouseenter', function() {
          this.setAttribute('r', parseInt(this.getAttribute('r')) + 3);
        });
        node.addEventListener('mouseleave', function() {
          this.setAttribute('r', this.getAttribute('data-year') == 1 ? 7 : 5);
        });

        svg.appendChild(node);
        nodesByYear[ring.year].push(node);

        var labelText = ring.labels[i];
        if (labelText) {
          var label = el('text', {
            class: 'node-label', x: x, y: y - 12,
            'text-anchor': 'middle', 'data-year': ring.year
          });
          label.textContent = labelText;
          svg.appendChild(label);
          nodesByYear[ring.year].push(label);
        }
      }
    });

    // Draw Central RTK Hub
    var hub = el('circle', { cx: cx, cy: cy, r: 20, fill: 'var(--ink)' });
    svg.appendChild(hub);
    var hubLabel = el('text', {
      x: cx, y: cy + 4, 'text-anchor': 'middle',
      fill: 'var(--bg)', 'font-family': 'var(--font-mono)', 'font-size': '9'
    });
    hubLabel.textContent = 'RTK';
    svg.appendChild(hubLabel);

    function showYear(year) {
      [1, 2, 3].forEach(function (y) {
        var visible = y <= year;
        nodesByYear[y].forEach(function (n) {
          n.style.opacity = visible ? '1' : '0.08';
        });
      });
    }

    showYear(1);

    var tabs = document.querySelectorAll('.growth-tab');
    var figuresPanels = document.querySelectorAll('[data-year-figures]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { 
          t.classList.remove('active'); 
          t.setAttribute('aria-selected', 'false'); 
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        var year = parseInt(tab.getAttribute('data-year'), 10);
        showYear(year);
        figuresPanels.forEach(function (p) {
          p.hidden = parseInt(p.getAttribute('data-year-figures'), 10) !== year;
        });
      });
    });
  })();

  /* ============================================================
     3. GSAP & SCROLLTRIGGER ANIMATIONS
     ============================================================ */
  (function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Text Entrance
    var heroTexts = document.querySelectorAll('[data-gsap="hero-text"] > *');
    if (heroTexts.length) {
      gsap.from(heroTexts, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
      });
    }

    // Generic Fade Up on Scroll
    var fadeElements = document.querySelectorAll('[data-gsap="fade-up"]');
    fadeElements.forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out'
      });
    });

    // Pillar Stagger Animations
    var pillarContainers = document.querySelectorAll('.pillars');
    pillarContainers.forEach(function (container) {
      var pillars = container.querySelectorAll('[data-gsap="pillar"]');
      if (pillars.length) {
        gsap.from(pillars, {
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.18,
          ease: 'power2.out'
        });
      }
    });
  })();


});
/* ============================================================
   REBUILD TRUST KENYA — HOMEPAGE ANIMATIONS
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  if (typeof gsap === 'undefined') return;

  // 1. Kinetic Hero Split Text
  var splitLines = document.querySelectorAll('.gsap-line span');
  if (splitLines.length > 0) {
    gsap.fromTo(splitLines, 
      { y: '100%', opacity: 0 },
      { 
        y: '0%', 
        opacity: 1, 
        duration: 1.0, 
        stagger: 0.12, 
        ease: 'power3.out',
        delay: 0.1
      }
    );
  }

  // 2. Dialogue Motif Pulse & Float Effect
  var pulseNodes = document.querySelectorAll('.pulse-node');
  if (pulseNodes.length > 0) {
    gsap.to(pulseNodes, {
      y: 'random(-6, 6)',
      x: 'random(-6, 6)',
      duration: 'random(2.5, 4)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.easeInOut',
      stagger: 0.2
    });
  }

  // 3. Stat Counters Roll-up Trigger
  var stats = document.querySelectorAll('.stat .n');
  if (stats.length > 0 && typeof ScrollTrigger !== 'undefined') {
    stats.forEach(function(stat) {
      var target = parseFloat(stat.getAttribute('data-target'));
      if (!target) return;

      gsap.to(stat, {
        innerText: target,
        duration: 2.0,
        ease: 'power2.out',
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: '.stat-row',
          start: 'top 85%'
        }
      });
    });
  }

  // 4. Staggered Pillars Elevation
  var pillars = document.querySelectorAll('[data-gsap="pillar"]');
  if (pillars.length > 0 && typeof ScrollTrigger !== 'undefined') {
    gsap.fromTo(pillars,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.pillars',
          start: 'top 80%'
        }
      }
    );
  }

  // 5. Magnetic CTA Buttons
  var magnetBtns = document.querySelectorAll('.magnet-btn');
  magnetBtns.forEach(function(btn) {
    btn.addEventListener('mousemove', function(e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', function() {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
});