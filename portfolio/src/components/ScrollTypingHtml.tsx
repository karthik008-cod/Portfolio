'use client';
import { useRef, useEffect, useState } from 'react';
import { useScroll, motion } from 'framer-motion';

export function ScrollTypingHtml({ html, scrollYProgress }: { html: string, scrollYProgress: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [totalChars, setTotalChars] = useState(0);
  const charSpansRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create a temporary div to parse the HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    charSpansRef.current = [];
    
    // Function to recursively wrap text nodes
    function wrapTextNodes(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text) return document.createTextNode('');
        
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          const span = document.createElement('span');
          span.textContent = char;
          span.style.opacity = '0.1'; // Start dim
          span.style.transition = 'opacity 0.1s ease';
          charSpansRef.current.push(span);
          fragment.appendChild(span);
        }
        return fragment;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Clone element
        const el = node.cloneNode(false) as Element;
        const childNodes = Array.from(node.childNodes);
        for (const child of childNodes) {
          el.appendChild(wrapTextNodes(child));
        }
        return el;
      }
      return node.cloneNode(false);
    }
    
    const newContent = document.createDocumentFragment();
    Array.from(temp.childNodes).forEach(child => {
      newContent.appendChild(wrapTextNodes(child));
    });
    
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(newContent);
    setTotalChars(charSpansRef.current.length);
    setIsReady(true);
  }, [html]);

  // Whenever scroll changes, update spans
  useEffect(() => {
    if (!isReady || totalChars === 0) return;
    const unsubscribe = scrollYProgress.on('change', (v: number) => {
      // Map scroll progress to visible character count.
      // E.g., if v = 0.5, half of the characters are fully visible.
      // We can add a small gradient to make it look smooth.
      
      const visibleCount = v * totalChars;
      
      charSpansRef.current.forEach((span, index) => {
        if (index < visibleCount) {
           span.style.opacity = '1';
        } else {
           span.style.opacity = '0.1';
        }
      });
    });
    return () => unsubscribe();
  }, [isReady, totalChars, scrollYProgress]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        visibility: isReady ? 'visible' : 'hidden',
        fontSize: 'clamp(1.1rem, 1.8vw, 1.25rem)', 
        lineHeight: 1.8, 
        color: '#3A3832', 
        fontWeight: 400, 
        maxWidth: 750,
      }} 
    />
  );
}
