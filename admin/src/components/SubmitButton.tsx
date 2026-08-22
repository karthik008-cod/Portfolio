'use client';
import { useFormStatus } from 'react-dom';

export function SubmitButton({ 
  children, 
  pendingText = 'Saving...', 
  style 
}: { 
  children: React.ReactNode;
  pendingText?: string;
  style?: React.CSSProperties;
}) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending} 
      style={{
        ...style,
        opacity: pending ? 0.7 : 1,
        cursor: pending ? 'not-allowed' : 'pointer',
      }}
    >
      {pending ? pendingText : children}
    </button>
  );
}
