/* =========================================
   TERME DI EQUI — script.js
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

 // ── 1. STICKY HEADER ─────────────────────────────────────────────
 const header = document.querySelector('.site-header');
 if (header) {
   const onScroll = () => {
     // Aggiunge 'scrolled' se scendi oltre i 60px OPPURE se è una pagina senza Hero
     if (window.scrollY > 60 || header.classList.contains('header-no-hero')) {
       header.classList.add('scrolled');
     } else {
       header.classList.remove('scrolled');
     }
   };
   window.addEventListener('scroll', onScroll, { passive: true });
   onScroll(); // Esegue il controllo al caricamento
 }

  // ── 2. MOBILE NAV ────────────────────────────────────────────────
  const burger = document.querySelector('.nav__burger');
  const mobileNav = document.querySelector('.nav__mobile');

  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      const isOpen = burger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Chiude il menu cliccando su un link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── 3. AOS INIT (se la libreria è caricata) ──────────────────────
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    });
  } else {
    // Fallback: attiva subito le animazioni con IntersectionObserver
    const aosEls = document.querySelectorAll('[data-aos]');
    if (aosEls.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const delay = parseInt(e.target.dataset.aosDelay || 0);
            setTimeout(() => e.target.classList.add('aos-animate'), delay);
            observer.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      aosEls.forEach(el => observer.observe(el));
    }
  }

  // ── 4. ACCORDION ─────────────────────────────────────────────────
  document.querySelectorAll('.accordion__trigger').forEach(trigger => {
    trigger.addEventListener('click', function () {
      const body = this.nextElementSibling;
      const isOpen = this.classList.contains('open');

      // Chiude tutti
      document.querySelectorAll('.accordion__trigger').forEach(t => {
        t.classList.remove('open');
        const b = t.nextElementSibling;
        if (b) b.classList.remove('open');
      });

      // Apre quello cliccato (toggle)
      if (!isOpen) {
        this.classList.add('open');
        if (body) body.classList.add('open');
      }
    });
  });

  // ── 5. FORM DI RICHIESTA ─────────────────────────────────────────
  const richiestForm = document.getElementById('form-richiesta');
  if (richiestForm) {

    const emailBtn = document.getElementById('btn-email');
    const waBtn = document.getElementById('btn-whatsapp');
    const successBox = document.getElementById('form-success');

    // Helper: raccoglie i dati del form
    function getFormData() {
      const nome = (document.getElementById('f-nome') || {}).value || '';
      const cognome = (document.getElementById('f-cognome') || {}).value || '';
      const email = (document.getElementById('f-email') || {}).value || '';
      const telefono = (document.getElementById('f-tel') || {}).value || '';
      const argomento = (document.getElementById('f-argomento') || {}).value || '';
      const data = (document.getElementById('f-data') || {}).value || '';
      const persone = (document.getElementById('f-persone') || {}).value || '';
      const messaggio = (document.getElementById('f-messaggio') || {}).value || '';
      return { nome, cognome, email, telefono, argomento, data, persone, messaggio };
    }

    // Helper: valida form base
    function validateForm() {
      let valid = true;
      ['f-nome', 'f-email', 'f-argomento', 'f-messaggio'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (!el.value.trim()) {
          el.style.borderColor = '#e05252';
          valid = false;
        } else {
          el.style.borderColor = '';
        }
      });
      return valid;
    }

    // Email
    if (emailBtn) {
      emailBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (!validateForm()) return;
        const d = getFormData();

        const subject = encodeURIComponent(`[Terme di Equi] Richiesta: ${d.argomento}`);
        const body = encodeURIComponent(
          `Gentili Terme di Equi,\n\n` +
          `Vi contatto per una richiesta riguardante: ${d.argomento}\n\n` +
          `=== DATI RICHIEDENTE ===\n` +
          `Nome: ${d.nome} ${d.cognome}\n` +
          `Email: ${d.email}\n` +
          `Telefono: ${d.telefono || 'non specificato'}\n` +
          (d.data ? `Data visita preferita: ${d.data}\n` : '') +
          (d.persone ? `Numero persone: ${d.persone}\n` : '') +
          `\n=== MESSAGGIO ===\n${d.messaggio}\n\n` +
          `Resto in attesa di una vostra risposta.\n\nCordiali saluti,\n${d.nome} ${d.cognome}`
        );

        window.location.href = `mailto:segr.centrobenessereequiterme@yahoo.com?subject=${subject}&body=${body}`;
        if (successBox) {
          successBox.style.display = 'block';
          successBox.textContent = '✓ La richiesta via email è pronta! Apri il tuo client di posta per inviarla.';
        }
      });
    }

    // WhatsApp
    if (waBtn) {
      waBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (!validateForm()) return;
        const d = getFormData();

        const msg = encodeURIComponent(
          `Salve! Sono *${d.nome} ${d.cognome}*.\n` +
          `Vi scrivo per una richiesta riguardante: *${d.argomento}*\n\n` +
          (d.data ? `📅 Data visita: ${d.data}\n` : '') +
          (d.persone ? `👥 Persone: ${d.persone}\n` : '') +
          `\n💬 ${d.messaggio}\n\n` +
          `Email di contatto: ${d.email}` +
          (d.telefono ? `\nTel: ${d.telefono}` : '')
        );

        const waNumber = '390585949339'; // Numero da aggiornare con WhatsApp Business
        window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');
        if (successBox) {
          successBox.style.display = 'block';
          successBox.textContent = '✓ Si aprirà WhatsApp con il messaggio pre-compilato. Inviatelo per completare la richiesta.';
        }
      });
    }
  }

  // ── 6. SMOOTH SCROLL INTERNO ─────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 7. ACTIVE NAV LINK ───────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});