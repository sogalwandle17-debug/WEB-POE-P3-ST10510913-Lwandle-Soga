/* Student: Lwandle Soga | ST: 10510913 | WEDE5020 Part 2 */
/* Tshwane Community Youth Center – Interactivity Script */

document.addEventListener('DOMContentLoaded', function () {

  /* 1. Highlight the active navigation link */
  const navLinks = document.querySelectorAll('nav.nav-links a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* 2. Mobile menu toggle */
  const nav = document.querySelector('nav.nav-links');
  if (nav) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'menu-toggle';
    toggleBtn.type = 'button';
    toggleBtn.setAttribute('aria-label', 'Toggle navigation menu');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-controls', 'main-nav');
    toggleBtn.textContent = '☰ Menu';

    nav.id = 'main-nav';
    nav.parentNode.insertBefore(toggleBtn, nav);

    toggleBtn.addEventListener('click', function () {
      const isCollapsed = nav.classList.toggle('collapsed');
      toggleBtn.setAttribute('aria-expanded', String(!isCollapsed));
      toggleBtn.textContent = isCollapsed ? '☰ Menu' : '✕ Close';
    });

    // Reset collapsed state when resizing up to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        nav.classList.remove('collapsed');
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.textContent = '☰ Menu';
      }
    });
  }

  /* 3. Back-to-top button */
  const backToTop = document.createElement('button');
  backToTop.id = 'backToTop';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.textContent = '↑';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', function () {
    backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
  }, { passive: true });

  backToTop.addEventListener('click', function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* 4. Enquiry form validation (specific form only) */
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    const msg = document.createElement('div');
    msg.className = 'form-message';
    msg.setAttribute('role', 'status');
    msg.setAttribute('aria-live', 'polite');
    enquiryForm.appendChild(msg);

    function showError(text, field) {
      msg.className = 'form-message error';
      msg.textContent = '⚠ ' + text;
      if (field) field.focus();
    }

    enquiryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      msg.className = 'form-message';
      msg.textContent = '';

      const name  = document.getElementById('name');
      const cell  = document.getElementById('cell');
      const email = document.getElementById('email');

      if (!name.value.trim())  return showError('Please enter your full name.', name);
      if (!cell.value.trim())  return showError('Please enter your cell number.', cell);

      const cellPattern = /^0\d{9}$/;
      if (!cellPattern.test(cell.value.trim())) {
        return showError('Please enter a valid 10-digit SA cell number (e.g. 0821234567).', cell);
      }

      if (!email.value.trim()) return showError('Please enter your email address.', email);

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        return showError('Please enter a valid email address.', email);
      }

      // Escape user input safely for innerHTML
      function escapeHtml(str) {
        return str.replace(/[&<>"']/g, function (c) {
          return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
        });
      }

      const body = encodeURIComponent(
        'Name: ' + name.value.trim() +
        '\nCell: ' + cell.value.trim() +
        '\nEmail: ' + email.value.trim() +
        '\nMessage: ' + (document.getElementById('message').value.trim() || '(none)')
      );
      const mailto = 'mailto:info@tcyouthcenter.org.za?subject=Website%20Enquiry&body=' + body;

      msg.className = 'form-message success';
      msg.innerHTML = '✅ Thank you, <strong>' + escapeHtml(name.value.trim()) +
        '</strong>! Your enquiry has been received. ' +
        '<a href="' + mailto + '">Click here to send it by email</a> (your mail app will open).';

      enquiryForm.reset();
    });
  }

  /* 5. Time-based greeting on the home page (use a stable ID) */
  const welcomeHeading = document.getElementById('welcomeHeading');
  if (welcomeHeading) {
    const greeting = document.createElement('p');
    greeting.style.cssText = 'font-style:italic;color:#0D47A1;';

    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning'
                      : hour < 18 ? 'Good afternoon'
                      : 'Good evening';

    greeting.textContent = timeGreeting + '! 👋 Welcome to the Tshwane Community Youth Center.';
    welcomeHeading.insertAdjacentElement('afterend', greeting);
  }

  /* 6. Lightbox config (only on pages that load it) */
  if (typeof lightbox !== 'undefined') {
    lightbox.option({ resizeDuration: 200, wrapAround: true, albumLabel: 'Image %1 of %2' });
  }

});