'use client';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ScrollTypingHtml } from './ScrollTypingHtml';

/* ─────────────────────────────────────────────────────────────
   ANIMATED COUNTER
   ───────────────────────────────────────────────────────────── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          const t0 = performance.now();
          const dur = 2000;
          const step = (now: number) => {
            const p = Math.min((now - t0) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            setVal(Math.round(ease * target));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────────
   SECTION LABEL
   ───────────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-3 mb-6"
      style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#B8704A' }}
    >
      <motion.span
        initial={{ width: 0 }}
        whileInView={{ width: 24 }}
        viewport={{ once: false }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ display: 'block', height: '1.5px', backgroundColor: '#B8704A' }}
      />
      {children}
    </motion.span>
  );
}

function GalleryScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY, behavior: 'auto' });
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div ref={scrollRef} className="gallery-scroll" style={{ display: 'flex', gap: 16, overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: 16, WebkitOverflowScrolling: 'touch' }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ANIMATION VARIANTS
   ───────────────────────────────────────────────────────────── */

// Fade up with exit
const fadeUp: any = {
  hidden: { opacity: 0, y: 60 },
  visible: (d: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, y: -30, transition: { duration: 0.4 } },
};

// Fade from left
const fadeLeft: any = {
  hidden: { opacity: 0, x: -60 },
  visible: (d: number = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, x: -40, transition: { duration: 0.3 } },
};

// Fade from right
const fadeRight: any = {
  hidden: { opacity: 0, x: 60 },
  visible: (d: number = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, x: 40, transition: { duration: 0.3 } },
};

