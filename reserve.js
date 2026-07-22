/* Fake-door reservation reveal (compliance: no sale, no price, no promised return).
 * Clicking a [data-reserve] CTA reveals the "not available yet, join the list" block
 * and scrolls to it. The form submit shows a thank-you state. No backend here — a real
 * deployment posts to the demand-test lead store with the ad-set UTM already on the URL. */
(function () {
  function reveal() {
    var r = document.getElementById('reserve');
    if (!r) return;
    r.classList.add('on');
    r.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var f = r.querySelector('input'); if (f) setTimeout(function(){ f.focus(); }, 400);
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-reserve]');
    if (t) { e.preventDefault(); reveal(); }
  });
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('.reserve');
    if (!form) return;
    e.preventDefault();
    var body = form.closest('[data-reserve-body]') || form.parentNode;
    body.innerHTML = '<p class="eyebrow">You’re on the list</p>'
      + '<h3>Thank you. We’ll be in touch.</h3>'
      + '<p style="max-width:44ch">We’ll notify you the moment early access opens in your area. '
      + 'Nothing was charged, and no account was created.</p>';
  });
})();
