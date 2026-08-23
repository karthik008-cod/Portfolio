'use client';
import { useRef, useState } from 'react';
import { addCertification, updateCertification } from '@/app/actions';
import { SubmitButton } from './SubmitButton';

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 1280;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height *= MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width *= MAX_HEIGHT / height));
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.7));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export function CertificationForm({ certification, onCancel }: { certification?: any, onCancel?: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = !!certification;
  const [image, setImage] = useState<string>(certification?.image || '');

  const handleSubmit = async (formData: FormData) => {
    if (isEdit) {
      await updateCertification(formData);
      if (onCancel) onCancel();
    } else {
      await addCertification(formData);
      formRef.current?.reset();
      setImage('');
    }
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImage(file);
      setImage(compressedDataUrl);
    } catch (err) {
      console.error("Error compressing image", err);
    }
    
    e.target.value = '';
  };

  return (
    <form ref={formRef} action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#F6F1EA', padding: '16px', borderRadius: '8px', border: '1px solid #E6E0D5', marginBottom: isEdit ? 0 : '24px' }}>
      {isEdit && <input type="hidden" name="id" value={certification.id} />}
      <input type="hidden" name="image" value={image} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <input name="name" defaultValue={certification?.name} placeholder="Certification Name" required style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
        <input name="issuer" defaultValue={certification?.issuer} placeholder="Issuer (e.g., Google, AWS)" required style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <input name="date" defaultValue={certification?.date} placeholder="Date (e.g., Aug 2024)" required style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
        <input name="link" defaultValue={certification?.link} placeholder="Link to Credential (optional)" style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
        <input type="number" name="order" defaultValue={certification?.order} placeholder="Order (1, 2...)" style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
      </div>
      
      <div>
        <label style={{ fontSize: '12px', fontWeight: 500, color: '#6B6860', display: 'block', marginBottom: '4px' }}>Proof Image (optional)</label>
        <input type="file" accept="image/*" onChange={handleImage} style={{ fontSize: '14px', color: '#3A3832', marginBottom: '8px' }} />
        {image && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={image} alt="Proof" style={{ height: '80px', borderRadius: '4px', border: '1px solid #E6E0D5' }} />
            <button 
              type="button" 
              onClick={() => setImage('')}
              style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <SubmitButton style={{ flex: 1, background: '#B8704A', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 16px', fontSize: '14px', fontWeight: 600 }}>
          {isEdit ? 'Save Changes' : 'Add Certification'}
        </SubmitButton>
        {isEdit && onCancel && (
          <button type="button" onClick={onCancel} style={{ background: '#E6E0D5', color: '#1C1B18', padding: '10px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: 'none' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
