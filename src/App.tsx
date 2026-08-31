import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ProjectWizard } from './components/ProjectWizard';
import { GeneratorProgress } from './components/GeneratorProgress';
import { IDEHeader } from './components/BuilderIDE/IDEHeader';
import { FileExplorer } from './components/BuilderIDE/FileExplorer';
import { MonacoEditorView } from './components/BuilderIDE/MonacoEditorView';
import { TelegramSimulator } from './components/BuilderIDE/TelegramSimulator';
import { DatabaseViewer } from './components/BuilderIDE/DatabaseViewer';
import { AdminPanelPreview } from './components/BuilderIDE/AdminPanelPreview';
import { VersionDiffViewer } from './components/BuilderIDE/VersionDiffViewer';
import { BuildTerminal } from './components/BuilderIDE/BuildTerminal';
import { AIChatPanel } from './components/BuilderIDE/AIChatPanel';
import { GitHubModal } from './components/GitHubModal';
import { TokenModal } from './components/TokenModal';
import { DeploymentModal } from './components/DeploymentModal';
import { DocsPage } from './components/DocsPage';

import { Project, ProjectFile, User } from './types/project';
import { generateInitialFiles } from './data/templates';
import { exportProjectToZip } from './services/zipExporter';

import { Code, MessageSquare, Database, Shield, GitBranch, Terminal } from 'lucide-react';

