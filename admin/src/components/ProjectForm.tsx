'use client';
import { useState } from 'react';
import { addProject, updateProject } from '@/app/actions';
import { SubmitButton } from './SubmitButton';
import { RichTextInput } from './RichTextInput';

export function ProjectForm({ project, onCancel }: { project?: any, onCancel?: () => void }) {
  // Initialize with existing images or backward compatible single image
  const initialImages = project ? (project.images?.length > 0 ? project.images : (project.image ? [project.image] : [])) : [];
  const [images, setImages] = useState<string[]>(initialImages);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages(prev => {
      const newImages = [...prev];
      const targetIndex = index + direction;
      if (targetIndex >= 0 && targetIndex < newImages.length) {
        [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      }
      return newImages;
    });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    // Clear the input so the same files can be selected again if needed
    e.target.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const isEdit = !!project;
  const action = isEdit ? updateProject : addProject;

  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#F6F1EA', padding: '16px', borderRadius: '8px', border: '1px solid #E6E0D5', marginTop: isEdit ? '12px' : '0' }}>
      {isEdit && <input type="hidden" name="id" value={project.id} />}
      
      <input name="title" defaultValue={project?.title} placeholder="Project title" required style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
      <RichTextInput name="description" defaultValue={project?.description} placeholder="Description" />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <input name="link" defaultValue={project?.link} placeholder="URL (optional)" style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
        <input type="number" name="order" defaultValue={project?.order} placeholder="Order (1, 2...)" style={{ border: '1px solid #E6E0D5', padding: '8px 12px', borderRadius: '4px', fontSize: '14px', outline: 'none' }} />
      </div>
      
      <div>
        <label style={{ fontSize: '12px', fontWeight: 500, color: '#6B6860', display: 'block', marginBottom: '4px' }}>Images</label>
        <input type="file" accept="image/*" multiple onChange={handleImage} style={{ fontSize: '14px', color: '#3A3832' }} />
        
        {/* Hidden inputs for formData submission */}
        {images.map((img, i) => (
          <input key={i} type="hidden" name="images" value={img} />
        ))}
      </div>
      
      {images.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={img} 
                  alt={`Preview ${i}`} 
                  onClick={() => setPreviewImage(img)}
                  style={{ height: '80px', width: '120px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E6E0D5', background: '#FFFDF8', cursor: 'zoom-in' }} 
                />
                <button 
                  type="button" 
                  onClick={() => removeImage(i)}
                  style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button 
                  type="button" 
                  disabled={i === 0}
                  onClick={() => moveImage(i, -1)}
                  style={{ background: '#E6E0D5', border: 'none', borderRadius: '2px', padding: '2px 8px', fontSize: '12px', cursor: i === 0 ? 'not-allowed' : 'pointer', opacity: i === 0 ? 0.5 : 1 }}
                >←</button>
                <button 
                  type="button" 
                  disabled={i === images.length - 1}
                  onClick={() => moveImage(i, 1)}
                  style={{ background: '#E6E0D5', border: 'none', borderRadius: '2px', padding: '2px 8px', fontSize: '12px', cursor: i === images.length - 1 ? 'not-allowed' : 'pointer', opacity: i === images.length - 1 ? 0.5 : 1 }}
                >→</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', cursor: 'zoom-out' }}
        >
          <img src={previewImage} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <SubmitButton style={{ background: '#B8704A', color: '#fff', padding: '10px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 500, border: 'none', flex: 1 }}>
          {isEdit ? 'Save Changes' : 'Add Project'}
        </SubmitButton>
        {isEdit && (
          <button type="button" onClick={onCancel} style={{ background: '#E6E0D5', color: '#1C1B18', padding: '10px 16px', borderRadius: '4px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', border: 'none' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
