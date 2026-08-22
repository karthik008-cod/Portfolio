'use client';
import { useState } from 'react';
import { addProject, updateProject } from '@/app/actions';

export function ProjectForm({ project, onCancel }: { project?: any, onCancel?: () => void }) {
  const [imageBase64, setImageBase64] = useState('');

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const isEdit = !!project;
  const action = isEdit ? updateProject : addProject;

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#F6F1EA', padding: '16px', borderRadius: '8px', border: '1px solid #E6E0D5', marginTop: isEdit ? '12px' : '0' }}>
      {isEdit && <input type="hidden" name="id" value={project.id} />}
      
      <input name="title" defaultValue={project?.title} placeholder="Project title" required style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
      <textarea name="description" defaultValue={project?.description} placeholder="Description" required style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', height: '80px', resize: 'none', outline: 'none' }} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <input name="link" defaultValue={project?.link} placeholder="URL (optional)" style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
        <input type="number" name="order" defaultValue={project?.order} placeholder="Order (1, 2...)" style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
      </div>
      
      <div>
        <label style={{ fontSize: '12px', fontWeight: 500, color: '#6B6860', display: 'block', marginBottom: '4px' }}>Image {isEdit && '(Leave empty to keep current)'}</label>
        <input type="file" accept="image/*" onChange={handleImage} style={{ fontSize: '14px', color: '#3A3832' }} />
        <input type="hidden" name="image" value={imageBase64} />
      </div>
      
      {imageBase64 && <img src={imageBase64} alt="Preview" style={{ height: '96px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #E6E0D5', padding: '4px', background: '#FFFDF8' }} />}
      
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <button type="submit" style={{ background: '#B8704A', color: '#fff', padding: '10px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', border: 'none', flex: 1 }}>
          {isEdit ? 'Save Changes' : 'Add Project'}
        </button>
        {isEdit && (
          <button type="button" onClick={onCancel} style={{ background: '#E6E0D5', color: '#1C1B18', padding: '10px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', border: 'none' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
