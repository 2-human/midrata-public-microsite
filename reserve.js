/* Sticky bottom reservation dock (compliance: no sale, no price, no promised return).
 * The form is always visible at the bottom. Clicking "Register" (or any
 * [data-register]/[data-reserve] CTA) or focusing a field enters SPOTLIGHT mode:
 * the page dims behind a backdrop and the form is lifted above it. Clicking the
 * backdrop, pressing Escape, or submitting exits. Submit shows a thank-you state.
 * No backend here — a real deployment posts to the lead store with the ad-set UTM. */
(function () {
  function dock() { return document.querySelector('.dock'); }

  // backdrop (created once; sits below the dock, above everything else)
  var dim = null;
  function backdrop() {
    if (dim) return dim;
    dim = document.createElement('div');
    dim.className = 'dim';
    dim.addEventListener('click', deactivate);
    document.body.appendChild(dim);
    return dim;
  }

  function pad() { var d = dock(); if (d) document.body.style.paddingBottom = (d.offsetHeight + 6) + 'px'; }

  function activate() {
    var d = dock(); if (!d) return;
    backdrop().classList.add('on');
    d.classList.add('spot');
  }
  function deactivate() {
    var d = dock();
    if (dim) dim.classList.remove('on');
    if (d) d.classList.remove('spot');
    var a = document.activeElement;
    if (a && d && d.contains(a) && a.blur) a.blur();
  }
  function focusDock() {
    var d = dock(); if (!d) return;
    activate();
    var i = d.querySelector('input, select'); if (i) i.focus({ preventScroll: true });
  }

  // CTA buttons / links that should open the form
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-register],[data-reserve]');
    if (t) { e.preventDefault(); focusDock(); }
  });

  // focusing any dock field enters spotlight
  document.addEventListener('focusin', function (e) {
    var d = dock(); if (d && d.contains(e.target)) activate();
  });
  // leaving the dock (focus moved elsewhere) exits spotlight
  document.addEventListener('focusout', function (e) {
    var d = dock(); if (!d) return;
    setTimeout(function () { if (!d.contains(document.activeElement)) deactivate(); }, 0);
  });
  // Escape exits
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') deactivate(); });

  document.addEventListener('submit', function (e) {
    var f = e.target.closest('.reserve'); if (!f) return;
    e.preventDefault();
    var body = f.closest('[data-reserve-body]') || f.parentNode;
    body.innerHTML = '<div class="dock__msg"><b>You’re on the list</b>'
      + '<span class="fine">Thank you. We’ll notify you the moment early access opens. Nothing was charged, and no account was created.</span></div>';
    deactivate();
    pad();
  });

  window.addEventListener('load', pad);
  window.addEventListener('resize', pad);
  if (document.readyState !== 'loading') pad(); else document.addEventListener('DOMContentLoaded', pad);
})();
