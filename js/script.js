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
    const realSlides = Array.from(stepSlider.querySelectorAll('.process-slide'));
    const prevButton = stepSlider.querySelector('[data-step-prev]');
    const nextButton = stepSlider.querySelector('[data-step-next]');
    const dots = Array.from(stepSlider.querySelectorAll('[data-step-dot]'));
    const n = realSlides.length;
    let activeIndex = 0;
    let jumping = false;
    let autoplayTimer = null;
    let isHovering = false;
    const autoplayDelay = 5000;

    // Clone first & last slide so looping appears seamless.
    // DOM order: [lastClone, s0, s1, s2, firstClone]
    let firstCloneEl = null;
    let lastCloneEl = null;
    if (track && n > 1) {
      lastCloneEl = realSlides[n - 1].cloneNode(true);
      firstCloneEl = realSlides[0].cloneNode(true);
      lastCloneEl.setAttribute('aria-hidden', 'true');
      firstCloneEl.setAttribute('aria-hidden', 'true');
      // Clones must not be CSS snap targets
      lastCloneEl.style.scrollSnapAlign = 'none';
      firstCloneEl.style.scrollSnapAlign = 'none';
      track.insertBefore(lastCloneEl, realSlides[0]);
      track.appendChild(firstCloneEl);
      // Start at real slide 0 (instant, no animation)
      window.requestAnimationFrame(function () {
        track.style.scrollBehavior = 'auto';
        track.scrollLeft = realSlides[0].offsetLeft - track.offsetLeft;
        track.getBoundingClientRect();
        track.style.scrollBehavior = '';
      });
    }

    const slotLeft = function (el) {
      return el.offsetLeft - track.offsetLeft;
    };

    const updateDots = function (index) {
      dots.forEach(function (dot, i) {
        if (i === index) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    };

    // Instant positional reset without visible scroll animation
    const silentJump = function (left) {
      track.style.scrollBehavior = 'auto';
      track.scrollLeft = left;
      track.getBoundingClientRect();
      track.style.scrollBehavior = '';
    };

    // Run cb after the current smooth scroll finishes (scrollend or timeout fallback)
    const afterScroll = function (cb) {
      const handler = function () {
        clearTimeout(fallback);
        cb();
      };
      const fallback = setTimeout(function () {
        track.removeEventListener('scrollend', handler);
        cb();
      }, 600);
      track.addEventListener('scrollend', handler, { once: true });
    };

    const goToSlide = function (index) {
      if (jumping) return;
      const clamped = Math.max(0, Math.min(index, n - 1));
      activeIndex = clamped;
      updateDots(activeIndex);
      track.scrollTo({ left: slotLeft(realSlides[activeIndex]), behavior: 'smooth' });
    };

    // Navigate with infinite wrap using clones.
    // scroll-snap-type is disabled during the wrap so the browser allows
    // scrolling past the last real snap point to the clone position.
    const advance = function (delta) {
      if (jumping || !track || !n) return;
      const next = activeIndex + delta;

      if (next >= n && firstCloneEl) {
        // Forward wrap: scroll to firstClone, then silently reset to s0
        jumping = true;
        updateDots(0);
        track.style.scrollSnapType = 'none';
        track.scrollTo({ left: slotLeft(firstCloneEl), behavior: 'smooth' });
        afterScroll(function () {
          silentJump(slotLeft(realSlides[0]));
          activeIndex = 0;
          jumping = false;
          track.style.scrollSnapType = '';
        });
      } else if (next < 0 && lastCloneEl) {
        // Backward wrap: scroll to lastClone, then silently reset to s(n-1)
        jumping = true;
        updateDots(n - 1);
        track.style.scrollSnapType = 'none';
        track.scrollTo({ left: slotLeft(lastCloneEl), behavior: 'smooth' });
        afterScroll(function () {
          silentJump(slotLeft(realSlides[n - 1]));
          activeIndex = n - 1;
          jumping = false;
          track.style.scrollSnapType = '';
        });
      } else {
        goToSlide(Math.max(0, Math.min(next, n - 1)));
      }
    };

    const stopAutoplay = function () {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const startAutoplay = function () {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion || isHovering || autoplayTimer || n < 2) return;
      autoplayTimer = window.setInterval(function () {
        advance(1);
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

    if (track && n) {
      let isDragging = false;
      let startX = 0;
      let startScrollLeft = 0;

      // Snap to nearest real slide (ignores clones)
      const snapToNearestSlide = function () {
        if (jumping) return;
        const viewCenter = track.scrollLeft + track.clientWidth / 2;
        let nearest = activeIndex;
        let nearestDist = Infinity;
        realSlides.forEach(function (slide, i) {
          const dist = Math.abs((slide.offsetLeft - track.offsetLeft + slide.offsetWidth / 2) - viewCenter);
          if (dist < nearestDist) { nearestDist = dist; nearest = i; }
        });
        goToSlide(nearest);
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

      track.addEventListener('touchstart', function () {
        stopAutoplay();
      }, { passive: true });

      track.addEventListener('touchend', function () {
        window.setTimeout(snapToNearestSlide, 80);
        restartAutoplay();
      }, { passive: true });

      track.addEventListener('scroll', function () {
        if (jumping) return;
        const viewCenter = track.scrollLeft + track.clientWidth / 2;
        let nearest = activeIndex;
        let nearestDist = Infinity;
        realSlides.forEach(function (slide, i) {
          const dist = Math.abs((slide.offsetLeft - track.offsetLeft + slide.offsetWidth / 2) - viewCenter);
          if (dist < nearestDist) { nearestDist = dist; nearest = i; }
        });
        if (nearest !== activeIndex) {
          activeIndex = nearest;
          updateDots(activeIndex);
        }
      }, { passive: true });

      track.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') { event.preventDefault(); advance(-1); restartAutoplay(); }
        if (event.key === 'ArrowRight') { event.preventDefault(); advance(1); restartAutoplay(); }
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () { advance(-1); restartAutoplay(); });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () { advance(1); restartAutoplay(); });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goToSlide(Number(dot.getAttribute('data-step-dot')));
        restartAutoplay();
      });
    });

    updateDots(0);
    startAutoplay();
  }

  /* --------------------------------------------------------------
     Gewebe-Slider (infinite loop via clones)
     -------------------------------------------------------------- */
  const gewebeSlider = document.querySelector('[data-gewebe-slider]');
  if (gewebeSlider) {
    const track = gewebeSlider.querySelector('[data-gewebe-track]');
    const realSlides = Array.from(gewebeSlider.querySelectorAll('.gewebe-slide'));
    const prevButton = gewebeSlider.querySelector('[data-gewebe-prev]');
    const nextButton = gewebeSlider.querySelector('[data-gewebe-next]');
    const dots = Array.from(gewebeSlider.querySelectorAll('[data-gewebe-dot]'));
    const n = realSlides.length;
    let activeIndex = 0;
    let jumping = false;

    const slotLeft = function (el) { return el.offsetLeft - track.offsetLeft; };

    const silentJump = function (left) {
      track.style.scrollBehavior = 'auto';
      track.scrollLeft = left;
      track.getBoundingClientRect();
      track.style.scrollBehavior = '';
    };

    const updateDots = function (index) {
      dots.forEach(function (dot, i) {
        if (i === index) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    };

    const afterScroll = function (cb) {
      const fallback = setTimeout(function () {
        track.removeEventListener('scrollend', handler);
        cb();
      }, 600);
      const handler = function () {
        clearTimeout(fallback);
        cb();
      };
      track.addEventListener('scrollend', handler, { once: true });
    };

    // Insert clones for infinite looping
    let firstClone = null;
    let lastClone = null;
    if (track && n > 1) {
      lastClone = realSlides[n - 1].cloneNode(true);
      firstClone = realSlides[0].cloneNode(true);
      lastClone.setAttribute('aria-hidden', 'true');
      firstClone.setAttribute('aria-hidden', 'true');
      lastClone.style.scrollSnapAlign = 'none';
      firstClone.style.scrollSnapAlign = 'none';
      track.insertBefore(lastClone, realSlides[0]);
      track.appendChild(firstClone);
      window.requestAnimationFrame(function () {
        silentJump(slotLeft(realSlides[0]));
      });
    }

    const scrollToSlide = function (index) {
      if (jumping || !track || !n) return;
      const target = ((index % n) + n) % n;
      activeIndex = target;
      updateDots(activeIndex);
      track.scrollTo({ left: slotLeft(realSlides[target]), behavior: 'smooth' });
    };

    const advance = function (delta) {
      if (jumping || !track || !n) return;
      const next = activeIndex + delta;

      if (next >= n && firstClone) {
        jumping = true;
        track.style.scrollSnapType = 'none';
        track.scrollTo({ left: slotLeft(firstClone), behavior: 'smooth' });
        afterScroll(function () {
          silentJump(slotLeft(realSlides[0]));
          activeIndex = 0;
          updateDots(0);
          track.style.scrollSnapType = '';
          jumping = false;
        });
        return;
      }

      if (next < 0 && lastClone) {
        jumping = true;
        track.style.scrollSnapType = 'none';
        track.scrollTo({ left: slotLeft(lastClone), behavior: 'smooth' });
        afterScroll(function () {
          silentJump(slotLeft(realSlides[n - 1]));
          activeIndex = n - 1;
          updateDots(n - 1);
          track.style.scrollSnapType = '';
          jumping = false;
        });
        return;
      }

      scrollToSlide(next);
    };

    if (track && n) {
      let isDragging = false;
      let startX = 0;
      let startScrollLeft = 0;

      const snapToNearest = function () {
        if (jumping) return;
        const viewCenter = track.scrollLeft + track.clientWidth / 2;
        let nearest = activeIndex;
        let nearestDist = Infinity;
        realSlides.forEach(function (slide, i) {
          const dist = Math.abs((slotLeft(slide) + slide.offsetWidth / 2) - viewCenter);
          if (dist < nearestDist) { nearestDist = dist; nearest = i; }
        });
        scrollToSlide(nearest);
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
        snapToNearest();
      });

      track.addEventListener('pointercancel', function () {
        isDragging = false;
        track.classList.remove('is-dragging');
        snapToNearest();
      });

      track.addEventListener('touchend', function () {
        window.setTimeout(snapToNearest, 80);
      }, { passive: true });

      track.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft') { event.preventDefault(); advance(-1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); advance(1); }
      });
    }

    if (prevButton) prevButton.addEventListener('click', function () { advance(-1); });
    if (nextButton) nextButton.addEventListener('click', function () { advance(1); });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        scrollToSlide(Number(dot.getAttribute('data-gewebe-dot')));
      });
    });

    updateDots(0);
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
