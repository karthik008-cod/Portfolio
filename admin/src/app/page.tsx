import { connectToDatabase, Project, Skill, Detail, Education, Certification } from '@/lib/db';
import { ProjectForm } from '@/components/ProjectForm';
import { ProjectList } from '@/components/ProjectList';
import { SkillList } from '@/components/SkillList';
import { EducationForm } from '@/components/EducationForm';
import { EducationList } from '@/components/EducationList';
import { CertificationForm } from '@/components/CertificationForm';
import { CertificationList } from '@/components/CertificationList';
import { addSkill, updateAllDetails } from '@/app/actions';
import { SubmitButton } from '@/components/SubmitButton';
import { RichTextInput } from '@/components/RichTextInput';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  await connectToDatabase();
  const projects = await Project.find().sort({ order: 1 });
  const skills = await Skill.find();
  const details = await Detail.find();
  const education = await Education.find().sort({ order: 1 });
  const certifications = await Certification.find().sort({ order: 1 });

  const getDetail = (key: string) => details.find(d => d.key === key)?.value || '';

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF8', color: '#1C1B18', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <header style={{ background: '#FFF', borderBottom: '1px solid #E6E0D5', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1C1B18' }}>Portfolio Admin</h1>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#B8704A', background: 'rgba(184,112,74,0.1)', padding: '4px 10px', borderRadius: '100px' }}>Dashboard</span>
      </header>

      <main style={{ maxWidth: '1024px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Personal Details */}
        <section style={{ background: '#FFF', border: '1px solid #E6E0D5', borderRadius: '8px', padding: '24px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid #F6F1EA' }}>Personal Details</h2>

          <form action={updateAllDetails}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B6860' }}>Hero Title</label>
                <input name="hero-title" defaultValue={getDetail('hero-title')} placeholder="Hi, I'm Yuvaa Kaarthikeyaa" style={{ flex: 1, border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B6860' }}>Hero Subtitle</label>
                <input name="hero-subtitle" defaultValue={getDetail('hero-subtitle')} placeholder="Student / Developer" style={{ flex: 1, border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B6860' }}>Contact Email</label>
                <input name="email" defaultValue={getDetail('email')} placeholder="hello@example.com" type="email" style={{ flex: 1, border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B6860' }}>Hero Intro (Paragraph)</label>
                <textarea name="hero-intro" defaultValue={getDetail('hero-intro')} placeholder="I build software around problems worth solving..." style={{ flex: 1, border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none', minHeight: '60px', resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B6860', marginBottom: '4px' }}>About Me</label>
              <RichTextInput name="about-me" defaultValue={getDetail('about-me')} placeholder="Your biography..." />
              <SubmitButton pendingText="Saving All Details..." style={{ alignSelf: 'flex-start', background: '#1C1B18', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', fontSize: '14px', fontWeight: 600, marginTop: '12px' }}>Save All Details</SubmitButton>
            </div>
          </form>
        </section>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>

          {/* Projects */}
          <section style={{ background: '#FFF', border: '1px solid #E6E0D5', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #F6F1EA' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Projects</h2>
              <span style={{ fontSize: '12px', color: '#9C9889' }}>{projects.length} total</span>
            </div>

            <ProjectForm />
            
            <ProjectList projects={projects.map(p => ({
              id: p.id, title: p.title, description: p.description || '', link: p.link || '', image: p.image || '', images: p.images ? Array.from(p.images) : [], order: p.order || 0
            }))} />
          </section>

          {/* Skills */}
          <section style={{ background: '#FFF', border: '1px solid #E6E0D5', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #F6F1EA' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Skills</h2>
              <span style={{ fontSize: '12px', color: '#9C9889' }}>{skills.length} total</span>
            </div>

            <form action={addSkill} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#F6F1EA', padding: '16px', borderRadius: '8px', border: '1px solid #E6E0D5', marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input name="name" placeholder="Skill name" required style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
                <input name="category" placeholder="Category" required style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="number" name="level" placeholder="Level (1-100)" min="1" max="100" style={{ width: '120px', border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
                <SubmitButton pendingText="Adding..." style={{ flex: 1, background: '#B8704A', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 500 }}>Add Skill</SubmitButton>
              </div>
            </form>

            <SkillList skills={skills.map(s => ({
              id: s.id, name: s.name, category: s.category || '', level: s.level || 50
            }))} />
          </section>
        </div>

        {/* Second Row for Education and Certifications */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px', marginTop: '32px' }}>

          {/* Education */}
          <section style={{ background: '#FFF', border: '1px solid #E6E0D5', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #F6F1EA' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Academic Journey</h2>
              <span style={{ fontSize: '12px', color: '#9C9889' }}>{education.length} total</span>
            </div>

            <EducationForm />
            
            <EducationList education={education.map(ed => ({
              id: ed.id, degree: ed.degree, institution: ed.institution, duration: ed.duration, description: ed.description || '', order: ed.order || 0
            }))} />
          </section>

          {/* Certifications */}
          <section style={{ background: '#FFF', border: '1px solid #E6E0D5', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #F6F1EA' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Credentials & Honors</h2>
              <span style={{ fontSize: '12px', color: '#9C9889' }}>{certifications.length} total</span>
            </div>

            <CertificationForm />

            <CertificationList certifications={certifications.map(c => ({
              id: c.id, name: c.name, issuer: c.issuer, date: c.date, link: c.link || '', image: c.image || '', order: c.order || 0
            }))} />
          </section>
        </div>
      </main>
    </div>
  );
}
