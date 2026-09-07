'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { QuestionRenderer } from '@/components/fields/QuestionRenderer';
import { Question, FormTheme } from '@/types/form';
import { THEME_PRESETS } from '@/lib/theme';

const DEMO_FORM_ID = 'eba8b334-7d15-42c0-b123-7f30686ff31b';
const previewTheme: FormTheme = { primaryColor: '#c65a87', backgroundColor: '#fff9f8', textColor: '#29202c', answerColor: '#ffffff', fontFamily: 'Plus Jakarta Sans', cornerRadius: 12, textAlignment: 'left' };
const previewQuestions: Question[] = [
  { id: 'nomi-preview-idea', form_id: 'nomi-preview', type: 'multiple_choice', title: 'What are you bringing to life?', description: 'Choose the idea closest to your heart.', required: true, position: 0, choices: [{ id: 'startup', label: 'A new venture' }, { id: 'portfolio', label: 'A creative portfolio' }, { id: 'community', label: 'A growing community' }] },
  { id: 'nomi-preview-stage', form_id: 'nomi-preview', type: 'multiple_choice', title: 'Where are you in the journey?', description: 'A little context helps us meet you there.', required: true, position: 1, choices: [{ id: 'curious', label: 'Still exploring' }, { id: 'building', label: 'Already building' }, { id: 'growing', label: 'Ready to grow' }] },
  { id: 'nomi-preview-focus', form_id: 'nomi-preview', type: 'multiple_choice', title: 'What matters most right now?', description: 'There is no wrong answer.', required: true, position: 2, choices: [{ id: 'clarity', label: 'Finding clarity' }, { id: 'momentum', label: 'Building momentum' }, { id: 'connection', label: 'Connecting people' }] },
  { id: 'nomi-preview-feeling', form_id: 'nomi-preview', type: 'multiple_choice', title: 'How do you want it to feel?', description: 'Pick the feeling you want to leave behind.', required: true, position: 3, choices: [{ id: 'calm', label: 'Calm and considered' }, { id: 'bold', label: 'Bold and memorable' }, { id: 'warm', label: 'Warm and human' }] },
];

function NomiMark() { return <span className="nomi-mark" aria-hidden="true"><span /><span /><span /></span>; }

