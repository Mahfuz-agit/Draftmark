import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { ThemeMode } from '../../types';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  theme: ThemeMode;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, theme }) => {
  return (
    <div className="h-full overflow-hidden text-base">
      <CodeMirror
        value={value}
        height="100%"
        className="h-full font-mono text-sm leading-relaxed"
        extensions={[markdown()]}
        theme={theme === 'dark' ? oneDark : undefined}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  );
};