import { connectToDatabase, Project, Skill, Detail } from '@/lib/db';
import { ProjectForm } from '@/components/ProjectForm';
import { deleteProject, deleteSkill, addSkill, updateDetail } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  await connectToDatabase();
  const projects = await Project.find().sort({ order: 1 });
  const skills = await Skill.find();
  const details = await Detail.find();

  const getDetail = (key: string) => details.find(d => d.key === key)?.value || '';

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-bold text-gray-900">Portfolio Admin</h1>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Dashboard</span>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* Personal Details */}
        <section className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">Personal Details</h2>

          <form action={updateDetail} className="mb-4">
            <input type="hidden" name="key" value="hero-title" />
            <label className="text-sm font-medium text-gray-600 block mb-1">Hero Title</label>
            <div className="flex gap-2">
              <input name="value" defaultValue={getDetail('hero-title')} placeholder="Hi, I'm Yuvaan" className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-500" />
              <button className="bg-gray-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700">Save</button>
            </div>
          </form>

          <form action={updateDetail} className="mb-4">
            <input type="hidden" name="key" value="hero-subtitle" />
            <label className="text-sm font-medium text-gray-600 block mb-1">Hero Subtitle</label>
            <div className="flex gap-2">
              <input name="value" defaultValue={getDetail('hero-subtitle')} placeholder="Student / Developer" className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-500" />
              <button className="bg-gray-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700">Save</button>
            </div>
          </form>

          <form action={updateDetail}>
            <input type="hidden" name="key" value="about-me" />
            <label className="text-sm font-medium text-gray-600 block mb-1">About Me</label>
            <textarea name="value" defaultValue={getDetail('about-me')} placeholder="Your biography..." className="w-full border border-gray-300 px-3 py-2 rounded text-sm h-28 resize-none focus:outline-none focus:border-gray-500" />
            <button className="bg-gray-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 mt-2">Save</button>
          </form>
        </section>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Projects */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex justify-between items-center">
              Projects
              <span className="text-xs text-gray-400 font-normal">{projects.length} total</span>
            </h2>

            <ProjectForm />

            <div className="mt-6 flex flex-col gap-3">
              {projects.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                  <div className="flex items-center gap-3">
                    {p.image && <img src={p.image} alt={p.title} className="w-10 h-10 rounded object-cover" />}
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{p.title}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[180px]">{p.description}</p>
                    </div>
                  </div>
                  <form action={deleteProject.bind(null, p.id)}>
                    <button className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                  </form>
                </div>
              ))}
              {projects.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No projects yet.</p>}
            </div>
          </section>

          {/* Skills */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-base font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100 flex justify-between items-center">
              Skills
              <span className="text-xs text-gray-400 font-normal">{skills.length} total</span>
            </h2>

            <form action={addSkill} className="flex flex-col gap-3 mb-6 bg-gray-50 p-4 rounded border border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <input name="name" placeholder="Skill name" className="border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-500" required />
                <input name="category" placeholder="Category" className="border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-500" required />
              </div>
              <div className="flex gap-3">
                <input type="number" name="level" placeholder="Level (1-100)" min="1" max="100" className="w-28 border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-500" />
                <button className="flex-1 bg-gray-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700">Add</button>
              </div>
            </form>

            <div className="flex flex-col gap-2">
              {skills.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                  <div>
                    <span className="text-sm font-semibold text-gray-800">{s.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{s.category} · {s.level}%</span>
                  </div>
                  <form action={deleteSkill.bind(null, s.id)}>
                    <button className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                  </form>
                </div>
              ))}
              {skills.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No skills yet.</p>}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