export default function LandingPage() {
  const [previewStep, setPreviewStep] = useState(0);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, unknown>>({});
  const landingRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const previewQuestion = previewQuestions[previewStep];
  const isLastPreviewQuestion = previewStep === previewQuestions.length - 1;
  const advancePreview = () => setPreviewStep((step) => isLastPreviewQuestion ? 0 : step + 1);
  const openWorkspace = () => window.location.assign('/dashboard');

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const landing = landingRef.current;
    if (!landing || reduceMotion) return;

    const sections = Array.from(landing.querySelectorAll<HTMLElement>('.nomi-motion-section'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    sections.forEach((section) => observer.observe(section));

    let frame = 0;
    const updateScrollEffects = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = documentHeight > 0 ? scrollY / documentHeight : 0;
      progressRef.current?.style.setProperty('transform', `scaleX(${progress})`);
      navRef.current?.classList.toggle('is-scrolled', scrollY > 28);

      const hero = heroRef.current;
      if (hero) {
        const heroProgress = Math.min(1, Math.max(0, scrollY / Math.max(hero.offsetHeight, 1)));
        hero.style.setProperty('--nomi-hero-y', `${heroProgress * -36}px`);
        hero.style.setProperty('--nomi-hero-scale', `${1 - heroProgress * 0.018}`);
        hero.style.setProperty('--nomi-hero-opacity', `${1 - heroProgress * 0.16}`);
        hero.style.setProperty('--nomi-copy-y', `${heroProgress * -24}px`);
        hero.style.setProperty('--nomi-preview-y', `${heroProgress * -41}px`);
        hero.style.setProperty('--nomi-orb-y', `${heroProgress * 16}px`);
      }
      landing.style.setProperty('--nomi-grid-shift', `${Math.min(scrollY * 0.035, 18)}px`);
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateScrollEffects); };
    updateScrollEffects();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, []);

  return <main className="nomi-landing" ref={landingRef}>
    <div className="nomi-scroll-progress" ref={progressRef} aria-hidden="true" />
    <section className="nomi-hero" id="top" ref={heroRef}>
      <span className="nomi-sparkle nomi-sparkle-one" aria-hidden="true">*</span><span className="nomi-sparkle nomi-sparkle-two" aria-hidden="true">*</span><span className="nomi-sparkle nomi-sparkle-three" aria-hidden="true">*</span>
      <header className="nomi-nav" ref={navRef}><a href="/" className="nomi-logo" aria-label="Nomi home"><NomiMark />Nomi</a><nav aria-label="Primary navigation"><a href="#build">Build</a><a href="#experience">Experience</a><a href="#insights">Insights</a></nav><div className="nomi-nav-actions"><button type="button" onClick={openWorkspace} className="nomi-workspace-link">My forms</button><button type="button" onClick={openWorkspace} className="nomi-button nomi-button-small">Create a form</button></div></header>
      <div className="nomi-hero-grid"><div className="nomi-hero-copy nomi-reveal"><p className="nomi-eyebrow">Conversational forms for a more human web</p><h1>Forms should feel like <em>conversations.</em></h1><p className="nomi-lede">Create beautiful conversational forms that people actually enjoy completing.</p><div className="nomi-cta-row"><button type="button" onClick={openWorkspace} className="nomi-button">Create a form <span aria-hidden="true">→</span></button><a href={`/f/${DEMO_FORM_ID}`} className="nomi-button nomi-button-quiet">Explore demo <span aria-hidden="true">↗</span></a></div></div>
        <div className="nomi-product-wrap nomi-reveal nomi-delay-one"><div className="nomi-product-preview"><div className="nomi-preview-topbar"><span className="nomi-mini-logo"><NomiMark /> Nomi</span><span>Preview</span></div><div className="nomi-preview-progress"><i style={{ width: `${((previewStep + 1) / previewQuestions.length) * 100}%` }} /></div><div className="nomi-preview-body" key={previewQuestion.id}><p className="nomi-preview-count">{String(previewStep + 1).padStart(2, '0')} <span>/ {String(previewQuestions.length).padStart(2, '0')}</span></p><QuestionRenderer question={previewQuestion} value={previewAnswers[previewQuestion.id]} onChange={(value) => setPreviewAnswers((answers) => ({ ...answers, [previewQuestion.id]: value }))} theme={previewTheme} onEnterKey={advancePreview} /><div className="nomi-preview-footer"><span>Press <kbd>Enter</kbd> to continue</span><button type="button" onClick={advancePreview}>{isLastPreviewQuestion ? 'Start again' : 'Next'} <span aria-hidden="true">→</span></button></div></div></div><p className="nomi-preview-caption"><span /> One focused question at a time</p></div></div>
    </section>
    <section className="nomi-value-strip nomi-motion-section" aria-label="Nomi benefits">{[['01', 'BUILD', 'Craft thoughtful questions without losing the thread.'], ['02', 'SHARE', 'Publish a calm, clear experience in one link.'], ['03', 'UNDERSTAND', 'Turn every answer into useful context.']].map(([number, title, copy]) => <article key={title}><span>{number}</span><h2>{title}</h2><p>{copy}</p></article>)}</section>
    <section className="nomi-showcase nomi-builder-section nomi-motion-section" id="build"><div className="nomi-section-copy"><p className="nomi-eyebrow">Build with clarity</p><h2>Build questions people want to answer.</h2><p>Compose, arrange, style, and preview every moment of the conversation in one considered workspace.</p><a href="/dashboard" className="nomi-inline-link">Open the builder <span aria-hidden="true">→</span></a></div><div className="nomi-builder-card" aria-label="Nomi builder preview"><aside><div className="nomi-side-brand"><NomiMark /> Nomi</div><p>CONTENT</p><span className="is-active">01 <b>What are you building?</b></span><span>02 <b>Tell us about it</b></span><span>03 <b>When should we begin?</b></span><button type="button">+ Add content</button></aside><div className="nomi-builder-canvas"><header><span>Form editor</span><div><b>Design</b><em>Desktop</em></div></header><p className="nomi-builder-number">01 / 03</p><h3>What are you building?</h3><p className="nomi-builder-description">A little context helps us make your next steps count.</p><div className="nomi-answer-line">Tell us about your idea...</div><button type="button" className="nomi-canvas-button">Continue <span>→</span></button></div></div></section>
    <section className="nomi-showcase nomi-experience-section nomi-motion-section" id="experience"><div className="nomi-phone-shell"><div className="nomi-phone-notch" /><div className="nomi-phone-progress"><i /></div><p>02 / 04</p><h3>What kind of work makes you lose track of time?</h3><button type="button"><b>A</b> Making something new</button><button type="button"><b>B</b> Solving a difficult problem</button><footer><span>Cmd Enter</span><strong>Next →</strong></footer></div><div className="nomi-section-copy"><p className="nomi-eyebrow">Conversational experience</p><h2>One question at a time.</h2><p>Give each answer room to breathe. Nomi keeps the experience focused, keyboard-friendly, and comfortable on any screen.</p><Link href={`/f/${DEMO_FORM_ID}`} className="nomi-inline-link">Try the live demo <span aria-hidden="true">↗</span></Link></div></section>
    <section className="nomi-insights nomi-motion-section" id="insights"><div className="nomi-section-copy"><p className="nomi-eyebrow">Understand the conversation</p><h2>Turn responses into insights.</h2><p>See the shape of every answer, track response momentum, and return to the words behind the numbers.</p><Link href="/dashboard" className="nomi-inline-link">View your forms <span aria-hidden="true">→</span></Link></div><div className="nomi-insights-card"><header><span><i /> 128 responses</span><small>Last 30 days</small></header><h3>What are you building?</h3><div className="nomi-bar"><span style={{ width: '76%' }} /><b>76%</b><p>A new venture</p></div><div className="nomi-bar"><span style={{ width: '52%' }} /><b>52%</b><p>A creative portfolio</p></div><div className="nomi-bar"><span style={{ width: '31%' }} /><b>31%</b><p>A growing community</p></div></div></section>
    <section className="nomi-design-section nomi-motion-section" id="design"><div className="nomi-design-heading"><p className="nomi-eyebrow">Design with feeling</p><h2>A form that looks like <em>you.</em></h2><p>Start with a thoughtful theme, then make every surface your own.</p></div><div className="nomi-theme-grid">{THEME_PRESETS.slice(0, 4).map((preset, index) => <article className={`nomi-theme-card nomi-delay-${index + 1}`} key={preset.id} style={{ backgroundColor: preset.theme.backgroundColor, color: preset.theme.textColor }}><span>{preset.name}</span><h3>What matters most?</h3><p style={{ backgroundColor: preset.theme.answerColor }}>Your answer</p><b style={{ backgroundColor: preset.theme.primaryColor }}>Continue →</b></article>)}</div></section>
    <section className="nomi-final nomi-motion-section"><div className="nomi-final-inner"><NomiMark /><p className="nomi-eyebrow">Start your next conversation</p><h2>Ready to start a <em>conversation?</em></h2><button type="button" onClick={openWorkspace} className="nomi-button">Create a form <span aria-hidden="true">→</span></button></div></section>
    <footer className="nomi-footer"><Link href="/" className="nomi-logo"><NomiMark />Nomi</Link><p>Forms should feel like conversations.</p><nav><a href="#build">Build</a><a href="#experience">Experience</a><a href="#insights">Insights</a><Link href="/dashboard">My forms</Link></nav></footer>
  </main>;
}
