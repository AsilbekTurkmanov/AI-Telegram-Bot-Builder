import React, { useState } from 'react';
import { Terminal, Play, ShieldCheck, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { validateProjectBuild, ValidationStepLog } from '../../services/buildValidator';
import { Project } from '../../types/project';

interface BuildTerminalProps {
  project: Project;
}

export const BuildTerminal: React.FC<BuildTerminalProps> = ({ project }) => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [logs, setLogs] = useState<ValidationStepLog[]>([
    { step: 'Backend Compilation', command: 'dotnet build src/*.Api.csproj', status: 'passed', output: 'Build succeeded. 0 Warning(s), 0 Error(s).' },
    { step: 'Unit Tests', command: 'dotnet test tests/*.UnitTests.csproj', status: 'passed', output: 'Passed! 12 tests succeeded.' },
    { step: 'Frontend Build', command: 'cd admin && npm run build', status: 'passed', output: 'vite v5.0.0 building for production...' },
    { step: 'Docker Compose Config', command: 'docker compose config', status: 'passed', output: 'Docker config valid.' }
  ]);

  const handleRunBuild = () => {
    setIsBuilding(true);
    setTimeout(() => {
      const res = validateProjectBuild(project.files);
      setLogs(res.logs);
      setIsBuilding(false);
    }, 1200);
  };

  return (
    <div className="build-terminal-container">
      <div className="terminal-top-bar">
        <div className="flex-align">
          <Terminal size={18} color="#38bdf8" />
          <span>Build Validation & AI Repair Loop Engine</span>
        </div>

        <button
          className="btn-primary btn-sm flex-align"
          onClick={handleRunBuild}
          disabled={isBuilding}
        >
          {isBuilding ? <RefreshCw size={14} className="spin-icon" /> : <Play size={14} />}
          <span>{isBuilding ? 'Validating...' : 'Run Build Check'}</span>
        </button>
      </div>

      <div className="terminal-logs-wrapper">
        {logs.map((l, i) => (
          <div key={i} className={`terminal-log-card ${l.status}`}>
            <div className="log-card-header">
              <span className="log-step">{l.step}</span>
              <code className="log-cmd">$ {l.command}</code>
              <span className={`status-pill ${l.status}`}>
                {l.status === 'passed' ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                {l.status.toUpperCase()}
              </span>
            </div>
            <pre className="log-output-text">{l.output}</pre>
          </div>
        ))}
      </div>
    </div>
  );
};
