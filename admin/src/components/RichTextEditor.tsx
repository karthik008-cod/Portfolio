'use client';
import { useEffect, useRef } from 'react';
import Quill from 'quill';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }, { 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ]
};

export function RichTextEditor({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      // Initialize Quill
      quillRef.current = new Quill(containerRef.current, {
        theme: 'snow',
        placeholder,
        modules,
      });

      // Set initial value
      if (value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }

      // Listen for changes
      quillRef.current.on('text-change', () => {
        if (quillRef.current) {
          onChange(quillRef.current.root.innerHTML);
        }
      });
    }
  }, []);

  return (
    <div style={{ background: '#FFFDF8', borderRadius: '4px' }} className="rich-text-container">
      <style>{`
        .rich-text-container .ql-toolbar {
          border: 1px solid #E6E0D5;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          background: #F6F1EA;
        }
        .rich-text-container .ql-container {
          border: 1px solid #E6E0D5;
          border-top: none;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          font-family: inherit;
          font-size: 14px;
          background: #FFF;
        }
        .rich-text-container .ql-editor {
          min-height: 100px;
        }
        .rich-text-container .ql-editor:focus {
          outline: none;
        }
      `}</style>
      <div ref={containerRef} />
    </div>
  );
}
