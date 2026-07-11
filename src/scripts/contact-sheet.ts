import $ from 'jquery';
import { CONTACT_ENDPOINT } from '../lib/constants';

function initContactSheet() {
  const $back = $('#helloSheet');
  if (!$back.length) return;
  const back = $back[0];
  const $form = $('#helloForm');
  const form = $form[0] as HTMLFormElement;
  const $feedback = $('#helloFeedback');
  const $sendBtn = $('#sendBtn');
  const $msg = $('#cMsg');
  const msg = $msg[0] as HTMLTextAreaElement;

  const SEND_LABEL = 'Send message <span class="ar">↗</span>';
  const SENT_LABEL = 'Sent <span class="ar">✓</span>';

  const $name = $('#cName');
  const open = () => {
    $back.addClass('open').attr('aria-hidden', 'false');
    $('body').css('overflow', 'hidden');
    requestAnimationFrame(() => $name.trigger('focus'));
  };
  const close = () => {
    $back.removeClass('open').attr('aria-hidden', 'true');
    $('body').css('overflow', '');
  };

  $('[data-hello]').on('click', (e) => {
    e.preventDefault();
    open();
  });
  $back.on('click', (e) => {
    if (e.target === back) close();
  });
  $back.find('[data-close]').on('click', () => close());
  $(document).on('keydown', (e) => {
    if (e.key === 'Escape' && $back.hasClass('open')) close();
  });

  // live clock
  const cfmt = () =>
    new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Vienna',
    }).format(new Date());
  const ctick = () => $back.find('[data-clock]').text(cfmt());
  ctick();
  setInterval(ctick, 1000);

  // auto-grow message textarea
  const resizeMsg = () => {
    $msg.css('height', 'auto');
    $msg.css('height', `${msg.scrollHeight}px`);
  };
  $msg.on('input', resizeMsg);
  resizeMsg();

  const resetForm = () => {
    form.reset();
    $feedback.css('display', 'none').html('');
    $sendBtn.prop('disabled', false).removeClass('is-sent').html(SEND_LABEL);
    resizeMsg();
  };

  $form.on('submit', async (e) => {
    e.preventDefault();
    $sendBtn.prop('disabled', true).text('Sending…');
    $feedback.css('display', 'none');

    const val = (name: string) =>
      String($form.find(`[name="${name}"]`).val() ?? '');
    const payload = {
      name: val('name').trim(),
      email: val('email').trim(),
      message: val('message').trim(),
      _honeypot: val('_honeypot'),
    };

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        $sendBtn.addClass('is-sent').html(SENT_LABEL);
      } else {
        $feedback
          .text(data.error ?? 'Something went wrong. Try again.')
          .css('display', 'block');
        $sendBtn.prop('disabled', false).html(SEND_LABEL);
      }
    } catch {
      $feedback
        .text('Network error. Please try again.')
        .css('display', 'block');
      $sendBtn.prop('disabled', false).html(SEND_LABEL);
    }
  });

  $back.on('transitionend', (e) => {
    if (e.target === back && !$back.hasClass('open')) resetForm();
  });
}

initContactSheet();
