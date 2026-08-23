'use client';
import { useState } from 'react';
import { deleteCertification } from '@/app/actions';
import { SubmitButton } from './SubmitButton';
import { CertificationForm } from './CertificationForm';

export function CertificationList({ certifications }: { certifications: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {certifications.map(cert => (
        <div key={cert.id} style={{ padding: '16px', background: '#FFFDF8', borderRadius: '8px', border: '1px solid #E6E0D5' }}>
          {editingId === cert.id ? (
            <CertificationForm certification={cert} onCancel={() => setEditingId(null)} />
          ) : (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {cert.image && (
                <img 
                  src={cert.image} 
                  alt={cert.name}
                  onClick={() => setPreviewImage(cert.image)}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E6E0D5', cursor: 'zoom-in' }} 
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: '#1C1B18' }}>{cert.name}</h4>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6B6860', fontWeight: 600 }}>{cert.issuer} <span style={{ color: '#9C9889', fontWeight: 400, marginLeft: '8px' }}>{cert.date}</span></p>
                    {cert.link && (
                      <a href={cert.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', color: '#B8704A', textDecoration: 'none', fontWeight: 600 }}>
                        View Credential ↗
                      </a>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setEditingId(cert.id)} style={{ background: 'none', border: 'none', color: '#B8704A', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Edit</button>
                    <form action={deleteCertification.bind(null, cert.id)}>
                      <SubmitButton pendingText="Deleting..." style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '12px', fontWeight: 600 }}>Delete</SubmitButton>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Lightbox */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', cursor: 'zoom-out' }}
        >
          <img src={previewImage} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
        </div>
      )}

      {certifications.length === 0 && <p style={{ fontSize: '14px', color: '#9C9889', textAlign: 'center', padding: '16px 0' }}>No certifications yet.</p>}
    </div>
  );
}
