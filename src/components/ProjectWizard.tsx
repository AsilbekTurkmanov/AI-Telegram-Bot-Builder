import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Bot, Check, Sparkles, Database, Layers, ShieldCheck, Zap, Key, CheckCircle2, AlertCircle, RefreshCw, HelpCircle, ExternalLink, Shield } from 'lucide-react';
import { Project } from '../types/project';
import { generateInitialFiles } from '../data/templates';
import { validateTelegramToken } from '../services/telegramBotRunner';

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

  // Step 1: Telegram Bot Token (Starts Empty so it explicitly asks user)
  const [botToken, setBotToken] = useState('');
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [tokenValidationMsg, setTokenValidationMsg] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  // Step 2: Basic Info
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

  // Step 3: Selected Features
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

  const handleTestToken = async () => {
    if (!botToken.trim()) {
      setIsTokenValid(false);
      setTokenValidationMsg(lang === 'uz' ? 'Iltimos, avval bot tokenini kiriting.' : 'Please enter a bot token first.');
      return;
    }
    setIsValidatingToken(true);
    setTokenValidationMsg(null);
    setStepError(null);

    const result = await validateTelegramToken(botToken);
    setIsValidatingToken(false);

    if (result.isValid) {
      setIsTokenValid(true);
      if (result.botInfo?.username) {
        setBotName(result.botInfo.username.replace('@', ''));
      }
      if (result.botInfo?.first_name) {
        setProjectName(`${result.botInfo.first_name} Bot`);
      }
      setTokenValidationMsg(
        lang === 'uz'
          ? `✅ Token muvaffaqiyatli tekshirildi! (${result.botInfo?.first_name || 'Bot'} @${result.botInfo?.username || botName})`
          : `✅ Token verified! (${result.botInfo?.first_name || 'Bot'} @${result.botInfo?.username || botName})`
      );
    } else {
      setIsTokenValid(false);
      setTokenValidationMsg(result.errorMessage || (lang === 'uz' ? "Token noto'g'ri." : 'Invalid token.'));
    }
  };

  const handleGenerateSampleToken = () => {
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    let randStr = '';
    for (let i = 0; i < 35; i++) {
      randStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const sample = `${randomDigits}:${randStr}`;
    setBotToken(sample);
    setIsTokenValid(true);
    setStepError(null);
    setTokenValidationMsg(lang === 'uz' ? 'Namuna test token biriktirildi' : 'Sample test token generated');
  };

  const handleNextStep = () => {
    setStepError(null);

    // Validation for Step 1 (Token is REQUIRED)
    if (step === 1) {
      if (!botToken.trim()) {
        setStepError(
          lang === 'uz'
            ? "⚠️ Iltimos, Telegram Bot Tokenini kiriting! (Agar hozircha tokeningiz bo'lmasa, 'Namuna Token' tugmasini bosing)"
            : "⚠️ Please enter your Telegram Bot Token! (Or click 'Sample Token' to test)"
        );
        return;
      }
    }

    if (step === 2) {
      if (!projectName.trim() || !botName.trim()) {
        setStepError(
          lang === 'uz'
            ? "⚠️ Loyiha nomi va Bot username'ini kiriting."
            : "⚠️ Please enter project name and bot username."
        );
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const handleFinish = () => {
    const finalToken = botToken.trim() || '7182940124:AAEk921jklMNOpqrSTUvwxYZ_sample';
    const generatedFiles = generateInitialFiles(
      projectName,
      botName,
      botType,
      language,
      database,
      selectedFeatures,
      finalToken
    );

    const newProj: Project = {
      id: `proj_${Date.now()}`,
      userId: 'usr_default',
      name: projectName,
      botName,
      botToken: finalToken,
      botUsername: botName,
      description,
      botType,
      language,
      database,
      cache,
      status: 'Analyzing',
      progress: 10,
      currentStage: 1,
      isBotConnected: true,
      isRunning: true,
      uptimeSeconds: 0,
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
          content: `Assalomu alaykum! Men sizning **${projectName}** (@${botName}) loyihangiz uchun biriktirilgan AI Architect yordamchisiman. Kodni o'zgartirish uchun istalgan savol yoki buyruq bering!`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    onStartGeneration(newProj);
  };

  return (
    <div className="wizard-container">
      <div className="wizard-card">
        {/* Wizard Progress Steps (5 Steps) */}
        <div className="wizard-steps-header">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span className="step-label">{lang === 'uz' ? 'Bot Token' : 'Bot Token'}</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span className="step-label">{lang === 'uz' ? 'Ma\'lumotlar' : 'Basic Info'}</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-label">{lang === 'uz' ? 'Funksiyalar' : 'Features'}</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step-item ${step >= 4 ? 'active' : ''}`}>
            <span className="step-num">4</span>
            <span className="step-label">{lang === 'uz' ? 'Stack' : 'Stack'}</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step-item ${step >= 5 ? 'active' : ''}`}>
            <span className="step-num">5</span>
            <span className="step-label">{lang === 'uz' ? 'Tasdiqlash' : 'Confirm'}</span>
          </div>
        </div>

        {/* STEP 1: EXPLICIT TELEGRAM BOT TOKEN REQUEST */}
        {step === 1 && (
          <div className="wizard-step-content">
            <div className="step-title-with-icon">
              <div className="icon-badge-cyan">
                <Key size={26} color="#38bdf8" />
              </div>
              <div>
                <h2>{lang === 'uz' ? '1. Telegram Bot Tokenini Kiriting' : '1. Enter Telegram Bot Token'}</h2>
                <p className="text-muted">
                  {lang === 'uz'
                    ? 'Botingiz serverda to‘liq ishlab turishi va xabarlarni qabul qilishi uchun @BotFather tokenini kiriting.'
                    : 'To run your bot and listen to messages in real-time, provide your Bot HTTP API token.'}
                </p>
              </div>
            </div>

            {/* Visual BotFather Step-by-Step Guide */}
            <div className="botfather-guide-card">
              <div className="guide-header">
                <Sparkles size={16} color="#38bdf8" />
                <span>{lang === 'uz' ? "Tokenni olish yo'riqnomasi (@BotFather):" : "How to get a Token from @BotFather:"}</span>
              </div>
              <div className="guide-steps-grid">
                <div className="guide-step">
                  <span className="guide-num">1</span>
                  <span>Telegramda <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="inline-link"><strong>@BotFather</strong> <ExternalLink size={11} /></a> ga kiring</span>
                </div>
                <div className="guide-step">
                  <span className="guide-num">2</span>
                  <span><code>/newbot</code> yuborib, bot nomi va <code>_bot</code> bilan tugovchi username bering</span>
                </div>
                <div className="guide-step">
                  <span className="guide-num">3</span>
                  <span>Berilgan <strong>HTTP API Token</strong>ni nusxalab, pastdagi maydonga kiriting</span>
                </div>
              </div>
            </div>

            {/* Token Input Section */}
            <div className="wizard-token-large-card">
              <label className="token-field-label">
                <Key size={16} color="#38bdf8" />
                <span>{lang === 'uz' ? 'Telegram Bot Token (HTTP API):' : 'Telegram Bot Token (HTTP API):'}</span>
                <span className="required-star">*</span>
              </label>

              <div className="token-input-group">
                <input
                  type="text"
                  autoFocus
                  className={`token-input ${isTokenValid === true ? 'valid' : isTokenValid === false ? 'invalid' : ''}`}
                  value={botToken}
                  onChange={(e) => {
                    setBotToken(e.target.value);
                    setIsTokenValid(null);
                    setTokenValidationMsg(null);
                    setStepError(null);
                  }}
                  placeholder="Masalan: 7182940124:AAEk921jklMNOpqrSTUvwxYZ_sample"
                />

                <button
                  type="button"
                  className="btn-secondary flex-align btn-token-action"
                  onClick={handleTestToken}
                  disabled={isValidatingToken}
                >
                  {isValidatingToken ? (
                    <>
                      <RefreshCw size={14} className="spin-icon" />
                      <span>{lang === 'uz' ? 'Tekshirilmoqda...' : 'Checking...'}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} color="#4ade80" />
                      <span>{lang === 'uz' ? 'Tekshirish' : 'Validate'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn-secondary btn-token-action"
                  onClick={handleGenerateSampleToken}
                  title="Test token generatsiya qilish"
                >
                  {lang === 'uz' ? '⚡ Namuna Token' : '⚡ Sample Token'}
                </button>
              </div>

              {tokenValidationMsg && (
                <div className={`token-status-hint ${isTokenValid ? 'success' : 'error'}`}>
                  {isTokenValid ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  <span>{tokenValidationMsg}</span>
                </div>
              )}

              {stepError && (
                <div className="wizard-step-error-banner">
                  <AlertCircle size={16} />
                  <span>{stepError}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: BASIC INFO & AI PROMPT */}
        {step === 2 && (
          <div className="wizard-step-content">
            <h2>{lang === 'uz' ? '2. Loyiha va Bot Ma\'lumotlari' : '2. Project Details & AI Prompt'}</h2>
            <p className="text-muted">{lang === 'uz' ? 'Bot nomi, username va AI arxitektori uchun talablaringizni belgilang.' : 'Set up your bot handle, category and natural language specification.'}</p>

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
                <label>{lang === 'uz' ? 'Telegram Bot Username (@handle)' : 'Telegram Bot Handle'}</label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="TastyFoodBot"
                />
              </div>
            </div>

            <div className="form-group">
              <label>{lang === 'uz' ? 'Bot turi (Category)' : 'Bot Category'}</label>
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
                placeholder="Bot nima qilishi kerak..."
              />
            </div>

            {stepError && (
              <div className="wizard-step-error-banner">
                <AlertCircle size={16} />
                <span>{stepError}</span>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: FEATURES */}
        {step === 3 && (
          <div className="wizard-step-content">
            <h2>{lang === 'uz' ? '3. Bot Modullari va Imkoniyatlari' : '3. Bot Features & Modules'}</h2>
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

        {/* STEP 4: ARCHITECTURE */}
        {step === 4 && (
          <div className="wizard-step-content">
            <h2>{lang === 'uz' ? '4. Texnologik Arxitektura' : '4. Tech Stack & Architecture'}</h2>
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

        {/* STEP 5: CONFIRMATION & AUTO-RUN */}
        {step === 5 && (
          <div className="wizard-step-content">
            <h2>{lang === 'uz' ? '5. Yaratishga Tayyor!' : '5. Confirm & Generate'}</h2>
            <p className="text-muted">{lang === 'uz' ? 'Barcha sozlamalarni tekshiring. Yaratilgandan so‘ng bot avtomatik ishga tushadi (Auto-Run).' : 'Review your configuration. Bot will start running automatically once generated.'}</p>

            <div className="summary-box">
              <div className="summary-row">
                <span>Telegram Bot Token:</span>
                <strong className="text-cyan">
                  {botToken ? `${botToken.slice(0, 8)}...${botToken.slice(-6)}` : 'Namuna Token'}
                  <span className="token-pill-badge">🟢 Connected</span>
                </strong>
              </div>
              <div className="summary-row">
                <span>Project Name:</span>
                <strong>{projectName} (@{botName})</strong>
              </div>
              <div className="summary-row">
                <span>Auto-Run Status:</span>
                <strong className="text-emerald">⚡ Avtomatik ishga tushirish (Live Polling & Simulator)</strong>
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
                <span>Specification:</span>
                <em>"{description}"</em>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="wizard-footer">
          {step > 1 ? (
            <button className="btn-secondary flex-align" onClick={() => { setStepError(null); setStep(step - 1); }}>
              <ArrowLeft size={16} />
              <span>{lang === 'uz' ? 'Orqaga' : 'Back'}</span>
            </button>
          ) : (
            <button className="btn-secondary" onClick={onCancel}>
              {lang === 'uz' ? 'Bekor qilish' : 'Cancel'}
            </button>
          )}

          {step < 5 ? (
            <button className="btn-primary flex-align" onClick={handleNextStep}>
              <span>{lang === 'uz' ? 'Keyingisi' : 'Next'}</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn-primary btn-lg flex-align glowing-btn" onClick={handleFinish}>
              <Sparkles size={18} />
              <span>{lang === 'uz' ? '🤖 GENERATSIYA VA ISHGA TUSHIRISH' : '🤖 GENERATE & RUN BOT NOW'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
