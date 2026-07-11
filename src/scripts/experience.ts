import $ from 'jquery';

type C = { el: HTMLElement; y: number; x: number };
type Phase =
  | { type: 'pause'; node: C; y: number; dur: number }
  | { type: 'travel'; fromY: number; toY: number; dur: number }
  | { type: 'hold'; dur: number };

function initExperienceTimeline() {
  const $body = $('#experience .gitlog .body');
  if (!$body.length) return;
  const body = $body[0];
  const $nodes = $body.find('.commit .node');
  if (!$nodes.length) return;
  const nodes = $nodes.toArray() as HTMLElement[];

  const $trail = $('<span>', { class: 'tl-trail' }).appendTo($body);
  const $pulse = $('<span>', { class: 'tl-pulse' }).appendTo($body);

  const SEG_TRAVEL = 2150,
    PAUSE_MS = 300,
    HOLD_MS = 1100;

  let centers: C[] = [];
  let phases: Phase[] = [];
  let totalDur = 0;

  function measure() {
    const b = body.getBoundingClientRect();
    centers = nodes.map((n) => {
      const r = n.getBoundingClientRect();
      return {
        el: n,
        y: r.top - b.top + r.height / 2,
        x: r.left - b.left + r.width / 2,
      };
    });
    $pulse.css('left', centers[0].x + 'px');
    $trail.css('left', centers[0].x + 'px');

    const rev = [...centers].reverse(); // bottom node → top node
    const ps: Phase[] = [];
    for (let i = 0; i < rev.length; i++) {
      ps.push({ type: 'pause', node: rev[i], y: rev[i].y, dur: PAUSE_MS });
      if (i < rev.length - 1)
        ps.push({
          type: 'travel',
          fromY: rev[i].y,
          toY: rev[i + 1].y,
          dur: SEG_TRAVEL,
        });
    }
    ps.push({ type: 'hold', dur: HOLD_MS });
    phases = ps;
    totalDur = ps.reduce((s, p) => s + p.dur, 0);
  }

  const A = () => {
    const n = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--A'),
    );
    return n > 0 ? n : 1;
  };
  const reset = () => $nodes.removeClass('lit');

  let raf: number | null = null,
    t0: number | null = null,
    prevE = Infinity;

  function loop(ts: number) {
    if (t0 == null) {
      t0 = ts;
      measure();
    }
    const a = A();
    const scaled = totalDur / a;
    const e = (ts - t0) % scaled;
    if (e < prevE) reset();
    prevE = e;

    let acc = 0;
    for (const ph of phases) {
      const dur = ph.dur / a;
      if (e < acc + dur) {
        const p = (e - acc) / dur;
        if (ph.type === 'pause') {
          $(ph.node.el).addClass('lit');
          $pulse.css({ top: ph.y + 'px', opacity: '1' });
          $trail.css({ top: ph.y + 'px', opacity: '0.85' });
        } else if (ph.type === 'travel') {
          const pe = 0.5 - 0.5 * Math.cos(Math.PI * p);
          const y = ph.fromY + (ph.toY - ph.fromY) * pe;
          $pulse.css({ top: y + 'px', opacity: '1' });
          $trail.css({ top: y + 'px', opacity: '0.85' });
        } else {
          centers.forEach((c) => $(c.el).addClass('lit'));
          const fade = p > 0.8 ? 1 - (p - 0.8) / 0.2 : 1;
          $pulse.css('opacity', String(fade));
          $trail.css('opacity', String(fade * 0.85));
        }
        break;
      }
      acc += dur;
    }

    raf = requestAnimationFrame(loop);
  }

  $(window).on('resize', () => {
    if (raf) measure();
  });
  const vio = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          if (!raf) {
            t0 = null;
            prevE = Infinity;
            raf = requestAnimationFrame(loop);
          }
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
      }),
    { threshold: 0.12 },
  );
  vio.observe(document.getElementById('experience')!);
}

initExperienceTimeline();
