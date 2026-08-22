'use client';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

/* ─────────────────────────────────────────────────────────────
   UTILITY COMPONENTS
   ───────────────────────────────────────────────────────────── */

// Animated number counter
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
          const dur = 1800;
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

// Section label (used consistently)
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8704A] mb-6">
      <span className="block w-6 h-[1.5px] bg-[#B8704A]" />
      {children}
    </span>
  );
}

// Smooth reveal wrapper
const reveal = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────── */
export function AnimatedPortfolio({ projects, skills, details }: any) {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(heroScroll, [0, 1], ['0%', '35%']);
  const heroOp = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.92]);

  // Global scroll progress → thin accent bar on left
  const { scrollYProgress } = useScroll();
  const barScale = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  const get = (key: string) => details.find((d: any) => d.key === key)?.value || '';

  // Group skills by category
  const grouped = skills.reduce((a: any, s: any) => {
    const c = s.category || 'General';
    (a[c] = a[c] || []).push(s);
    return a;
  }, {} as Record<string, any[]>);

  return (
    <div className="w-full relative">
      {/* Progress bar */}
      <motion.div
        style={{ scaleY: barScale }}
        className="fixed left-0 top-0 w-[2px] h-full bg-[#B8704A] origin-top z-50"
      />

      {/* ════════════════════════════════════════════════════════
          HERO
          ════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden grain"
        style={{ background: 'linear-gradient(180deg, #FFFDF8 0%, #F6F1EA 100%)' }}
      >
        {/* Subtle decorative circle */}
        <div className="absolute w-[600px] h-[600px] rounded-full border border-[#E6E0D5] opacity-30 pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-[#E6E0D5] opacity-20 pointer-events-none" />

        <motion.div
          style={{ y: heroY, opacity: heroOp, scale: heroScale }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SectionLabel>Portfolio</SectionLabel>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.92] tracking-[-0.03em] text-[#1C1B18]"
          >
            {get('hero-title') || 'Your Name'}
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="w-14 h-[1.5px] bg-[#B8704A] mx-auto mt-8 mb-8 origin-left"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="text-lg md:text-xl text-[#6B6860] font-light max-w-lg mx-auto leading-relaxed"
          >
            {get('hero-subtitle') || 'A brief subtitle about you'}
          </motion.p>
        </motion.div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 flex flex-col items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.35em] text-[#9C9889] font-medium">Scroll</span>
          <div className="w-[1px] h-10 bg-[#B8704A]/30 relative overflow-hidden">
            <div className="w-full h-4 bg-[#B8704A] animate-scroll-down" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          ABOUT
          ════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 px-6 grain" style={{ background: '#F6F1EA' }}>
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16"
          >
            <div className="md:col-span-4">
              <SectionLabel>About</SectionLabel>
              <h2 className="font-display text-4xl md:text-5xl text-[#1C1B18] leading-[1.1]">
                Who I Am
              </h2>
            </div>
            <div className="md:col-span-8 flex flex-col">
              <p className="text-lg md:text-[1.35rem] leading-[1.75] text-[#3A3832] font-light">
                {get('about-me') || 'Write your biography in the admin dashboard and it will appear here.'}
              </p>
              <div className="divider mt-14" />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={reveal}
            custom={0.2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          >
            {[
              { v: projects.length, l: 'Projects', s: '+' },
              { v: skills.length, l: 'Skills', s: '+' },
              { v: Object.keys(grouped).length, l: 'Domains', s: '' },
              { v: new Date().getFullYear() - 2020, l: 'Years Exp', s: '+' },
            ].map((s, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="font-display text-4xl md:text-5xl text-[#1C1B18]">
                  <Counter target={s.v} suffix={s.s} />
                </p>
                <p className="text-[#9C9889] text-[11px] uppercase tracking-[0.2em] mt-2 font-semibold">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PROJECTS
          ════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 grain" style={{ background: '#121210' }}>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Header */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-20"
          >
            <div>
              <SectionLabel>Work</SectionLabel>
              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-[#E8E4DC] leading-[1]">
                Selected<br />Projects
              </h2>
            </div>
            <p className="text-[#7A766C] font-light max-w-xs md:text-right text-sm leading-relaxed">
              A curated collection of work reflecting craft and attention to detail.
            </p>
          </motion.div>

          {/* Project cards */}
          <div className="flex flex-col gap-28">
            {projects.map((p: any, i: number) => (
              <motion.article
                key={p._id}
                variants={reveal}
                custom={0.05}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-12%' }}
                className="group"
              >
                <div className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-14 items-center`}>
                  {/* Image */}
                  <div className="w-full md:w-[58%] rounded-xl overflow-hidden relative">
                    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.5 }}>
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="w-full aspect-[16/10] object-cover rounded-xl" />
                      ) : (
                        <div className="w-full aspect-[16/10] bg-[#1E1D1A] rounded-xl flex items-center justify-center">
                          <span className="text-[#7A766C] text-xs uppercase tracking-[0.2em]">No Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-[#B8704A]/0 group-hover:bg-[#B8704A]/8 transition-colors duration-500 rounded-xl" />
                    </motion.div>
                    <span className="absolute top-5 left-5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#B8704A] bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Copy */}
                  <div className="w-full md:w-[42%]">
                    <h3 className="font-display text-3xl md:text-4xl text-[#E8E4DC] mb-4 group-hover:text-[#D4956E] transition-colors duration-300">
                      {p.title}
                    </h3>
                    <p className="text-[#7A766C] text-base font-light leading-relaxed mb-8">
                      {p.description}
                    </p>
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover-line text-[#B8704A] text-sm font-semibold uppercase tracking-[0.15em] inline-flex items-center gap-2"
                      >
                        View Project
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </a>
                    )}
                  </div>
                </div>
                {i < projects.length - 1 && <div className="divider-accent mt-28" />}
              </motion.article>
            ))}

            {projects.length === 0 && (
              <p className="text-center text-[#7A766C] text-base py-20">
                No projects published yet. Add one from the admin dashboard!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SKILLS
          ════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 px-6" style={{ background: '#FFFDF8' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 md:gap-24 relative">
            {/* Sticky heading */}
            <div className="w-full md:w-[35%]">
              <div className="sticky top-28">
                <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <SectionLabel>Expertise</SectionLabel>
                  <h2 className="font-display text-5xl md:text-6xl text-[#1C1B18] leading-[1.05] mb-5">
                    Skills &<br />Tools
                  </h2>
                  <p className="text-[#6B6860] text-base font-light leading-relaxed max-w-xs">
                    Technologies I use to build digital experiences. Scroll to explore.
                  </p>
                  <div className="w-10 h-[1.5px] bg-[#B8704A] mt-8" />
                </motion.div>
              </div>
            </div>

            {/* Skill categories */}
            <div className="w-full md:w-[65%] flex flex-col gap-14">
              {Object.entries(grouped).map(([cat, catSkills]: [string, any], ci) => (
                <motion.div
                  key={cat}
                  variants={reveal}
                  custom={ci * 0.08}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-8%' }}
                >
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8704A] mb-7 flex items-center gap-3">
                    <span className="w-5 h-[1px] bg-[#B8704A]" />
                    {cat}
                  </h3>
                  <div className="flex flex-col gap-5">
                    {catSkills.map((sk: any, si: number) => (
                      <motion.div
                        key={sk._id}
                        initial={{ opacity: 0, x: 15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: si * 0.04 }}
                        className="group"
                      >
                        <div className="flex justify-between items-center mb-2.5">
                          <span className="text-[#1C1B18] font-semibold text-[15px] group-hover:text-[#B8704A] transition-colors">{sk.name}</span>
                          <span className="text-[#9C9889] text-xs font-medium tabular-nums">{sk.level || 50}%</span>
                        </div>
                        <div className="w-full h-[5px] bg-[#E6E0D5] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${sk.level || 50}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.1, delay: 0.15 + si * 0.08, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg, #B8704A, #D4956E)' }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
              {skills.length === 0 && <p className="text-[#9C9889]">No skills added yet.</p>}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CONTACT CTA
          ════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 grain" style={{ background: 'linear-gradient(180deg, #1E1D1A 0%, #121210 100%)' }}>
        <div className="max-w-3xl mx-auto text-center px-6 relative z-10">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionLabel>Contact</SectionLabel>
            <h2 className="font-display text-5xl md:text-7xl text-[#E8E4DC] leading-[1] mb-6">
              Let&apos;s Build<br />Something
            </h2>
            <p className="text-[#7A766C] text-base font-light max-w-md mx-auto mb-14 leading-relaxed">
              Have a project in mind or just want to say hello? I&apos;d love to hear from you.
            </p>
            <motion.a
              href={`mailto:${get('email') || '#'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 bg-[#B8704A] text-white px-10 py-4 rounded-full font-semibold text-sm uppercase tracking-[0.15em] hover:bg-[#A06040] transition-colors shadow-lg shadow-[#B8704A]/20 cursor-pointer"
            >
              Say Hello
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════════════ */}
      <footer className="py-7 bg-[#0A0A09]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[#7A766C] text-xs font-light">
            © {new Date().getFullYear()} {get('hero-title') || 'Portfolio'}
          </p>
          <p className="text-[#7A766C]/40 text-[10px] tracking-[0.2em] uppercase font-light">
            Crafted with care
          </p>
        </div>
      </footer>
    </div>
  );
}
