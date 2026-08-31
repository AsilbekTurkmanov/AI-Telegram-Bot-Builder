import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, RefreshCw, Terminal, Play, Square, Radio, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { TelegramMessage, TelegramLog, InlineKeyboardButton, ReplyKeyboardButton } from '../../types/telegram';
import { Project } from '../../types/project';
import { generateLivePollingLog } from '../../services/telegramBotRunner';

interface TelegramSimulatorProps {
  project: Project;
  onToggleRun?: (isRunning: boolean) => void;
}

export const TelegramSimulator: React.FC<TelegramSimulatorProps> = ({ project, onToggleRun }) => {
  const isRunning = project.isRunning ?? (project.status === 'Running' || project.status === 'Ready');

  const [messages, setMessages] = useState<TelegramMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Assalomu alaykum! **${project.botName}** botiga xush kelibsiz!\nBot hozir serverda aktiv ishlamoqda. Buyruq tanlang yoki xabar yozing:`,
      timestamp: new Date().toLocaleTimeString(),
      replyKeyboard: [
        [{ text: '🍔 Menyu' }, { text: '🛒 Savat' }],
        [{ text: '📦 Buyurtmalarim' }, { text: '👤 Profil' }]
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [cartItems, setCartItems] = useState<{ name: string; price: number }[]>([]);
  const [logs, setLogs] = useState<TelegramLog[]>([
    { id: 'l0', timestamp: new Date().toLocaleTimeString(), event: 'Bot Service Initialized', details: `Loaded token: ${project.botToken ? project.botToken.slice(0, 10) + '...' : 'default'}`, type: 'info' },
    { id: 'l1', timestamp: new Date().toLocaleTimeString(), event: 'Long Polling Started', details: `Listening updates for @${project.botName} on port 5000`, type: 'success' },
    { id: 'l2', timestamp: new Date().toLocaleTimeString(), event: 'BotUpdateHandler.cs ready', details: 'Clean Architecture pipeline active (200 OK)', type: 'success' }
  ]);

  const [isLivePollingActive, setIsLivePollingActive] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Background live server polling simulator when running
  useEffect(() => {
    if (!isRunning || !isLivePollingActive) return;

    const interval = setInterval(() => {
      const nextLog = generateLivePollingLog(project.botName, project.botToken);
      setLogs(prev => {
        const updated = [...prev, nextLog];
        return updated.length > 50 ? updated.slice(updated.length - 50) : updated;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isRunning, isLivePollingActive, project.botName, project.botToken]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (event: string, details: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setLogs(prev => [
      ...prev,
      { id: `l_${Date.now()}_${Math.random()}`, timestamp: new Date().toLocaleTimeString(), event, details, type }
    ]);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!isRunning) {
      addLog('Message Rejected: Bot Stopped', 'Cannot process update while bot status is STOPPED', 'error');
      return;
    }

    const userMsg: TelegramMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    addLog(`Message received: "${text}"`, `UpdateId: ${Math.floor(100000 + Math.random() * 900000)} from user @dilshodbek`);

    setTimeout(() => {
      respondToUser(text);
    }, 350);
  };

  const respondToUser = (userText: string) => {
    const lower = userText.toLowerCase();

    if (lower.includes('/start')) {
      const botMsg: TelegramMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: `Assalomu alaykum! **${project.botName}** botiga xush kelibsiz!\nQuyidagi menyudan kerakli bo'limni tanlang:`,
        timestamp: new Date().toLocaleTimeString(),
        replyKeyboard: [
          [{ text: '🍔 Menyu' }, { text: '🛒 Savat' }],
          [{ text: '📦 Buyurtmalarim' }, { text: '👤 Profil' }]
        ]
      };
      setMessages(prev => [...prev, botMsg]);
      addLog('SendWelcomeMessageAsync called', 'Status 200 OK — ReplyKeyboardMarkup rendered', 'success');

    } else if (lower.includes('menyu') || lower.includes('/menu')) {
      const botMsg: TelegramMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: '📋 **Bizning Mazali Menyu:**\nMahsulot tanlash uchun tugmalardan birini bosing:',
        timestamp: new Date().toLocaleTimeString(),
        inlineKeyboard: [
          [{ text: '🍔 Toshkent Oshi (35,000 UZS)', callback_data: 'add_osh' }],
          [{ text: '🍕 Peperoni Pitsa (65,000 UZS)', callback_data: 'add_pitsa' }],
          [{ text: '🥤 Koka-Kola 1.5L (12,000 UZS)', callback_data: 'add_cola' }],
          [{ text: '🛒 Savatni ko\'rish', callback_data: 'view_cart' }]
        ]
      };
      setMessages(prev => [...prev, botMsg]);
      addLog('SendMenuAsync executed', 'InlineKeyboardMarkup returned 4 catalog items', 'success');

    } else if (lower.includes('savat') || lower.includes('/cart')) {
      const total = cartItems.reduce((a, b) => a + b.price, 0);
      const text = cartItems.length === 0
        ? '🛒 Savatingiz bo\'sh. Menyu bo\'limidan taom tanlang!'
        : `🛒 **Sizning Savatingiz:**\n\n${cartItems.map(i => `• ${i.name} - ${i.price.toLocaleString()} UZS`).join('\n')}\n\nJami: **${total.toLocaleString()} UZS**`;

      const botMsg: TelegramMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text,
        timestamp: new Date().toLocaleTimeString(),
        inlineKeyboard: cartItems.length > 0 ? [
          [{ text: '✅ Buyurtmani rasmiylashtirish', callback_data: 'checkout' }],
          [{ text: '🗑️ Savatni tozalash', callback_data: 'clear_cart' }]
        ] : []
      };
      setMessages(prev => [...prev, botMsg]);
      addLog('CartHandler.cs executed', `Items in cart: ${cartItems.length} | Total: ${total} UZS`, 'info');

    } else if (lower.includes('buyurtma') || lower.includes('/orders')) {
      const botMsg: TelegramMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: '📦 **Sizning oxirgi buyurtmalaringiz:**\n\n#ORD-8492 | Status: **Tayyorlanmoqda 👨‍🍳** | Jami: 47,000 UZS\n#ORD-7193 | Status: **Yuborildi 🚚** | Jami: 65,000 UZS',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMsg]);
      addLog('GetOrdersAsync DB query', 'Fetched 2 records from PostgreSQL orders table', 'success');

    } else if (lower.includes('profil') || lower.includes('/profile')) {
      const botMsg: TelegramMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: `👤 **Foydalanuvchi Profili:**\n\nID: 9812471\nIsm: Dilshodbek\nTelefon: +998 90 123 45 67\nTil: O'zbekcha\nBonus ballar: 150 ball`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMsg]);
      addLog('UserProfileHandler executed', 'User profile retrieved from Redis cache', 'success');

    } else {
      const botMsg: TelegramMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: `Kechirasiz, "${userText}" buyrug'i tushunilmadi. Menyudan foydalanish uchun /start bosing.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMsg]);
      addLog('Fallback handler triggered', 'Unknown command input routed to default responder', 'warning');
    }
  };

  const handleInlineClick = (btn: InlineKeyboardButton) => {
    if (!isRunning) return;

    addLog(`InlineCallback: "${btn.callback_data}"`, 'CallbackQuery received and handled by BotUpdateHandler');

    if (btn.callback_data === 'add_osh') {
      setCartItems(prev => [...prev, { name: 'Toshkent Oshi', price: 35000 }]);
      handleSendMessage('🍔 Toshkent Oshi tanlandi');

    } else if (btn.callback_data === 'add_pitsa') {
      setCartItems(prev => [...prev, { name: 'Peperoni Pitsa', price: 65000 }]);
      handleSendMessage('🍕 Peperoni Pitsa tanlandi');

    } else if (btn.callback_data === 'add_cola') {
      setCartItems(prev => [...prev, { name: 'Koka-Kola 1.5L', price: 12000 }]);
      handleSendMessage('🥤 Koka-Kola tanlandi');

    } else if (btn.callback_data === 'view_cart') {
      handleSendMessage('🛒 Savat');

    } else if (btn.callback_data === 'clear_cart') {
      setCartItems([]);
      handleSendMessage('🗑️ Savat tozalandi');

    } else if (btn.callback_data === 'checkout') {
      const botMsg: TelegramMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: '📍 **Yetkazib berish manzilingiz va telefon raqamingiz qabul qilindi!**\nBuyurtmangiz #ORD-9912 raqami bilan rasmiylashtirildi.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMsg]);
      setCartItems([]);
      addLog('OrderService.CreateOrderAsync', 'Inserted new order into PostgreSQL with status Pending', 'success');
    }
  };

  return (
    <div className="telegram-simulator-container">
      {/* Phone Frame */}
      <div className="phone-emulator">
        <div className="phone-screen">
          {/* Phone Header */}
          <div className="telegram-app-header">
            <div className="bot-avatar">
              <Bot size={20} color="#38bdf8" />
            </div>
            <div className="bot-info">
              <span className="bot-title">{project.botName}</span>
              <span className={`bot-status ${isRunning ? 'online' : 'offline'}`}>
                {isRunning ? '🟢 online • running' : '🔴 offline • stopped'}
              </span>
            </div>
            <button className="btn-icon text-muted" onClick={() => setMessages([])} title="Reset Chat">
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Stopped Banner if not running */}
          {!isRunning && (
            <div className="simulator-stopped-banner">
              <AlertCircle size={16} />
              <div className="banner-content">
                <span>Bot hozir to'xtatilgan</span>
                <button
                  className="btn-success btn-xs"
                  onClick={() => onToggleRun && onToggleRun(true)}
                >
                  <Play size={12} /> Ishga tushirish
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="telegram-chat-body">
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble-wrapper ${m.sender}`}>
                <div className="chat-bubble">
                  <div className="bubble-text">{m.text}</div>
                  <span className="bubble-time">{m.timestamp}</span>

                  {/* Inline Keyboard */}
                  {m.inlineKeyboard && isRunning && (
                    <div className="inline-keyboard-grid">
                      {m.inlineKeyboard.map((row, rIdx) => (
                        <div key={rIdx} className="inline-row">
                          {row.map((btn, bIdx) => (
                            <button
                              key={bIdx}
                              className="inline-btn"
                              onClick={() => handleInlineClick(btn)}
                            >
                              {btn.text}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Reply Keyboard (Bottom Bar) */}
          {isRunning && messages.length > 0 && messages[messages.length - 1].replyKeyboard && (
            <div className="reply-keyboard-bar">
              {messages[messages.length - 1].replyKeyboard?.map((row, rIdx) => (
                <div key={rIdx} className="reply-row">
                  {row.map((btn, bIdx) => (
                    <button
                      key={bIdx}
                      className="reply-btn"
                      onClick={() => handleSendMessage(btn.text)}
                    >
                      {btn.text}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="telegram-input-bar">
            <input
              type="text"
              placeholder={isRunning ? "Message..." : "Bot to'xtatilgan..."}
              disabled={!isRunning}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="send-btn" onClick={() => handleSendMessage()} disabled={!isRunning}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Logs Box with Live Stream */}
      <div className="simulator-log-panel">
        <div className="log-panel-header">
          <div className="flex-align gap-2">
            <Terminal size={16} color="#38bdf8" />
            <span>Telegram Bot API & Polling Trace</span>
          </div>

          <div className="flex-align gap-2">
            <span className={`live-pulse-badge ${isRunning ? 'active' : 'paused'}`}>
              <Radio size={12} className="spin-slow" />
              {isRunning ? 'LIVE POLLING' : 'PAUSED'}
            </span>

            <button
              className="btn-icon-sm"
              onClick={() => setLogs([])}
              title="Clear logs"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        <div className="log-panel-body" ref={logContainerRef}>
          {logs.map((l) => (
            <div key={l.id} className={`log-entry ${l.type}`}>
              <span className="log-time">[{l.timestamp}]</span>
              <span className="log-event">{l.event}</span>
              <span className="log-details">{l.details}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
