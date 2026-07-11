import $ from 'jquery';
import { MOMENT_IDX_STORAGE_KEY } from '../lib/constants';

// Count-up animation
function initCountUp() {
  const countUp = (el: HTMLElement) => {
    const $el = $(el);
    const t = +($el.attr('data-count') ?? 0);
    const suf = $el.attr('data-suffix') ?? '';
    let s = 0;
    const step = Math.max(1, Math.round(t / 24));
    const id = setInterval(() => {
      s += step;
      if (s >= t) {
        s = t;
        clearInterval(id);
      }
      $el.text(s + suf);
    }, 34);
  };
  const cio = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          countUp(e.target as HTMLElement);
          cio.unobserve(e.target);
        }
      }),
    { threshold: 0.6 },
  );
  $('[data-count]').each(function () {
    cio.observe(this);
  });
}

// About — "a moment in my day" Spotlight + Filmstrip
function initMomentCarousel() {
  const $stage = $('#momentStage');
  if (!$stage.length) return;
  const $frames = $stage.find('.spot-frame');
  const N = $frames.length;
  const $strip = $('#momentStrip');
  const $idx = $('#stIx');
  const $ttl = $('#stTtl');
  const $cap = $stage.find('.spot-cap');
  const DUR = 4400;
  const MOMENTS: { t: string; src: string }[] = JSON.parse(
    $stage.attr('data-moments') ?? '[]',
  );
  let idx = 0,
    paused = false,
    elapsed = 0,
    lastT = performance.now();
  try {
    const s = +(localStorage.getItem(MOMENT_IDX_STORAGE_KEY) ?? '');
    if (!isNaN(s) && s >= 0 && s < N) idx = s;
  } catch {}
  const strip = MOMENTS.map((mo, i) =>
    $('<button>', {
      class: 'fs',
      type: 'button',
      title: mo.t,
      'aria-label': mo.t,
    })
      .html(
        '<img src="' +
          mo.src +
          '" alt="' +
          mo.t +
          '" /><span class="fs-prog"></span>',
      )
      .on('click', () => jump(i))
      .appendTo($strip),
  );
  $frames.each(function (i) {
    $(this)
      .css('cursor', 'pointer')
      .on('click', () => jump(i));
  });
  function jump(i: number) {
    idx = ((i % N) + N) % N;
    elapsed = 0;
    strip.forEach(($b) => $b.find('.fs-prog').css('width', '0%'));
    paint();
  }
  function paint() {
    $frames.each(function (i) {
      let rel = i - idx;
      if (rel > N / 2) rel -= N;
      if (rel < -N / 2) rel += N;
      const a = Math.abs(rel),
        sgn = Math.sign(rel);
      let x: number,
        z: number,
        ry: number,
        sc: number,
        op: number,
        fl: string,
        zi: number;
      if (a === 0) {
        x = 0;
        z = 0;
        ry = 0;
        sc = 1;
        op = 1;
        fl = 'none';
        zi = 4;
      } else if (a === 1) {
        x = sgn * 42;
        z = -205;
        ry = -sgn * 26;
        sc = 0.86;
        op = 0.58;
        fl = 'grayscale(.8) brightness(.55)';
        zi = 3;
      } else {
        x = sgn * 58;
        z = -360;
        ry = -sgn * 30;
        sc = 0.74;
        op = 0.14;
        fl = 'grayscale(1) brightness(.35)';
        zi = 2;
      }
      $(this)
        .css({
          transform: `translate(-50%,-50%) translateX(${x}%) translateZ(${z}px) rotateY(${ry}deg) scale(${sc})`,
          opacity: String(op),
          zIndex: String(zi),
          pointerEvents: a > 1 ? 'none' : 'auto',
        })
        .toggleClass('on', a === 0);
      $(this).find('.kb').css('filter', fl);
    });
    strip.forEach(($b, i) => $b.toggleClass('on', i === idx));
    $idx.html('0' + (idx + 1) + '<b> / 0' + N + '</b>');
    if ($cap.length) {
      $cap.removeClass('lit');
      void $cap[0].offsetWidth;
      requestAnimationFrame(() => $cap.addClass('lit'));
    }
    $ttl.text(MOMENTS[idx].t);
    try {
      localStorage.setItem(MOMENT_IDX_STORAGE_KEY, String(idx));
    } catch {}
  }
  function tick(now: number) {
    const dt = now - lastT;
    lastT = now;
    if (!paused) {
      elapsed += dt;
      const fr = Math.min(elapsed / DUR, 1);
      const $fs = strip[idx];
      if ($fs) $fs.find('.fs-prog').css('width', fr * 100 + '%');
      if (elapsed >= DUR) {
        elapsed = 0;
        strip.forEach(($b) => $b.find('.fs-prog').css('width', '0%'));
        idx = (idx + 1) % N;
        paint();
      }
    }
    requestAnimationFrame(tick);
  }
  let hov = false;
  $stage.on('mouseenter', () => {
    paused = true;
    hov = true;
  });
  $stage.on('mouseleave', () => {
    paused = false;
    hov = false;
  });
  $(document).on('keydown', (e) => {
    if (!hov) return;
    if (e.key === 'ArrowLeft') jump(idx - 1);
    else if (e.key === 'ArrowRight') jump(idx + 1);
  });
  paint();
  requestAnimationFrame(tick);
}

initCountUp();
initMomentCarousel();
