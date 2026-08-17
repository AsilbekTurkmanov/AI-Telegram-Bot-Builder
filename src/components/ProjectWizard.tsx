import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Bot, Check, Sparkles, Database, Layers, ShieldCheck, Zap } from 'lucide-react';
import { Project } from '../types/project';
import { generateInitialFiles } from '../data/templates';

interface ProjectWizardProps {
  initialPrompt?: string;
  onCancel: () => void;
  onStartGeneration: (newProject: Project) => void;
  lang: 'uz' | 'en';
}

export const ProjectWizard: React.FC<ProjectWizardProps> = ({
  initialPrompt = '',
  onCancel,
  onStartGeneration,
  lang
}) => {
  const [step, setStep] = useState(1);

  // Form State
  const [projectName, setProjectName] = useState('My Restaurant Bot');
  const [botName, setBotName] = useState('TastyFoodBot');
  const [description, setDescription] = useState(
    initialPrompt ||
      (lang === 'uz'
        ? "Menga restoran uchun Telegram bot kerak. Menyu, buyurtma berish, yetkazib berish manzili, admin panel va buyurtma statuslari bo‘lsin."
        : "I need a restaurant Telegram bot. Includes food menu, order cart, delivery address, admin panel, and order status updates.")
  );
  const [botType, setBotType] = useState<'Restaurant' | 'E-Commerce' | 'Support' | 'Booking' | 'Custom'>('Restaurant');
  const [language, setLanguage] = useState<'Uzbek' | 'English' | 'Russian'>('Uzbek');
  const [database, setDatabase] = useState<'PostgreSQL' | 'SQLite'>('PostgreSQL');
  const [cache, setCache] = useState<'Redis' | 'None'>('Redis');

  // Selected Features
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    '/start',
    'registration',
    'menu',
    'cart',
    'orders',
    'delivery',
    'admin_panel',
    'broadcast',
    'statistics'
  ]);

  const availableFeatures = [
    { id: '/start', label: '/start Command' },
    { id: 'registration', label: 'User Registration' },
    { id: 'menu', label: 'Product Catalog / Menu' },
    { id: 'cart', label: 'Shopping Cart' },
    { id: 'orders', label: 'Order Placement & Tracking' },
    { id: 'payments', label: 'Payment Gateway (Payme/Click)' },
    { id: 'delivery', label: 'Location & Delivery Address' },
    { id: 'admin_panel', label: 'React Admin Dashboard' },
    { id: 'broadcast', label: 'Mass Broadcast Messenger' },
    { id: 'referral', label: 'Referral System' },
    { id: 'promo', label: 'Promo Codes & Discounts' },
    { id: 'statistics', label: 'Live Analytics & Reports' }
  ];

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const handleFinish = () => {
    const generatedFiles = generateInitialFiles(
      projectName,
      botName,
      botType,
      language,
      database,
      selectedFeatures
    );

    const newProj: Project = {
      id: `proj_${Date.now()}`,
      userId: 'usr_default',
      name: projectName,
      botName,
      description,
      botType,
      language,
      database,
      cache,
      status: 'Analyzing',
      progress: 10,
      currentStage: 1,
      isBotConnected: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      features: selectedFeatures,
      files: generatedFiles,
      versions: [
        {
          version: 1,
          description: 'Initial AI Architecture Generation',
          createdAt: new Date().toISOString(),
          filesSnapshot: generatedFiles.reduce((acc, f) => ({ ...acc, [f.path]: f.content }), {})
        }
      ],
      messages: [
        {
          id: 'msg_init',
          role: 'assistant',
          content: `Assalomu alaykum! Men sizning **${projectName}** loyihangiz uchun biriktirilgan AI Architect yordamchisiman. Kodni o'zgartirish uchun istalgan savol yoki buyruq bering!`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    onStartGeneration(newProj);
  };

  return (
    <div className="wizard-container">
      <div className="wizard-card">
        {/* Wizard Progress Steps */}
        <div className="wizard-steps-header">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-label">{lang === 'uz' ? 'Asosiy Ma\'lumotlar' : 'Basic Info'}</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-label">{lang === 'uz' ? 'Funksiyalar' : 'Features'}</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-label">{lang === 'uz' ? 'Arxitektura' : 'Architecture'}</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step-item ${step >= 4 ? 'active' : ''}`}>
            <span className="step-num">4</span>
            <span className="step-label">{lang === 'uz' ? 'Tasdiqlash' : 'Confirm'}</span>
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="wizard-step-content">
            <h2>{lang === 'uz' ? '1. Loyiha haqida ma\'lumot' : '1. Basic Information'}</h2>
            <p className="text-muted">{lang === 'uz' ? 'Telegram botingiz nomi va maqsadini belgilang.' : 'Set up your project title and natural language prompt.'}</p>

            <div className="form-grid">
              <div className="form-group">
                <label>{lang === 'uz' ? 'Loyiha nomi' : 'Project Name'}</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Restaurant Bot"
                />
              </div>

              <div className="form-group">
                <label>{lang === 'uz' ? 'Telegram Bot Username' : 'Telegram Bot Name'}</label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="TastyFoodBot"
                />
              </div>
            </div>

            <div className="form-group">
              <label>{lang === 'uz' ? 'Bot turi (Category)' : 'Bot Type'}</label>
              <div className="type-buttons">
                {['Restaurant', 'E-Commerce', 'Support', 'Booking', 'Custom'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`type-btn ${botType === t ? 'active' : ''}`}
                    onClick={() => setBotType(t as any)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>{lang === 'uz' ? 'AI prompt / Talabingiz (Natural Language)' : 'Natural Language Requirements'}</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Features */}
        {step === 2 && (
          <div className="wizard-step-content">
            <h2>{lang === 'uz' ? '2. Bot Modullari va Imkoniyatlari' : '2. Bot Features & Modules'}</h2>
            <p className="text-muted">{lang === 'uz' ? 'Botingiz tarkibiga kiruvchi funksiyalarni tanlang.' : 'Check the required capabilities for your generated bot.'}</p>

            <div className="features-checkbox-grid">
              {availableFeatures.map((f) => {
                const isChecked = selectedFeatures.includes(f.id);
                return (
                  <div
                    key={f.id}
                    className={`feature-checkbox-card ${isChecked ? 'selected' : ''}`}
                    onClick={() => toggleFeature(f.id)}
                  >
                    <div className="checkbox-icon">
                      {isChecked && <Check size={14} color="#38bdf8" />}
                    </div>
                    <span>{f.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Architecture */}
        {step === 3 && (
          <div className="wizard-step-content">
            <h2>{lang === 'uz' ? '3. Texnologik Arxitektura' : '3. Tech Stack & Architecture'}</h2>
            <p className="text-muted">{lang === 'uz' ? 'AI yaratuvchi backend va ma\'lumotlar bazasi texnologiyalari.' : 'Choose the stack for code generation.'}</p>

            <div className="arch-options-grid">
              <div className="arch-card active">
                <Layers size={24} color="#38bdf8" />
                <h3>Backend Framework</h3>
                <span className="arch-value">ASP.NET Core .NET 10 (Clean Architecture)</span>
              </div>

              <div className="arch-card active">
                <Database size={24} color="#4ade80" />
                <h3>Database Provider</h3>
                <div className="arch-select-buttons">
                  <button
                    type="button"
                    className={database === 'PostgreSQL' ? 'active' : ''}
                    onClick={() => setDatabase('PostgreSQL')}
                  >
                    PostgreSQL
                  </button>
                  <button
                    type="button"
                    className={database === 'SQLite' ? 'active' : ''}
                    onClick={() => setDatabase('SQLite')}
                  >
                    SQLite
                  </button>
                </div>
              </div>

              <div className="arch-card active">
                <Zap size={24} color="#facc15" />
                <h3>Cache & Queue</h3>
                <div className="arch-select-buttons">
                  <button
                    type="button"
                    className={cache === 'Redis' ? 'active' : ''}
                    onClick={() => setCache('Redis')}
                  >
                    Redis
                  </button>
                  <button
                    type="button"
                    className={cache === 'None' ? 'active' : ''}
                    onClick={() => setCache('None')}
                  >
                    None
                  </button>
                </div>
              </div>

              <div className="arch-card active">
                <ShieldCheck size={24} color="#c084fc" />
                <h3>Container & Deployment</h3>
                <span className="arch-value">Docker Compose + GitHub Actions</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="wizard-step-content">
            <h2>{lang === 'uz' ? '4. Yaratishga Tayyor!' : '4. Confirm & Generate'}</h2>
            <p className="text-muted">{lang === 'uz' ? 'Barcha sozlamalarni tekshiring va AI kod generatorini ishga tushiring.' : 'Review your architecture configuration before triggering generation.'}</p>

            <div className="summary-box">
              <div className="summary-row">
                <span>Project Name:</span>
                <strong>{projectName} (@{botName})</strong>
              </div>
              <div className="summary-row">
                <span>Bot Category:</span>
                <strong>{botType}</strong>
              </div>
              <div className="summary-row">
                <span>Architecture Stack:</span>
                <strong>C# .NET 10 + {database} + {cache} + React Admin</strong>
              </div>
              <div className="summary-row">
                <span>Selected Features ({selectedFeatures.length}):</span>
                <strong>{selectedFeatures.join(', ')}</strong>
              </div>
              <div className="summary-row">
                <span>Natural Language Specification:</span>
                <em>"{description}"</em>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="wizard-footer">
          {step > 1 ? (
            <button className="btn-secondary flex-align" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={16} />
              <span>{lang === 'uz' ? 'Orqaga' : 'Back'}</span>
            </button>
          ) : (
            <button className="btn-secondary" onClick={onCancel}>
              {lang === 'uz' ? 'Bekor qilish' : 'Cancel'}
            </button>
          )}

          {step < 4 ? (
            <button className="btn-primary flex-align" onClick={() => setStep(step + 1)}>
              <span>{lang === 'uz' ? 'Keyingisi' : 'Next'}</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn-primary btn-lg flex-align glowing-btn" onClick={handleFinish}>
              <Sparkles size={18} />
              <span>{lang === 'uz' ? '🤖 KODNI GENERATSIYA QILISH' : '🤖 GENERATE CODE NOW'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
