'use client';
import { useState } from 'react';
import { addProject } from '@/app/actions';

export function ProjectForm() {
  const [imageBase64, setImageBase64] = useState('');

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={addProject} className="flex flex-col gap-4 border border-gray-200 p-6 rounded-lg mt-4 max-w-md shadow-sm bg-white">
      <h3 className="font-bold text-xl border-b pb-2 mb-2 text-gray-800">Add New Project</h3>
      <input name="title" placeholder="Project Title" className="border border-gray-300 p-2 rounded text-gray-800" required />
      <textarea name="description" placeholder="Description" className="border border-gray-300 p-2 rounded h-24 text-gray-800" required />
      <input name="link" placeholder="Project URL" className="border border-gray-300 p-2 rounded text-gray-800" />
      <input type="number" name="order" placeholder="Order (e.g. 1)" className="border border-gray-300 p-2 rounded text-gray-800" />
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">Project Image</label>
        <input type="file" accept="image/*" onChange={handleImage} className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
        <input type="hidden" name="image" value={imageBase64} />
      </div>
      
      {imageBase64 && <img src={imageBase64} alt="Preview" className="h-32 object-contain self-start rounded border p-1" />}

      <button type="submit" className="bg-black text-white p-3 rounded-md font-semibold hover:bg-gray-800 transition shadow">Add Project</button>
    </form>
  );
}
