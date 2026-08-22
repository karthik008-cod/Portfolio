'use client';
import { useState } from 'react';
import { deleteSkill, updateSkill } from '@/app/actions';

export function SkillList({ skills }: { skills: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {skills.map(s => (
        <div key={s.id} style={{ padding: '12px', background: '#FFFDF8', borderRadius: '4px', border: '1px solid #E6E0D5' }}>
          {editingId === s.id ? (
            <form action={(formData) => { updateSkill(formData); setEditingId(null); }} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input type="hidden" name="id" value={s.id} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input name="name" defaultValue={s.name} placeholder="Skill name" required style={{ border: '1px solid #E6E0D5', padding: '6px 8px', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
                <input name="category" defaultValue={s.category} placeholder="Category" required style={{ border: '1px solid #E6E0D5', padding: '6px 8px', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="number" name="level" defaultValue={s.level} placeholder="Level %" min="1" max="100" style={{ width: '80px', border: '1px solid #E6E0D5', padding: '6px 8px', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
                <button type="submit" style={{ flex: 1, background: '#B8704A', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                <button type="button" onClick={() => setEditingId(null)} style={{ flex: 1, background: '#E6E0D5', color: '#1C1B18', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1C1B18' }}>{s.name}</span>
                <span style={{ fontSize: '12px', color: '#9C9889', marginLeft: '8px' }}>{s.category} · {s.level}%</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setEditingId(s.id)} style={{ background: 'none', border: 'none', color: '#B8704A', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                <form action={deleteSkill.bind(null, s.id)}>
                  <button style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                </form>
              </div>
            </div>
          )}
        </div>
      ))}
      {skills.length === 0 && <p style={{ fontSize: '14px', color: '#9C9889', textAlign: 'center', padding: '16px 0' }}>No skills yet.</p>}
    </div>
  );
}
