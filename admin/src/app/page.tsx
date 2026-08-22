import { connectToDatabase, Project, Skill, Detail } from '@/lib/db';
import { ProjectForm } from '@/components/ProjectForm';
import { ProjectList } from '@/components/ProjectList';
import { SkillList } from '@/components/SkillList';
import { addSkill, updateDetail } from '@/app/actions';
import { SubmitButton } from '@/components/SubmitButton';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  await connectToDatabase();
  const projects = await Project.find().sort({ order: 1 });
  const skills = await Skill.find();
  const details = await Detail.find();

  const getDetail = (key: string) => details.find(d => d.key === key)?.value || '';

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF8', color: '#1C1B18', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <header style={{ background: '#FFF', borderBottom: '1px solid #E6E0D5', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1C1B18' }}>Portfolio Admin</h1>
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#B8704A', background: 'rgba(184,112,74,0.1)', padding: '4px 10px', borderRadius: '100px' }}>Dashboard</span>
      </header>

      <main style={{ maxWidth: '1024px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Personal Details */}
        <section style={{ background: '#FFF', border: '1px solid #E6E0D5', borderRadius: '8px', padding: '24px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 20px', paddingBottom: '12px', borderBottom: '1px solid #F6F1EA' }}>Personal Details</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <form action={updateDetail} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <input type="hidden" name="key" value="hero-title" />
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B6860' }}>Hero Title</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input name="value" defaultValue={getDetail('hero-title')} placeholder="Hi, I'm Yuvaan" style={{ flex: 1, border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
                <SubmitButton style={{ background: '#1C1B18', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>Save</SubmitButton>
              </div>
            </form>

            <form action={updateDetail} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <input type="hidden" name="key" value="hero-subtitle" />
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B6860' }}>Hero Subtitle</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input name="value" defaultValue={getDetail('hero-subtitle')} placeholder="Student / Developer" style={{ flex: 1, border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
                <SubmitButton style={{ background: '#1C1B18', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>Save</SubmitButton>
              </div>
            </form>
            
            <form action={updateDetail} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <input type="hidden" name="key" value="email" />
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B6860' }}>Contact Email</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input name="value" defaultValue={getDetail('email')} placeholder="hello@example.com" type="email" style={{ flex: 1, border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
                <SubmitButton style={{ background: '#1C1B18', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>Save</SubmitButton>
              </div>
            </form>
          </div>

          <form action={updateDetail} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '20px' }}>
            <input type="hidden" name="key" value="about-me" />
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#6B6860' }}>About Me</label>
            <textarea name="value" defaultValue={getDetail('about-me')} placeholder="Your biography..." style={{ width: '100%', border: '1px solid #E6E0D5', padding: '12px', borderRadius: '4px', fontSize: '14px', height: '100px', resize: 'none', outline: 'none', fontFamily: 'inherit' }} />
            <SubmitButton style={{ alignSelf: 'flex-start', background: '#1C1B18', color: '#fff', border: 'none', padding: '8px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: 500, marginTop: '8px' }}>Save Biography</SubmitButton>
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
              id: p.id, title: p.title, description: p.description, link: p.link, image: p.image, images: p.images, order: p.order
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
              id: s.id, name: s.name, category: s.category, level: s.level
            }))} />
          </section>
        </div>
      </main>
    </div>
  );
}
