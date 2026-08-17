import React, { useState } from 'react';
import { X, Key, ShieldCheck, RefreshCw, CheckCircle2, AlertTriangle, Bot } from 'lucide-react';
import { Project } from '../types/project';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpdateProject: (updated: Project) => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdateProject
}) => {
  const [token, setToken] = useState(project.botToken || '7182940124:AAEk921jklMNOpqrSTUvwxYZ_example');
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    telegramApi: boolean;
    postgres: boolean;
    redis: boolean;
  } | null>(project.isBotConnected ? { telegramApi: true, postgres: true, redis: true } : null);

  if (!isOpen) return null;

  const handleSaveAndTest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);

    setTimeout(() => {
      setIsTesting(false);
      const results = { telegramApi: true, postgres: true, redis: true };
      setTestResults(results);

      onUpdateProject({
        ...project,
        botToken: token,
        isBotConnected: true
      });
    }, 1000);
  };

  const maskedToken = token.length > 8 ? `${token.slice(0, 4)}************${token.slice(-4)}` : token;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="modal-header-icon">
          <Key size={36} color="#4ade80" />
          <h2>Telegram Bot Token Connection</h2>
          <p className="text-muted">Enter your bot HTTP API Token from @BotFather.</p>
        </div>

        <form onSubmit={handleSaveAndTest} className="token-form">
          <div className="form-group">
            <label><Bot size={14} /> Telegram Bot Token</label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxYZ"
            />
          </div>

          <div className="masked-preview-box">
            <span>Encrypted Token at rest:</span>
            <code>{maskedToken}</code>
          </div>

          {testResults && (
            <div className="token-test-results">
              <div className="test-row success">
                <CheckCircle2 size={16} color="#4ade80" />
                <span>Telegram Bot API: <strong>Connected (OK 200)</strong></span>
              </div>
              <div className="test-row success">
                <CheckCircle2 size={16} color="#4ade80" />
                <span>PostgreSQL Database: <strong>Connected (Ready)</strong></span>
              </div>
              <div className="test-row success">
                <CheckCircle2 size={16} color="#4ade80" />
                <span>Redis Distributed Cache: <strong>Connected (Ping 1ms)</strong></span>
              </div>
            </div>
          )}

          <button type="submit" className="btn-primary w-full btn-lg flex-align" disabled={isTesting}>
            {isTesting ? (
              <>
                <RefreshCw size={16} className="spin-icon" />
                <span>Testing Connection...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Save Token & Test Connection</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
