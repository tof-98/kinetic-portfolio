import $ from 'jquery';
import { THEME_STORAGE_KEY } from '../lib/constants';

function initBurger() {
  const $burger = $('#burger');
  const $sheet = $('#navSheet');
  if (!$burger.length || !$sheet.length) return;
  const set = (o: boolean) => {
    $burger.toggleClass('open', o);
    $sheet.toggleClass('open', o);
    $burger.attr('aria-expanded', o ? 'true' : 'false');
    $sheet.attr('aria-hidden', o ? 'false' : 'true');
    $('body').css('overflow', o ? 'hidden' : '');
  };
  $burger.on('click', () => set(!$sheet.hasClass('open')));
  $sheet.find('a').on('click', () => set(false));
  $(document).on('keydown', (e) => {
    if (e.key === 'Escape' && $sheet.hasClass('open')) set(false);
  });
}

function initThemeToggle() {
  const $toggle = $('#themeToggle');
  if (!$toggle.length) return;
  const apply = (light: boolean) => {
    document.documentElement.dataset.theme = light ? 'light' : '';
    localStorage.setItem(THEME_STORAGE_KEY, light ? 'light' : 'dark');
    $toggle.attr(
      'aria-label',
      light ? 'Switch to dark mode' : 'Switch to light mode',
    );
  };
  $toggle.on('click', () => {
    apply(document.documentElement.dataset.theme !== 'light');
  });
}

initBurger();
initThemeToggle();
