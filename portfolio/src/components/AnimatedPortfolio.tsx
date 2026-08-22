'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function AnimatedPortfolio({ projects, skills, details }: any) {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Parallax effects
  const heroY = useTransform(heroScrollY, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(heroScrollY, [0, 1], [1, 0]);

  const getDetail = (key: string) => details.find((d: any) => d.key === key)?.value || '';

  return (
    <div className="w-full">
      {/* 1. Hero Section with Parallax */}
      <section ref={heroRef} className="h-screen flex flex-col justify-center items-center overflow-hidden relative border-b border-gray-100">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="text-center z-10 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-extrabold tracking-tighter"
          >
            {getDetail('hero-title') || "Your Name"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto font-light"
          >
            {getDetail('hero-subtitle') || "A brief subtitle about your profession"}
          </motion.p>
        </motion.div>
      </section>

      {/* About Me Section */}
      <section className="py-24 px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6">About</h2>
          <p className="text-xl leading-relaxed text-gray-700 font-light">
            {getDetail('about-me') || "Your about me text goes here. Update this from your admin dashboard!"}
          </p>
        </motion.div>
      </section>

      {/* 2. Projects with Scroll-Triggered Fade/Slide */}
      <section className="py-32 bg-gray-50 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-24 text-center tracking-tight">Selected Work</h2>
          <div className="flex flex-col gap-32">
            {projects.map((project: any, index: number) => (
              <motion.div 
                key={project._id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col md:flex-row gap-12 items-center"
              >
                <div className={`w-full md:w-1/2 ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full rounded-xl shadow-2xl hover:scale-[1.02] transition-transform duration-500" />
                  ) : (
                    <div className="w-full aspect-video bg-gray-200 rounded-xl"></div>
                  )}
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-4xl font-bold mb-4">{project.title}</h3>
                  <p className="text-gray-600 mb-8 text-lg font-light leading-relaxed">{project.description}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-block border-b border-black pb-1 font-semibold hover:text-gray-600 transition">
                      View Project
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
            {projects.length === 0 && <p className="text-center text-gray-500">No projects added yet.</p>}
          </div>
        </div>
      </section>

      {/* 3. Skills with Sticky/Pinned Element */}
      <section className="py-32 px-8 max-w-6xl mx-auto relative min-h-screen">
        <div className="flex flex-col md:flex-row gap-16 relative h-full">
          {/* Sticky left side */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-32">
              <h2 className="text-5xl font-bold mb-6 tracking-tight leading-tight">Skills &<br/>Expertise</h2>
              <p className="text-gray-500 text-lg font-light">
                Technologies and tools I use to bring ideas to life. Keep scrolling to explore.
              </p>
            </div>
          </div>
          
          {/* Scrolling right side */}
          <div className="w-full md:w-2/3 flex flex-col gap-12">
            {skills.map((skill: any, i: number) => (
              <motion.div 
                key={skill._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-10%" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border-b border-gray-200 pb-8"
              >
                <div className="flex justify-between items-end mb-4">
                  <h4 className="text-3xl font-bold">{skill.name}</h4>
                  <span className="text-gray-400 font-medium uppercase tracking-widest text-sm">{skill.category}</span>
                </div>
                {/* Visual bar */}
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden mt-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="h-full bg-black"
                  ></motion.div>
                </div>
              </motion.div>
            ))}
            {skills.length === 0 && <p className="text-gray-500">No skills added yet.</p>}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t text-center text-gray-400 font-light text-sm">
        <p>© {new Date().getFullYear()} {getDetail('hero-title')}. All rights reserved.</p>
      </footer>
    </div>
  );
}
