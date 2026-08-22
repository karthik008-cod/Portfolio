'use client';
import { useState } from 'react';
import { addProject } from '@/app/actions';

export function ProjectForm() {
  const [imageBase64, setImageBase64] = useState('');

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={addProject} className="flex flex-col gap-3 bg-gray-50 p-4 rounded border border-gray-100">
      <input name="title" placeholder="Project title" className="border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-500" required />
      <textarea name="description" placeholder="Description" className="border border-gray-300 px-3 py-2 rounded text-sm h-20 resize-none focus:outline-none focus:border-gray-500" required />
      <div className="grid grid-cols-2 gap-3">
        <input name="link" placeholder="URL (optional)" className="border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-500" />
        <input type="number" name="order" placeholder="Order (1, 2...)" className="border border-gray-300 px-3 py-2 rounded text-sm focus:outline-none focus:border-gray-500" />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-500 block mb-1">Image</label>
        <input type="file" accept="image/*" onChange={handleImage} className="text-sm text-gray-600" />
        <input type="hidden" name="image" value={imageBase64} />
      </div>
      {imageBase64 && <img src={imageBase64} alt="Preview" className="h-24 object-contain rounded border border-gray-200 p-1" />}
      <button type="submit" className="bg-gray-900 text-white px-4 py-2.5 rounded text-sm font-medium hover:bg-gray-700 mt-1">Add Project</button>
    </form>
  );
}
