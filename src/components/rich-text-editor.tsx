import React, { useRef, useEffect } from 'react';
import Quill from 'quill';

const RichTextEditor = ({ content }: { content: string }) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: false,
        },
        readOnly: true,
      });

      quill.root.innerHTML = content;

      quill.on('selection-change', (range) => {
        if (range && range.length > 0) {
          const selectedText = quill.getText(range.index, range.length);
          if (selectedText.trim().length === 0) return; // Ignore if only spaces are selected

          const isBold = quill.getFormat(range).bold;
          quill.format('bold', !isBold);
        }
      });
    }
  }, [content]);

  return <div ref={editorRef} />;
};

export default RichTextEditor;
