(function () {
  const body = document.body;

  function setupNav() {
    const navToggle = document.querySelector('[data-nav-toggle]');
    const navMenu = document.getElementById('primary-nav');

    if (!navToggle || !navMenu) {
      return;
    }

    const setOpen = (isOpen) => {
      body.classList.toggle('nav-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navMenu.setAttribute('data-open', String(isOpen));
    };

    navToggle.addEventListener('click', function () {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      setOpen(!isOpen);
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 980px)').matches) {
          setOpen(false);
        }
      });
    });

    window.addEventListener('resize', function () {
      if (window.matchMedia('(min-width: 981px)').matches) {
        setOpen(false);
      }
    });
  }

  function setupActiveSectionLinks() {
    const sectionLinks = Array.from(
      document.querySelectorAll('.nav a[href^="#"], .nav a[href*="index.html#"]')
    ).filter(function (link) {
      return link.hash && document.querySelector(link.hash);
    });

    if (!sectionLinks.length) {
      return;
    }

    const byId = new Map(sectionLinks.map(function (link) {
      return [link.hash.slice(1), link];
    }));

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const id = entry.target.id;
          const link = byId.get(id);
          if (!link) {
            return;
          }

          if (entry.isIntersecting) {
            sectionLinks.forEach(function (candidate) {
              candidate.classList.remove('is-active');
            });
            link.classList.add('is-active');
          }
        });
      },
      {
        rootMargin: '-35% 0px -55% 0px',
        threshold: 0,
      }
    );

    byId.forEach(function (_, id) {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });
  }

  function setupGalleryControls() {
    document.querySelectorAll('[data-rail-controls]').forEach(function (controlGroup) {
      const railId = controlGroup.getAttribute('data-rail-controls');
      const rail = document.getElementById(railId);
      if (!rail) {
        return;
      }

      const scrollByAmount = function () {
        return Math.max(rail.clientWidth * 0.85, 240);
      };

      controlGroup.addEventListener('click', function (event) {
        const button = event.target.closest('button[data-direction]');
        if (!button) {
          return;
        }

        const direction = button.getAttribute('data-direction') === 'next' ? 1 : -1;
        rail.scrollBy({ left: direction * scrollByAmount(), behavior: 'smooth' });
      });
    });
  }

  function setupCopyTemplate() {
    const button = document.querySelector('[data-copy-template]');
    if (!button || !navigator.clipboard) {
      return;
    }

    const template = [
      'Device model:',
      'iOS/watchOS version:',
      'App version:',
      'What happened:',
      'What you expected:',
      'Steps to reproduce:',
    ].join('\n');

    button.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(template);
        button.textContent = 'Template copied';
        window.setTimeout(function () {
          button.textContent = 'Copy support template';
        }, 1800);
      } catch (error) {
        button.textContent = 'Copy failed';
        window.setTimeout(function () {
          button.textContent = 'Copy support template';
        }, 1800);
      }
    });
  }

  function setupFaqDetails() {
    document.querySelectorAll('.faq details').forEach(function (detail) {
      detail.addEventListener('toggle', function () {
        if (!detail.open) {
          return;
        }

        const siblings = detail.parentElement ? detail.parentElement.querySelectorAll('details[open]') : [];
        siblings.forEach(function (other) {
          if (other !== detail) {
            other.open = false;
          }
        });
      });
    });
  }

  setupNav();
  setupActiveSectionLinks();
  setupGalleryControls();
  setupCopyTemplate();
  setupFaqDetails();
})();
