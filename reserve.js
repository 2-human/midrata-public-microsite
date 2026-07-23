/* Sticky bottom reservation dock (compliance: no sale, no price, no promised return).
 * The form is always visible at the bottom. The nav "Register" button (and any
 * [data-register]/[data-reserve] CTA) focuses it. Submit shows a thank-you state.
 * No backend here — a real deployment posts to the lead store with the ad-set UTM. */
(function () {
  function dock() { return document.querySelector('.dock'); }
  function pad() { var d = dock(); if (d) document.body.style.paddingBottom = (d.offsetHeight + 6) + 'px'; }
  function focusDock() {
    var d = dock(); if (!d) return;
    var i = d.querySelector('input, select'); if (i) i.focus({ preventScroll: true });
    if (d.animate) d.animate(
      [{ boxShadow: '0 -6px 24px rgba(0,0,0,.28), 0 0 0 3px rgba(140,161,122,.7) inset' },
       { boxShadow: '0 -6px 24px rgba(0,0,0,.28)' }],
      { duration: 1000, easing: 'ease-out' });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-register],[data-reserve]');
    if (t) { e.preventDefault(); focusDock(); }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target.closest('.reserve'); if (!f) return;
    e.preventDefault();
    var body = f.closest('[data-reserve-body]') || f.parentNode;
    body.innerHTML = '<div class="dock__msg"><b>You’re on the list</b>'
      + '<span class="fine">Thank you. We’ll notify you the moment early access opens. Nothing was charged, and no account was created.</span></div>';
    pad();
  });
  window.addEventListener('load', pad);
  window.addEventListener('resize', pad);
  if (document.readyState !== 'loading') pad(); else document.addEventListener('DOMContentLoaded', pad);
})();
