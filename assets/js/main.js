/* Ecostalk Fibre — vanilla JS. Everything degrades gracefully if this file fails. */
(function () {
  'use strict';
  var C = window.SITE_CONFIG || {};
  var doc = document.documentElement;
  doc.classList.add('js');

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  var hasEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(C.businessEmail || '');

  /* ---------- Mobile navigation ---------- */
  var toggle = $('.nav-toggle'), nav = $('#site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    window.matchMedia('(min-width:1061px)').addEventListener('change', function () { setOpen(false); });
  }

  /* ---------- Config-driven contact details ---------- */
  $$('[data-config="email"]').forEach(function (el) {
    if (hasEmail) { el.textContent = C.businessEmail; el.setAttribute('href', 'mailto:' + C.businessEmail); }
    else { el.removeAttribute('href'); el.textContent = 'Email address to be announced'; }
  });
  $$('[data-config="phone"]').forEach(function (el) {
    var p = C.businessTelephone || '';
    if (p) { el.textContent = p; el.setAttribute('href', 'tel:' + p.replace(/[^+\d]/g, '')); }
    else { el.removeAttribute('href'); el.textContent = 'Telephone to be announced'; }
  });
  $$('[data-config-row]').forEach(function (row) { /* hide rows with no value */
    var k = row.getAttribute('data-config-row');
    if (k === 'phone' && !C.businessTelephone) row.hidden = true;
  });
  $$('[data-config="maps"]').forEach(function (el) { if (C.address && C.address.mapsUrl) el.setAttribute('href', C.address.mapsUrl); });
  $$('[data-social]').forEach(function (el) {
    var u = C.social && C.social[el.getAttribute('data-social')];
    if (u) el.setAttribute('href', u); else { var li = el.closest('li'); (li || el).hidden = true; }
  });
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Product enquiry buttons ---------- */
  $$('[data-enquire]').forEach(function (a) {
    var name = a.getAttribute('data-enquire');
    if (hasEmail) {
      var subject = 'Enquiry: ' + name + ' — ' + (C.companyName || '');
      var body = 'Hello,\n\nI would like to enquire about: ' + name + '.\n\nPlease share details.\n\nName:\nCompany:\nCountry / City:\nPhone:\n';
      a.setAttribute('href', 'mailto:' + C.businessEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body));
    } else {
      a.setAttribute('href', 'contact.html?product=' + encodeURIComponent(name) + '#enquiry');
    }
  });

  /* ---------- Enquiry form (mailto — no backend, nothing is stored) ---------- */
  var form = $('#enquiry-form');
  if (form) {
    var status = $('#form-status');
    var params = new URLSearchParams(location.search);
    var pre = params.get('product');
    var sel = $('#f-topic');
    if (pre && sel) { var found = false; $$('option', sel).forEach(function (o) { if (o.value === pre) { o.selected = true; found = true; } });
      if (!found) { var o = document.createElement('option'); o.textContent = pre; o.value = pre; o.selected = true; sel.appendChild(o); } }
    var note = $('#mailto-note');
    if (note) note.hidden = true;
    var noEmail = $('#no-email-note');
    if (noEmail) noEmail.hidden = hasEmail;

    var validate = function () {
      var ok = true, first = null;
      $$('.field', form).forEach(function (f) {
        var inp = $('input,textarea,select', f); if (!inp) return;
        var v = (inp.value || '').trim(), bad = false;
        if (inp.required && !v) bad = true;
        if (inp.type === 'email' && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) bad = true;
        f.classList.toggle('invalid', bad);
        inp.setAttribute('aria-invalid', bad ? 'true' : 'false');
        if (bad) { ok = false; if (!first) first = inp; }
      });
      if (first) first.focus();
      return ok;
    };
    var sendRemote = function (subject, body) {
      var btn = $('button[type=submit]', form), label = btn.innerHTML;
      btn.disabled = true; btn.textContent = 'Sending…';
      status.textContent = 'Sending your enquiry…';
      var d = function (id) { return ($('#' + id).value || '').trim(); };
      var fallback = function () {
        status.innerHTML = '';
        var p = document.createElement('p'); p.style.margin = '0';
        p.textContent = 'Sorry, we could not send your enquiry from the website. Nothing has been sent. Please email ' + (hasEmail ? C.businessEmail : 'us') + (C.businessTelephone ? ' or call ' + C.businessTelephone : '') + ' with the details below.';
        var ta = document.createElement('textarea'); ta.readOnly = true; ta.value = 'Subject: ' + subject + '\n\n' + body;
        status.appendChild(p); status.appendChild(ta);
        if (hasEmail) { var a = document.createElement('a'); a.className = 'btn btn--ghost'; a.style.marginTop = '.8rem'; a.textContent = 'Open email app'; a.href = 'mailto:' + C.businessEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); status.appendChild(a); }
      };
      fetch(C.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: d('f-name'), company: d('f-company'), email: d('f-email'), phone: d('f-phone'), topic: d('f-topic'), message: d('f-message'),
          _subject: subject, _template: 'table', _captcha: 'false' }) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (x) {
          if (x.ok && (x.j.success === true || x.j.success === 'true')) {
            status.textContent = 'Thank you. Your enquiry has been sent to our team and we will get back to you.';
            form.reset();
          } else fallback();
        })
        .catch(fallback)
        .then(function () { btn.disabled = false; btn.innerHTML = label; });
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if ($('.hp input', form) && $('.hp input', form).value) return;
      if (!validate()) return;
      var d = function (id) { return ($('#' + id).value || '').trim(); };
      var subject = 'Business enquiry: ' + d('f-topic') + ' — ' + d('f-name');
      var body = 'Name: ' + d('f-name') + '\nCompany: ' + d('f-company') + '\nEmail: ' + d('f-email') + '\nPhone: ' + d('f-phone') +
        '\nTopic: ' + d('f-topic') + '\n\nMessage:\n' + d('f-message') + '\n';
      status.classList.add('show');
      if (C.formEndpoint) { sendRemote(subject, body); return; }
      if (hasEmail) {
        status.innerHTML = '';
        var p = document.createElement('p'); p.style.margin = '0';
        p.textContent = 'Your email application should now open with a drafted message. Nothing has been sent yet — please press Send in your email app. If nothing opened, your device may have no email app configured: copy the text below and email it to ' + C.businessEmail + '.';
        var ta = document.createElement('textarea'); ta.readOnly = true; ta.value = 'To: ' + C.businessEmail + '\nSubject: ' + subject + '\n\n' + body;
        status.appendChild(p); status.appendChild(ta);
        window.location.href = 'mailto:' + C.businessEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      } else {
        status.innerHTML = '';
        var p2 = document.createElement('p'); p2.style.margin = '0';
        p2.textContent = 'The company email address has not been configured yet, so this enquiry cannot be drafted automatically. Nothing has been sent. Please copy the text below and send it once the business email is published.';
        var ta2 = document.createElement('textarea'); ta2.readOnly = true; ta2.value = 'Subject: ' + subject + '\n\n' + body;
        status.appendChild(p2); status.appendChild(ta2);
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rev = $$('.reveal');
  if (!rev.length) { /* nothing */ }
  else if (reduce || !('IntersectionObserver' in window)) rev.forEach(function (el) { el.classList.add('in'); });
  else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    rev.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Gallery lightbox ---------- */
  var items = $$('[data-lightbox]');
  var dlg = $('#lightbox');
  if (items.length && dlg && typeof dlg.showModal === 'function') {
    var img = $('img', dlg), cap = $('p', dlg), idx = 0, opener = null;
    var show = function (i) {
      idx = (i + items.length) % items.length;
      var b = items[idx];
      img.src = b.getAttribute('data-full'); img.alt = b.getAttribute('data-alt') || '';
      cap.textContent = b.getAttribute('data-caption') || '';
    };
    items.forEach(function (b, i) {
      b.addEventListener('click', function () { opener = b; show(i); dlg.showModal(); $('.lb-close', dlg).focus(); });
    });
    $('.lb-close', dlg).addEventListener('click', function () { dlg.close(); });
    $('.lb-prev', dlg).addEventListener('click', function () { show(idx - 1); });
    $('.lb-next', dlg).addEventListener('click', function () { show(idx + 1); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('lightbox-inner')) dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    dlg.addEventListener('close', function () { if (opener) opener.focus(); });
  }
})();
