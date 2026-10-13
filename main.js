// Bernie's — interacciones. Sin dependencias.
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktop = () => matchMedia('(min-width: 960px)').matches;

// ——— El titular "se sirve" cuando la fuente está lista ———
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() =>
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-ready')))
);

// ——— Cabecera ———
const header = $('[data-top]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 24);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ——— Menú móvil ———
const menu = $('[data-menu]');
const openBtn = $('[data-menu-open]');
const closeMenu = (focusBack = true) => {
  menu.hidden = true;
  openBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  if (focusBack) openBtn.focus();
};
openBtn.addEventListener('click', () => {
  menu.hidden = false;
  openBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  $('a', menu).focus();
});
$('[data-menu-close]').addEventListener('click', () => closeMenu());
$$('a', menu).forEach((a) => a.addEventListener('click', () => closeMenu(false)));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) closeMenu(); });

// ——— Revelados al hacer scroll ———
const revealables = [
  '.vitrina__head', '.filters', '.builder', '.gofre__type', '.gofre__photos', '.steps li', '.extras > *',
  '.pizarra__head', '.board__group', '.casa__copy', '.casa__photo', '.quote', '.visita__head', '.visita__grid > *',
];
const reveal = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('is-in');
    reveal.unobserve(en.target);
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
if (!reduce) {
  revealables.forEach((sel) => $$(sel).forEach((el, i) => {
    el.dataset.reveal = '';
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
    reveal.observe(el);
  }));
}

// ——— Neón de "La casa" ———
const neon = $('[data-neon]');
new IntersectionObserver(([en], obs) => {
  if (en.isIntersecting) { neon.classList.add('is-lit'); obs.disconnect(); }
}, { threshold: 0.5 }).observe(neon);

// ——— La vitrina: filtros ———
const flavorBtns = $$('.flavor');
$$('[data-filter]').forEach((chip) => chip.addEventListener('click', () => {
  const f = chip.dataset.filter;
  $$('[data-filter]').forEach((c) => {
    const on = c === chip;
    c.classList.toggle('is-on', on);
    c.setAttribute('aria-pressed', String(on));
  });
  flavorBtns.forEach((b) => {
    const match = f === 'todos' || b.dataset.tags.split(' ').includes(f);
    b.classList.toggle('is-dim', !match);
    b.disabled = !match;
  });
}));

// ——— La vitrina: combinación ———
// w: ancho de la bola (unidades del viewBox 300×380) · base: dónde apoya la primera bola
const FORMATS = {
  cucurucho: { label: 'Cucurucho', w: 150, base: 166 },
  tarrina: { label: 'Tarrina', w: 170, base: 262 },
  waffle: { label: 'Bubble waffle', w: 160, base: 268 },
};
const FLAVORS = Object.fromEntries(flavorBtns.map((b) => [b.dataset.id, {
  name: $('.flavor__name', b).textContent.replace(/\s+/g, ' ').trim(),
  img: `assets/img/scoop-${b.dataset.id}-480.webp`,
  thumb: `assets/img/scoop-${b.dataset.id}-240.webp`,
  ar: +b.dataset.ar,
}]));
const state = { format: 'cucurucho', picks: [] };

const stage = $('[data-stage]');
const scoops = $$('.scoop', stage);
const summary = $('[data-summary]');
const share = $('[data-share]');
const desc = $('[data-stage-desc]');
const tray = $('[data-tray]');
const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const listado = (names) => names.length < 2 ? names[0]
  : `${names[0]}${names.some((n) => / y /.test(n)) ? ' + ' : ' y '}${lower(names[1])}`;

function drop(g) {
  g.classList.remove('is-on');
  void g.getBoundingClientRect(); // reinicia la caída
  g.classList.add('is-on');
}

