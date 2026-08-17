import React, { useState } from 'react';
import { FileCode, FileText, Folder, Search, Database, Layers, Shield } from 'lucide-react';
import { ProjectFile } from '../../types/project';

interface FileExplorerProps {
  files: ProjectFile[];
  activeFile: ProjectFile | null;
  onSelectFile: (file: ProjectFile) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, activeFile, onSelectFile }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFiles = files.filter(f => f.path.toLowerCase().includes(searchTerm.toLowerCase()));

  const getFileIcon = (lang: string, path: string) => {
    if (lang === 'csharp') return <FileCode size={16} color="#c084fc" />;
    if (lang === 'typescript') return <FileCode size={16} color="#38bdf8" />;
    if (lang === 'sql') return <Database size={16} color="#4ade80" />;
    if (lang === 'dockerfile') return <Layers size={16} color="#facc15" />;
    return <FileText size={16} color="#94a3b8" />;
  };

  return (
    <div className="file-explorer-panel">
      <div className="explorer-header">
        <span className="explorer-title">PROJECT FILES ({files.length})</span>
      </div>

      <div className="explorer-search">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          placeholder="Filter files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="file-tree-list">
        {filteredFiles.map((file) => {
          const isActive = activeFile?.id === file.id;
          return (
            <div
              key={file.id}
              className={`file-tree-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectFile(file)}
            >
              {getFileIcon(file.language, file.path)}
              <span className="file-name" title={file.path}>
                {file.name}
              </span>
              <span className="file-path-sub">{file.path.split('/')[0]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
