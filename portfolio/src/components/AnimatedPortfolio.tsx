'use client';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

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
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */
export function AnimatedPortfolio({ projects, skills, details }: any) {
  const [activeGallery, setActiveGallery] = useState<{ title: string, images: string[] } | null>(null);
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms for hero
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '50%']);
  const heroOp = useTransform(heroScroll, [0, 0.6], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.88]);
  const heroRotate = useTransform(heroScroll, [0, 1], [0, -2]);

  // Global scroll progress bar
  const { scrollYProgress } = useScroll();
  const barScale = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  const get = (key: string) => details.find((d: any) => d.key === key)?.value || '';

  // Group skills
  const grouped = skills.reduce((a: any, s: any) => {
    const c = s.category || 'General';
    (a[c] = a[c] || []).push(s);
    return a;
  }, {} as Record<string, any[]>);

  return (
    <div style={{ width: '100%', position: 'relative', overflowX: 'hidden', fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>

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
          <motion.p
            initial={{ opacity: 0, y: 20, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.3em' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#B8704A', marginBottom: 32 }}
          >
            Portfolio
          </motion.p>

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
            style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: '#6B6860', fontWeight: 300, maxWidth: 420, margin: '0 auto', lineHeight: 1.7 }}
          >
            {get('hero-subtitle') || 'A brief subtitle about you'}
          </motion.p>

          {get('hero-intro') && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', color: '#7A766C', fontWeight: 400, maxWidth: 600, margin: '24px auto 0', lineHeight: 1.8 }}
            >
              {get('hero-intro')}
            </motion.p>
          )}
        </motion.div>


      </section>

      {/* ════════════════════════════════════════════════════════
          ABOUT SECTION
          ════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', padding: '120px 24px', background: '#F3EDE3' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
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

            {/* Body text */}
            <motion.div
              variants={fadeUp}
              custom={0.15}
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: false, amount: 0.3 }}
            >
              <div 
                style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', lineHeight: 1.8, color: '#3A3832', fontWeight: 300, maxWidth: 700 }}
                dangerouslySetInnerHTML={{ __html: get('about-me') || 'Write your biography in the admin dashboard and it will appear here.' }}
              />
            </motion.div>
          </div>

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
              { v: new Date().getFullYear() - 2020, l: 'Years', s: '+' },
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
            {projects.map((p: any, i: number) => (
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
                  <div 
                    style={{ color: '#9C9889', fontSize: 'clamp(1.05rem, 1.5vw, 1.15rem)', fontWeight: 300, lineHeight: 1.85, margin: '0 0 32px' }}
                    dangerouslySetInnerHTML={{ __html: p.description }}
                  />
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
