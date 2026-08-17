import React from 'react';
import { BookOpen, Layers, Terminal, Database, Shield, Bot, Code } from 'lucide-react';

interface DocsPageProps {
  lang: 'uz' | 'en';
}

export const DocsPage: React.FC<DocsPageProps> = ({ lang }) => {
  return (
    <div className="docs-page-container">
      <div className="docs-header">
        <BookOpen size={32} color="#38bdf8" />
        <div>
          <h2>{lang === 'uz' ? 'AI Telegram Bot Builder — Rasmiy Hujjatlar' : 'AI Telegram Bot Builder — Documentation'}</h2>
          <p className="text-muted">
            {lang === 'uz' ? 'Platformaning barcha 63 bo‘limli spetsifikatsiyasi va loyiha tuzilishi haqida to‘liq qo‘llanma.' : 'Full developer specification, solution structure, and deployment instructions.'}
          </p>
        </div>
      </div>

      <div className="docs-grid">
        <div className="docs-card">
          <div className="docs-card-icon"><Layers size={20} color="#38bdf8" /></div>
          <h3>1. Solution Clean Architecture</h3>
          <p>Loyiha 5 ta asosiy C# .NET 10 qatlamidan va 1 ta React Admin Panelidan tashkil topgan:</p>
          <ul>
            <li><code>Bot.Domain</code> — Enitity va Enum modellar</li>
            <li><code>Bot.Application</code> — Biznes mantiq va Servislar (OrderService)</li>
            <li><code>Bot.Infrastructure</code> — EF Core AppDbContext va Repository</li>
            <li><code>Bot.Telegram</code> — Telegram Bot Update handler va Keyboard UI</li>
            <li><code>Bot.Api</code> — REST API controllerlar va Swagger</li>
            <li><code>admin/</code> — React + Tailwind Admin UI Dashboard</li>
          </ul>
        </div>

        <div className="docs-card">
          <div className="docs-card-icon"><Database size={20} color="#4ade80" /></div>
          <h3>2. PostgreSQL & EF Core Migrations</h3>
          <p>Entity Framework Core orqali ma'lumotlar bazasi jadvallari avtomatik boshqariladi:</p>
          <pre><code>dotnet ef database update --project src/Bot.Infrastructure</code></pre>
          <p>Users, Products, Orders va AuditLogs jadvallari yaratiladi.</p>
        </div>

        <div className="docs-card">
          <div className="docs-card-icon"><Bot size={20} color="#facc15" /></div>
          <h3>3. Telegram Bot Token Setup</h3>
          <p>Telegram botingizni ulash uchun @BotFather orqali API Token oling va <code>.env</code> fayliga kiriting:</p>
          <pre><code>TELEGRAM_BOT_TOKEN=7182940124:AAEk92...</code></pre>
        </div>

        <div className="docs-card">
          <div className="docs-card-icon"><Shield size={20} color="#c084fc" /></div>
          <h3>4. AI Repair Loop & Validation</h3>
          <p>Generatsiya qilingan kod avtomatik tarzda 3 bosqichli repair loop orqali build va unit-test sinovidan o'tadi.</p>
        </div>
      </div>
    </div>
  );
};
