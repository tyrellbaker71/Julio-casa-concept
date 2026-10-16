/* Julio's Casa — main.js (no dependencies) */
(function () {
  'use strict';

  /* Mobile navigation */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', function () { setOpen(false); });
  }

  /* Photos: hide or restyle any that are not in /images yet */
  var photos = document.querySelectorAll('.photo');
  var mark = function (img) { var f = img.closest('.photo'); if (f) f.classList.add('is-missing'); };
  photos.forEach(function (fig) {
    var img = fig.querySelector('img');
    if (!img) return;
    img.addEventListener('error', function () { mark(img); updateGallery(); });
    if (img.complete && img.naturalWidth === 0) mark(img);
    /* lazy images never report errors until scrolled to, so probe each file once (it is then cached) */
    var probe = new Image();
    probe.onerror = function () { mark(img); updateGallery(); };
    probe.src = img.getAttribute('src');
  });
  function updateGallery() {
    var gallery = document.getElementById('gallery');
    if (!gallery) return;
    var shown = gallery.querySelectorAll('.photo:not(.is-missing)').length;
    gallery.hidden = shown === 0;
    document.querySelectorAll('[data-gallery-link]').forEach(function (li) { li.hidden = shown === 0; });
  }
  updateGallery();

  /* Menu category index highlights the section being read */
  var links = document.querySelectorAll('.menu-index a');
  if (links.length && 'IntersectionObserver' in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = byId[en.target.id];
        if (a) {
          a.setAttribute('aria-current', 'true');
          var box = a.closest('ul');
          if (box && box.scrollWidth > box.clientWidth) {
            box.scrollTo({ left: a.offsetLeft - 24, behavior: 'auto' });
          }
        }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    document.querySelectorAll('.menu-cat').forEach(function (s) { obs.observe(s); });
  }
})();
