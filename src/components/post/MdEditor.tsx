'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import './mdEditor.css';
import MDEditor, { commands, type ICommand } from '@uiw/react-md-editor';
import { useTheme } from 'next-themes';
import { useRef, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import MarkDownPost from './MarkDownPost';

type Props = {
  value: string;
  onChange: (value?: string) => void;
};

const TOOLTIP_KO: Record<string, string> = {
  bold: '굵게 (Ctrl+B)',
  italic: '기울임 (Ctrl+I)',
  strikethrough: '취소선 (Ctrl+Shift+X)',
  hr: '구분선 삽입 (Ctrl+H)',
  title: '제목 삽입',
  heading1: '제목 1 (Ctrl+1)',
  heading2: '제목 2 (Ctrl+2)',
  heading3: '제목 3 (Ctrl+3)',
  heading4: '제목 4 (Ctrl+4)',
  heading5: '제목 5 (Ctrl+5)',
  heading6: '제목 6 (Ctrl+6)',
  link: '링크 추가 (Ctrl+L)',
  quote: '인용문 삽입 (Ctrl+Q)',
  code: '인라인 코드 (Ctrl+J)',
  codeBlock: '코드 블록 삽입 (Ctrl+Shift+J)',
  comment: '주석 삽입 (Ctrl+/)',
  image: '이미지 업로드',
  table: '표 추가',
  'unordered-list': '글머리 기호 목록 (Ctrl+Shift+U)',
  'ordered-list': '번호 매기기 목록 (Ctrl+Shift+O)',
  'checked-list': '체크리스트 (Ctrl+Shift+C)',
  help: '도움말',
};

const translateTooltip = (cmd: ICommand): ICommand => {
  const label = cmd.name ? TOOLTIP_KO[cmd.name] : undefined;
  if (!label) return cmd;
  return {
    ...cmd,
    buttonProps: { ...cmd.buttonProps, title: label, 'aria-label': label },
  };
};

export default function MdEditor({ value, onChange }: Props) {
  const { resolvedTheme } = useTheme();

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const imageUploadCommand: ICommand = {
    ...commands.image,
    execute: () => fileInputRef.current?.click(),
    buttonProps: {
      ...commands.image.buttonProps,
      title: TOOLTIP_KO.image,
      'aria-label': TOOLTIP_KO.image,
    },
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/image', { method: 'POST', body: formData });
      const data = await res.json();
      return `![](${data.document.url})`;
    } finally {
      setIsUploading(false);
    }
  };

  const insertImages = async (files: FileList) => {
    let updatedValue = value;
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        const imageUrl = await uploadImage(file);
        updatedValue = updatedValue + '\n' + imageUrl;
        onChange(updatedValue);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (!e.clipboardData) return;
    insertImages(e.clipboardData.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer) return;
    insertImages(e.dataTransfer.files);
  };

  return (
    <div
      className="relative"
      data-color-mode={resolvedTheme === 'dark' ? 'dark' : 'light'}
    >
      {isUploading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10">
          <ClipLoader />
        </div>
      )}
      <MDEditor
        value={value}
        onChange={onChange}
        height={600}
        onPaste={handlePaste}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        commandsFilter={(cmd) => {
          if (cmd.name === 'image') return imageUploadCommand;
          if (cmd.name === 'title' && Array.isArray(cmd.children)) {
            return {
              ...translateTooltip(cmd),
              children: cmd.children.map(translateTooltip),
            };
          }
          return translateTooltip(cmd);
        }}
        components={{
          preview: (source) => <MarkDownPost content={source} />,
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        aria-label="이미지 업로드"
        onChange={(e) => {
          if (e.target.files) insertImages(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
