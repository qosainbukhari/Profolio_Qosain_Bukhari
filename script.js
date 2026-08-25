// ============================================================
// QOSAIN BUKHARI PORTFOLIO — INTERACTIVE & FRAMER MOTION ENGINE
// Features: Parallax Scrolling Curved Yellow Background,
// Framer Motion Physics Springs, Staggered Entrances,
// Project Category Filter, Accordions, Architecture Lab, Email Copier
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const Motion = window.Motion;
  const hasMotion = typeof Motion !== 'undefined';

  /* ================= 1. MOBILE NAVIGATION ================= */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');

  function openNav() {
    navLinks?.classList.add('open');
    navBackdrop?.classList.add('active');
    navToggle?.classList.add('open');
    navToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    if (hasMotion && Motion.animate) {
      Motion.animate('.nav-links.open .nav-link, .nav-links.open .nav-cta', {
        opacity: [0, 1],
        x: [24, 0]
      }, {
        delay: Motion.stagger(0.04),
        duration: 0.35,
        easing: [0.16, 1, 0.3, 1]
      });
    }
  }

  function closeNav() {
    navLinks?.classList.remove('open');
    navBackdrop?.classList.remove('active');
    navToggle?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle?.addEventListener('click', () => {
    if (navLinks?.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  navBackdrop?.addEventListener('click', closeNav);

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  /* ================= 2. PARALLAX SCROLL FOR CURVED YELLOW BACKGROUNDS ================= */
  const aboutSection = document.getElementById('about');
  const curveHalfShape = document.getElementById('curveHalfShape');
  const curveAmbientGlow = document.querySelector('.curve-ambient-glow');
  const curveEdgeLine = document.querySelector('.curve-edge-line');
  const heroCurve = document.querySelector('.curve-shape-hero');
  const resumeCurve = document.querySelector('.curve-shape-resume');

  let ticking = false;

  function updateParallaxCurves() {
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;

    // 1. Hero Ambient Curve Movement
    if (heroCurve) {
      const heroOffset = scrollY * 0.22;
      heroCurve.style.transform = `translate3d(0, ${heroOffset}px, 0) rotate(${heroOffset * 0.04}deg)`;
    }

    // 2. About Section — Sweeping Yellow Curved Background Moving Behind
    if (aboutSection && (curveHalfShape || curveAmbientGlow)) {
      const rect = aboutSection.getBoundingClientRect();
      if (rect.top < windowH && rect.bottom > 0) {
        // Compute relative scroll progress across the About section (0 to 1)
        const progress = (windowH - rect.top) / (windowH + rect.height);
        const shiftY = (progress - 0.5) * 160;
        const rotateDeg = -4 + (progress - 0.5) * 14;
        const scaleVal = 1 + Math.sin(progress * Math.PI) * 0.05;

        if (curveHalfShape) {
          curveHalfShape.style.transform = `translate3d(0, ${shiftY}px, 0) rotate(${rotateDeg}deg) scale(${scaleVal})`;
        }
        if (curveAmbientGlow) {
          curveAmbientGlow.style.transform = `translate3d(0, ${shiftY * 1.3}px, 0) scale(${scaleVal * 1.05})`;
        }
        if (curveEdgeLine) {
          curveEdgeLine.style.transform = `translate3d(0, ${shiftY * 0.7}px, 0) rotate(${6 - (progress - 0.5) * 10}deg)`;
        }
      }
    }

    // 3. Resume Section Curve
    if (resumeCurve) {
      const resumeSec = document.getElementById('resume');
      if (resumeSec) {
        const rect = resumeSec.getBoundingClientRect();
        if (rect.top < windowH && rect.bottom > 0) {
          const progress = (windowH - rect.top) / (windowH + rect.height);
          const shiftY = (progress - 0.5) * 80;
          resumeCurve.style.transform = `translate3d(0, ${shiftY}px, 0)`;
        }
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallaxCurves);
      ticking = true;
    }
  }, { passive: true });

  // Initial trigger
  updateParallaxCurves();

  /* ================= 3. FRAMER MOTION / SCROLL REVEALS ================= */
  if (hasMotion && Motion.animate && Motion.inView) {
    // Hero entrance with Framer Motion spring stagger
    Motion.animate('.hero .reveal', {
      opacity: [0, 1],
      y: [28, 0]
    }, {
      delay: Motion.stagger ? Motion.stagger(0.1) : 0.1,
      duration: 0.75,
      easing: [0.16, 1, 0.3, 1]
    });

    // Scroll reveal with Framer Motion inView
    document.querySelectorAll('section').forEach(sec => {
      Motion.inView(sec, () => {
        const reveals = sec.querySelectorAll('.reveal');
        if (reveals.length > 0) {
          Motion.animate(reveals, {
            opacity: [0, 1],
            y: [22, 0]
          }, {
            delay: Motion.stagger ? Motion.stagger(0.08) : 0.05,
            duration: 0.65,
            easing: [0.16, 1, 0.3, 1]
          });
          reveals.forEach(r => r.classList.add('in'));
        }
      }, { margin: '0px 0px -40px 0px' });
    });
  } else {
    // Fallback using standard IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      revealElements.forEach(el => io.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('in'));
    }
  }

  /* ================= 4. ACTIVE NAV LINK ON SCROLL ================= */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(a => {
          if (a.getAttribute('href') === `#${id}`) {
            a.classList.add('active');
          } else {
            a.classList.remove('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ================= 5. PROJECT CATEGORY FILTER ================= */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.sys-card');

  // Dynamically compute and populate counts
  const counts = { all: projectCards.length, genai: 0, cv: 0, mlops: 0 };
  projectCards.forEach(card => {
    const cat = card.dataset.category;
    if (counts[cat] !== undefined) counts[cat]++;
  });

  const elAll = document.getElementById('count-all');
  const elGenai = document.getElementById('count-genai');
  const elCv = document.getElementById('count-cv');
  const elMlops = document.getElementById('count-mlops');
  if (elAll) elAll.textContent = counts.all;
  if (elGenai) elGenai.textContent = counts.genai;
  if (elCv) elCv.textContent = counts.cv;
  if (elMlops) elMlops.textContent = counts.mlops;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const matchedCards = [];

      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.classList.remove('filtered-out');
          card.classList.add('in');
          matchedCards.push(card);
        } else {
          card.classList.add('filtered-out');
        }
      });

      // Framer Motion spring layout entrance on filter change
      if (hasMotion && Motion.animate && matchedCards.length > 0) {
        Motion.animate(matchedCards, {
          opacity: [0, 1],
          y: [16, 0],
          scale: [0.97, 1]
        }, {
          delay: Motion.stagger ? Motion.stagger(0.06) : 0.04,
          duration: 0.45,
          easing: [0.16, 1, 0.3, 1]
        });
      }
    });
  });

  /* ================= 6. PROJECT ACCORDIONS ================= */
  document.querySelectorAll('[data-toggle]').forEach(toggle => {
    const card = toggle.closest('.sys-card');
    const body = card?.querySelector('.sys-body');
    if (!card || !body) return;

    const toggleOpen = () => {
      const isOpen = card.classList.contains('open');
      if (isOpen) {
        card.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        body.style.maxHeight = '0px';
      } else {
        card.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';

        // Framer Motion spring expand effect on inner contents
        if (hasMotion && Motion.animate) {
          const innerItems = body.querySelectorAll('.sys-inner > div');
          Motion.animate(innerItems, {
            opacity: [0, 1],
            y: [14, 0]
          }, {
            delay: Motion.stagger ? Motion.stagger(0.05) : 0.05,
            duration: 0.4,
            easing: [0.16, 1, 0.3, 1]
          });
        }
      }
    };

    toggle.addEventListener('click', toggleOpen);
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleOpen();
      }
    });
  });

  // Recompute accordion height on window resize
  window.addEventListener('resize', () => {
    document.querySelectorAll('.sys-card.open').forEach(card => {
      const body = card.querySelector('.sys-body');
      if (body) {
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  }, { passive: true });

  /* ================= 7. ARCHITECTURE LAB ================= */
  const labPipelines = {
    finetuning: {
      badge: 'PIPELINE: LLM FINE-TUNING & QUANTIZATION',
      desc: 'Instruction dataset preparation -> QLoRA 4-bit SFT -> Adapter Merge -> GGUF / AWQ Quantization -> vLLM Serving.',
      nodes: [
        'INSTRUCTION DATA (JSONL)',
        'TOKENIZATION',
        '4-BIT NF4 BASE LLM',
        'LoRA ADAPTER TARGETS',
        'TRL SFTTRAINER',
        'ADAPTER MERGE',
        'GGUF / AWQ EXPORT',
        'vLLM / OLLAMA SERVING'
      ]
    },
    rag: {
      badge: 'PIPELINE: AGENTIC RAG & RETRIEVAL',
      desc: 'PDF parsing -> Recursive chunking -> Vector Embeddings -> ChromaDB -> Llama 3 Inference -> Grounded Answer.',
      nodes: [
        'INPUT DOCUMENTS (PDF)',
        'RECURSIVE CHUNKER',
        'EMBEDDINGS (HF)',
        'CHROMADB VECTOR DB',
        'SIMILARITY RETRIEVER',
        'LLAMA 3 (GROQ)',
        'GROUNDED CITATIONS'
      ]
    },
    cv: {
      badge: 'PIPELINE: REAL-TIME COMPUTER VISION (YOLOv12)',
      desc: 'Video feed -> Low-latency YOLOv12 inference -> Bounding box tracking -> FastAPI event queue -> SMTP Alert.',
      nodes: [
        'VIDEO STREAM / CCTV',
        'FRAME INGESTION',
        'YOLOv12 INFERENCE',
        'CONFIDENCE FILTER',
        'FASTAPI ASYNC QUEUE',
        'DATABASE LOG',
        'SMTP ALERT DISPATCH'
      ]
    },
    mlops: {
      badge: 'PIPELINE: MLOPS & AUTOMATED CI/CD',
      desc: 'DVC data versioning -> MLflow experiment tracking -> Automated Pytest -> Docker build -> GitHub Actions.',
      nodes: [
        'DVC DATA STORE',
        'DATA PREPROCESSING',
        'MLFLOW RUN TRACKING',
        'PYTEST TEST SUITE',
        'DOCKER CONTAINER',
        'GITHUB ACTIONS CI',
        'DEPLOYED SERVICE'
      ]
    },
    api: {
      badge: 'PIPELINE: PRODUCTION FASTAPI SERVICE',
      desc: 'Client request -> JWT Auth -> Pydantic validation -> Async model run -> SQLAlchemy ORM -> Response.',
      nodes: [
        'CLIENT REQUEST',
        'JWT AUTH & RATE LIMIT',
        'PYDANTIC VALIDATION',
        'ASYNC MODEL RUN',
        'SQLAlchemy ORM',
        'STRUCTURED RESPONSE'
      ]
    }
  };

  const labBadge = document.getElementById('labBadge');
  const labDesc = document.getElementById('labDesc');
  const labDiagram = document.getElementById('labDiagram');
  const labTabs = document.querySelectorAll('.lab-tab');

  function renderLab(key) {
    const pipeline = labPipelines[key];
    if (!pipeline || !labDiagram) return;

    if (labBadge) labBadge.textContent = pipeline.badge;
    if (labDesc) labDesc.textContent = pipeline.desc;

    labDiagram.innerHTML = '';
    pipeline.nodes.forEach((n, i) => {
      const node = document.createElement('div');
      node.className = 'lab-node';
      node.textContent = n;
      labDiagram.appendChild(node);

      if (i < pipeline.nodes.length - 1) {
        const arrow = document.createElement('span');
        arrow.className = 'lab-arrow';
        arrow.textContent = '→';
        arrow.setAttribute('aria-hidden', 'true');
        labDiagram.appendChild(arrow);
      }
    });

    // Framer Motion spring stagger animation on new pipeline nodes
    if (hasMotion && Motion.animate) {
      Motion.animate('.lab-node, .lab-arrow', {
        opacity: [0, 1],
        scale: [0.88, 1],
        y: [8, 0]
      }, {
        delay: Motion.stagger ? Motion.stagger(0.035) : 0.02,
        duration: 0.4,
        easing: [0.16, 1, 0.3, 1]
      });
    }
  }

  labTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      labTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      renderLab(tab.dataset.lab);
    });
  });

  // Initial render
  renderLab('finetuning');

  /* ================= 8. TOAST NOTIFICATION HELPER ================= */
  const toastEl = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  }

  /* ================= 9. COPY EMAIL BUTTON ================= */
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText');

  copyEmailBtn?.addEventListener('click', () => {
    const email = emailText?.textContent?.trim() || 'bukhariqosain824@gmail.com';
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(() => {
        showToast('✓ Email address copied to clipboard!');
      }).catch(() => {
        fallbackCopy(email);
      });
    } else {
      fallbackCopy(email);
    }
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast('✓ Email address copied to clipboard!');
    } catch (e) {
      showToast('Email: bukhariqosain824@gmail.com');
    }
    document.body.removeChild(tempInput);
  }

  /* ================= 10. CONTACT FORM CHIPS & MAILTO ================= */
  let selectedChip = 'LLM Fine-Tuning & GenAI';
  const chips = document.querySelectorAll('.chip');
  
  const defaultChip = document.querySelector('.chip[data-chip="LLM Fine-Tuning & GenAI"]');
  defaultChip?.classList.add('active');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedChip = chip.dataset.chip || '';
    });
  });

  const briefForm = document.getElementById('briefForm');
  briefForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fName')?.value?.trim() || '';
    const email = document.getElementById('fEmail')?.value?.trim() || '';
    const details = document.getElementById('fDetails')?.value?.trim() || '';

    const subject = `Inquiry from ${name} [${selectedChip || 'AI Engineering'}]`;
    const body = `Hi Qosain,\n\nName: ${name}\nEmail: ${email}\nDomain / Topic: ${selectedChip}\n\nMessage & Scope:\n${details}\n\nBest regards,\n${name}`;

    const mailtoUrl = `mailto:bukhariqosain824@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    showToast('Opening your email client...');
  });

});
