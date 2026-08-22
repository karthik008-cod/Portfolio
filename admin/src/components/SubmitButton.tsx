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
      {pending ? (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <svg style={{ animation: 'spin 1s linear infinite', height: '16px', width: '16px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {pendingText}
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </span>
      ) : children}
    </button>
  );
}
