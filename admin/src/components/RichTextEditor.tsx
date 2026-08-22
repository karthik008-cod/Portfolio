'use client';
import dynamic from 'next/dynamic';

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false, loading: () => <div style={{ height: '100px', background: '#F6F1EA', borderRadius: '4px', border: '1px solid #E6E0D5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9C9889', fontSize: '13px' }}>Loading editor...</div> });

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ]
};

export function RichTextEditor({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder?: string }) {

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
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
}
