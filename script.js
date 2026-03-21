/* =========================================
   TERME DI EQUI — script.js  v5
   Refactor completo: ARIA, no-hero flash fix,
   keyboard nav, form validation migliorata
   ========================================= */

// ── IIFE: header no-hero applicato PRIMA del paint ──────────────────
// Evita il "flash" di header trasparente sulle pagine senza hero image.
// Eseguito immediatamente, prima di DOMContentLoaded.
(function () {
  var header = document.querySelector('.site-header.header-no-hero');
  if (header) header.classList.add('scrolled');
})();

document.addEventListener('DOMContentLoaded', function () {

  // ── 1. STICKY HEADER ────────────────────────────────────────────
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 60 || header.classList.contains('header-no-hero')) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // controllo immediato al caricamento
  }

  // ── 2. MOBILE NAV ────────────────────────────────────────────────
  var burger    = document.querySelector('.nav__burger');
  var mobileNav = document.querySelector('.nav__mobile');

  if (burger && mobileNav) {
    // Stato iniziale ARIA
    burger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');

    function openMenu() {
      burger.classList.add('open');
      mobileNav.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      mobileNav.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Focus al primo link del menu
      var firstLink = mobileNav.querySelector('a');
      if (firstLink) firstLink.focus();
    }

    function closeMenu() {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', function () {
      burger.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Chiude su click link
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Chiude con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMenu();
        burger.focus();
      }
    });

    // Chiude cliccando fuori dal menu
    mobileNav.addEventListener('click', function (e) {
      if (e.target === mobileNav) closeMenu();
    });
  }

  // ── 3. INTERSECTION OBSERVER (AOS fallback) ──────────────────────
  // Se AOS non è caricato, usa IntersectionObserver nativo.
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing:   'ease-out-cubic',
      once:     true,
      offset:   80,
    });
  } else {
    var aosEls = document.querySelectorAll('[data-aos]');
    if (aosEls.length && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var delay = parseInt(e.target.dataset.aosDelay || 0, 10);
            setTimeout(function () {
              e.target.classList.add('aos-animate');
            }, delay);
            observer.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      aosEls.forEach(function (el) { observer.observe(el); });
    }
  }

  // ── 4. ACCORDION (con ARIA corretti) ────────────────────────────
  document.querySelectorAll('.accordion__trigger').forEach(function (trigger, i) {
    var body   = trigger.nextElementSibling;
    var bodyId = 'accordion-body-' + i;

    // Setup ARIA iniziale
    trigger.setAttribute('aria-expanded', 'false');
    if (body) {
      body.id = bodyId;
      trigger.setAttribute('aria-controls', bodyId);
    }

    trigger.addEventListener('click', function () {
      var isOpen = this.classList.contains('open');

      // Chiude tutti gli altri
      document.querySelectorAll('.accordion__trigger').forEach(function (t) {
        t.classList.remove('open');
        t.setAttribute('aria-expanded', 'false');
        var b = t.nextElementSibling;
        if (b) b.classList.remove('open');
      });

      // Toggle quello cliccato
      if (!isOpen) {
        this.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
        if (body) body.classList.add('open');
      }
    });
  });

  // ── 5. FORM DI RICHIESTA ─────────────────────────────────────────
  var richiestForm = document.getElementById('form-richiesta');
  if (richiestForm) {
    var emailBtn   = document.getElementById('btn-email');
    var waBtn      = document.getElementById('btn-whatsapp');
    var successBox = document.getElementById('form-success');

    function getVal(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : '';
    }

    function getFormData() {
      return {
        nome:      getVal('f-nome'),
        cognome:   getVal('f-cognome'),
        email:     getVal('f-email'),
        telefono:  getVal('f-tel'),
        argomento: getVal('f-argomento'),
        data:      getVal('f-data'),
        persone:   getVal('f-persone'),
        messaggio: getVal('f-messaggio'),
      };
    }

    function validateForm() {
      var required = ['f-nome', 'f-email', 'f-argomento', 'f-messaggio'];
      var valid = true;
      required.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        var ok = el.value.trim() !== '';
        el.style.borderColor = ok ? '' : '#e05252';
        el.setAttribute('aria-invalid', String(!ok));
        if (!ok) valid = false;
      });
      return valid;
    }

    if (emailBtn) {
      emailBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (!validateForm()) return;
        var d = getFormData();
        var subject = encodeURIComponent('[Terme di Equi] Richiesta: ' + d.argomento);
        var body = encodeURIComponent(
          'Gentili Terme di Equi,\n\n' +
          'Vi contatto per una richiesta riguardante: ' + d.argomento + '\n\n' +
          '=== DATI RICHIEDENTE ===\n' +
          'Nome: ' + d.nome + ' ' + d.cognome + '\n' +
          'Email: ' + d.email + '\n' +
          'Telefono: ' + (d.telefono || 'non specificato') + '\n' +
          (d.data    ? 'Data visita preferita: ' + d.data + '\n'  : '') +
          (d.persone ? 'Numero persone: ' + d.persone + '\n'       : '') +
          '\n=== MESSAGGIO ===\n' + d.messaggio + '\n\n' +
          'Resto in attesa di una vostra risposta.\n\n' +
          'Cordiali saluti,\n' + d.nome + ' ' + d.cognome
        );
        window.location.href = 'mailto:segr.centrobenessereequiterme@yahoo.com?subject=' + subject + '&body=' + body;
        if (successBox) {
          successBox.style.display = 'block';
          successBox.textContent   = '✓ La richiesta via email è pronta! Apri il tuo client di posta per inviarla.';
        }
      });
    }

    if (waBtn) {
      waBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (!validateForm()) return;
        var d = getFormData();
        var msg = encodeURIComponent(
          'Salve! Sono *' + d.nome + ' ' + d.cognome + '*.\n' +
          'Vi scrivo per una richiesta riguardante: *' + d.argomento + '*\n\n' +
          (d.data    ? '📅 Data visita: ' + d.data + '\n'  : '') +
          (d.persone ? '👥 Persone: ' + d.persone + '\n'   : '') +
          '\n💬 ' + d.messaggio + '\n\n' +
          'Email di contatto: ' + d.email +
          (d.telefono ? '\nTel: ' + d.telefono : '')
        );
        window.open('https://wa.me/390585949339?text=' + msg, '_blank');
        if (successBox) {
          successBox.style.display = 'block';
          successBox.textContent   = '✓ Si aprirà WhatsApp con il messaggio pre-compilato. Inviatelo per completare la richiesta.';
        }
      });
    }
  }

  // ── 6. SMOOTH SCROLL INTERNO ─────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 7. ACTIVE NAV LINK ───────────────────────────────────────────
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});