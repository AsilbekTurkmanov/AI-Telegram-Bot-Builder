import React, { useState } from 'react';
import { GitCommit, Check, X, ArrowLeftRight, FileCode } from 'lucide-react';
import { Project } from '../../types/project';

interface VersionDiffViewerProps {
  project: Project;
}

export const VersionDiffViewer: React.FC<VersionDiffViewerProps> = ({ project }) => {
  const [selectedVersionIdx, setSelectedVersionIdx] = useState(project.versions.length - 1);
  const selectedVersion = project.versions[selectedVersionIdx] || project.versions[0];

  return (
    <div className="diff-viewer-container">
      {/* Version Sidebar */}
      <div className="version-sidebar">
        <div className="version-sidebar-header">
          <GitCommit size={18} color="#38bdf8" />
          <span>PROJECT VERSIONS ({project.versions.length})</span>
        </div>

        <div className="version-list">
          {project.versions.map((ver, idx) => {
            const isSelected = idx === selectedVersionIdx;
            return (
              <div
                key={ver.version}
                className={`version-item ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedVersionIdx(idx)}
              >
                <div className="ver-badge">v{ver.version}</div>
                <div className="ver-info">
                  <span className="ver-desc">{ver.description}</span>
                  <span className="ver-time">{new Date(ver.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Diff Content */}
      <div className="diff-content-panel">
        <div className="diff-header-bar">
          <div>
            <h3>Version {selectedVersion.version} — Snapshot Diff</h3>
            <span className="text-muted">{selectedVersion.description}</span>
          </div>

          <div className="diff-actions">
            <button className="btn-success btn-sm flex-align">
              <Check size={14} /> Accept Patch
            </button>
            <button className="btn-secondary btn-sm flex-align">
              <X size={14} /> Reject Patch
            </button>
          </div>
        </div>

        {/* Simulated Code Diff View */}
        <div className="code-diff-box">
          <div className="diff-file-title">
            <FileCode size={14} />
            <span>src/Bot.Domain/Entities/User.cs</span>
          </div>

          <div className="diff-code-lines">
            <div className="diff-line unchanged">
              <span className="ln">1</span>
              <code>namespace Bot.Domain.Entities;</code>
            </div>
            <div className="diff-line unchanged">
              <span className="ln">2</span>
              <code>{"public class User {"}</code>
            </div>
            <div className="diff-line unchanged">
              <span className="ln">3</span>
              <code>{"    public long TelegramId { get; set; }"}</code>
            </div>
            <div className="diff-line removed">
              <span className="ln">4</span>
              <code>{"-   public string Role { get; set; } = \"User\";"}</code>
            </div>
            <div className="diff-line added">
              <span className="ln">5</span>
              <code>{"+   public string Role { get; set; } = \"User\"; // Updated for RBAC"}</code>
            </div>
            <div className="diff-line added">
              <span className="ln">6</span>
              <code>{"+   public string? ReferralCode { get; set; }"}</code>
            </div>
            <div className="diff-line added">
              <span className="ln">7</span>
              <code>{"+   public int ReferralBonusPoints { get; set; } = 0;"}</code>
            </div>
            <div className="diff-line unchanged">
              <span className="ln">8</span>
              <code>{"}"}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
