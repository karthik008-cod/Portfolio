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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-inner">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Portfolio <span className="text-indigo-600">Admin</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">LIVE DASHBOARD</span>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-8 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Left Column: Details & Skills */}
          <div className="xl:col-span-5 flex flex-col gap-10">
            
            {/* General Details Panel */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50/80 border-b border-slate-100 px-6 py-5">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Personal Details
                </h2>
              </div>
              <div className="p-6 flex flex-col gap-6">
                <form action={updateDetail} className="flex flex-col gap-2 relative group">
                  <input type="hidden" name="key" value="hero-title" />
                  <label className="text-sm font-semibold text-slate-600">Hero Title</label>
                  <div className="flex gap-2">
                    <input name="value" defaultValue={getDetail('hero-title')} placeholder="Hi, I am Yuvaan" className="flex-1 border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-4 py-2.5 rounded-xl text-sm outline-none transition-all shadow-sm" />
                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-all shadow-md hover:shadow-lg active:scale-95">Save</button>
                  </div>
                </form>

                <form action={updateDetail} className="flex flex-col gap-2 relative group">
                  <input type="hidden" name="key" value="hero-subtitle" />
                  <label className="text-sm font-semibold text-slate-600">Hero Subtitle</label>
                  <div className="flex gap-2">
                    <input name="value" defaultValue={getDetail('hero-subtitle')} placeholder="A brief description..." className="flex-1 border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-4 py-2.5 rounded-xl text-sm outline-none transition-all shadow-sm" />
                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-all shadow-md hover:shadow-lg active:scale-95">Save</button>
                  </div>
                </form>

                <form action={updateDetail} className="flex flex-col gap-2 relative group">
                  <input type="hidden" name="key" value="about-me" />
                  <label className="text-sm font-semibold text-slate-600">About Me</label>
                  <textarea name="value" defaultValue={getDetail('about-me')} placeholder="Write your full biography here..." className="w-full border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-4 py-3 rounded-xl text-sm outline-none transition-all shadow-sm h-32 resize-none leading-relaxed" />
                  <button className="bg-slate-900 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-md hover:shadow-lg mt-2 active:scale-[0.98]">Save Biography</button>
                </form>
              </div>
            </section>

            {/* Skills Panel */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50/80 border-b border-slate-100 px-6 py-5 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Skills Management
                </h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-md">{skills.length}</span>
              </div>
              
              <div className="p-6">
                <form action={addSkill} className="flex flex-col gap-3 bg-slate-50 p-5 rounded-xl border border-slate-200 mb-8 shadow-inner">
                  <div className="grid grid-cols-2 gap-3">
                    <input name="name" placeholder="Skill Name" className="border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-3 py-2.5 rounded-lg text-sm outline-none transition-all shadow-sm" required />
                    <input name="category" placeholder="Category" className="border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-3 py-2.5 rounded-lg text-sm outline-none transition-all shadow-sm" required />
                  </div>
                  <div className="flex gap-3 items-center">
                    <input type="number" name="level" placeholder="Level %" min="1" max="100" className="w-24 border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-3 py-2.5 rounded-lg text-sm outline-none transition-all shadow-sm text-center" />
                    <button className="flex-1 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95">Add Skill</button>
                  </div>
                </form>

                <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
                  {skills.map(s => (
                    <div key={s.id} className="group flex justify-between items-center p-3.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all shadow-sm">
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 text-sm flex items-center gap-3">
                          {s.name} 
                          <span className="bg-slate-200 text-slate-600 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-widest">{s.category}</span>
                        </div>
                        <div className="w-3/4 bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${s.level || 50}%` }}></div>
                        </div>
                      </div>
                      <form action={deleteSkill.bind(null, s.id)}>
                        <button className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </form>
                    </div>
                  ))}
                  {skills.length === 0 && <p className="text-slate-500 text-sm text-center py-6 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-300">No skills added yet.</p>}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Projects */}
          <div className="xl:col-span-7">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
              <div className="bg-slate-50/80 border-b border-slate-100 px-8 py-5 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                  Projects Repository
                </h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1.5 rounded-md">{projects.length} Published</span>
              </div>
              
              <div className="p-8 border-b border-slate-200 bg-slate-50/50">
                <ProjectForm />
              </div>

              <div className="p-8 flex-1 bg-slate-50/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map(p => (
                    <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all relative group hover:-translate-y-1">
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <form action={deleteProject.bind(null, p.id)}>
                          <button className="bg-white text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg shadow-sm border border-slate-200 hover:border-red-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </form>
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center relative">
                          {p.image ? (
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          )}
                          {p.link && (
                            <a href={p.link} target="_blank" rel="noreferrer" className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-indigo-600 p-2 rounded-lg shadow-sm hover:scale-105 transition-transform">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            </a>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-lg text-slate-900 leading-tight mb-2 pr-10">{p.title}</h4>
                          <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{p.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {projects.length === 0 && (
                    <div className="col-span-full py-16 text-center text-slate-500 bg-white border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg mb-1">No projects found</h3>
                      <p className="text-sm">Publish your first project using the form above.</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}
