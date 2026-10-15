import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- smooth scroll (Lenis, lerp 0.1 like the reference) ---------- */
function setupLenis() {
  if (reduce) return null;
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add('lenis');
  // anchor links through Lenis
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')!;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.4 });
    });
  });
  return lenis;
}

/* ---------- fixed scene cross-fades ---------- */
const LIGHT_SCENES = new Set(['dawn', 'day', 'paper']);
let currentScene = 'hero';
function setScene(name: string) {
  if (name === currentScene) return;
  currentScene = name;
  document.querySelectorAll<HTMLElement>('.scene').forEach((el) => {
    const on = el.dataset.scene === name;
    gsap.to(el, { opacity: on ? 1 : 0, duration: 1.1, ease: 'power2.inOut', overwrite: true });
    const v = el.querySelector('video');
    if (v) {
      if (on) v.play().catch(() => {});
      else setTimeout(() => v.pause(), 1200);
    }
  });
  const light = LIGHT_SCENES.has(name);
  document.querySelector('[data-topnav]')?.classList.toggle('is-dark', light);
  document.querySelector('[data-rail]')?.classList.toggle('is-dark', light);
}

function sceneTriggers() {
  const map: Array<[string, string, string]> = [
    // [selector, scene when entering, start]
    ['.statement', 'night', 'top 55%'],
    ['.orb-scene', 'night', 'top 80%'],
    ['.chapter', 'dawn', 'top 70%'],
    ['.thesis', 'day', 'top 60%'],
    ['.paper-block', 'paper', 'top 70%'],
    ['.cta', 'paper', 'top 90%'],
  ];
  const order = ['hero', 'night', 'night', 'dawn', 'day', 'paper', 'paper'];
  map.forEach(([sel, scene, start], i) => {
    ScrollTrigger.create({
      trigger: sel,
      start,
      onEnter: () => setScene(scene),
      onLeaveBack: () => setScene(order[i]),
    });
  });
}

/* ---------- stars (four-point sprites, twinkle + slow drift) ---------- */
function stars() {
  const canvas = document.querySelector<HTMLCanvasElement>('.stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d')!;
  let w = 0, h = 0, dpr = Math.min(devicePixelRatio, 2);
  type Star = { x: number; y: number; r: number; p: number; s: number; big: boolean };
  let list: Star[] = [];
  const resize = () => {
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    list = Array.from({ length: Math.round((innerWidth * innerHeight) / 9000) }, () => {
      const big = Math.random() < 0.08;
      return { x: Math.random() * w, y: Math.random() * h, r: (big ? 6 + Math.random() * 10 : 0.6 + Math.random() * 1.4) * dpr, p: Math.random() * Math.PI * 2, s: 0.4 + Math.random() * 1.2, big };
    });
  };
  const sprite = (x: number, y: number, r: number, a: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = a;
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, 'rgba(255,236,200,1)');
    g.addColorStop(0.3, 'rgba(255,220,160,0.5)');
    g.addColorStop(1, 'rgba(255,220,160,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,245,220,0.95)';
    ctx.beginPath();
    const k = r * 0.18;
    ctx.moveTo(0, -r); ctx.lineTo(k, -k); ctx.lineTo(r, 0); ctx.lineTo(k, k); ctx.lineTo(0, r); ctx.lineTo(-k, k); ctx.lineTo(-r, 0); ctx.lineTo(-k, -k); ctx.closePath(); ctx.fill();
    ctx.restore();
  };
  let t = 0;
  const draw = () => {
    if ((canvas.parentElement as HTMLElement).style.opacity === '0') { requestAnimationFrame(draw); return; }
    t += 0.016;
    ctx.clearRect(0, 0, w, h);
    for (const s of list) {
      const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s + s.p));
      const yy = (s.y + t * 6 * dpr * s.s) % h;
      if (s.big) sprite(s.x, yy, s.r * (0.85 + 0.15 * Math.sin(t * 2 * s.s + s.p)), a);
      else { ctx.globalAlpha = a; ctx.fillStyle = '#fff6e6'; ctx.beginPath(); ctx.arc(s.x, yy, s.r, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  };
  addEventListener('resize', resize);
  resize();
  if (!reduce) draw(); else { t = 1; draw(); }
}

/* ---------- text reveals ---------- */
function reveals() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const lines = el.querySelectorAll('span');
    lines.forEach((l) => { l.innerHTML = `<em style="display:block;font-style:normal;transform:translateY(110%)">${l.innerHTML}</em>`; });
    const ems = el.querySelectorAll('em');
    const tl = gsap.timeline({ paused: true }).to(ems, { y: 0, duration: 1.1, stagger: 0.09, ease: 'power4.out' });
    if (el.closest('.hero')) tl.play(0.1);
    else ScrollTrigger.create({ trigger: el, start: 'top 85%', onEnter: () => tl.play(), onLeaveBack: () => tl.reverse() });
  });
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } });
  });
}

