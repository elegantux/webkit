import { useRef } from 'react';
import { Editor, EditorProps } from '@monaco-editor/react';
import { useColorMode } from '@chakra-ui/react';

export enum CODE_EDITOR_LANGUAGES {
  JAVASCRIPT = 'javascript',
  HTML = 'html',
  PHP = 'php',
  CSS = 'css',
}

export function CodeEditor({
  value,
  onChange,
  language,
  height = '320px',
}: {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  language: CODE_EDITOR_LANGUAGES;
  height?: string;
}) {
  const editorRef = useRef<EditorProps>();
  const { colorMode } = useColorMode();

  const onMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      value={value}
      onChange={onChange}
      height={height}
      theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
      defaultLanguage={language}
      // defaultValue=""
      onMount={onMount}
    />
  );
}
