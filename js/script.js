/* ==========================================================================
   H2 Insektenschutz – Website JavaScript
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------
     Mobile-Menü Toggle
     -------------------------------------------------------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      siteNav.setAttribute('aria-hidden', String(isOpen));
      document.body.classList.toggle('nav-open', !isOpen);
    });

    // Schließe Menü, wenn ein Link geklickt wird
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('nav-open');
      });
    });

    // Schließe Menü, wenn außerhalb geklickt wird
    document.addEventListener('click', function (event) {
      if (
        navToggle.getAttribute('aria-expanded') === 'true' &&
        !siteNav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('nav-open');
      }
    });
  }

  /* --------------------------------------------------------------
     Header-Schatten beim Scrollen
     -------------------------------------------------------------- */
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const handleScroll = function () {
      if (window.scrollY > 8) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* --------------------------------------------------------------
     Smooth Scroll für interne Anker-Links (Fallback)
     -------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        const headerOffset = siteHeader ? siteHeader.offsetHeight + 12 : 0;
        const top =
          target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------------------
     Fade-In Animation beim Scrollen
     -------------------------------------------------------------- */
  const fadeElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && fadeElements.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: einfach alle einblenden
    fadeElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* --------------------------------------------------------------
     Ablauf-Slider
     -------------------------------------------------------------- */
  const stepSlider = document.querySelector('[data-step-slider]');
  if (stepSlider) {
    const track = stepSlider.querySelector('[data-step-track]');
    const slides = Array.from(stepSlider.querySelectorAll('.process-slide'));
    const prevButton = stepSlider.querySelector('[data-step-prev]');
    const nextButton = stepSlider.querySelector('[data-step-next]');
    const dots = Array.from(stepSlider.querySelectorAll('[data-step-dot]'));
    let activeIndex = 0;
    let autoplayTimer = null;
    let isHovering = false;
    const autoplayDelay = 5000;

    const getLoopedIndex = function (index) {
      return (index + slides.length) % slides.length;
    };

    const updateSlider = function (index) {
      activeIndex = Math.max(0, Math.min(index, slides.length - 1));

      dots.forEach(function (dot, dotIndex) {
        if (dotIndex === activeIndex) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });
    };

    const scrollToSlide = function (index) {
      if (!track || !slides.length) return;
      const targetIndex = getLoopedIndex(index);
      track.scrollTo({
        left: slides[targetIndex].offsetLeft - track.offsetLeft,
        behavior: 'smooth',
      });
      updateSlider(targetIndex);
    };

    const stopAutoplay = function () {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const startAutoplay = function () {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion || isHovering || autoplayTimer || slides.length < 2) return;
      autoplayTimer = window.setInterval(function () {
        scrollToSlide(activeIndex + 1);
      }, autoplayDelay);
    };

    const restartAutoplay = function () {
      stopAutoplay();
      startAutoplay();
    };

    stepSlider.addEventListener('mouseenter', function () {
      isHovering = true;
      stopAutoplay();
    });

    stepSlider.addEventListener('mouseleave', function () {
      isHovering = false;
      startAutoplay();
    });

    if (track && slides.length) {
      let isDragging = false;
      let startX = 0;
      let startScrollLeft = 0;

      const snapToNearestSlide = function () {
        const slideWidth = slides[1]
          ? slides[1].offsetLeft - slides[0].offsetLeft
          : slides[0].offsetWidth;
        const nearestIndex = Math.round(track.scrollLeft / slideWidth);
        scrollToSlide(nearestIndex);
      };

      track.addEventListener('pointerdown', function (event) {
        if (event.pointerType === 'touch') return;
        stopAutoplay();
        isDragging = true;
        startX = event.clientX;
        startScrollLeft = track.scrollLeft;
        track.classList.add('is-dragging');
        track.setPointerCapture(event.pointerId);
      });

      track.addEventListener('pointermove', function (event) {
        if (!isDragging) return;
        event.preventDefault();
        track.scrollLeft = startScrollLeft - (event.clientX - startX);
      });

      track.addEventListener('pointerup', function (event) {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove('is-dragging');
        track.releasePointerCapture(event.pointerId);
        snapToNearestSlide();
        restartAutoplay();
      });

      track.addEventListener('pointercancel', function () {
        isDragging = false;
        track.classList.remove('is-dragging');
        snapToNearestSlide();
        restartAutoplay();
      });

      track.addEventListener(
        'touchstart',
        function () {
          stopAutoplay();
        },
        { passive: true }
      );

      track.addEventListener(
        'touchend',
        function () {
          window.setTimeout(snapToNearestSlide, 80);
          restartAutoplay();
        },
        { passive: true }
      );

      track.addEventListener(
        'scroll',
        function () {
          const trackCenter = track.scrollLeft + track.clientWidth / 2;
          const nearestIndex = slides.reduce(function (nearest, slide, index) {
            const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
            const nearestCenter =
              slides[nearest].offsetLeft + slides[nearest].clientWidth / 2;
            return Math.abs(slideCenter - trackCenter) <
              Math.abs(nearestCenter - trackCenter)
              ? index
              : nearest;
          }, 0);
          updateSlider(nearestIndex);
        },
        { passive: true }
      );

      track.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollToSlide(activeIndex - 1);
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollToSlide(activeIndex + 1);
        }
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        scrollToSlide(activeIndex - 1);
        restartAutoplay();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        scrollToSlide(activeIndex + 1);
        restartAutoplay();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        scrollToSlide(Number(dot.getAttribute('data-step-dot')));
        restartAutoplay();
      });
    });

    updateSlider(0);
    startAutoplay();
  }

  /* --------------------------------------------------------------
     Gewebe-Slider
     -------------------------------------------------------------- */
  const gewebeSlider = document.querySelector('[data-gewebe-slider]');
  if (gewebeSlider) {
    const track = gewebeSlider.querySelector('[data-gewebe-track]');
    const slides = Array.from(gewebeSlider.querySelectorAll('.gewebe-slide'));
    const prevButton = gewebeSlider.querySelector('[data-gewebe-prev]');
    const nextButton = gewebeSlider.querySelector('[data-gewebe-next]');
    const dots = Array.from(gewebeSlider.querySelectorAll('[data-gewebe-dot]'));
    let activeIndex = 0;

    const getLoopedIndex = function (index) {
      return (index + slides.length) % slides.length;
    };

    const updateSlider = function (index) {
      activeIndex = Math.max(0, Math.min(index, slides.length - 1));

      dots.forEach(function (dot, dotIndex) {
        if (dotIndex === activeIndex) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });
    };

    const scrollToSlide = function (index) {
      if (!track || !slides.length) return;
      const targetIndex = getLoopedIndex(index);
      track.scrollTo({
        left: slides[targetIndex].offsetLeft - track.offsetLeft,
        behavior: 'smooth',
      });
      updateSlider(targetIndex);
    };

    if (track && slides.length) {
      let isDragging = false;
      let startX = 0;
      let startScrollLeft = 0;

      const snapToNearestSlide = function () {
        const slideWidth = slides[1]
          ? slides[1].offsetLeft - slides[0].offsetLeft
          : slides[0].offsetWidth;
        const nearestIndex = Math.round(track.scrollLeft / slideWidth);
        scrollToSlide(nearestIndex);
      };

      track.addEventListener('pointerdown', function (event) {
        if (event.pointerType === 'touch') return;
        isDragging = true;
        startX = event.clientX;
        startScrollLeft = track.scrollLeft;
        track.classList.add('is-dragging');
        track.setPointerCapture(event.pointerId);
      });

      track.addEventListener('pointermove', function (event) {
        if (!isDragging) return;
        event.preventDefault();
        track.scrollLeft = startScrollLeft - (event.clientX - startX);
      });

      track.addEventListener('pointerup', function (event) {
        if (!isDragging) return;
        isDragging = false;
        track.classList.remove('is-dragging');
        track.releasePointerCapture(event.pointerId);
        snapToNearestSlide();
      });

      track.addEventListener('pointercancel', function () {
        isDragging = false;
        track.classList.remove('is-dragging');
        snapToNearestSlide();
      });

      track.addEventListener(
        'touchend',
        function () {
          window.setTimeout(snapToNearestSlide, 80);
        },
        { passive: true }
      );

      track.addEventListener(
        'scroll',
        function () {
          const trackCenter = track.scrollLeft + track.clientWidth / 2;
          const nearestIndex = slides.reduce(function (nearest, slide, index) {
            const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
            const nearestCenter =
              slides[nearest].offsetLeft + slides[nearest].clientWidth / 2;
            return Math.abs(slideCenter - trackCenter) <
              Math.abs(nearestCenter - trackCenter)
              ? index
              : nearest;
          }, 0);
          updateSlider(nearestIndex);
        },
        { passive: true }
      );

      track.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          scrollToSlide(activeIndex - 1);
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          scrollToSlide(activeIndex + 1);
        }
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        scrollToSlide(activeIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        scrollToSlide(activeIndex + 1);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        scrollToSlide(Number(dot.getAttribute('data-gewebe-dot')));
      });
    });

    updateSlider(0);
  }

  /* --------------------------------------------------------------
     Aktuelles Jahr im Footer
     -------------------------------------------------------------- */
  const yearEl = document.querySelector('[data-current-year]');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* --------------------------------------------------------------
     Aktive Navigation hervorheben
     -------------------------------------------------------------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });
})();
