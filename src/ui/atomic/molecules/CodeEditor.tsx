import { Dispatch, useCallback, useEffect, useRef } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';

export function CodeEditor({
  value,
  onChange,
  codeEditor,
  setCodeEditor,
}: {
  value: string;
  onChange: (value: string) => void;
  codeEditor: Record<any, any> | null;
  setCodeEditor: Dispatch<Record<any, any> | null>;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const mode = useColorMode();

  const handleEditorChange = useCallback(
    (_delta: Record<any, any>, _editor: Record<any, any>) => {
      onChange(_editor.getValue());
    },
    [onChange, value]
  );

  const init = () => {
    if (!editorRef) {
      return;
    }

    // @ts-ignore
    const { ace, wa_url } = window;

    const editorInstance = ace.edit(editorRef.current);
    ace.config.set('basePath', `${wa_url}wa-content/js/ace/`);

    if (mode.colorMode === 'dark') {
      editorInstance.setTheme('ace/theme/monokai');
    } else {
      editorInstance.setTheme('ace/theme/eclipse');
    }
    editorInstance.session.setMode('ace/mode/javascript');
    editorInstance.session.setMode('ace/mode/css');
    editorInstance.session.setMode('ace/mode/html');
    editorInstance.session.setMode('ace/mode/smarty');
    editorInstance.session.setUseWrapMode(true);

    editorInstance.session.setValue(value);
    editorInstance.session.on('change', handleEditorChange);

    setCodeEditor(editorInstance);
  };

  const destroy = () => {
    if (codeEditor) {
      codeEditor.session.off('change', handleEditorChange);
      codeEditor.destroy();
    }
  };

  useEffect(() => {
    if (editorRef) {
      init();
    }

    return destroy;
  }, []);

  useEffect(() => {
    if (codeEditor) {
      if (mode.colorMode === 'dark') {
        codeEditor.setTheme('ace/theme/monokai');
      } else {
        codeEditor.setTheme('ace/theme/eclipse');
      }
    }
  }, [mode.colorMode]);

  return (
    <Box
      height="300px"
      ref={editorRef}
    />
  );
}
