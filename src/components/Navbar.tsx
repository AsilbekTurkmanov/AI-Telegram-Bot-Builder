import React from 'react';
import { Bot, Cpu, FolderGit2, BookOpen, CreditCard, Shield, Globe, UserCheck, LogIn } from 'lucide-react';
import { User } from '../types/project';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  lang: 'uz' | 'en';
  setLang: (lang: 'uz' | 'en') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  lang,
  setLang
}) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <div className="nav-brand" onClick={() => setActiveTab('landing')}>
          <div className="logo-icon">
            <Bot size={26} color="#38bdf8" />
          </div>
          <div className="brand-text">
            <span className="brand-title">AI Telegram Bot Builder</span>
            <span className="brand-badge">.NET 10 • Clean Arch</span>
          </div>
        </div>

        {/* Links */}
        <div className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'landing' ? 'active' : ''}`}
            onClick={() => setActiveTab('landing')}
          >
            <Cpu size={16} />
            <span>{lang === 'uz' ? 'Asosiy' : 'Home'}</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FolderGit2 size={16} />
            <span>{lang === 'uz' ? 'Loyihalar' : 'Projects'}</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'docs' ? 'active' : ''}`}
            onClick={() => setActiveTab('docs')}
          >
            <BookOpen size={16} />
            <span>{lang === 'uz' ? 'Hujjatlar' : 'Docs'}</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            <CreditCard size={16} />
            <span>{lang === 'uz' ? 'Narxlar' : 'Pricing'}</span>
          </button>
        </div>

        {/* Right Section */}
        <div className="nav-actions">
          {/* Language Switcher */}
          <button
            className="lang-toggle"
            onClick={() => setLang(lang === 'uz' ? 'en' : 'uz')}
            title="Tilni o'zgartirish / Switch language"
          >
            <Globe size={16} />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* User Section */}
          {currentUser ? (
            <div className="user-profile" onClick={onOpenAuth}>
              <div className="avatar">
                <UserCheck size={16} />
              </div>
              <div className="user-details">
                <span className="user-name">{currentUser.name}</span>
                <span className="plan-tag">{currentUser.plan}</span>
              </div>
            </div>
          ) : (
            <button className="btn-primary flex-align" onClick={onOpenAuth}>
              <LogIn size={16} />
              <span>{lang === 'uz' ? 'Kirish' : 'Login'}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
