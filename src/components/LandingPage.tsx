import React, { useState } from 'react';
import { Sparkles, Bot, Layers, Database, Shield, Terminal, ArrowRight, CheckCircle2, Zap, Download } from 'lucide-react';

interface LandingPageProps {
  onStartWizard: (initialPrompt?: string) => void;
  lang: 'uz' | 'en';
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartWizard, lang }) => {
  const [prompt, setPrompt] = useState(
    lang === 'uz'
      ? "Menga restoran uchun Telegram bot kerak. Menyu, buyurtma berish, yetkazib berish manzili, admin panel va buyurtma statuslari bo‘lsin."
      : "I need a restaurant Telegram bot. Includes menu, order cart, delivery address, admin panel, and order statuses."
  );

  const samplePrompts = [
    lang === 'uz'
      ? "Menga restoran uchun Telegram bot kerak. Menyu, buyurtma berish, yetkazib berish manzili va admin panel bo‘lsin."
      : "I need a restaurant Telegram bot with food menu, online ordering, delivery address, and admin panel.",

    lang === 'uz'
      ? "Kiyim do'koni uchun Telegram e-commerce bot. Mahsulotlar katalogi, filtr, savat, Payme/Click to'lov va zakazlar boshqaruvi."
      : "E-Commerce clothing store bot with product catalog, search filters, cart, payment integration, and admin dashboard.",

    lang === 'uz'
      ? "Texnik yordam va chiptalar (Support Ticket) boti. User savol yuboradi, admin javob beradi, notification yuboradi."
      : "Support & Helpdesk ticket Telegram bot. User submits ticket, admin receives alert and replies directly."
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-glow"></div>
        
        <div className="hero-badge">
          <Sparkles size={14} color="#38bdf8" />
          <span>Next-Gen AI Code Generation Platform</span>
        </div>

        <h1 className="hero-title">
          {lang === 'uz' ? (
            <>
              Oddiy matndan <span className="text-gradient">Professional Telegram Bot</span> yarating
            </>
          ) : (
            <>
              Build Production-Ready <span className="text-gradient">Telegram Bots</span> using AI
            </>
          )}
        </h1>

        <p className="hero-subtitle">
          {lang === 'uz'
            ? 'AI siz bergan talab bo‘yicha .NET 10 Clean Architecture backend, PostgreSQL modeli, React Admin Paneli va Docker konfiguratsiyasini avtomatik yaratadi.'
            : 'AI analyzes your requirements and automatically generates .NET 10 Clean Architecture backend, PostgreSQL schemas, React Admin UI, and Docker configurations.'}
        </p>

        {/* AI Prompt Input Box */}
        <div className="prompt-sandbox-card">
          <div className="sandbox-header">
            <Bot size={20} color="#38bdf8" />
            <span>{lang === 'uz' ? 'AI Bot Talabingizni Yozing:' : 'Describe your Bot in natural language:'}</span>
          </div>

          <textarea
            className="prompt-textarea"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={lang === 'uz' ? 'Bot haqida yozing...' : 'Type your bot requirements...'}
          />

          <div className="sandbox-footer">
            <div className="sample-prompts">
              <span className="sample-title">{lang === 'uz' ? 'Namuna:' : 'Templates:'}</span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  className="sample-chip"
                  onClick={() => setPrompt(p)}
                >
                  {p.slice(0, 35)}...
                </button>
              ))}
            </div>

            <button
              className="btn-primary btn-lg flex-align"
              onClick={() => onStartWizard(prompt)}
            >
              <span>{lang === 'uz' ? 'AI Bot Yaratish' : 'Generate Bot Now'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Live Features Bar */}
        <div className="hero-stats-bar">
          <div className="stat-item">
            <span className="stat-num">.NET 10</span>
            <span className="stat-label">Clean Architecture</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">PostgreSQL</span>
            <span className="stat-label">EF Core Migrations</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">React</span>
            <span className="stat-label">Tailwind Admin UI</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">Docker</span>
            <span className="stat-label">1-Click Compose</span>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="features-grid-section">
        <h2 className="section-title text-center">
          {lang === 'uz' ? 'Platformaning Asosiy Imkoniyatlari' : 'Complete Bot Builder Ecosystem'}
        </h2>
        <p className="section-subtitle text-center">
          {lang === 'uz' ? 'Qo‘lda kod yozish shart emas. Barcha qatlamlar 100% tayyor va testdan o‘tgan holda taqdim etiladi.' : 'No manual boilerplate coding needed. Everything comes validated, structured, and ready to deploy.'}
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Layers size={24} color="#38bdf8" /></div>
            <h3>{lang === 'uz' ? 'Clean Architecture' : 'Clean Architecture'}</h3>
            <p>{lang === 'uz' ? 'Domain, Application, Infrastructure, API va Telegram qatlamlari SOLID prinsiplariga mos holda tuziladi.' : 'Separation of concerns into Domain, Application, Infrastructure, API, and Bot layers following SOLID rules.'}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Database size={24} color="#4ade80" /></div>
            <h3>{lang === 'uz' ? 'PostgreSQL & Redis' : 'PostgreSQL & Redis'}</h3>
            <p>{lang === 'uz' ? 'Entity Framework Core modellari, DB migration fayllari va Redis kesh mexanizmi tayyor holatda.' : 'EF Core entity definitions, database migration scripts, and Redis distributed caching.'}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Terminal size={24} color="#facc15" /></div>
            <h3>{lang === 'uz' ? 'Live Simulator & Code Editor' : 'Live Simulator & Code Editor'}</h3>
            <p>{lang === 'uz' ? 'Monaco editor va Telegram simulyatori orqali bot tugmalarini va buyruqlarini darhol test qiling.' : 'Test bot commands, inline keyboards, and edit generated C# & React code directly inside the browser.'}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Shield size={24} color="#c084fc" /></div>
            <h3>{lang === 'uz' ? 'AI Repair Loop & Validation' : 'AI Repair Loop & Validation'}</h3>
            <p>{lang === 'uz' ? 'Generatsiya qilingan kod avtomatik build qilinadi. Xatolik topsa, AI avto-tuzatish (repair) bajaradi.' : 'Automated validation runs dotnet build and npm test. Detects errors and performs self-healing fix cycles.'}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Download size={24} color="#fb7185" /></div>
            <h3>{lang === 'uz' ? 'ZIP Export & GitHub Sync' : 'ZIP Export & GitHub Sync'}</h3>
            <p>{lang === 'uz' ? 'Tayyor loyihani 1-klikda ZIP qilib yuklab oling yoki to\'g\'ridan-to\'g\'ri GitHub reposiga push qiling.' : 'Download complete source code with 1-click ZIP export or push directly to GitHub repository.'}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon"><Zap size={24} color="#38bdf8" /></div>
            <h3>{lang === 'uz' ? 'Docker-First Deployment' : 'Docker-First Deployment'}</h3>
            <p>{lang === 'uz' ? 'Dockerfile va docker-compose.yml fayllari Contabo, VPS, DigitalOcean va Railway uchun tayyor.' : 'Pre-configured Dockerfile & docker-compose setup ready for VPS, Railway, Render, or Hetzner.'}</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <h2 className="section-title text-center">
          {lang === 'uz' ? 'Mos Keluvchi Rejani Tanlang' : 'Simple, Transparent Pricing'}
        </h2>
        <p className="text-center text-muted" style={{ marginTop: '-16px', marginBottom: '28px' }}>
          {lang === 'uz' ? '🔥 Barcha tariflar hozirda vaqtinchalik 100% BEPUL ($0) aksiyada!' : '🔥 All plans are currently 100% FREE ($0) during special promo!'}
        </p>

        <div className="pricing-grid">
          {/* Free Plan */}
          <div className="pricing-card">
            <h3 className="plan-name">Free</h3>
            <div className="plan-price">$0 <span>/ month</span></div>
            <p className="plan-desc">{lang === 'uz' ? 'Boshlash va o\'rganish uchun' : 'For exploring and simple bot projects'}</p>

            <ul className="plan-features">
              <li><CheckCircle2 size={16} color="#4ade80" /> 2 Active Projects</li>
              <li><CheckCircle2 size={16} color="#4ade80" /> 10 AI Generations/mo</li>
              <li><CheckCircle2 size={16} color="#4ade80" /> ZIP Code Export</li>
              <li><CheckCircle2 size={16} color="#4ade80" /> Monaco Code Editor</li>
            </ul>

            <button className="btn-secondary w-full" onClick={() => onStartWizard()}>
              {lang === 'uz' ? 'Bepul boshlash' : 'Get Started Free'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="pricing-card popular">
            <div className="popular-badge">{lang === 'uz' ? '100% Bepul Aksiya' : '100% Free Promo'}</div>
            <h3 className="plan-name">Pro Developer</h3>
            <div className="plan-price">
              <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '18px', marginRight: '6px' }}>$29</span>
              <strong style={{ color: '#4ade80' }}>$0</strong> <span>/ month</span>
            </div>
            <p className="plan-desc">{lang === 'uz' ? 'Professional dasturchilar va bizneslar uchun (Vaqtinchalik $0)' : 'For developers building real production bots (Promo $0)'}</p>

            <ul className="plan-features">
              <li><CheckCircle2 size={16} color="#4ade80" /> Unlimited Projects</li>
              <li><CheckCircle2 size={16} color="#4ade80" /> 500 AI Generations/mo</li>
              <li><CheckCircle2 size={16} color="#4ade80" /> GitHub Repository Sync</li>
              <li><CheckCircle2 size={16} color="#4ade80" /> Live Telegram Bot Tester</li>
              <li><CheckCircle2 size={16} color="#4ade80" /> React Admin Panel Generator</li>
              <li><CheckCircle2 size={16} color="#4ade80" /> Docker Deployment Configs</li>
            </ul>

            <button className="btn-primary w-full glowing-btn" onClick={() => onStartWizard()}>
              {lang === 'uz' ? 'Pro ni Bepul Faollashtirish ($0)' : 'Activate Pro Free ($0)'}
            </button>
          </div>

          {/* Enterprise */}
          <div className="pricing-card">
            <div className="popular-badge" style={{ background: '#38bdf8' }}>{lang === 'uz' ? 'Vaqtinchalik Bepul' : 'Free Promo'}</div>
            <h3 className="plan-name">Enterprise</h3>
            <div className="plan-price">
              <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '18px', marginRight: '6px' }}>$99</span>
              <strong style={{ color: '#38bdf8' }}>$0</strong> <span>/ month</span>
            </div>
            <p className="plan-desc">{lang === 'uz' ? 'Katta jamoalar va agentliklar uchun (Vaqtinchalik $0)' : 'For agencies and large scale bots (Promo $0)'}</p>

            <ul className="plan-features">
              <li><CheckCircle2 size={16} color="#4ade80" /> Custom AI Model Routing</li>
              <li><CheckCircle2 size={16} color="#4ade80" /> Isolated Sandboxed Execution</li>
              <li><CheckCircle2 size={16} color="#4ade80" /> Dedicated Cloud VPS Deploy</li>
              <li><CheckCircle2 size={16} color="#4ade80" /> 24/7 Priority Support</li>
            </ul>

            <button className="btn-secondary w-full" onClick={() => onStartWizard()}>
              {lang === 'uz' ? 'Enterprise Bepul Kirish ($0)' : 'Access Enterprise Free ($0)'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
