/* Reservation flow (compliance: no sale, no price, no promised return).
 * A slim CTA bar is docked at the bottom of every page. Clicking its "Join early
 * access" button — or the nav "Register" button, or any [data-register]/[data-reserve]
 * CTA — opens the FULL form as a full-screen overlay. Close via the small top-right X,
 * a backdrop click, or Escape. Submit shows a thank-you state.
 * No backend here — a real deployment posts to the lead store with the ad-set UTM. */
(function () {
  var overlay = null;

  var FORM = ''
    + '<div class="overlay__panel" data-reserve-body role="document">'
    +   '<button class="overlay__close" type="button" aria-label="Close">✕</button>'
    +   '<p class="eyebrow">Early access</p>'
    +   '<h3 class="overlay__title">Reserve your place</h3>'
    +   '<div class="notice"><b>Midrata isn’t available in your area yet.</b> Membership requires securities registration we’re completing now. Join the early-access list and we’ll notify you the moment it opens. Nothing is charged today, and no account is created.</div>'
    +   '<form class="reserve">'
    +     '<label>Full name</label><input required placeholder="Your name">'
    +     '<label>Email</label><input type="email" required placeholder="you@email.com">'
    +     '<label>Phone (optional)</label><input placeholder="(555) 000-0000">'
    +     '<label>How likely are you to join when it opens?</label>'
    +     '<select><option>Very likely</option><option>Somewhat likely</option><option>Just exploring</option></select>'
    +     '<label>If you did join, what annual amount might you consider?</label>'
    +     '<select><option>Under $5,000</option><option>$5,000–$10,000</option><option>$10,000–$25,000</option><option>$25,000–$50,000</option><option>$50,000 or more</option></select>'
    +     '<button class="ghost" type="submit">Join early access</button>'
    +     '<p class="finelegal">By joining you agree to be contacted by Midrata about early access. This is not an offer to sell or a solicitation to buy a security, and no return is promised. Final wording is subject to legal review.</p>'
    +   '</form>'
    + '</div>';

  function build() {
    overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'reserve-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Reserve your place');
    overlay.innerHTML = FORM;
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    wireClose();
    document.body.appendChild(overlay);
    return overlay;
  }
  function ov() { return overlay || build(); }
  function wireClose() {
    var x = overlay.querySelector('.overlay__close');
    if (x) x.addEventListener('click', close);
  }
  function open() {
    var o = ov();
    o.classList.add('on');
    document.body.classList.add('modal-open');
    var f = o.querySelector('input, select'); if (f) setTimeout(function () { f.focus(); }, 40);
  }
  function close() {
    if (overlay) { overlay.classList.remove('on'); document.body.classList.remove('modal-open'); }
  }

  function pad() { var d = document.querySelector('.dock'); if (d) document.body.style.paddingBottom = (d.offsetHeight + 6) + 'px'; }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-register],[data-reserve]');
    if (t) { e.preventDefault(); open(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  document.addEventListener('submit', function (e) {
    var f = e.target.closest('.reserve'); if (!f) return;
    e.preventDefault();
    var body = f.closest('[data-reserve-body]') || f.parentNode;
    body.innerHTML = '<button class="overlay__close" type="button" aria-label="Close">✕</button>'
      + '<p class="eyebrow">You’re on the list</p>'
      + '<h3 class="overlay__title">Thank you</h3>'
      + '<p>We’ll notify you the moment early access opens. Nothing was charged, and no account was created.</p>';
    var x = body.querySelector('.overlay__close'); if (x) x.addEventListener('click', close);
  });

  window.addEventListener('load', pad);
  window.addEventListener('resize', pad);
  if (document.readyState !== 'loading') pad(); else document.addEventListener('DOMContentLoaded', pad);
})();
