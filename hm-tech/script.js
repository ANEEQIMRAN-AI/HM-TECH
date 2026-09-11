/* ============================================================
   HM TECH — Site Interactions
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  (function preloader(){
    const el = document.getElementById('preloader');
    const fill = document.getElementById('preloaderFill');
    const pct = document.getElementById('preloaderPct');
    let n = 0;
    const timer = setInterval(() => {
      n += Math.random() * 18 + 6;
      if (n >= 100) {
        n = 100;
        clearInterval(timer);
        setTimeout(() => el.classList.add('hide'), 300);
      }
      fill.style.width = n + '%';
      pct.textContent = Math.round(n);
    }, 160);
  })();

  /* ---------- Cursor glow ---------- */
  (function cursorGlow(){
    const glow = document.getElementById('cursorGlow');
    if (!glow || matchMedia('(hover:none)').matches) return;
    window.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
    const hoverables = 'a, button, .bento-card, .work-card, .price-card, input, textarea, select';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverables)) glow.classList.add('hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverables)) glow.classList.remove('hover');
    });
  })();

  /* ---------- Scroll progress bar ---------- */
  (function scrollProgress(){
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;
    function update(){
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = scrolled + '%';
    }
    window.addEventListener('scroll', update, { passive:true });
    update();
  })();

  /* ---------- Hero title staged reveal ---------- */
  (function heroReveal(){
    const title = document.querySelector('.hero-title');
    if (!title) return;
    const words = title.textContent.trim().split(' ');
    title.innerHTML = words.map(w => `<span class="word"><span class="word-inner">${w}</span></span>`).join(' ');
    title.querySelectorAll('.word').forEach(w => { w.style.display='inline-block'; w.style.overflow='hidden'; });
    title.querySelectorAll('.word-inner').forEach(w => {
      w.style.display = 'inline-block';
      w.style.transform = 'translateY(115%)';
      w.style.transition = 'transform .8s cubic-bezier(.22,.9,.32,1)';
    });
    setTimeout(() => {
      title.querySelectorAll('.word-inner').forEach((w, i) => {
        setTimeout(() => { w.style.transform = 'translateY(0)'; }, i * 70);
      });
    }, 700);
  })();

  /* ---------- 3D tilt for cards ---------- */
  (function tilt(){
    if (matchMedia('(hover:none)').matches) return;
    const cards = document.querySelectorAll('.bento-card, .work-card, .price-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  })();

  /* ---------- Navbar scroll state + scroll-spy ---------- */
  (function navScroll(){
    const nav = document.getElementById('siteNav');
    const links = document.querySelectorAll('[data-nav]');
    const sections = Array.from(links).map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

    function onScroll(){
      nav.classList.toggle('scrolled', window.scrollY > 40);
      const backTop = document.getElementById('backTop');
      backTop.classList.toggle('show', window.scrollY > 600);

      let current = sections[0];
      const y = window.scrollY + 140;
      sections.forEach(s => { if (s.offsetTop <= y) current = s; });
      links.forEach(l => l.classList.toggle('active', current && l.getAttribute('href') === '#' + current.id));
    }
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  })();

  /* ---------- Mobile nav toggle ---------- */
  (function mobileNav(){
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.classList.toggle('active', open);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    }));
  })();

  /* ---------- Back to top ---------- */
  document.getElementById('backTop').addEventListener('click', () => {
    window.scrollTo({ top:0, behavior:'smooth' });
  });

  /* ---------- Reveal on scroll ---------- */
  (function reveal(){
    const items = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting){
          setTimeout(() => entry.target.classList.add('in'), i * 60);
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.15 });
    items.forEach(el => io.observe(el));
  })();

  /* ---------- Animated counters ---------- */
  (function counters(){
    const stats = document.querySelectorAll('.stat');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const numEl = el.querySelector('.stat-num');
        const isFloat = target % 1 !== 0;
        let start = null;
        const dur = 1400;
        function step(ts){
          if (!start) start = ts;
          const progress = Math.min((ts - start) / dur, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = target * eased;
          numEl.textContent = prefix + (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold:0.4 });
    stats.forEach(s => io.observe(s));
  })();

  /* ---------- Bento card cursor-glow tracking ---------- */
  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Hero circuit canvas ---------- */
  (function circuit(){
    const canvas = document.getElementById('circuitCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, nodes = [];
    const NODE_COUNT = 46;
    const MAX_DIST = 150;
    let mouse = { x:-9999, y:-9999 };

    function resize(){
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
      canvas.style.width = canvas.offsetWidth + 'px';
    }

    function init(){
      resize();
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.3 * devicePixelRatio,
        r: Math.random() * 1.6 + 1
      }));
    }

    function tick(){
      ctx.clearRect(0,0,w,h);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });
      for (let i=0;i<nodes.length;i++){
        for (let j=i+1;j<nodes.length;j++){
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x-b.x, a.y-b.y);
          if (d < MAX_DIST * devicePixelRatio){
            ctx.strokeStyle = `rgba(41,214,232,${(1 - d/(MAX_DIST*devicePixelRatio)) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
        const md = Math.hypot(n.x-mouse.x, n.y-mouse.y);
        if (md < 220 * devicePixelRatio){
          ctx.strokeStyle = `rgba(255,178,56,${(1 - md/(220*devicePixelRatio)) * 0.35})`;
          ctx.beginPath(); ctx.moveTo(n.x,n.y); ctx.lineTo(mouse.x,mouse.y); ctx.stroke();
        }
      }
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(94,164,255,0.75)';
        ctx.arc(n.x, n.y, n.r * devicePixelRatio, 0, Math.PI*2);
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }

    window.addEventListener('resize', () => { init(); });
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) * devicePixelRatio;
      mouse.y = (e.clientY - r.top) * devicePixelRatio;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    init();
    requestAnimationFrame(tick);
  })();

  /* ---------- Portfolio data + render ---------- */
  (function portfolio(){
    const projects = [
      { name:'SMEFLOW — Raw Materials & Procurement Manager', cat:'Logistics & Supply Chain', year:'2026', init:'SF',
        desc:'An end-to-end procurement tracker for SMEs covering stock levels, purchase orders, vendor spend, and low-stock alerts.' },
      { name:'Wander Hub AI — Intelligent Tourism Assistant', cat:'AI TravelTech', year:'2026', init:'WH',
        desc:'A travel companion using recommendation engines, multilingual NLP translation, and personalized itinerary generation.' },
      { name:'Digital Local Services Platform', cat:'Web Platform', year:'2025', init:'LS',
        desc:'A marketplace connecting customers with verified local professionals, with real-time booking and payments.' },
      { name:'HAULR — Haulage Booking & Logistics', cat:'Logistics Automation', year:'2026', init:'HL',
        desc:'A freight booking platform automating driver assignment, live route tracking, and admin approvals.' },
      { name:'AI Inventory Pro', cat:'AI & ML Systems', year:'2026', init:'IP',
        desc:'An enterprise inventory scanner and purchase-order tracker powered by vision models and analytics.' },
      { name:'Autonomous BOM Inventory Agent', cat:'AI Automation', year:'2026', init:'BA',
        desc:'A zero-touch agent that updates inventory databases and notifies teams directly from operational chat.' },
      { name:'High-Resolution Urdu OCR', cat:'Machine Learning', year:'2024', init:'OC',
        desc:'A custom OCR model trained to read complex handwritten Urdu script using PyTorch.' },
      { name:'Online Billing System', cat:'Web Engineering', year:'2026', init:'BS',
        desc:'A fast, edge-optimized invoicing and point-of-sale billing application.' },
      { name:'NexusMarket', cat:'Web Marketplace', year:'2025', init:'NM',
        desc:'A digital marketplace for trading in-game assets, currencies, and gift cards securely.' }
    ];
    const grad = [
      'linear-gradient(135deg,#1E3FE0,#29D6E8)',
      'linear-gradient(135deg,#29D6E8,#1832A8)',
      'linear-gradient(135deg,#3A2CE0,#29D6E8)',
      'linear-gradient(135deg,#0F1729,#2F6BFF)'
    ];
    const wrap = document.getElementById('workGrid');
    wrap.innerHTML = projects.map((p,i) => `
      <article class="work-card">
        <div class="work-thumb" style="background:${grad[i % grad.length]}">
          <div class="work-tags"><span class="work-cat">${p.cat}</span><span class="work-year">${p.year}</span></div>
          <span class="work-thumb-init">${p.init}</span>
          <div class="work-overlay"><span>View Case Study</span></div>
        </div>
        <div class="work-body">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <span class="work-link">View Case Study</span>
        </div>
      </article>
    `).join('');
  })();

  /* ---------- Pricing toggle ---------- */
  (function pricing(){
    const buttons = document.querySelectorAll('.toggle-btn');
    const cards = document.querySelectorAll('[data-mode-card]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.mode;
        cards.forEach(c => { c.hidden = c.dataset.modeCard !== mode; });
      });
    });
  })();

  /* ---------- Testimonial carousel ---------- */
  (function testimonials(){
    const track = document.getElementById('testiTrack');
    const cards = Array.from(track.children);
    const dotsWrap = document.getElementById('testiDots');
    let idx = 0, timer;

    cards.forEach((_, i) => {
      const d = document.createElement('span');
      if (i === 0) d.classList.add('active');
      d.addEventListener('click', () => go(i));
      dotsWrap.appendChild(d);
    });
    const dots = Array.from(dotsWrap.children);

    function go(i){
      cards[idx].classList.remove('active');
      dots[idx].classList.remove('active');
      idx = (i + cards.length) % cards.length;
      cards[idx].classList.add('active');
      dots[idx].classList.add('active');
      restart();
    }
    function restart(){
      clearInterval(timer);
      timer = setInterval(() => go(idx + 1), 6000);
    }
    document.getElementById('testiNext').addEventListener('click', () => go(idx + 1));
    document.getElementById('testiPrev').addEventListener('click', () => go(idx - 1));
    cards[0].classList.add('active');
    restart();
  })();

  /* ---------- FAQ accordion (dynamic height) ---------- */
  (function faq(){
    const items = document.querySelectorAll('.faq-item');
    function setHeight(item, open){
      const a = item.querySelector('.faq-a');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
    }
    items.forEach(item => {
      if (item.classList.contains('open')) setHeight(item, true);
      item.querySelector('.faq-q').addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach(i => { i.classList.remove('open'); setHeight(i, false); });
        if (!isOpen){ item.classList.add('open'); setHeight(item, true); }
      });
    });
    window.addEventListener('resize', () => {
      items.forEach(i => { if (i.classList.contains('open')) setHeight(i, true); });
    });
  })();

  /* ---------- Hero parallax ---------- */
  (function heroParallax(){
    const canvas = document.getElementById('circuitCanvas');
    const chips = document.querySelector('.hero-chips');
    if (!canvas) return;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight){
        canvas.style.transform = `translateY(${y * 0.15}px)`;
        if (chips) chips.style.transform = `translateY(${y * -0.08}px)`;
      }
    }, { passive:true });
  })();

  /* ---------- Contact form ---------- */
  (function contactForm(){
    const form = document.getElementById('contactForm');
    const btn = document.getElementById('submitBtn');
    const success = document.getElementById('formSuccess');

    function validate(){
      let ok = true;
      const name = document.getElementById('cName');
      const email = document.getElementById('cEmail');
      const brief = document.getElementById('cBrief');
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

      toggleError(name, name.value.trim().length > 1);
      toggleError(email, emailOk);
      toggleError(brief, brief.value.trim().length > 8);

      if (name.value.trim().length <= 1) ok = false;
      if (!emailOk) ok = false;
      if (brief.value.trim().length <= 8) ok = false;
      return ok;
    }
    function toggleError(field, isValid){
      field.closest('.form-row').classList.toggle('invalid', !isValid);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) return;
      btn.classList.add('loading');
      btn.disabled = true;
      success.classList.remove('show');
      setTimeout(() => {
        btn.classList.remove('loading');
        btn.disabled = false;
        success.classList.add('show');
        form.reset();
      }, 1200);
    });
  })();

});