function render(changed) {
  const fmt = FORMATS[state.format];
  $$('.vessel', stage).forEach((v) => v.toggleAttribute('hidden', v.dataset.vessel !== state.format));
  let apoyo = fmt.base;                                   // la bola de arriba se hunde un 38 % en la de abajo
  scoops.forEach((g, i) => {
    const id = state.picks[i];
    if (!id) { g.classList.remove('is-on'); return; }
    const w = fmt.w * (i ? 0.94 : 1), h = w / FLAVORS[id].ar, y = apoyo - h;
    const img = $('image', g);
    img.setAttribute('href', FLAVORS[id].img);
    img.setAttribute('x', 150 - w / 2); img.setAttribute('y', y);
    img.setAttribute('width', w); img.setAttribute('height', h);
    apoyo = y + h * 0.38;
    if (changed === id || changed === 'format') drop(g); else g.classList.add('is-on');
  });
  stage.classList.toggle('has-scoops', state.picks.length > 0);

  flavorBtns.forEach((b) => {
    const idx = state.picks.indexOf(b.dataset.id);
    b.setAttribute('aria-pressed', String(idx > -1));
    $('.flavor__scoop', b).dataset.order = idx > -1 ? idx + 1 : '';
  });

  const names = state.picks.map((id) => FLAVORS[id].name);
  summary.textContent = names.length
    ? `${fmt.label} de ${lower(listado(names))}`
    : `${fmt.label} · elige hasta dos sabores`;
  desc.textContent = names.length
    ? `${fmt.label} con ${names.length === 1 ? 'una bola' : 'dos bolas'}: ${listado(names)}.`
    : `${fmt.label} vacío esperando sabores.`;

  if (names.length) {
    const url = location.href.split('#')[0];
    const txt = `Me pido esto en Bernie's: ${lower(fmt.label)} de ${lower(listado(names))}. C/ Marqués de Campo 51, Dénia. ${url}`;
    share.href = `https://wa.me/?text=${encodeURIComponent(txt)}`;
    share.removeAttribute('aria-disabled');
    share.removeAttribute('tabindex');
  } else {
    share.href = '#';
    share.setAttribute('aria-disabled', 'true');
    share.setAttribute('tabindex', '-1');
  }

  $('[data-tray-dots]').innerHTML = state.picks.map((id) => `<img src="${FLAVORS[id].thumb}" alt="" width="34" height="34">`).join('');
  $('[data-tray-txt]').textContent = names.length ? `${fmt.label}: ${listado(names)}` : 'Tu combinación';
  updateFloating();
}

flavorBtns.forEach((b) => b.addEventListener('click', () => {
  const id = b.dataset.id;
  const i = state.picks.indexOf(id);
  if (i > -1) state.picks.splice(i, 1);
  else {
    if (state.picks.length === 2) state.picks.shift();
    state.picks.push(id);
  }
  render(i > -1 ? null : id);
}));

$$('[data-format]').forEach((btn) => btn.addEventListener('click', () => {
  state.format = btn.dataset.format;
  $$('[data-format]').forEach((x) => {
    const on = x === btn;
    x.classList.toggle('is-on', on);
    x.setAttribute('aria-checked', String(on));
  });
  render('format');
}));

$('[data-clear]').addEventListener('click', () => { state.picks = []; render(); });

// ——— Elementos flotantes en móvil: "Cómo llegar" y la bandeja de la combinación ———
const floatCta = $('[data-float]');
const seen = { hero: true, vitrina: false, builder: false, visita: false };
const watch = (el, key, opts) => new IntersectionObserver(([en]) => { seen[key] = en.isIntersecting; updateFloating(); }, opts).observe(el);
watch($('.hero'), 'hero', { threshold: 0.15 });
watch($('#vitrina'), 'vitrina', { threshold: 0 });
watch($('.builder__card'), 'builder', { threshold: 0.35 });
watch($('#visita'), 'visita', { threshold: 0.05 });

function updateFloating() {
  if (isDesktop()) return;
  const showTray = seen.vitrina && !seen.builder && state.picks.length > 0;
  tray.hidden = false;
  tray.classList.toggle('is-visible', showTray);
  tray.toggleAttribute('inert', !showTray);
  const showCta = !seen.hero && !seen.visita && !showTray && !(seen.vitrina && seen.builder);
  floatCta.classList.toggle('is-visible', showCta);
  floatCta.toggleAttribute('inert', !showCta);
}

render();
