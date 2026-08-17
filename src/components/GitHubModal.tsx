import React, { useState } from 'react';
import { X, GitBranch, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { Project } from '../types/project';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpdateProject: (updated: Project) => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdateProject
}) => {
  const [repoName, setRepoName] = useState(`ai-bot-${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
  const [isPrivate, setIsPrivate] = useState(true);
  const [isPushing, setIsPushing] = useState(false);
  const [isPushed, setIsPushed] = useState(!!project.githubRepo);

  if (!isOpen) return null;

  const handlePush = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPushing(true);

    setTimeout(() => {
      setIsPushing(false);
      setIsPushed(true);
      onUpdateProject({
        ...project,
        githubRepo: `https://github.com/user/${repoName}`
      });
    }, 1200);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header-icon">
          <GitBranch size={36} color="#38bdf8" />
          <h2>GitHub Integration & Repository Sync</h2>
          <p className="text-muted">Connect your GitHub account and push generated Clean Architecture code.</p>
        </div>

        {isPushed ? (
          <div className="success-github-box">
            <CheckCircle2 size={48} color="#4ade80" style={{ margin: '0 auto 12px' }} />
            <h3>Repository Successfully Pushed!</h3>
            <p className="text-muted">Your code is live on GitHub:</p>
            <div className="repo-link-box">
              <GitBranch size={16} />
              <a href={project.githubRepo} target="_blank" rel="noreferrer">
                {project.githubRepo}
              </a>
            </div>

            <button className="btn-primary w-full mt-4" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handlePush} className="github-form">
            <div className="form-group">
              <label><GitBranch size={14} /> Repository Name</label>
              <input
                type="text"
                required
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label><GitBranch size={14} /> Default Branch</label>
              <input type="text" disabled value="main" />
            </div>

            <div className="form-group flex-align">
              <input
                type="checkbox"
                id="private-check"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <label htmlFor="private-check" style={{ marginBottom: 0 }}>
                Private Repository (Recommended)
              </label>
            </div>

            <div className="alert-info-box">
              <Shield size={16} color="#38bdf8" />
              <span>GitHub API access token is never exposed to generated bot code. Secrets remain in .env file.</span>
            </div>

            <button type="submit" className="btn-primary w-full btn-lg flex-align" disabled={isPushing}>
              {isPushing ? 'Creating Repository & Pushing...' : 'Push Code to GitHub'}
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
