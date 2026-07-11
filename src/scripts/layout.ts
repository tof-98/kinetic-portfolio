import $ from 'jquery';

// Bar scroll + active nav link
function initScrollSpy() {
  const $bar = $('#bar');
  if (!$bar.length) return;
  const $links = $('.bar nav a');
  const ids = ['about', 'work', 'stack', 'experience', 'contact'];
  const onScroll = () => {
    $bar.toggleClass('stuck', window.scrollY > 40);
    const y = window.scrollY + window.innerHeight * 0.35;
    let cur = '';
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= y) cur = id;
    });
    $links.each(function () {
      $(this).toggleClass('on', $(this).attr('href') === '#' + cur);
    });
  };
  $(window).on('scroll', onScroll);
  onScroll();
}

// Reveal observer
function initReveal() {
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          $(e.target).addClass('in');
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 },
  );
  $('.rv:not(.in)').each(function () {
    io.observe(this);
  });
}

initScrollSpy();
initReveal();
