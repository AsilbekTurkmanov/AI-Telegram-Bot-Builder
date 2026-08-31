import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Terminal, Code } from 'lucide-react';
import { Project, GenerationStage } from '../types/project';

interface GeneratorProgressProps {
  project: Project;
  onComplete: (updatedProject: Project) => void;
  lang: 'uz' | 'en';
}

export const GeneratorProgress: React.FC<GeneratorProgressProps> = ({ project, onComplete, lang }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Initializing AI Architect session...`,
    `[${new Date().toLocaleTimeString()}] Parsing requirements prompt: "${project.description.slice(0, 60)}..."`
  ]);

  const stages: GenerationStage[] = [
    { id: 1, name: 'Requirements Analysis', description: 'Extracting features & domain entities', status: 'completed', log: 'JSON Schema validated successfully.' },
    { id: 2, name: 'Database Schema Generation', description: 'EF Core DbContext & Migrations', status: 'completed', log: 'PostgreSQL tables generated.' },
    { id: 3, name: 'Domain & Application Layer', description: 'Entities, Services, DTOs', status: 'completed', log: 'User.cs, Product.cs, Order.cs created.' },
    { id: 4, name: 'Telegram Bot Handlers', description: 'InlineKeyboard & Update handlers', status: 'completed', log: 'BotUpdateHandler.cs generated with /start & /menu.' },
    { id: 5, name: 'ASP.NET Core Web API', description: 'RESTful Controllers & Swagger', status: 'completed', log: 'OrdersController.cs generated.' },
    { id: 6, name: 'React Admin Panel', description: 'Admin UI dashboard & state', status: 'completed', log: 'Admin React dashboard created in /admin.' },
    { id: 7, name: 'Unit & Integration Tests', description: 'xUnit & Moq test suite', status: 'completed', log: 'OrderServiceTests.cs generated.' },
    { id: 8, name: 'Docker & Environment', description: 'Dockerfile & docker-compose.yml', status: 'completed', log: 'Docker-compose with PostgreSQL & Redis configured.' },
    { id: 9, name: 'Build Validation & Docs', description: 'dotnet build check & README.md', status: 'completed', log: 'Build validation PASSED. Solution ready!' },
    { id: 10, name: 'Live Bot Startup', description: 'Connecting Telegram API & Starting Polling Engine', status: 'completed', log: `Bot @${project.botName} successfully STARTED! Listening for incoming updates...` }
  ];

  useEffect(() => {
    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage < stages.length) {
        setCurrentStageIdx(stage);
        setLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Stage ${stage + 1}/10: ${stages[stage].name} — ${stages[stage].log}`
        ]);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete({
            ...project,
            status: 'Running',
            isRunning: true,
            progress: 100,
            currentStage: 10
          });
        }, 800);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = Math.round(((currentStageIdx + 1) / stages.length) * 100);

  return (
    <div className="generator-progress-container">
      <div className="generator-card">
        <div className="generator-header">
          <div className="ai-pulse-icon">
            <Sparkles size={28} color="#38bdf8" />
          </div>
          <div>
            <h2>{lang === 'uz' ? 'AI Loyihani Generatsiya Qilmoqda...' : 'Generating Project Solution...'}</h2>
            <p className="text-muted">
              {lang === 'uz' ? 'Iltimos kuting. AI kodingizni arxitektura bo‘yicha bosqichma-bosqich yozmoqda.' : 'Please wait while AI constructs your clean architecture project files.'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-wrapper">
          <div className="progress-bar-label">
            <span>{stages[currentStageIdx]?.name}</span>
            <strong>{progressPercentage}%</strong>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Stage Checklist */}
        <div className="stages-checklist-grid">
          {stages.map((stg, idx) => {
            const isFinished = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;

            return (
              <div
                key={stg.id}
                className={`stage-item-card ${isFinished ? 'finished' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div className="stage-status-icon">
                  {isFinished ? (
                    <CheckCircle2 size={18} color="#4ade80" />
                  ) : isCurrent ? (
                    <Loader2 size={18} className="spin-icon" color="#38bdf8" />
                  ) : (
                    <div className="pending-dot"></div>
                  )}
                </div>

                <div className="stage-info">
                  <span className="stage-title">{stg.name}</span>
                  <span className="stage-sub">{stg.description}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live SignalR / WebSocket Logs Stream */}
        <div className="terminal-log-box">
          <div className="terminal-header">
            <Terminal size={14} />
            <span>Real-time SignalR Log Stream</span>
          </div>
          <div className="terminal-body">
            {logs.map((l, i) => (
              <div key={i} className="log-line">
                <code>{l}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
