import React, { useState, useEffect } from 'react';
import { Bot, Download, Key, Play, Square, RotateCw, ShieldCheck, Rocket, ChevronLeft, GitBranch, Radio } from 'lucide-react';
import { Project } from '../../types/project';

interface IDEHeaderProps {
  project: Project;
  onBack: () => void;
  onValidate: () => void;
  onExportZip: () => void;
  onOpenGitHub: () => void;
  onOpenToken: () => void;
  onOpenDeploy: () => void;
  onToggleRun?: (isRunning: boolean) => void;
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
  onToggleRun,
  lang
}) => {
  const isRunning = project.isRunning ?? (project.status === 'Running' || project.status === 'Ready');
  const [uptime, setUptime] = useState(12);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggle = () => {
    if (onToggleRun) {
      onToggleRun(!isRunning);
    }
  };

  const handleRestart = () => {
    if (onToggleRun) {
      onToggleRun(false);
      setTimeout(() => {
        onToggleRun(true);
        setUptime(0);
      }, 600);
    }
  };

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

        {/* Live Running Badge */}
        <div className={`ide-run-badge ${isRunning ? 'running' : 'stopped'}`}>
          <span className="run-dot"></span>
          <span className="run-text">
            {isRunning ? (
              <>
                <strong>RUNNING</strong>
                <span className="uptime-pill">⏱ {formatUptime(uptime)}</span>
              </>
            ) : (
              <strong>STOPPED</strong>
            )}
          </span>
        </div>
      </div>

      <div className="ide-header-actions">
        {/* Run / Stop / Restart Controller */}
        {isRunning ? (
          <>
            <button
              className="btn-danger-outline btn-sm flex-align btn-stop-bot"
              onClick={handleToggle}
              title={lang === 'uz' ? "Botni to'xtatish" : "Stop Bot"}
            >
              <Square size={14} />
              <span>{lang === 'uz' ? "To'xtatish" : "Stop"}</span>
            </button>

            <button
              className="btn-secondary btn-sm flex-align"
              onClick={handleRestart}
              title={lang === 'uz' ? "Qayta ishga tushirish" : "Restart Bot"}
            >
              <RotateCw size={14} />
              <span>{lang === 'uz' ? 'Restart' : 'Restart'}</span>
            </button>
          </>
        ) : (
          <button
            className="btn-success btn-sm flex-align glowing-btn"
            onClick={handleToggle}
            title={lang === 'uz' ? "Botni ishga tushirish" : "Run Bot"}
          >
            <Play size={14} />
            <span>{lang === 'uz' ? 'Botni Ishga Tushirish ▶' : 'Run Bot ▶'}</span>
          </button>
        )}

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
        <button className="btn-secondary btn-sm flex-align" onClick={onOpenDeploy}>
          <Rocket size={14} />
          <span>Deploy</span>
        </button>
      </div>
    </div>
  );
};
