import React from 'react';
import Editor from '@monaco-editor/react';
import { ProjectFile } from '../../types/project';
import { Save, Code } from 'lucide-react';

interface MonacoEditorViewProps {
  file: ProjectFile | null;
  onContentChange: (newContent: string) => void;
}

export const MonacoEditorView: React.FC<MonacoEditorViewProps> = ({ file, onContentChange }) => {
  if (!file) {
    return (
      <div className="editor-empty-state">
        <Code size={48} color="#475569" />
        <p>Chap paneldan tahrirlash uchun faylni tanlang</p>
      </div>
    );
  }

  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case 'csharp': return 'csharp';
      case 'typescript': return 'typescript';
      case 'sql': return 'sql';
      case 'json': return 'json';
      case 'dockerfile': return 'dockerfile';
      case 'markdown': return 'markdown';
      default: return 'plaintext';
    }
  };

  return (
    <div className="monaco-editor-wrapper">
      <div className="editor-tab-bar">
        <div className="tab-item active">
          <span>{file.path}</span>
          <span className="version-tag">v{file.version}</span>
        </div>
        <div className="editor-actions">
          <button className="btn-sm btn-secondary flex-align">
            <Save size={14} />
            <span>Saved</span>
          </button>
        </div>
      </div>

      <div className="monaco-container">
        <Editor
          height="100%"
          language={getMonacoLanguage(file.language)}
          theme="vs-dark"
          value={file.content}
          onChange={(val) => onContentChange(val || '')}
          options={{
            fontSize: 14,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on'
          }}
        />
      </div>
    </div>
  );
};
