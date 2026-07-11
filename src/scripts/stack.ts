import $ from 'jquery';

// Stack lane reveal
function initStackReveal() {
  const $lanes = $('#stackGrid .dp-lane');
  if (!$lanes.length) return;
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            $(e.target).addClass('in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.2 },
    );
    $lanes.each(function () {
      io.observe(this);
    });
  } else {
    $lanes.addClass('in');
  }
}

initStackReveal();
