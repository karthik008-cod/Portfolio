'use client';
import { useState } from 'react';
import { addProject } from '@/app/actions';

export function ProjectForm() {
  const [imageBase64, setImageBase64] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={addProject} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <input name="title" placeholder="Project Title" className="border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-4 py-2.5 rounded-xl text-sm outline-none transition-all shadow-sm" required />
          <input name="link" placeholder="Project URL (optional)" className="border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-4 py-2.5 rounded-xl text-sm outline-none transition-all shadow-sm" />
          <input type="number" name="order" placeholder="Display Order (e.g. 1)" className="border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-4 py-2.5 rounded-xl text-sm outline-none transition-all shadow-sm" />
        </div>
        <div className="flex flex-col gap-3">
          <textarea name="description" placeholder="Project Description..." className="border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 px-4 py-3 rounded-xl text-sm outline-none transition-all shadow-sm h-full min-h-[120px] resize-none leading-relaxed" required />
        </div>
      </div>
      
      <div 
        className={`mt-2 flex items-center justify-center w-full relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200 ${isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'} ${imageBase64 ? 'p-4' : 'h-32'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleImage(e); }}
      >
        <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
        <input type="hidden" name="image" value={imageBase64} />
        
        {imageBase64 ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <img src={imageBase64} alt="Preview" className="h-32 object-contain rounded-lg shadow-sm bg-white" />
            <span className="text-xs font-semibold text-slate-500">Click or drag to change image</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500 pointer-events-none">
            <svg className="w-8 h-8 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p className="mb-1 text-sm font-semibold">Click to upload or drag and drop</p>
            <p className="text-xs text-slate-400">SVG, PNG, JPG or GIF</p>
          </div>
        )}
      </div>

      <button type="submit" className="bg-indigo-600 text-white p-3.5 rounded-xl font-bold tracking-wide hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg mt-2 active:scale-[0.99]">Publish Project</button>
    </form>
  );
}