/* ---------- orb: rotate, then swell to fill the viewport ---------- */
function orb() {
  const scene = document.querySelector<HTMLElement>('.orb-scene');
  const orbEl = scene?.querySelector<HTMLElement>('[data-orb]');
  const cards = scene?.querySelector<HTMLElement>('.orb__cards');
  const copy = scene?.querySelector<HTMLElement>('.orb-scene__copy');
  if (!scene || !orbEl || !cards || !copy) return;
  const maxScale = Math.max(innerWidth, innerHeight) / 420 * 1.6;
  gsap.timeline({ scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
    .fromTo(orbEl, { scale: 0.18, yPercent: -50, xPercent: -50 }, { scale: 1, duration: 0.35, ease: 'power2.out' }, 0)
    .fromTo(cards, { rotateY: -40, rotateX: 8 }, { rotateY: 320, rotateX: -6, duration: 1, ease: 'none' }, 0)
    .to(orbEl, { scale: maxScale, duration: 0.5, ease: 'power2.in' }, 0.5)
    .to(copy, { opacity: 0, y: -30, duration: 0.2 }, 0.55)
    .to(orbEl, { opacity: 0, duration: 0.12 }, 0.88);
  // gentle idle spin on top of scroll (adds life while pinned)
  if (!reduce) gsap.to(cards, { rotateZ: 6, duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
}

/* ---------- chapter title parallax ---------- */
function chapter() {
  document.querySelectorAll<HTMLElement>('.chapter').forEach((sec) => {
    const inner = sec.querySelector('.chapter__inner');
    gsap.fromTo(inner, { y: 0 }, { y: -80, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: true } });
  });
}

/* ---------- area chart: reveal clip scrubbed by scroll ---------- */
function areaChart() {
  const fig = document.querySelector<HTMLElement>('[data-chart="area"]');
  const rect = fig?.querySelector<SVGRectElement>('.reveal-rect');
  if (!fig || !rect) return;
  const full = 1400 - 60 - 200; // innerW from component
  gsap.fromTo(rect, { attr: { width: 0 } }, {
    attr: { width: full }, ease: 'none',
    scrollTrigger: {
      trigger: fig, start: 'top 75%', end: 'top 15%', scrub: 0.4,
      onUpdate: (st) => fig.classList.toggle('is-complete', st.progress > 0.96),
    },
  });
}

/* ---------- tabs ---------- */
function tabs() {
  document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((card) => {
    const buttons = card.querySelectorAll<HTMLButtonElement>('[data-tab]');
    const panels = card.querySelectorAll<HTMLElement>('[data-panel]');
    const show = (key: string) => {
      buttons.forEach((b) => { const on = b.dataset.tab === key; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', String(on)); });
      panels.forEach((p) => { const on = p.dataset.panel === key; p.hidden = !on; p.classList.toggle('is-active', on); if (on) { p.classList.remove('is-drawn'); requestAnimationFrame(() => p.classList.add('is-drawn')); } });
    };
    buttons.forEach((b) => b.addEventListener('click', () => show(b.dataset.tab!)));
    ScrollTrigger.create({ trigger: card, start: 'top 70%', once: true, onEnter: () => card.querySelector('.panel.is-active')?.classList.add('is-drawn') });
  });
}

/* ---------- chrome: top nav + chapter rail ---------- */
function chrome() {
  const top = document.querySelector('[data-topnav]');
  const rail = document.querySelector('[data-rail]');
  ScrollTrigger.create({ trigger: '.hero', start: '40% top', onEnter: () => { top?.classList.add('is-visible'); rail?.classList.add('is-visible'); }, onLeaveBack: () => { top?.classList.remove('is-visible'); rail?.classList.remove('is-visible'); } });
  document.querySelectorAll<HTMLElement>('[data-chapter-start]').forEach((sec) => {
    const id = sec.dataset.chapterStart!;
    const set = () => rail?.querySelectorAll('a').forEach((a) => a.classList.toggle('is-active', (a as HTMLElement).dataset.chapter === id));
    ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onEnter: set, onEnterBack: set });
  });
}

export function init() {
  setupLenis();
  stars();
  reveals();
  orb();
  chapter();
  areaChart();
  tabs();
  chrome();
  sceneTriggers();
  addEventListener('load', () => ScrollTrigger.refresh());
}
