import React, { useRef, useEffect } from 'react';
import Quill from 'quill';

const RichTextEditor = ({ content, id }: { content: string; id: string }) => {
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

      // content.replace(/&nbsp;/g, ' ');

      quill.root.innerHTML = content;

      quill.on('selection-change', (range) => {
        if (range && range.length > 0) {
          const selectedText = quill.getText(range.index, range.length);
          const trimmedText = selectedText.trim();

          if (trimmedText.length > 0) {
            const trimmedRange =
              range.index + selectedText.indexOf(trimmedText);
            const endIndex = trimmedRange + trimmedText.length;

            const isBold = quill.getFormat(
              trimmedRange,
              endIndex - trimmedRange
            ).bold;
            quill.formatText(
              trimmedRange,
              endIndex - trimmedRange,
              'bold',
              !isBold
            );
          } else {
            quill.format('bold', false);
          }
        }
      });
    }
  }, [content]);

  return <div id={id} ref={editorRef} />;
};

export default RichTextEditor;
