'use client';

import '@toast-ui/editor/dist/toastui-editor.css';
import { Viewer } from '@toast-ui/react-editor';
import 'prismjs/themes/prism.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import Prism from 'prismjs';
import './tuiEditor.css';

export default function MarkDownPost({ content }: { content: string }) {
  return (
    <>
      {content && (
        <Viewer
          initialValue={content}
          plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
        />
      )}
    </>
  );
}
