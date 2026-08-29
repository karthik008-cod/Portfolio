'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

const fadeUp: any = {
  hidden: { opacity: 0, y: 60 },
  visible: (d: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <section style={{ position: 'relative', padding: '120px 24px', background: '#1C1B18', color: '#F3EDE3' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#B8704A', display: 'block', marginBottom: 16 }}>
            Get in touch
          </span>
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05, margin: '0 0 24px' }}>
            Let's build something together.
          </h2>
          <p style={{ color: '#9C9889', fontSize: 16, marginBottom: 48 }}>
            Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>

          {status === 'success' ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: 32, background: 'rgba(184,112,74,0.1)', border: '1px solid #B8704A', borderRadius: 12 }}>
              <h3 style={{ color: '#B8704A', fontSize: 24, margin: '0 0 12px', fontFamily: "'DM Serif Display', serif" }}>Message Sent!</h3>
              <p style={{ margin: 0, color: '#9C9889' }}>Thanks for reaching out. I'll get back to you shortly.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#9C9889' }}>Name</label>
                <input required type="text" style={{ width: '100%', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#FFF', outline: 'none', transition: 'border 0.3s ease' }} placeholder="Your Name" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#9C9889' }}>Email</label>
                <input required type="email" style={{ width: '100%', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#FFF', outline: 'none', transition: 'border 0.3s ease' }} placeholder="your@email.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, color: '#9C9889' }}>Message</label>
                <textarea required rows={4} style={{ width: '100%', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#FFF', outline: 'none', resize: 'none' }} placeholder="How can I help you?"></textarea>
              </div>
              <button disabled={status === 'submitting'} type="submit" style={{ marginTop: 16, padding: '16px', background: '#B8704A', color: '#FFF', border: 'none', borderRadius: 8, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, cursor: 'pointer', transition: 'background 0.3s' }}>
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
