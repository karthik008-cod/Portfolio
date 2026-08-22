'use client';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// Animated counter for stats
function AnimatedCounter({ value, suffix = '' }: { value: number, suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Magnetic cursor effect for buttons
function MagneticButton({ children, href }: { children: React.ReactNode, href?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className="inline-flex items-center gap-2 bg-[#C9A96E] text-[#0D0D0D] px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-widest hover:bg-[#A88B52] transition-colors duration-300 shadow-lg cursor-pointer"
    >
      {children}
    </motion.a>
  );
}

export function AnimatedPortfolio({ projects, skills, details }: any) {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(heroScrollY, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroScrollY, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScrollY, [0, 1], [1, 0.95]);

  // Full page scroll progress for the decorative line
  const { scrollYProgress } = useScroll();
  const lineScaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const getDetail = (key: string) => details.find((d: any) => d.key === key)?.value || '';

  // Group skills by category
  const skillsByCategory = skills.reduce((acc: any, skill: any) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="w-full relative">
      {/* Scroll progress bar — gold accent line on left edge */}
      <motion.div
        style={{ scaleY: lineScaleY }}
        className="fixed left-0 top-0 w-[3px] h-full bg-[#C9A96E] origin-top z-50"
      />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO SECTION — Cream bg, massive serif typography */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="h-screen flex flex-col justify-center items-center overflow-hidden relative bg-[#FAF7F2]">
        {/* Decorative corner lines */}
        <div className="absolute top-12 left-12 w-24 h-24 border-l-2 border-t-2 border-[#C9A96E]/30" />
        <div className="absolute bottom-12 right-12 w-24 h-24 border-r-2 border-b-2 border-[#C9A96E]/30" />

        <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }} className="text-center z-10 px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[#C9A96E] uppercase tracking-[0.3em] text-sm font-semibold mb-8"
          >
            Portfolio
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9]"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {getDetail('hero-title') || "Your Name"}
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-[2px] bg-[#C9A96E] mx-auto mt-8 mb-8"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-[#8C8279] max-w-xl mx-auto font-light leading-relaxed"
          >
            {getDetail('hero-subtitle') || "A brief subtitle about your profession"}
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-12 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C8279]">Scroll</span>
          <div className="w-[1px] h-12 bg-[#C9A96E]/40 relative overflow-hidden">
            <motion.div className="w-full h-1/2 bg-[#C9A96E] animate-scroll-pulse" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ABOUT SECTION — Warm white bg */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-32 px-8 bg-[#F0EBE1] noise-overlay relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start"
          >
            <div className="md:col-span-4">
              <p className="text-[#C9A96E] uppercase tracking-[0.3em] text-xs font-semibold mb-4">About</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                Who I Am
              </h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-xl md:text-2xl leading-relaxed text-[#3D3229] font-light">
                {getDetail('about-me') || "Your about me text goes here. Update this from your admin dashboard!"}
              </p>
              <div className="gradient-line mt-12" />
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          >
            {[
              { value: projects.length, label: 'Projects', suffix: '+' },
              { value: skills.length, label: 'Skills', suffix: '+' },
              { value: Object.keys(skillsByCategory).length, label: 'Domains', suffix: '' },
              { value: new Date().getFullYear() - 2020, label: 'Years Exp.', suffix: '+' },
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="text-4xl md:text-5xl font-bold text-[#1A1A1A]" style={{ fontFamily: 'var(--font-playfair)' }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[#8C8279] text-sm uppercase tracking-widest mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* PROJECTS SECTION — Dark olive/charcoal bg with warm tones */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-32 bg-[#1A1A1A] text-white noise-overlay relative">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20"
          >
            <div>
              <p className="text-[#C9A96E] uppercase tracking-[0.3em] text-xs font-semibold mb-4">Portfolio</p>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter" style={{ fontFamily: 'var(--font-playfair)' }}>
                Selected Work
              </h2>
            </div>
            <p className="text-[#8C8279] mt-4 md:mt-0 font-light max-w-sm text-right">
              A curated collection of projects that showcase craft, creativity, and attention to detail.
            </p>
          </motion.div>

          <div className="flex flex-col gap-24">
            {projects.map((project: any, index: number) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="group"
              >
                <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
                  {/* Image */}
                  <div className="w-full md:w-3/5 overflow-hidden rounded-2xl relative">
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="relative"
                    >
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full aspect-video object-cover rounded-2xl"
                        />
                      ) : (
                        <div className="w-full aspect-video bg-[#2C2C2A] rounded-2xl flex items-center justify-center">
                          <span className="text-[#8C8279] text-sm uppercase tracking-widest">No Image</span>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-[#C9A96E]/0 group-hover:bg-[#C9A96E]/10 transition-colors duration-500 rounded-2xl" />
                    </motion.div>
                    {/* Project number */}
                    <span className="absolute top-6 left-6 text-[#C9A96E] text-xs uppercase tracking-[0.3em] font-bold bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="w-full md:w-2/5">
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight group-hover:text-[#C9A96E] transition-colors duration-300" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {project.title}
                    </h3>
                    <p className="text-[#8C8279] text-lg font-light leading-relaxed mb-8">
                      {project.description}
                    </p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-hover text-[#C9A96E] font-semibold text-sm uppercase tracking-widest inline-flex items-center gap-2"
                      >
                        View Project
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </a>
                    )}
                  </div>
                </div>

                {/* Divider between projects */}
                {index < projects.length - 1 && (
                  <div className="gradient-line mt-24 opacity-30" />
                )}
              </motion.div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[#8C8279] text-lg">No projects added yet. Head to the admin dashboard to publish your first project!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SKILLS SECTION — Cream bg with sticky layout */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-32 px-8 bg-[#FAF7F2] relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-20 relative">
            {/* Sticky left side */}
            <div className="w-full md:w-2/5">
              <div className="sticky top-32">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-[#C9A96E] uppercase tracking-[0.3em] text-xs font-semibold mb-4">Expertise</p>
                  <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Skills &<br />Tools
                  </h2>
                  <p className="text-[#8C8279] text-lg font-light leading-relaxed">
                    Technologies and tools I use to bring ideas to life. Scroll to explore each domain.
                  </p>
                  <div className="w-16 h-[2px] bg-[#C9A96E] mt-8" />
                </motion.div>
              </div>
            </div>

            {/* Scrolling right side — grouped by category */}
            <div className="w-full md:w-3/5 flex flex-col gap-16">
              {Object.entries(skillsByCategory).map(([category, categorySkills]: [string, any], catIdx: number) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.6, delay: catIdx * 0.1 }}
                >
                  <h3 className="text-[#C9A96E] uppercase tracking-[0.2em] text-xs font-bold mb-8 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-[#C9A96E]"></span>
                    {category}
                  </h3>
                  <div className="flex flex-col gap-6">
                    {categorySkills.map((skill: any, i: number) => (
                      <motion.div
                        key={skill._id}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="group"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-xl font-bold text-[#1A1A1A] group-hover:text-[#C9A96E] transition-colors">{skill.name}</h4>
                          <span className="text-[#8C8279] text-sm font-medium">{skill.level || 50}%</span>
                        </div>
                        <div className="w-full bg-[#E8E2D6] h-[6px] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level || 50}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full bg-gradient-to-r from-[#C9A96E] to-[#A88B52] rounded-full"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
              {skills.length === 0 && <p className="text-[#8C8279]">No skills added yet.</p>}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CTA / CONTACT SECTION — Dark mocha bg */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-32 bg-[#3D3229] text-white noise-overlay relative">
        <div className="max-w-4xl mx-auto text-center px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#C9A96E] uppercase tracking-[0.3em] text-xs font-semibold mb-6">Get In Touch</p>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
              Let&apos;s Work<br />Together
            </h2>
            <p className="text-[#8C8279] text-lg font-light max-w-lg mx-auto mb-12 leading-relaxed">
              Have a project in mind? I&apos;d love to hear about it. Let&apos;s create something extraordinary together.
            </p>
            <MagneticButton href={`mailto:${getDetail('email') || '#'}`}>
              Say Hello
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════════════════════ */}
      <footer className="py-8 bg-[#0D0D0D] text-center">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#8C8279] text-sm font-light">
            © {new Date().getFullYear()} {getDetail('hero-title') || 'Portfolio'}. All rights reserved.
          </p>
          <p className="text-[#8C8279]/50 text-xs font-light tracking-widest uppercase">
            Built with craft
          </p>
        </div>
      </footer>
    </div>
  );
}