// Scale in
const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (d: number = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

// Stagger children container
const stagger: any = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

/* ─────────────────────────────────────────────────────────────
   MONOGRAM LOADER
   ───────────────────────────────────────────────────────────── */
function MonogramLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'drawing' | 'filled' | 'done'>('drawing');

  useEffect(() => {
    // Phase 1: Draw strokes (0 → 1.8s)
    // Phase 2: Fill in + glow pulse (1.8s → 2.8s)
    // Phase 3: Exit (2.8s → 3.6s)
    const t1 = setTimeout(() => setPhase('filled'), 1800);
    const t2 = setTimeout(() => setPhase('done'), 2800);
    const t3 = setTimeout(onComplete, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  // Floating particles around the monogram
  const particles = Array.from({ length: 12 }, (_, i) => ({
    x: 50 + Math.cos((i / 12) * Math.PI * 2) * (38 + Math.random() * 12),
    y: 50 + Math.sin((i / 12) * Math.PI * 2) * (38 + Math.random() * 12),
    delay: 1.2 + i * 0.08,
    size: 1.2 + Math.random() * 1.2,
  }));

  return (
    <>
      {/* Left curtain */}
      <motion.div
        initial={{ x: 0 }}
        animate={phase === 'done' ? { x: '-100%' } : { x: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, width: '50%', height: '100%',
          zIndex: 9999, background: '#1C1B18',
        }}
      />
      {/* Right curtain */}
      <motion.div
        initial={{ x: 0 }}
        animate={phase === 'done' ? { x: '100%' } : { x: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: 'fixed', top: 0, right: 0, width: '50%', height: '100%',
          zIndex: 9999, background: '#1C1B18',
        }}
      />

      {/* Center content overlay */}
      <motion.div
        animate={phase === 'done' ? { opacity: 0, scale: 1.3 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: phase === 'done' ? 'none' : 'auto',
        }}
      >
        {/* Outer rotating ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
          animate={{ opacity: 0.15, scale: 1, rotate: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          style={{
            position: 'absolute',
            width: 280, height: 280,
            border: '1px solid #B8704A',
            borderRadius: '50%',
          }}
        />

        {/* Inner rotating ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4, rotate: 90 }}
          animate={{ opacity: 0.1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          style={{
            position: 'absolute',
            width: 320, height: 320,
            border: '1px solid #B8704A',
            borderRadius: '50%',
          }}
        />

        <motion.svg
          width="220" height="220" viewBox="0 0 100 100" fill="none"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ scale: 0.9 }}
          animate={phase === 'filled' ? { scale: 1.05 } : { scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* SVG glow filter */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4956E" />
              <stop offset="50%" stopColor="#B8704A" />
              <stop offset="100%" stopColor="#8B5233" />
            </linearGradient>
            <linearGradient id="fillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4956E" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#B8704A" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Y — filled shape (appears after draw) */}
          <motion.path
            d="M 10 18 L 28 48 L 28 82 L 36 82 L 36 48 L 54 18 L 46 18 L 32 42 L 18 18 Z"
            fill="url(#fillGrad)"
            initial={{ opacity: 0 }}
            animate={phase === 'filled' ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6 }}
          />

          {/* K — filled shape (appears after draw) */}
          <motion.path
            d="M 54 18 L 54 82 L 62 82 L 62 56 L 80 82 L 90 82 L 68 52 L 88 18 L 80 18 L 62 46 L 62 18 Z"
            fill="url(#fillGrad)"
            initial={{ opacity: 0 }}
            animate={phase === 'filled' ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />

          {/* Y — stroke path */}
          <motion.path
            d="M 10 18 L 32 50 L 32 82 M 54 18 L 32 50"
            stroke="url(#strokeGrad)"
            strokeWidth="4"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ pathLength: { duration: 1.4, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.3 } }}
          />

          {/* K — stroke path */}
          <motion.path
            d="M 58 18 L 58 82 M 86 18 L 58 52 L 86 82"
            stroke="url(#strokeGrad)"
            strokeWidth="4"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ pathLength: { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.5 }, opacity: { duration: 0.3, delay: 0.5 } }}
          />

          {/* Floating particles */}
          {particles.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x} cy={p.y} r={p.size}
              fill="#B8704A"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
              transition={{ duration: 1.4, delay: p.delay, ease: 'easeInOut' }}
            />
          ))}
        </motion.svg>

        {/* Subtle tagline below the monogram */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          style={{
            marginTop: 32, fontSize: 11, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.35em',
            color: '#B8704A', fontFamily: "'Space Grotesk', system-ui, sans-serif",
          }}
        >
          Portfolio
        </motion.p>
      </motion.div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */
export function AnimatedPortfolio({ projects, skills, details, education = [], certifications = [] }: any) {
  const [showLoader, setShowLoader] = useState(true);
  const [activeGallery, setActiveGallery] = useState<{ title: string, images: string[] } | null>(null);
  const [activeDownload, setActiveDownload] = useState<{ title: string, links: {name: string, url: string}[] } | null>(null);
  const [activeGuide, setActiveGuide] = useState<{ title: string, content: string } | null>(null);
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const aboutSectionRef = useRef(null);
  const { scrollYProgress: aboutScrollProgress } = useScroll({
    target: aboutSectionRef,
    offset: ['start start', 'end end']
  });

  // Parallax transforms for hero
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '50%']);
  const heroOp = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.88]);
  const heroRotate = useTransform(heroScroll, [0, 0.6], [0, -8]);

  // Global scroll progress bar
  const { scrollYProgress } = useScroll();
  const barScale = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showLoader]);

  const get = (key: string) => details.find((d: any) => d.key === key)?.value || '';

  // Group skills
  const grouped = skills.reduce((a: any, s: any) => {
    const c = s.category || 'General';
    (a[c] = a[c] || []).push(s);
    return a;
  }, {} as Record<string, any[]>);

  // Sort projects by release date
  const sortedProjects = [...projects].sort((a: any, b: any) => {
    const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : new Date(a.createdAt || 0).getTime();
    const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  // Sort education by duration year (newest first)
  const sortedEducation = [...education].sort((a: any, b: any) => {
    const extractYear = (str: string) => {
      const match = str?.match(/\d{4}/g);
      return match ? Math.max(...match.map(Number)) : 0;
    };
    const yearA = extractYear(a.duration);
    const yearB = extractYear(b.duration);
    if (yearA !== yearB) return yearB - yearA;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  // Sort certifications by date year (newest first)
  const sortedCertifications = [...certifications].sort((a: any, b: any) => {
    const extractYear = (str: string) => {
      const match = str?.match(/\d{4}/g);
      return match ? Math.max(...match.map(Number)) : 0;
    };
    const yearA = extractYear(a.date);
    const yearB = extractYear(b.date);
    if (yearA !== yearB) return yearB - yearA;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  return (
    <div style={{ width: '100%', position: 'relative', overflowX: 'clip', fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <AnimatePresence>
        {showLoader && <MonogramLoader onComplete={() => setShowLoader(false)} />}
      </AnimatePresence>

      {/* ── Scroll progress bar ── */}
      <motion.div
        style={{
          scaleY: barScale,
          position: 'fixed', left: 0, top: 0, width: '3px', height: '100%',
          background: 'linear-gradient(180deg, #B8704A 0%, #D4956E 100%)',
          transformOrigin: 'top', zIndex: 50,
        }}
      />

      {/* ════════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', position: 'relative',
          background: 'radial-gradient(ellipse at 50% 30%, #FFF9F0 0%, #F3EDE3 60%, #EDE5D8 100%)',
        }}
      >
        {/* Decorative circles — parallax at different rates */}
        <motion.div
          style={{ y: useTransform(heroScroll, [0, 1], ['0%', '20%']) }}
          className="absolute pointer-events-none"
        >
          <div style={{ width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(184,112,74,0.08)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          <div style={{ width: 350, height: 350, borderRadius: '50%', border: '1px solid rgba(184,112,74,0.05)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        </motion.div>

        {/* Corner accents */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{ position: 'absolute', top: 40, left: 40, width: 60, height: 60, borderLeft: '1.5px solid #B8704A', borderTop: '1.5px solid #B8704A' }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          style={{ position: 'absolute', bottom: 40, right: 40, width: 60, height: 60, borderRight: '1.5px solid #B8704A', borderBottom: '1.5px solid #B8704A' }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOp, scale: heroScale, rotateZ: heroRotate }}
          className="relative z-10 text-center px-6"
        >

          <motion.img
            src="/logo.png"
            alt="Logo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ display: 'none' }}
          />

          <motion.h1
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(2.5rem, 7vw, 6rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              color: '#1C1B18',
              margin: 0,
            }}
          >
            {get('hero-title') || 'Your Name'}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{ width: 50, height: 1.5, background: '#B8704A', margin: '28px auto', transformOrigin: 'left' }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: '#6B6860', fontWeight: 300, maxWidth: 420, margin: '0 auto', lineHeight: 1.7, textAlign: 'center' }}
          >
            {get('hero-subtitle') || 'A brief subtitle about you'}
          </motion.p>

          {get('hero-intro') && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', color: '#7A766C', fontWeight: 400, maxWidth: 600, margin: '24px auto 0', lineHeight: 1.8, textAlign: 'center' }}
            >
              {get('hero-intro')}
            </motion.p>
          )}
        </motion.div>


      </section>

      {/* ════════════════════════════════════════════════════════
          ABOUT SECTION
          ════════════════════════════════════════════════════════ */}
      <section ref={aboutSectionRef} style={{ position: 'relative', background: '#F3EDE3', height: '250vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 24px', overflow: 'hidden' }}>
          <div style={{ maxWidth: 960, margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48 }}>
              {/* Heading */}
              <motion.div
                variants={fadeLeft}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, amount: 0.3 }}
              >
                <SectionLabel>About</SectionLabel>
                <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1C1B18', lineHeight: 1.15, margin: 0 }}>
                  Who I Am
                </h2>
              </motion.div>

              {/* Body text — Animated with scroll */}
              <ScrollTypingHtml html={get('about-me') || 'Write your biography in the admin dashboard...'} scrollYProgress={aboutScrollProgress} />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          STATS SECTION
          ════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: '80px 24px 120px', background: '#F3EDE3' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          {/* Stats row */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 32, marginTop: 72 }}
          >
            {[
              { v: projects.length, l: 'Projects', s: '+' },
              { v: skills.length, l: 'Skills', s: '+' },
              { v: Object.keys(grouped).length, l: 'Domains', s: '' },
              { v: new Date().getFullYear() - (parseInt(get('experience-start-year')) || 2020), l: 'Years', s: '+' },
            ].map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                style={{ textAlign: 'center', padding: '24px 0' }}
              >
                <p style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#1C1B18', margin: '0 0 4px' }}>
                  <Counter target={s.v} suffix={s.s} />
                </p>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#9C9889', fontWeight: 600, margin: 0 }}>{s.l}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Education section moved below Certifications */}

      {/* ════════════════════════════════════════════════════════
          PROJECTS SECTION
          ════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: '120px 24px', background: '#141311' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, amount: 0.3 }}
            style={{ marginBottom: 80 }}
          >
            <SectionLabel>Work</SectionLabel>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#E8E4DC', lineHeight: 1.05, margin: '0 0 12px' }}>
              Projects
            </h2>
            <p style={{ color: '#7A766C', fontWeight: 300, fontSize: 14, maxWidth: 380, lineHeight: 1.7 }}>
              A curated collection of work reflecting craft and attention to detail.
            </p>
          </motion.div>

          {/* Project cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 120 }}>
            <style>{`
              @media (min-width: 900px) {
                .project-row {
                  flex-direction: row !important;
                  align-items: center;
                  justify-content: space-between;
                }
                .project-row.reverse {
                  flex-direction: row-reverse !important;
                }
                .project-row > .image-container {
                  width: 42% !important;
                  max-width: 500px !important;
                  flex: none !important;
                }
                .project-row > .text-container {
                  width: 50% !important;
                  max-width: 600px !important;
                  flex: none !important;
                }
              }
            `}</style>
            {sortedProjects.map((p: any, i: number) => (
              <motion.article
                key={p._id}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: false, amount: 0.2 }}
                className={i % 2 === 0 ? 'project-row' : 'project-row reverse'}
                style={{ display: 'flex', flexDirection: 'column', gap: '64px', position: 'relative' }}
              >
                <motion.div
                  className="image-container"
                  variants={i % 2 === 0 ? fadeLeft : fadeRight}
                  style={{ width: '100%', position: 'relative' }}
                >
                  <StackedGallery p={p} onClick={() => setActiveGallery({ title: p.title, images: p.images || [] })} />

                  {/* Number badge */}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    style={{
                      position: 'absolute', top: 16, left: 16, zIndex: 20,
                      fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em',
                      color: '#B8704A', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                      padding: '6px 12px', borderRadius: 20, pointerEvents: 'none'
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </motion.span>
                </motion.div>

                {/* Text — side by side */}
                <motion.div
                  className="text-container"
                  variants={i % 2 === 0 ? fadeRight : fadeLeft}
                  custom={0.15}
                  style={{
                    width: '100%',
                    padding: '0',
                  }}
                >
                  <h3 style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                    color: '#E8E4DC', margin: '0 0 16px', lineHeight: 1.2,
                  }}>
                    {p.title}
                  </h3>
                  {p.releaseDate && (
                    <p style={{ color: '#B8704A', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', marginTop: '-8px', marginBottom: '16px', textTransform: 'uppercase' }}>
                      Released: {new Date(p.releaseDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                    </p>
                  )}
                  <div 
                    style={{ color: '#9C9889', fontSize: 'clamp(1.05rem, 1.5vw, 1.15rem)', fontWeight: 300, lineHeight: 1.85, margin: '0 0 32px' }}
                    dangerouslySetInnerHTML={{ __html: p.description }}
                  />
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    {p.link && (
                      <motion.a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 4 }}
                        style={{
                          color: '#B8704A', fontSize: 13, fontWeight: 600,
                          textTransform: 'uppercase', letterSpacing: '0.15em',
                          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                        }}
                      >
                        View Project
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </motion.a>
                    )}
                    {p.downloadLinks && p.downloadLinks.length > 0 && (
                      <motion.button
                        onClick={() => setActiveDownload({ title: p.title, links: p.downloadLinks })}
                        whileHover={{ x: 4 }}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                          color: '#B8704A', fontSize: 13, fontWeight: 600,
                          textTransform: 'uppercase', letterSpacing: '0.15em',
                          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                        }}
                      >
                        Download APK
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </motion.button>
                    )}
                    {p.installationGuide && (
                      <motion.button
                        onClick={() => setActiveGuide({ title: p.title, content: p.installationGuide })}
                        whileHover={{ x: 4 }}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                          color: '#B8704A', fontSize: 13, fontWeight: 600,
                          textTransform: 'uppercase', letterSpacing: '0.15em',
                          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                        }}
                      >
                        Install Guide
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </motion.button>
                    )}
                  </div>
                </motion.div>

                {/* Divider (Optional, you can remove it or keep it below the whole row) */}
                {i < projects.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{
                      position: 'absolute', bottom: -60, left: 0, right: 0,
                      height: 1, transformOrigin: 'left',
                      background: 'linear-gradient(90deg, transparent 0%, rgba(184,112,74,0.3) 50%, transparent 100%)',
                    }}
                  />
                )}
              </motion.article>
            ))}

            {projects.length === 0 && (
              <p style={{ textAlign: 'center', color: '#7A766C', padding: '60px 0', fontSize: 15 }}>
                No projects published yet. Add one from the admin dashboard!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SKILLS SECTION
          ════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: '120px 24px', background: '#FFFDF8' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 64 }}>
            {/* Section heading */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, amount: 0.3 }}
            >
              <SectionLabel>Expertise</SectionLabel>
              <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1C1B18', lineHeight: 1.1, margin: '0 0 12px' }}>
                Skills & Tools
              </h2>
              <p style={{ color: '#6B6860', fontSize: 14, fontWeight: 300, maxWidth: 400, lineHeight: 1.7 }}>
                Technologies I use to build digital experiences.
              </p>
            </motion.div>

            {/* Skill categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
              {Object.entries(grouped).map(([cat, catSkills]: [string, any], ci) => (
                <motion.div
                  key={cat}
                  variants={fadeUp}
                  custom={ci * 0.08}
                  initial="hidden"
                  whileInView="visible"
                  exit="exit"
                  viewport={{ once: false, amount: 0.2 }}
                >
                  {/* Category name */}
                  <motion.h3
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.4 }}
                    style={{
                      fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.25em', color: '#B8704A', marginBottom: 24,
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}
                  >
                    <span style={{ width: 16, height: 1, background: '#B8704A' }} />
                    {cat}
                  </motion.h3>

                  {/* Individual skills */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {catSkills.map((sk: any, si: number) => (
                      <motion.div
                        key={sk._id}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        viewport={{ once: false, amount: 0.5 }}
                        transition={{ duration: 0.4, delay: si * 0.06 }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ color: '#1C1B18', fontWeight: 600, fontSize: 14 }}>{sk.name}</span>
                          <span style={{ color: '#9C9889', fontSize: 12, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{sk.level || 50}%</span>
                        </div>
                        <div style={{ width: '100%', height: 4, background: '#E6E0D5', borderRadius: 100, overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${sk.level || 50}%` }}
                            viewport={{ once: false }}
                            transition={{ duration: 1.2, delay: 0.1 + si * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            style={{ height: '100%', borderRadius: 100, background: 'linear-gradient(90deg, #B8704A, #D4956E)' }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
              {skills.length === 0 && <p style={{ color: '#9C9889' }}>No skills added yet.</p>}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CERTIFICATIONS SECTION
          ════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: '120px 24px', background: '#F3EDE3' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, amount: 0.3 }}
            style={{ marginBottom: 80 }}
          >
            <SectionLabel>Achievements</SectionLabel>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1C1B18', lineHeight: 1.15, margin: '0 0 12px' }}>
              Credentials & Honors
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
            {sortedCertifications.map((cert: any, i: number) => (
              <motion.div
                key={cert.id}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                custom={i * 0.1}
                style={{ 
                  background: '#FFFDF8', padding: '24px', borderRadius: '16px', 
                  border: '1px solid rgba(184,112,74,0.1)', boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
                  display: 'flex', flexDirection: 'column'
                }}
              >
                {cert.image && (
                  <div style={{ marginBottom: '20px', cursor: 'zoom-in' }} onClick={() => setActiveGallery({ title: cert.name, images: [cert.image] })}>
                    <img src={cert.image} alt={cert.name} style={{ width: '100%', height: '160px', objectFit: 'contain', background: '#F9F6F0', borderRadius: '8px', padding: '12px' }} />
                  </div>
                )}
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1C1B18', margin: '0 0 8px', lineHeight: 1.3 }}>{cert.name}</h3>
                <p style={{ fontSize: '14px', color: '#6B6860', margin: '0 0 16px', flex: 1 }}>{cert.issuer}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E6E0D5', paddingTop: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#9C9889', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cert.date}</span>
                  {cert.link && (
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" style={{ color: '#B8704A', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Verify <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          {certifications.length === 0 && <p style={{ color: '#9C9889', textAlign: 'center' }}>No credentials added yet.</p>}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          EDUCATION SECTION
          ════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: '120px 24px', background: '#FFFDF8' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, amount: 0.3 }}
            style={{ marginBottom: 60 }}
          >
            <SectionLabel>Background</SectionLabel>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1C1B18', lineHeight: 1.15, margin: '0 0 12px' }}>
              Academic Journey
            </h2>
          </motion.div>

          <div style={{ position: 'relative', paddingLeft: '24px' }}>
            {/* Timeline line */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2px', background: '#E6E0D5' }} />
            
            {sortedEducation.map((ed: any, i: number) => (
              <motion.div
                key={ed.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                custom={i * 0.1}
                style={{ position: 'relative', marginBottom: i === education.length - 1 ? 0 : 48 }}
              >
                {/* Timeline dot */}
                <div style={{ position: 'absolute', left: -29, top: 6, width: 12, height: 12, borderRadius: '50%', background: '#B8704A', border: '3px solid #FFFDF8' }} />
                
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1C1B18', margin: '0 0 4px' }}>{ed.degree}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '15px', color: '#B8704A', fontWeight: 600 }}>{ed.institution}</span>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#E6E0D5' }} />
                  <span style={{ fontSize: '13px', color: '#9C9889', fontWeight: 500, letterSpacing: '0.05em' }}>{ed.duration}</span>
                </div>
                {ed.description && (
                  <div 
                    style={{ fontSize: '15px', color: '#6B6860', lineHeight: 1.6, maxWidth: 600 }}
                    dangerouslySetInnerHTML={{ __html: ed.description }}
                  />
                )}
              </motion.div>
            ))}
            {education.length === 0 && <p style={{ color: '#9C9889' }}>No education details added yet.</p>}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CONTACT CTA
          ════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: '140px 24px', background: 'linear-gradient(180deg, #1A1917 0%, #121210 100%)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, amount: 0.3 }}
          >
            <SectionLabel>Contact</SectionLabel>
            <h2 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#E8E4DC', lineHeight: 1.1, margin: '0 0 16px',
            }}>
              Let&apos;s Build Something
            </h2>
            <p style={{ color: '#7A766C', fontSize: 14, fontWeight: 300, maxWidth: 400, margin: '0 auto 48px', lineHeight: 1.7 }}>
              Have a project in mind or just want to connect? I&apos;d love to hear from you.
            </p>
            <motion.a
              href={`mailto:${get('email') || '#'}`}
              whileHover={{ scale: 1.06, boxShadow: '0 12px 40px rgba(184,112,74,0.3)' }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: '#B8704A', color: '#fff',
                padding: '14px 36px', borderRadius: 50,
                fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.12em',
                textDecoration: 'none', cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(184,112,74,0.2)',
                transition: 'background 0.3s',
              }}
            >
              Say Hello
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════════════ */}
      <footer style={{ padding: '24px 24px', background: '#0A0A09' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: '#7A766C', fontSize: 12, fontWeight: 300, margin: 0 }}>
            © {new Date().getFullYear()} {get('hero-title') || 'Portfolio'}
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {get('linkedin-url') && (
              <a href={get('linkedin-url')} target="_blank" rel="noopener noreferrer" style={{ color: '#7A766C', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#B8704A'} onMouseOut={e => e.currentTarget.style.color = '#7A766C'}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            )}
            {get('github-url') && (
              <a href={get('github-url')} target="_blank" rel="noopener noreferrer" style={{ color: '#7A766C', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#B8704A'} onMouseOut={e => e.currentTarget.style.color = '#7A766C'}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            )}
            {get('leetcode-url') && (
              <a href={get('leetcode-url')} target="_blank" rel="noopener noreferrer" style={{ color: '#7A766C', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#B8704A'} onMouseOut={e => e.currentTarget.style.color = '#7A766C'}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125 2.22 5.32 5.32 0 0 0 1.05 2.203 5.27 5.27 0 0 0 1.956 1.408 5.3 5.3 0 0 0 2.253.313 5.265 5.265 0 0 0 2.146-.928l5.426-4.637c.397-.336.599-.861.599-1.42 0-.559-.202-1.084-.599-1.42l-5.426-4.636a1.365 1.365 0 0 0-1.879 0c-.396.335-.599.86-.599 1.419 0 .559.203 1.084.6 1.42l3.418 2.923-3.418 2.923a.36.36 0 0 1-.225.071.36.36 0 0 1-.226-.071.344.344 0 0 1-.09-.232.344.344 0 0 1 .09-.233l2.871-3.076-2.871-3.076a.344.344 0 0 1-.09-.232.344.344 0 0 1 .09-.233l5.405-5.787a.367.367 0 0 1 .253-.118.367.367 0 0 1 .253.118l3.418 2.922 3.418-2.922a.367.367 0 0 1 .253-.118.367.367 0 0 1 .253.118l4.475 4.792c.397.336.599.861.599 1.42 0 .559-.202 1.084-.599 1.42l-4.475 4.792a1.365 1.365 0 0 1-1.879 0c-.396-.335-.599-.86-.599-1.419 0-.559.203-1.084.6-1.42l2.533-2.166-2.533-2.166a.344.344 0 0 0-.09-.233.344.344 0 0 0-.09.233l-2.533 2.166 2.533 2.166a1.365 1.365 0 0 1 0 1.942c-.247.209-.574.316-.94.316-.367 0-.693-.107-.94-.316l-3.418-2.923a1.41 1.41 0 0 1-.413-.972c0-.395.148-.767.413-.972l5.426-4.636a1.374 1.374 0 0 1 .961-.438 1.374 1.374 0 0 1 .96.438l5.405 5.787c1.373 1.47 1.373 3.864 0 5.334l-5.405 5.787a4.116 4.116 0 0 1-2.88 1.314c-1.09 0-2.115-.466-2.88-1.314l-5.426-4.637a4.12 4.12 0 0 1-1.238-2.915c0-1.18.423-2.298 1.238-2.915l3.418-2.923a1.41 1.41 0 0 1 .413-.972c0-.395-.148-.767-.413-.972l-5.426-4.636a1.374 1.374 0 0 1-.961-.438 1.374 1.374 0 0 1-.96.438l-4.475 4.792c-.397.336-.599.861-.599 1.42 0 .559.202 1.084.599 1.42l4.475 4.792a1.365 1.365 0 0 0 1.879 0c.396-.335.599-.86.599-1.419 0-.559-.203-1.084-.6-1.42L7.304 9.155l3.418 2.923a.36.36 0 0 1 .225.071.36.36 0 0 1 .226.071.344.344 0 0 1 .09.232.344.344 0 0 1-.09.233l-2.871 3.076 2.871 3.076a.344.344 0 0 1 .09.232.344.344 0 0 1-.09.233L5.405 24H1.374a1.374 1.374 0 0 1-.961-.438A1.37 1.37 0 0 1 0 22.59v-21.18a1.37 1.37 0 0 1 .413-.972A1.374 1.374 0 0 1 1.374 0h12.109z"/></svg>
              </a>
            )}
          </div>
          <p style={{ color: 'rgba(122,118,108,0.4)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 300, margin: 0 }}>
            Crafted with care
          </p>
        </div>
      </footer>

      {/* ════════════════════════════════════════════════════════
          FULLSCREEN LIGHTBOX
          ════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)',
              display: 'flex', flexDirection: 'column',
            }}
          >
            <div style={{ padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'white', margin: 0, fontSize: 20, fontWeight: 600, fontFamily: "'DM Serif Display', Georgia, serif" }}>{activeGallery.title}</h3>
              <button 
                onClick={() => setActiveGallery(null)}
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
              <GalleryScroll>
                {activeGallery.images.map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{ minWidth: '85vw', maxWidth: '85vw', height: '80vh', scrollSnapAlign: 'center', flexShrink: 0, margin: '0 2vw', borderRadius: 16, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <img src={img} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
                  </motion.div>
                ))}
                {activeGallery.images.length === 0 && (
                  <div style={{ width: '100vw', display: 'flex', justifyContent: 'center' }}>
                    <span style={{ color: '#7A766C' }}>No images available.</span>
                  </div>
                )}
              </GalleryScroll>
            </div>
          </motion.div>
        )}

        {/* Download Links Popup */}
        {activeDownload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              style={{
                background: '#FFFDF8', borderRadius: 16, padding: '32px 40px', width: '100%', maxWidth: 500,
                boxShadow: '0 30px 60px rgba(0,0,0,0.3)', border: '1px solid #E6E0D5',
                position: 'relative'
              }}
            >
              <button 
                onClick={() => setActiveDownload(null)}
                style={{ position: 'absolute', top: 20, right: 20, background: '#E6E0D5', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >✕</button>
              
              <h3 style={{ margin: '0 0 24px', fontSize: 24, fontFamily: "'DM Serif Display', Georgia, serif", color: '#1C1B18' }}>
                Download Options
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {activeDownload.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 20px', borderRadius: 8, border: '1px solid #E6E0D5',
                      textDecoration: 'none', color: '#1C1B18', background: '#FFF',
                      transition: 'all 0.2s', fontWeight: 500
                    }}
                  >
                    {link.name}
                    <svg width="18" height="18" fill="none" stroke="#B8704A" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Installation Guide Popup */}
        {activeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px',
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              style={{
                background: '#FFFDF8', borderRadius: 16, padding: '40px', width: '100%', maxWidth: 700, maxHeight: '80vh',
                boxShadow: '0 30px 60px rgba(0,0,0,0.3)', border: '1px solid #E6E0D5',
                position: 'relative', display: 'flex', flexDirection: 'column'
              }}
            >
              <button 
                onClick={() => setActiveGuide(null)}
                style={{ position: 'absolute', top: 20, right: 20, background: '#E6E0D5', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >✕</button>
              
              <h3 style={{ margin: '0 0 24px', fontSize: 28, fontFamily: "'DM Serif Display', Georgia, serif", color: '#1C1B18' }}>
                Installation Guide
              </h3>
              
              <div 
                style={{ color: '#4A4843', fontSize: '15px', lineHeight: 1.8, overflowY: 'auto', paddingRight: '12px' }}
                dangerouslySetInnerHTML={{ __html: activeGuide.content }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const StackedGallery = ({ p, onClick }: { p: any, onClick: () => void }) => {
  const images = p.images || [];
  
  if (images.length === 0) {
    const fallback = p.image;
    return (
      <motion.div 
        whileHover={{ scale: 1.04 }} 
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ borderRadius: 12, overflow: 'hidden', width: '100%', aspectRatio: '16/10', cursor: 'pointer' }}
        onClick={onClick}
      >
        {fallback ? (
          <img src={fallback} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#1E1D1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#7A766C', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.2em' }}>No Image</span>
          </div>
        )}
      </motion.div>
    );
  }

  const displayImages = images.slice(0, 3).reverse();
  
  return (
    <motion.div 
      style={{ position: 'relative', width: '100%', aspectRatio: '16/10', cursor: 'pointer' }}
      onClick={onClick}
      whileHover="hover"
    >
      {displayImages.map((img: string, reversedIndex: number) => {
        // reversedIndex: if length is 3, index 0 is actually the 3rd image (right), index 1 is 2nd (left), index 2 is 1st (top)
        const total = displayImages.length;
        const actualIndex = total - 1 - reversedIndex;
        
        const isTop = actualIndex === 0;
        const isLeft = actualIndex === 1;
        const isRight = actualIndex === 2;

        const baseZ = 10 - actualIndex;
        const rotate = isTop ? 0 : isLeft ? -8 : 8;
        const xOffset = isTop ? '0%' : isLeft ? '-10%' : '10%';
        const yOffset = isTop ? '0%' : '8%';
        
        return (
          <motion.div
            key={actualIndex}
            variants={{
              hover: { 
                rotate: isTop ? 0 : isLeft ? -14 : 14, 
                x: isTop ? '0%' : isLeft ? '-18%' : '18%', 
                y: isTop ? '-4%' : '12%',
                scale: isTop ? 1.05 : 0.95
              }
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              zIndex: baseZ,
              rotate: rotate,
              x: xOffset,
              y: yOffset,
              scale: isTop ? 1 : 0.92,
              transformOrigin: 'bottom center',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              border: '2px solid rgba(255,255,255,0.05)'
            }}
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              src={img}
              alt={`${p.title} preview`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {isTop && (
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)', opacity: 0.3 }} />
            )}
            {isTop && images.length > 3 && (
              <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em' }}>
                +{images.length - 3} MORE
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};
