'use client';
import { useState } from 'react';
import { deleteProject } from '@/app/actions';
import { ProjectForm } from './ProjectForm';

export function ProjectList({ projects }: { projects: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
      {projects.map(p => (
        <div key={p.id} style={{ padding: '12px', background: '#FFFDF8', borderRadius: '4px', border: '1px solid #E6E0D5' }}>
          {editingId === p.id ? (
            <ProjectForm project={p} onCancel={() => setEditingId(null)} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {(p.images?.length > 0 ? p.images[0] : p.image) && <img src={p.images?.length > 0 ? p.images[0] : p.image} alt={p.title} style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }} />}
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: '#1C1B18' }}>{p.title}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6B6860', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setEditingId(p.id)} style={{ background: 'none', border: 'none', color: '#B8704A', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                <form action={deleteProject.bind(null, p.id)}>
                  <button style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                </form>
              </div>
            </div>
          )}
        </div>
      ))}
      {projects.length === 0 && <p style={{ fontSize: '14px', color: '#9C9889', textAlign: 'center', padding: '16px 0' }}>No projects yet.</p>}
    </div>
  );
}
