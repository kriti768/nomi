'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { QuestionRenderer } from '@/components/fields/QuestionRenderer';
import { Question, FormTheme } from '@/types/form';
import { THEME_PRESETS } from '@/lib/theme';
import { NomiLogo } from '@/components/brand/NomiLogo';
import { api } from '@/lib/api';

const DEMO_FORM_ID = 'eba8b334-7d15-42c0-b123-7f30686ff31b';

const previewTheme: FormTheme = {
  primaryColor: '#c65a87',
  backgroundColor: '#fff9f8',
  textColor: '#29202c',
  answerColor: '#ffffff',
  fontFamily: 'Plus Jakarta Sans',
  cornerRadius: 14,
  textAlignment: 'left',
};

const previewQuestions: Question[] = [
  {
    id: 'nomi-preview-idea',
    form_id: 'nomi-preview',
    type: 'multiple_choice',
    title: '✨ What are you bringing to life?',
    description: 'Choose the idea closest to your heart.',
    required: true,
    position: 0,
    choices: [
      { id: 'startup', label: '🚀 A new venture' },
      { id: 'portfolio', label: '🎨 A creative portfolio' },
      { id: 'community', label: '⚡ A growing community' },
    ],
  },
  {
    id: 'nomi-preview-stage',
    form_id: 'nomi-preview',
    type: 'multiple_choice',
    title: '🎯 Where are you in the journey?',
    description: 'A little context helps us meet you there.',
    required: true,
    position: 1,
    choices: [
      { id: 'curious', label: '🌱 Still exploring' },
      { id: 'building', label: '🛠️ Already building' },
      { id: 'growing', label: '📈 Ready to scale' },
    ],
  },
  {
    id: 'nomi-preview-focus',
    form_id: 'nomi-preview',
    type: 'multiple_choice',
    title: '💡 What matters most right now?',
    description: 'There is no wrong answer.',
    required: true,
    position: 2,
    choices: [
      { id: 'clarity', label: '✨ Finding clarity' },
      { id: 'momentum', label: '⚡ High momentum' },
      { id: 'connection', label: '🤝 Deep connection' },
    ],
  },
  {
    id: 'nomi-preview-feeling',
    form_id: 'nomi-preview',
    type: 'multiple_choice',
    title: '🔮 How do you want it to feel?',
    description: 'Pick the feeling you want to leave behind.',
    required: true,
    position: 3,
    choices: [
      { id: 'calm', label: '🕊️ Calm and considered' },
      { id: 'bold', label: '🔥 Bold and memorable' },
      { id: 'warm', label: '💖 Warm and human' },
    ],
  },
];

