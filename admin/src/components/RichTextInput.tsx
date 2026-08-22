'use client';
import { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';

export function RichTextInput({ name, defaultValue, placeholder }: { name: string, defaultValue: string, placeholder?: string }) {
  const [value, setValue] = useState(defaultValue || '');

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <RichTextEditor value={value} onChange={setValue} placeholder={placeholder} />
    </>
  );
}
