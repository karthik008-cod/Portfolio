import { connectToDatabase, Project, Skill, Detail } from '@/lib/db';
import { ProjectForm } from '@/components/ProjectForm';
import { deleteProject, deleteSkill, addSkill, updateDetail } from '@/app/actions';

export default async function AdminPage() {
  await connectToDatabase();
  const projects = await Project.find().sort({ order: 1 });
  const skills = await Skill.find();
  const details = await Detail.find();

  // helper to get detail
  const getDetail = (key: string) => details.find(d => d.key === key)?.value || '';

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900 font-sans">
      <h1 className="text-4xl font-bold mb-12 tracking-tight">Portfolio Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Details Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">General Details</h2>
          <form action={updateDetail} className="flex flex-col gap-4 border border-gray-200 p-6 rounded-lg bg-white shadow-sm mb-6">
            <input type="hidden" name="key" value="hero-title" />
            <label className="font-semibold text-sm">Hero Title (e.g. Hi, I am Yuvaan)</label>
            <input name="value" defaultValue={getDetail('hero-title')} className="border border-gray-300 p-2 rounded" />
            <button className="bg-black text-white p-2 rounded w-fit text-sm font-semibold hover:bg-gray-800">Save</button>
          </form>

          <form action={updateDetail} className="flex flex-col gap-4 border border-gray-200 p-6 rounded-lg bg-white shadow-sm mb-6">
            <input type="hidden" name="key" value="hero-subtitle" />
            <label className="font-semibold text-sm">Hero Subtitle</label>
            <input name="value" defaultValue={getDetail('hero-subtitle')} className="border border-gray-300 p-2 rounded" />
            <button className="bg-black text-white p-2 rounded w-fit text-sm font-semibold hover:bg-gray-800">Save</button>
          </form>

          <form action={updateDetail} className="flex flex-col gap-4 border border-gray-200 p-6 rounded-lg bg-white shadow-sm">
            <input type="hidden" name="key" value="about-me" />
            <label className="font-semibold text-sm">About Me</label>
            <textarea name="value" defaultValue={getDetail('about-me')} className="border border-gray-300 p-2 rounded h-32" />
            <button className="bg-black text-white p-2 rounded w-fit text-sm font-semibold hover:bg-gray-800">Save</button>
          </form>
        </section>

        {/* Projects Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Projects</h2>
          <ProjectForm />
          
          <div className="mt-8 flex flex-col gap-4 max-w-md">
            {projects.map(p => (
              <div key={p.id} className="border p-4 rounded-lg bg-white shadow-sm flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  {p.image && <img src={p.image} alt={p.title} className="w-12 h-12 object-cover rounded" />}
                  <div>
                    <h4 className="font-bold">{p.title}</h4>
                    <p className="text-xs text-gray-500">{p.description.substring(0, 40)}...</p>
                  </div>
                </div>
                <form action={deleteProject.bind(null, p.id)}>
                  <button className="text-red-500 font-semibold hover:underline text-sm">Delete</button>
                </form>
              </div>
            ))}
            {projects.length === 0 && <p className="text-gray-500 text-sm">No projects added yet.</p>}
          </div>
        </section>

        {/* Skills Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Skills</h2>
          <form action={addSkill} className="flex flex-col gap-4 border border-gray-200 p-6 rounded-lg bg-white shadow-sm max-w-md">
            <input name="name" placeholder="Skill Name (e.g. React)" className="border p-2 rounded" required />
            <input name="category" placeholder="Category (e.g. Frontend)" className="border p-2 rounded" required />
            <input type="number" name="level" placeholder="Proficiency (1-100)" className="border p-2 rounded" />
            <button className="bg-black text-white p-2 rounded font-semibold w-fit text-sm hover:bg-gray-800">Add Skill</button>
          </form>

          <div className="mt-8 flex flex-col gap-2 max-w-md">
            {skills.map(s => (
              <div key={s.id} className="border p-3 rounded-lg bg-white shadow-sm flex justify-between items-center">
                <span className="font-medium text-sm">{s.name} <span className="text-gray-400 text-xs">({s.category}) - {s.level}%</span></span>
                <form action={deleteSkill.bind(null, s.id)}>
                  <button className="text-red-500 font-semibold hover:underline text-sm">Delete</button>
                </form>
              </div>
            ))}
            {skills.length === 0 && <p className="text-gray-500 text-sm">No skills added yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