export default function LandingPage() {
  const [previewStep, setPreviewStep] = useState(0);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, unknown>>({});
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [creatingThemeId, setCreatingThemeId] = useState<string | null>(null);

  const landingRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const previewQuestion = previewQuestions[previewStep];
  const isLastPreviewQuestion = previewStep === previewQuestions.length - 1;

  const advancePreview = useCallback(() => {
    setPreviewStep((step) => (step >= previewQuestions.length - 1 ? 0 : step + 1));
  }, []);

  const openWorkspace = () => {
    window.location.assign('/dashboard');
  };

  // Keyboard shortcut handler for Hero Preview (Enter & shortcuts A, B, C, 1, 2, 3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in an input
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        advancePreview();
        return;
      }

      const q = previewQuestions[previewStep];
      if (q && q.choices) {
        const keyUpper = e.key.toUpperCase();
        let choiceIndex = -1;

        if (keyUpper === 'A' || e.key === '1') choiceIndex = 0;
        else if (keyUpper === 'B' || e.key === '2') choiceIndex = 1;
        else if (keyUpper === 'C' || e.key === '3') choiceIndex = 2;

        if (choiceIndex >= 0 && choiceIndex < q.choices.length) {
          e.preventDefault();
          const chosen = q.choices[choiceIndex].label;
          setPreviewAnswers((prev) => ({ ...prev, [q.id]: chosen }));
          setTimeout(() => {
            advancePreview();
          }, 240);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewStep, advancePreview]);

  // Click on a theme card to create a new form with that theme
  const handleSelectTheme = async (preset: typeof THEME_PRESETS[0]) => {
    try {
      setCreatingThemeId(preset.id);
      const newForm = await api.createForm({ title: `${preset.name} Form` });
      if (preset.theme) {
        await api.updateForm(newForm.id, { theme: preset.theme });
      }
      window.location.assign(`/builder/${newForm.id}`);
    } catch (err) {
      console.error('Failed to create themed form', err);
      window.location.assign('/dashboard');
    }
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const landing = landingRef.current;
    if (!landing || reduceMotion) return;

    // Intersection Observer for scroll-triggered sections
    const sections = Array.from(landing.querySelectorAll<HTMLElement>('.nomi-motion-section'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 40px 0px' }
    );
    sections.forEach((section) => observer.observe(section));

    // Sticky milestone observer
    const milestoneElements = Array.from(landing.querySelectorAll<HTMLElement>('.nomi-story-milestone'));
    const milestoneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-milestone-index') || 0);
            setActiveMilestone(index);
          }
        });
      },
      { threshold: 0.6 }
    );
    milestoneElements.forEach((el) => milestoneObserver.observe(el));

    let frame = 0;
    const updateScrollEffects = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = documentHeight > 0 ? scrollY / documentHeight : 0;

      // 1. Update top scroll progress line
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      // 2. Settle-in Navbar styling
      navRef.current?.classList.toggle('is-scrolled', scrollY > 20);

      // 3. Parallax transforms on hero elements
      const hero = heroRef.current;
      if (hero) {
        const heroProgress = Math.min(1, Math.max(0, scrollY / Math.max(hero.offsetHeight, 1)));
        hero.style.setProperty('--nomi-hero-y', `${heroProgress * -24}px`);
        hero.style.setProperty('--nomi-hero-scale', `${1 - heroProgress * 0.012}`);
        hero.style.setProperty('--nomi-hero-opacity', `${1 - heroProgress * 0.16}`);
        hero.style.setProperty('--nomi-copy-y', `${heroProgress * -16}px`);
        hero.style.setProperty('--nomi-preview-y', `${heroProgress * -28}px`);
      }

      // 4. Background grid shift
      landing.style.setProperty('--nomi-grid-shift', `${Math.min(scrollY * 0.025, 14)}px`);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollEffects);
    };

    updateScrollEffects();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      observer.disconnect();
      milestoneObserver.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <main className="nomi-landing" ref={landingRef}>
      {/* 2px Gradient Scroll Progress Bar */}
      <div className="nomi-scroll-progress" ref={progressRef} aria-hidden="true" />

      {/* Hero Section */}
      <section className="nomi-hero" id="top" ref={heroRef}>
        {/* Living Radial Glow Orbs */}
        <div className="nomi-hero-orb nomi-hero-orb-purple" aria-hidden="true" />
        <div className="nomi-hero-orb nomi-hero-orb-pink" aria-hidden="true" />

        {/* Ambient Twinkles */}
        <span className="nomi-sparkle nomi-sparkle-one" aria-hidden="true">✦</span>
        <span className="nomi-sparkle nomi-sparkle-two" aria-hidden="true">✦</span>
        <span className="nomi-sparkle nomi-sparkle-three" aria-hidden="true">✦</span>

        {/* Navigation */}
        <header className="nomi-nav" ref={navRef}>
          <div className="nomi-nav-inner">
            <Link href="/" className="nomi-logo" aria-label="Nomi home">
              <NomiLogo size="md" withWordmark={true} />
            </Link>

            <nav aria-label="Primary navigation">
              <a href="#experience">Experience</a>
              <a href="#build">Build</a>
              <a href="#insights">Insights</a>
              <a href="#design">Themes</a>
            </nav>

            <div className="nomi-nav-actions">
              <button type="button" onClick={openWorkspace} className="nomi-workspace-link">
                My forms
              </button>
              <button type="button" onClick={openWorkspace} className="nomi-button nomi-button-small">
                Create form <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Content & Live Interactive Preview */}
        <div className="nomi-hero-grid">
          <div className="nomi-hero-copy">
            <p className="nomi-eyebrow nomi-reveal-eyebrow">
              Conversational forms for a more human web
            </p>
            <h1 className="nomi-reveal-title">
              Forms should feel like <em>conversations.</em>
            </h1>
            <p className="nomi-lede nomi-reveal-lede">
              Create editorial, focused conversational forms that people actually enjoy completing. One question at a time.
            </p>

            <div className="nomi-cta-row nomi-reveal-cta">
              <button type="button" onClick={openWorkspace} className="nomi-button">
                Start creating for free <span aria-hidden="true">→</span>
              </button>
              <a href={`/f/${DEMO_FORM_ID}`} className="nomi-button nomi-button-quiet">
                Explore demo form <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="nomi-annotation">
              <span>✦</span>
              <span>Simple. Focused. Clear.</span>
            </div>
          </div>

          {/* Interactive Floating Product Preview */}
          <div className="nomi-product-wrap nomi-reveal-preview">
            <div className="nomi-product-preview">
              <div className="nomi-preview-topbar">
                <span className="nomi-mini-logo">
                  <NomiLogo size="sm" />
                  <span>Interactive Stage</span>
                </span>
                <span className="text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50 px-2 py-0.5 rounded-full">
                  Try typing or click
                </span>
              </div>

              <div className="nomi-preview-progress">
                <i style={{ width: `${((previewStep + 1) / previewQuestions.length) * 100}%` }} />
              </div>

              <div className="nomi-preview-body" key={previewQuestion.id}>
                <p className="nomi-preview-count">
                  {String(previewStep + 1).padStart(2, '0')} <span>/ {String(previewQuestions.length).padStart(2, '0')}</span>
                </p>

                <QuestionRenderer
                  question={previewQuestion}
                  value={previewAnswers[previewQuestion.id]}
                  onChange={(value) => {
                    setPreviewAnswers((answers) => ({ ...answers, [previewQuestion.id]: value }));
                    setTimeout(advancePreview, 220);
                  }}
                  theme={previewTheme}
                  onEnterKey={advancePreview}
                />

                <div className="nomi-preview-footer">
                  <span>Press <kbd>Enter ↵</kbd> or keys <kbd>A</kbd>–<kbd>C</kbd></span>
                  <button type="button" onClick={advancePreview}>
                    {isLastPreviewQuestion ? 'Start again' : 'Next'} <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </div>
            <p className="nomi-preview-caption">
              <span /> One focused thought at a time
            </p>
          </div>
        </div>
      </section>

      {/* Value Strip (01 BUILD, 02 SHARE, 03 UNDERSTAND) — Tight & Clean */}
      <section className="nomi-value-strip nomi-motion-section" aria-label="Nomi benefits">
        {[
          ['01', 'BUILD', 'Craft thoughtful questions without losing the editorial narrative thread.'],
          ['02', 'SHARE', 'Publish a calm, fast conversational experience in a single responsive link.'],
          ['03', 'UNDERSTAND', 'Turn every individual answer into structured, actionable context.'],
        ].map(([number, title, copy]) => (
          <article key={title}>
            <span>{number}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      {/* Sticky Storytelling Sequence: "One question at a time" */}
      <section className="nomi-sticky-story-section nomi-motion-section" id="experience">
        <div className="nomi-sticky-container">
          <div className="nomi-sticky-copy-column">
            <button
              type="button"
              onClick={() => setActiveMilestone(0)}
              className={`nomi-story-milestone ${activeMilestone === 0 ? 'is-active' : ''}`}
              data-milestone-index="0"
            >
              <span className="milestone-num">01 / Flow</span>
              <h3>No overwhelming walls of inputs.</h3>
              <p>
                Traditional forms present respondents with dozens of blank inputs at once. Nomi breaks friction by guiding respondents through one thought at a time with smooth transitions.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveMilestone(1)}
              className={`nomi-story-milestone ${activeMilestone === 1 ? 'is-active' : ''}`}
              data-milestone-index="1"
            >
              <span className="milestone-num">02 / Rhythm</span>
              <h3>Keyboard-first, fluid motion.</h3>
              <p>
                Respondents fly through options using keys A-D, 1-5, or Enter. No awkward clicking or hunting for tiny checkboxes.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveMilestone(2)}
              className={`nomi-story-milestone ${activeMilestone === 2 ? 'is-active' : ''}`}
              data-milestone-index="2"
            >
              <span className="milestone-num">03 / Clarity</span>
              <h3>Higher completion, better answers.</h3>
              <p>
                When questions are easy and pleasant to answer, people give deeper, higher-quality responses.
              </p>
            </button>
          </div>

          <div className="nomi-sticky-visual-column">
            <div className="nomi-phone-shell">
              <div className="nomi-phone-notch" />
              <div className="nomi-phone-progress">
                <i
                  style={{
                    width: activeMilestone === 0 ? '33%' : activeMilestone === 1 ? '66%' : '100%',
                    transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>
              <p>0{activeMilestone + 1} / 03</p>
              <h3>
                {activeMilestone === 0
                  ? 'What are you creating today?'
                  : activeMilestone === 1
                  ? 'How do you want it to feel?'
                  : 'Ready to share your story?'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveMilestone((prev) => (prev + 1) % 3)}
              >
                <b>A</b> {activeMilestone === 0 ? 'Something thoughtful & human' : activeMilestone === 1 ? 'Fast & fluid motion' : 'Publish with one click'}
              </button>
              <button
                type="button"
                onClick={() => setActiveMilestone((prev) => (prev + 1) % 3)}
              >
                <b>B</b> {activeMilestone === 0 ? 'Clean, minimal & fast' : activeMilestone === 1 ? 'Calm & focused design' : 'Share private invite link'}
              </button>
              <footer>
                <span>Press Enter</span>
                <strong onClick={() => setActiveMilestone((prev) => (prev + 1) % 3)} style={{ cursor: 'pointer' }}>
                  Next →
                </strong>
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* Builder Showcase Section */}
      <section className="nomi-showcase nomi-builder-section nomi-motion-section" id="build">
        <div className="nomi-section-copy">
          <p className="nomi-eyebrow">Build with clarity</p>
          <h2>Build questions people want to answer.</h2>
          <p>
            Compose, rearrange, style, and preview every moment of your form in one considered studio workspace.
          </p>
          <a href="/dashboard" className="nomi-inline-link">
            Open the builder workspace <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="nomi-builder-card" aria-label="Nomi builder preview">
          <aside>
            <div className="nomi-side-brand">
              <NomiLogo size="sm" />
              <span>Nomi Studio</span>
            </div>
            <p>CONTENT BLOCKS</p>
            <span className="is-active">01 <b>What are you building?</b></span>
            <span>02 <b>Tell us about your team</b></span>
            <span>03 <b>When should we begin?</b></span>
            <button type="button">+ Add content</button>
          </aside>
          <div className="nomi-builder-canvas">
            <header>
              <span>Form Editor Stage</span>
              <div><b>Design</b> <em>Desktop</em></div>
            </header>
            <p className="nomi-builder-number">01 / 03</p>
            <h3>What are you building?</h3>
            <p className="nomi-builder-description">A little context helps us make your next steps count.</p>
            <div className="nomi-answer-line">Type your idea here...</div>
            <button type="button" className="nomi-canvas-button">Continue <span>→</span></button>
          </div>
        </div>
      </section>

      {/* Insights & Analytics Section */}
      <section className="nomi-insights nomi-motion-section" id="insights">
        <div className="nomi-section-copy">
          <p className="nomi-eyebrow">Understand the conversation</p>
          <h2>Turn responses into insights.</h2>
          <p>
            See the shape of every answer in real time, track response momentum, and review the words behind the numbers.
          </p>
          <Link href="/dashboard" className="nomi-inline-link">
            View analytics workspace <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="nomi-insights-card">
          <header>
            <span><i /> 128 responses collected</span>
            <small>Active Form</small>
          </header>
          <h3>What are you building?</h3>
          <div className="nomi-bar">
            <span style={{ width: '76%' }} />
            <b>76%</b>
            <p>A new venture</p>
          </div>
          <div className="nomi-bar">
            <span style={{ width: '52%' }} />
            <b>52%</b>
            <p>A creative portfolio</p>
          </div>
          <div className="nomi-bar">
            <span style={{ width: '31%' }} />
            <b>31%</b>
            <p>A growing community</p>
          </div>
        </div>
      </section>

      {/* Theme Presets Showcase (Skipping the last theme to display 12 balanced cards) */}
      <section className="nomi-design-section nomi-motion-section" id="design">
        <div className="nomi-design-heading">
          <p className="nomi-eyebrow">Design with feeling</p>
          <h2>A form that looks like <em>you.</em></h2>
          <p>Choose any curated theme to instantly create a new form with that aesthetic.</p>
        </div>

        <div className="nomi-theme-grid">
          {THEME_PRESETS.slice(0, -1).map((preset) => (
            <article
              className="nomi-theme-card"
              key={preset.id}
              onClick={() => handleSelectTheme(preset)}
              style={{
                backgroundColor: preset.theme.backgroundColor,
                color: preset.theme.textColor,
              }}
              title={`Create a new form with ${preset.name} theme`}
            >
              <div>
                <span>{preset.name}</span>
                <h3>{preset.description.split(' ').slice(0, 5).join(' ')}...</h3>
              </div>
              <div>
                <p style={{ backgroundColor: preset.theme.answerColor, color: preset.theme.textColor }}>
                  Sample answer input
                </p>
                <b style={{ backgroundColor: preset.theme.primaryColor }}>
                  {creatingThemeId === preset.id ? 'Creating...' : 'Use Theme →'}
                </b>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="nomi-final nomi-motion-section">
        <div className="nomi-final-inner">
          <NomiLogo size="xl" variant="white" />
          <p className="nomi-eyebrow">Start your next conversation</p>
          <h2>Ready to start a <em>conversation?</em></h2>
          <button type="button" onClick={openWorkspace} className="nomi-button">
            Create your first form for free <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="nomi-footer">
        <Link href="/" className="nomi-logo" aria-label="Nomi home">
          <NomiLogo size="md" variant="white" withWordmark={true} />
        </Link>
        <p>Forms should feel like conversations. Built with care.</p>
        <nav>
          <a href="#experience">Experience</a>
          <a href="#build">Build</a>
          <a href="#insights">Insights</a>
          <a href="#design">Themes</a>
          <Link href="/dashboard">My forms</Link>
        </nav>
      </footer>
    </main>
  );
}
