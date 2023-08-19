import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';

import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import Prism from 'prismjs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './tuiEditor.css';

type Props = {
  content: string;
  editorRef: React.MutableRefObject<any>;
};

export default function TuiEditors({ content = '', editorRef }: Props) {
  const [previewStyle, setPreviewStyle] = useState<'tab' | 'vertical'>('tab');

  //화면 사이즈가 작아지면 tab형식으로 변환
  //mount될때 실행되는건 알겠는데, 왜 window사이즈가 변할때도 실행되는지 모르겠다.
  useEffect(() => {
    const handleResize = () => {
      window.innerWidth > 800
        ? setPreviewStyle('vertical')
        : setPreviewStyle('tab');
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Editor
        ref={editorRef}
        initialValue={content || ' '}
        previewStyle={previewStyle}
        height='600px'
        initialEditType='markdown'
        useCommandShortcut={true}
        plugins={[colorSyntax, [codeSyntaxHighlight, { highlighter: Prism }]]}
        hooks={{
          addImageBlobHook: async (
            blob: Blob | File,
            callback: (url: string) => void
          ) => {
            const formData = new FormData();
            formData.append('file', blob);
            const imageData = await axios
              .post('/api/image', formData)
              .then((res) => res.data.document);
            callback(imageData.url);
          },
        }}
      />
    </>
  );
}
