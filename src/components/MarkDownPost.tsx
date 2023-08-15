'use client';

import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';

export default function MarkDownPost({ content }: { content: string }) {
  return <>{content && <Viewer initialValue={content} />}</>;
}
