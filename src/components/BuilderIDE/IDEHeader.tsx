import { Bot, Download, Key, Play, ShieldCheck, Rocket, ChevronLeft, GitBranch } from 'lucide-react';
import { Project } from '../../types/project';

interface IDEHeaderProps {
  project: Project;
  onBack: () => void;
  onValidate: () => void;
  onExportZip: () => void;
  onOpenGitHub: () => void;
  onOpenToken: () => void;
  onOpenDeploy: () => void;
  lang: 'uz' | 'en';
}

export const IDEHeader: React.FC<IDEHeaderProps> = ({
  project,
  onBack,
  onValidate,
  onExportZip,
  onOpenGitHub,
  onOpenToken,
  onOpenDeploy,
  lang
}) => {
  return (
    <div className="ide-header-bar">
      <div className="ide-header-left">
        <button className="btn-icon" onClick={onBack} title="Back to Dashboard">
          <ChevronLeft size={18} />
        </button>

        <div className="ide-project-title flex-align">
          <Bot size={22} color="#38bdf8" />
          <div>
            <h3>{project.name}</h3>
            <span className="ide-sub-meta">@{project.botName} • {project.database} • .NET 10</span>
          </div>
        </div>

        <span className={`status-badge ${project.status.toLowerCase()}`}>
          {project.status}
        </span>
      </div>

      <div className="ide-header-actions">
        {/* Telegram Token Button */}
        <button className="btn-secondary btn-sm flex-align" onClick={onOpenToken}>
          <Key size={14} color={project.isBotConnected ? '#4ade80' : '#facc15'} />
          <span>{project.isBotConnected ? 'Token Connected' : 'Connect Token'}</span>
        </button>

        {/* GitHub Button */}
        <button className="btn-secondary btn-sm flex-align" onClick={onOpenGitHub}>
          <GitBranch size={14} />
          <span>{project.githubRepo ? 'GitHub Pushed' : 'Push GitHub'}</span>
        </button>

        {/* Validate Button */}
        <button className="btn-secondary btn-sm flex-align" onClick={onValidate}>
          <ShieldCheck size={14} color="#38bdf8" />
          <span>{lang === 'uz' ? 'Tekshirish' : 'Validate'}</span>
        </button>

        {/* Export ZIP */}
        <button className="btn-primary btn-sm flex-align" onClick={onExportZip}>
          <Download size={14} />
          <span>ZIP Download</span>
        </button>

        {/* Deploy */}
        <button className="btn-success btn-sm flex-align" onClick={onOpenDeploy}>
          <Rocket size={14} />
          <span>{lang === 'uz' ? 'Deploy' : 'Deploy'}</span>
        </button>
      </div>
    </div>
  );
};
