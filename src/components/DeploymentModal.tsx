import React, { useState } from 'react';
import { X, Rocket, Server, Terminal, Copy, Check } from 'lucide-react';
import { Project } from '../types/project';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const DeploymentModal: React.FC<DeploymentModalProps> = ({ isOpen, onClose, project }) => {
  const [copied, setCopied] = useState(false);
  const [target, setTarget] = useState<'DockerVPS' | 'Railway' | 'Render'>('DockerVPS');

  if (!isOpen) return null;

  const vpsCommands = `# 1. SSH into Linux VPS (Contabo, DigitalOcean, Hetzner)
ssh root@your-vps-ip

# 2. Clone repository & configure secrets
git clone ${project.githubRepo || 'https://github.com/user/ai-bot-solution'}
cd ${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}

# 3. Create production .env file
cp .env.example .env
nano .env

# 4. Start Docker Compose services
docker compose up -d --build

# 5. Check Health status
curl http://localhost:5000/health/ready`;

  const copyCode = () => {
    navigator.clipboard.writeText(vpsCommands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-lg">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header-icon">
          <Rocket size={36} color="#c084fc" />
          <h2>Docker & Cloud Deployment Guide</h2>
          <p className="text-muted">Deploy your .NET 10 Telegram Bot solution to VPS or Cloud hosting.</p>
        </div>

        <div className="deploy-target-tabs">
          <button
            className={`target-btn ${target === 'DockerVPS' ? 'active' : ''}`}
            onClick={() => setTarget('DockerVPS')}
          >
            <Server size={16} /> Docker Compose (VPS / Contabo)
          </button>
          <button
            className={`target-btn ${target === 'Railway' ? 'active' : ''}`}
            onClick={() => setTarget('Railway')}
          >
            Railway.app Cloud
          </button>
          <button
            className={`target-btn ${target === 'Render' ? 'active' : ''}`}
            onClick={() => setTarget('Render')}
          >
            Render.com
          </button>
        </div>

        <div className="deploy-code-box">
          <div className="code-box-header">
            <span>Terminal Shell Script</span>
            <button className="btn-sm btn-secondary flex-align" onClick={copyCode}>
              {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Commands'}</span>
            </button>
          </div>
          <pre className="code-box-body">{vpsCommands}</pre>
        </div>

        <div className="modal-actions mt-4">
          <button className="btn-primary w-full" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
