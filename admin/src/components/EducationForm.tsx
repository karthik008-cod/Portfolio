'use client';
import { useRef, useState } from 'react';
import { addEducation } from '@/app/actions';
import { SubmitButton } from './SubmitButton';
import { RichTextInput } from './RichTextInput';

export function EducationForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [resetKey, setResetKey] = useState(0);

  const handleSubmit = async (formData: FormData) => {
    await addEducation(formData);
    formRef.current?.reset();
    setResetKey(prev => prev + 1);
  };

  return (
    <form ref={formRef} action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#F6F1EA', padding: '16px', borderRadius: '8px', border: '1px solid #E6E0D5', marginBottom: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <input name="degree" placeholder="Degree / Title" required style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
        <input name="institution" placeholder="Institution" required style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <input name="duration" placeholder="Duration (e.g., 2020 - 2024)" required style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
        <input type="number" name="order" placeholder="Order (1, 2...)" style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
      </div>
      <RichTextInput key={resetKey} name="description" placeholder="Description (optional)" />
      
      <SubmitButton pendingText="Adding..." style={{ background: '#B8704A', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 16px', fontSize: '14px', fontWeight: 600, marginTop: '8px' }}>
        Add Education
      </SubmitButton>
    </form>
  );
}
