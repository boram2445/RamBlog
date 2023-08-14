import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import Prism from 'prismjs';

type Props = {
  content: string;
  // editorRef: React.MutableRefObject<any>;
};

export default function TuiEditors({ content = '' }: Props) {
  return (
    <>
      <Editor
        initialValue='hello react editor world!'
        previewStyle='vertical'
        height='500px'
        initialEditType='markdown'
        useCommandShortcut={true}
        plugins={[colorSyntax, [codeSyntaxHighlight, { highlighter: Prism }]]}
      />
    </>
  );
}
