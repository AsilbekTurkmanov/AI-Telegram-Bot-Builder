import React, { useState } from 'react';
import { Send, Bot, User as UserIcon, AlertTriangle, FileCode, Sparkles, CheckCircle2 } from 'lucide-react';
import { Project, AiMessage } from '../../types/project';
import { processAiChatMessage } from '../../services/aiChatService';

interface AIChatPanelProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({ project, onUpdateProject }) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const samplePrompts = [
    "Referral (taklif) tizimini qo'sh",
    "Buyurtma statuslariga 'Yetkazib berilmoqda' bosqichini qo'sh",
    "Payme to'lov tizimi integratsiyasini yarat"
  ];

  const handleSend = (textToSend?: string) => {
    const prompt = textToSend || inputPrompt;
    if (!prompt.trim() || isProcessing) return;

    setIsProcessing(true);
    setInputPrompt('');

    setTimeout(() => {
      const { updatedProject } = processAiChatMessage(project, prompt);
      onUpdateProject(updatedProject);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="ai-chat-panel">
      {/* AI Chat Header */}
      <div className="ai-chat-header">
        <div className="ai-chat-title">
          <Bot size={20} color="#38bdf8" />
          <span>AI Architect Assistant</span>
        </div>
        <span className="badge badge-success flex-align">
          <Sparkles size={12} /> Context Aware
        </span>
      </div>

      {/* Messages List */}
      <div className="ai-messages-list">
        {project.messages.map((msg) => (
          <div key={msg.id} className={`ai-message-wrapper ${msg.role}`}>
            <div className="msg-avatar">
              {msg.role === 'assistant' ? <Bot size={16} color="#38bdf8" /> : <UserIcon size={16} />}
            </div>

            <div className="msg-content-card">
              <div className="msg-text">{msg.content}</div>

              {/* Affected Files & Risk Badge */}
              {msg.affectedFiles && msg.affectedFiles.length > 0 && (
                <div className="affected-files-box">
                  <div className="affected-header">
                    <FileCode size={12} />
                    <span>Affected Files ({msg.affectedFiles.length}):</span>
                    {msg.riskLevel && (
                      <span className={`risk-tag risk-${msg.riskLevel.toLowerCase()}`}>
                        Risk: {msg.riskLevel}
                      </span>
                    )}
                  </div>
                  <div className="affected-list">
                    {msg.affectedFiles.map((f, idx) => (
                      <span key={idx} className="file-chip">
                        {f.split('/').pop()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <span className="msg-time">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="ai-message-wrapper assistant">
            <div className="msg-avatar">
              <Bot size={16} className="spin-icon" color="#38bdf8" />
            </div>
            <div className="msg-content-card typing">
              <span>AI kodingizni tahlil qilib, o'zgartirish kiritmoqda...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="quick-prompts-bar">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            className="quick-chip"
            onClick={() => handleSend(p)}
          >
            + {p}
          </button>
        ))}
      </div>

      {/* Prompt Input Box */}
      <div className="ai-chat-input-box">
        <textarea
          rows={2}
          placeholder="AI yordamchisiga buyruq bering (masalan: 'Referral tizim qo'sh')..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          className="btn-primary send-btn flex-align"
          onClick={() => handleSend()}
          disabled={isProcessing}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
