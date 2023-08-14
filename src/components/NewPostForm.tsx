'use client';

import { useRef } from 'react';
import TuiEditors from './TuiEditors';
import { Editor } from '@toast-ui/react-editor';

export default function NewPostForm() {
  const editorRef = useRef<Editor | null>(null);
  const handleSubmit = () => {
    const content = editorRef.current?.getInstance().getMarkdown() || '🤔';
    // console.log(content);
  };

  return (
    <>
      <TuiEditors content='' editorRef={editorRef} />
      <button onClick={handleSubmit}>저장하기</button>
    </>
  );
}
