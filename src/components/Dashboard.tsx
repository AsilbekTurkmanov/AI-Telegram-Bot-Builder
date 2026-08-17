import React, { useState } from 'react';
import { Plus, Search, Bot, CheckCircle2, AlertTriangle, Code, Download, Play, Trash2, ExternalLink } from 'lucide-react';
import { Project } from '../types/project';

interface DashboardProps {
  projects: Project[];
  onNewProject: () => void;
  onOpenProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onExportZip: (project: Project) => void;
  lang: 'uz' | 'en';
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  onNewProject,
  onOpenProject,
  onDeleteProject,
  onExportZip,
  lang
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.botName.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || p.botType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="dashboard-page">
      {/* Dashboard Stats Bar */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Bot size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-title">{lang === 'uz' ? 'Jami AI Proektlar' : 'Total AI Projects'}</span>
            <span className="stat-value">{projects.length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-title">{lang === 'uz' ? 'Tayyor Botlar' : 'Ready / Active Bots'}</span>
            <span className="stat-value">{projects.filter(p => p.status === 'Ready' || p.status === 'Deployed').length}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper yellow">
            <Code size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-title">{lang === 'uz' ? 'AI Generatsiyalar' : 'AI Generations'}</span>
            <span className="stat-value">18</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <ExternalLink size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-title">{lang === 'uz' ? 'Telegram Ulanish' : 'Connected Tokens'}</span>
            <span className="stat-value">{projects.filter(p => p.isBotConnected).length}</span>
          </div>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="dashboard-header-bar">
        <div>
          <h2>{lang === 'uz' ? 'Loyiha Boshqaruvi' : 'Projects Workspace'}</h2>
          <p className="text-muted">{lang === 'uz' ? 'Mavjud botlarni boshqaring yoki yangi AI bot yaratishni boshlang.' : 'Manage your generated Telegram bots or launch a new AI generator.'}</p>
        </div>

        <button className="btn-primary flex-align" onClick={onNewProject}>
          <Plus size={18} />
          <span>{lang === 'uz' ? '+ Yangi AI Bot' : '+ New AI Bot'}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="dashboard-filter-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={lang === 'uz' ? 'Proekt nomi bo\'yicha qidirish...' : 'Search projects...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-chips">
          {['All', 'Restaurant', 'E-Commerce', 'Support', 'Custom'].map((t) => (
            <button
              key={t}
              className={`filter-chip ${typeFilter === t ? 'active' : ''}`}
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="empty-state-card">
          <Bot size={48} color="#94a3b8" />
          <h3>{lang === 'uz' ? 'Hozircha proektlar yo\'q' : 'No projects found'}</h3>
          <p>{lang === 'uz' ? 'Yangi AI bot yaratish uchun pastdagi tugmani bosing.' : 'Create your first AI Telegram bot project now.'}</p>
          <button className="btn-primary flex-align" onClick={onNewProject}>
            <Plus size={18} />
            <span>{lang === 'uz' ? 'Yangi AI Bot Yaratish' : 'Create AI Bot'}</span>
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-card-header">
                <div className="bot-icon">
                  <Bot size={22} color="#38bdf8" />
                </div>
                <div className="project-meta">
                  <h3 className="project-name">{project.name}</h3>
                  <span className="bot-handle">@{project.botName}</span>
                </div>
                <span className={`status-badge ${project.status.toLowerCase()}`}>
                  {project.status}
                </span>
              </div>

              <p className="project-description">
                {project.description.slice(0, 100)}...
              </p>

              <div className="tech-tags">
                <span className="tag">.NET 10</span>
                <span className="tag">{project.database}</span>
                <span className="tag">{project.language}</span>
                <span className="tag">{project.files.length} files</span>
              </div>

              <div className="project-card-footer">
                <button
                  className="btn-primary flex-1 flex-align"
                  onClick={() => onOpenProject(project)}
                >
                  <Play size={16} />
                  <span>{lang === 'uz' ? 'IDE ni ochish' : 'Open IDE'}</span>
                </button>

                <button
                  className="btn-icon"
                  title="Export ZIP"
                  onClick={() => onExportZip(project)}
                >
                  <Download size={16} />
                </button>

                <button
                  className="btn-icon danger"
                  title="Delete Project"
                  onClick={() => onDeleteProject(project.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