export function App() {
  const [lang, setLang] = useState<'uz' | 'en'>('uz');
  const [activeTab, setActiveTab] = useState<string>('landing'); // landing, dashboard, wizard, generating, builder, docs, pricing
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Modals
  const [isGitHubOpen, setIsGitHubOpen] = useState(false);
  const [isTokenOpen, setIsTokenOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);

  // User State
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr_1',
    name: 'Dilshodbek',
    email: 'dilshodbek@example.com',
    role: 'User',
    plan: 'Pro',
    apiGenerationsUsed: 4,
    apiGenerationsLimit: 50
  });

  // Initial Sample Project
  // Initial Sample Project
  const sampleProjectToken = '7182940124:AAEk921jklMNOpqrSTUvwxYZ_sample';
  const initialFiles = generateInitialFiles(
    'My Restaurant Bot',
    'MyRestaurantBot',
    'Restaurant',
    'Uzbek',
    'PostgreSQL',
    ['/start', 'menu', 'cart', 'orders', 'delivery', 'admin_panel'],
    sampleProjectToken
  );

  const sampleProject: Project = {
    id: 'proj_sample_1',
    userId: 'usr_1',
    name: 'My Restaurant Bot',
    botName: 'MyRestaurantBot',
    description: 'Menga restoran uchun Telegram bot kerak. Menyu, buyurtma berish, yetkazib berish manzili, admin panel va buyurtma statuslari bo‘lsin.',
    botType: 'Restaurant',
    language: 'Uzbek',
    database: 'PostgreSQL',
    cache: 'Redis',
    status: 'Running',
    progress: 100,
    currentStage: 10,
    isBotConnected: true,
    isRunning: true,
    uptimeSeconds: 45,
    botToken: sampleProjectToken,
    botUsername: 'MyRestaurantBot',
    githubRepo: 'https://github.com/user/ai-bot-my-restaurant-bot',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    features: ['/start', 'menu', 'cart', 'orders', 'delivery', 'admin_panel'],
    files: initialFiles,
    versions: [
      {
        version: 1,
        description: 'Initial AI Clean Architecture Solution',
        createdAt: new Date().toISOString(),
        filesSnapshot: initialFiles.reduce((acc, f) => ({ ...acc, [f.path]: f.content }), {})
      }
    ],
    messages: [
      {
        id: 'm_init',
        role: 'assistant',
        content: "Assalomu alaykum! **My Restaurant Bot** loyihasi uchun biriktirilgan AI yordamchisiman. Istalgan o'zgartirish talabini yozing (masalan: *\"Referral tizim qo'sh\"*).",
        timestamp: new Date().toLocaleTimeString()
      }
    ]
  };

  const [projects, setProjects] = useState<Project[]>([sampleProject]);
  const [activeProject, setActiveProject] = useState<Project | null>(sampleProject);
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(initialFiles[0]);
  const [wizardInitialPrompt, setWizardInitialPrompt] = useState('');

  // Builder Center View Tab
  const [builderCenterTab, setBuilderCenterTab] = useState<'editor' | 'telegram' | 'database' | 'admin' | 'diff' | 'terminal'>('editor');

  const handleStartWizard = (prompt?: string) => {
    if (prompt) setWizardInitialPrompt(prompt);
    setActiveTab('wizard');
  };

  const handleStartGeneration = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    setActiveProject(newProject);
    setActiveFile(newProject.files[0] || null);
    setActiveTab('generating');
  };

  const handleGenerationComplete = (updatedProject: Project) => {
    const runningProj: Project = {
      ...updatedProject,
      status: 'Running',
      isRunning: true
    };
    setProjects(prev => prev.map(p => p.id === runningProj.id ? runningProj : p));
    setActiveProject(runningProj);
    setActiveTab('builder');
  };

  const handleOpenProject = (project: Project) => {
    setActiveProject(project);
    setActiveFile(project.files[0] || null);
    setActiveTab('builder');
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProject?.id === projectId) {
      setActiveProject(null);
      setActiveTab('dashboard');
    }
  };

  const handleUpdateActiveProject = (updated: Project) => {
    setActiveProject(updated);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleToggleRun = (targetProject: Project, isRunning: boolean) => {
    const updated: Project = {
      ...targetProject,
      isRunning,
      status: isRunning ? 'Running' : 'Stopped'
    };
    handleUpdateActiveProject(updated);
  };

  const handleFileContentChange = (newContent: string) => {
    if (!activeFile || !activeProject) return;

    const updatedFiles = activeProject.files.map(f =>
      f.id === activeFile.id ? { ...f, content: newContent } : f
    );

    const updatedProject = { ...activeProject, files: updatedFiles };
    setActiveFile({ ...activeFile, content: newContent });
    handleUpdateActiveProject(updatedProject);
  };

  const handleExportZip = (proj?: Project) => {
    const target = proj || activeProject;
    if (target) {
      exportProjectToZip(target.name, target.files);
    }
  };

  return (
    <div className="app-root-container">
      {/* Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        lang={lang}
        setLang={setLang}
      />

      {/* Main App Body */}
      <main className="main-content-area">
        {/* Landing Page */}
        {(activeTab === 'landing' || activeTab === 'pricing') && (
          <LandingPage
            onStartWizard={handleStartWizard}
            lang={lang}
          />
        )}

        {/* Projects Dashboard */}
        {activeTab === 'dashboard' && (
          <Dashboard
            projects={projects}
            onNewProject={() => handleStartWizard()}
            onOpenProject={handleOpenProject}
            onDeleteProject={handleDeleteProject}
            onExportZip={handleExportZip}
            onToggleRun={handleToggleRun}
            lang={lang}
          />
        )}

        {/* Project Wizard */}
        {activeTab === 'wizard' && (
          <ProjectWizard
            initialPrompt={wizardInitialPrompt}
            onCancel={() => setActiveTab('dashboard')}
            onStartGeneration={handleStartGeneration}
            lang={lang}
          />
        )}

        {/* Generation Progress Screen */}
        {activeTab === 'generating' && activeProject && (
          <GeneratorProgress
            project={activeProject}
            onComplete={handleGenerationComplete}
            lang={lang}
          />
        )}

        {/* Main Builder IDE Workspace */}
        {activeTab === 'builder' && activeProject && (
          <div className="builder-ide-workspace">
            {/* Top IDE Header */}
            <IDEHeader
              project={activeProject}
              onBack={() => setActiveTab('dashboard')}
              onValidate={() => setBuilderCenterTab('terminal')}
              onExportZip={() => handleExportZip(activeProject)}
              onOpenGitHub={() => setIsGitHubOpen(true)}
              onOpenToken={() => setIsTokenOpen(true)}
              onOpenDeploy={() => setIsDeployOpen(true)}
              onToggleRun={(isRunning) => handleToggleRun(activeProject, isRunning)}
              lang={lang}
            />

            <div className="ide-body-grid">
              {/* Left Panel: File Explorer */}
              <FileExplorer
                files={activeProject.files}
                activeFile={activeFile}
                onSelectFile={(f) => {
                  setActiveFile(f);
                  setBuilderCenterTab('editor');
                }}
              />

              {/* Center Workspace Area */}
              <div className="center-workspace-area">
                {/* Center Tabs Navigation */}
                <div className="center-tab-navigation">
                  <button
                    className={`center-tab-btn ${builderCenterTab === 'editor' ? 'active' : ''}`}
                    onClick={() => setBuilderCenterTab('editor')}
                  >
                    <Code size={15} /> <span>Code Editor</span>
                  </button>

                  <button
                    className={`center-tab-btn ${builderCenterTab === 'telegram' ? 'active' : ''}`}
                    onClick={() => setBuilderCenterTab('telegram')}
                  >
                    <MessageSquare size={15} color="#38bdf8" /> <span>Telegram Bot Simulator</span>
                  </button>

                  <button
                    className={`center-tab-btn ${builderCenterTab === 'database' ? 'active' : ''}`}
                    onClick={() => setBuilderCenterTab('database')}
                  >
                    <Database size={15} color="#4ade80" /> <span>PostgreSQL Schema</span>
                  </button>

                  <button
                    className={`center-tab-btn ${builderCenterTab === 'admin' ? 'active' : ''}`}
                    onClick={() => setBuilderCenterTab('admin')}
                  >
                    <Shield size={15} color="#facc15" /> <span>React Admin Panel</span>
                  </button>

                  <button
                    className={`center-tab-btn ${builderCenterTab === 'diff' ? 'active' : ''}`}
                    onClick={() => setBuilderCenterTab('diff')}
                  >
                    <GitBranch size={15} color="#c084fc" /> <span>Version & Diffs</span>
                  </button>

                  <button
                    className={`center-tab-btn ${builderCenterTab === 'terminal' ? 'active' : ''}`}
                    onClick={() => setBuilderCenterTab('terminal')}
                  >
                    <Terminal size={15} /> <span>Build Terminal</span>
                  </button>
                </div>

                {/* Center View Render */}
                <div className="center-view-content">
                  {builderCenterTab === 'editor' && (
                    <MonacoEditorView
                      file={activeFile}
                      onContentChange={handleFileContentChange}
                    />
                  )}

                  {builderCenterTab === 'telegram' && (
                    <TelegramSimulator
                      project={activeProject}
                      onToggleRun={(isRunning) => handleToggleRun(activeProject, isRunning)}
                    />
                  )}

                  {builderCenterTab === 'database' && (
                    <DatabaseViewer project={activeProject} />
                  )}

                  {builderCenterTab === 'admin' && (
                    <AdminPanelPreview project={activeProject} />
                  )}

                  {builderCenterTab === 'diff' && (
                    <VersionDiffViewer project={activeProject} />
                  )}

                  {builderCenterTab === 'terminal' && (
                    <BuildTerminal project={activeProject} />
                  )}
                </div>
              </div>

              {/* Right Panel: Persistent AI Assistant */}
              <AIChatPanel
                project={activeProject}
                onUpdateProject={handleUpdateActiveProject}
              />
            </div>
          </div>
        )}

        {/* Documentation Page */}
        {activeTab === 'docs' && <DocsPage lang={lang} />}
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={setCurrentUser}
        onLogout={() => setCurrentUser(null)}
        lang={lang}
      />

      {activeProject && (
        <>
          <GitHubModal
            isOpen={isGitHubOpen}
            onClose={() => setIsGitHubOpen(false)}
            project={activeProject}
            onUpdateProject={handleUpdateActiveProject}
          />

          <TokenModal
            isOpen={isTokenOpen}
            onClose={() => setIsTokenOpen(false)}
            project={activeProject}
            onUpdateProject={handleUpdateActiveProject}
          />

          <DeploymentModal
            isOpen={isDeployOpen}
            onClose={() => setIsDeployOpen(false)}
            project={activeProject}
          />
        </>
      )}
    </div>
  );
}

export default App;
