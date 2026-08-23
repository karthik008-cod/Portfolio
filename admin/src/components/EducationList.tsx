'use client';
import { useState } from 'react';
import { deleteEducation, updateEducation } from '@/app/actions';
import { SubmitButton } from './SubmitButton';
import { RichTextInput } from './RichTextInput';

export function EducationList({ education }: { education: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {education.map(ed => (
        <div key={ed.id} style={{ padding: '16px', background: '#FFFDF8', borderRadius: '8px', border: '1px solid #E6E0D5' }}>
          {editingId === ed.id ? (
            <form action={(formData) => { updateEducation(formData); setEditingId(null); }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="hidden" name="id" value={ed.id} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input name="degree" defaultValue={ed.degree} placeholder="Degree / Title" required style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
                <input name="institution" defaultValue={ed.institution} placeholder="Institution" required style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input name="duration" defaultValue={ed.duration} placeholder="Duration (e.g., 2020 - 2024)" required style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
                <input type="number" name="order" defaultValue={ed.order} placeholder="Order (1, 2...)" style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
              </div>
              <RichTextInput name="description" defaultValue={ed.description} placeholder="Description (optional)" />
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <SubmitButton style={{ flex: 1, background: '#B8704A', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 600 }}>Save Changes</SubmitButton>
                <button type="button" onClick={() => setEditingId(null)} style={{ flex: 1, background: '#E6E0D5', color: '#1C1B18', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: '#1C1B18' }}>{ed.degree}</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6B6860', fontWeight: 600 }}>{ed.institution} <span style={{ color: '#9C9889', fontWeight: 400, marginLeft: '8px' }}>{ed.duration}</span></p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setEditingId(ed.id)} style={{ background: 'none', border: 'none', color: '#B8704A', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                  <form action={deleteEducation.bind(null, ed.id)}>
                    <SubmitButton pendingText="Deleting..." style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '12px', fontWeight: 600 }}>Delete</SubmitButton>
                  </form>
                </div>
              </div>
              {ed.description && (
                <div 
                  style={{ fontSize: '14px', color: '#6B6860', lineHeight: 1.6 }}
                  dangerouslySetInnerHTML={{ __html: ed.description }}
                />
              )}
            </div>
          )}
        </div>
      ))}
      {education.length === 0 && <p style={{ fontSize: '14px', color: '#9C9889', textAlign: 'center', padding: '16px 0' }}>No education entries yet.</p>}
    </div>
  );
}
