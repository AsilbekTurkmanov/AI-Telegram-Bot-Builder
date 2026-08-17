import React, { useState } from 'react';
import { Send, Bot, User as UserIcon, RefreshCw, Terminal, Phone, MapPin, CheckCircle } from 'lucide-react';
import { TelegramMessage, TelegramLog, InlineKeyboardButton, ReplyKeyboardButton } from '../../types/telegram';
import { Project } from '../../types/project';

interface TelegramSimulatorProps {
  project: Project;
}

export const TelegramSimulator: React.FC<TelegramSimulatorProps> = ({ project }) => {
  const [messages, setMessages] = useState<TelegramMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Assalomu alaykum! **${project.botName}** ga xush kelibsiz!\nNimadan boshlaymiz?`,
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
    { id: 'l1', timestamp: new Date().toLocaleTimeString(), event: '/start received', details: 'Telegram User ID: 9812471', type: 'info' },
    { id: 'l2', timestamp: new Date().toLocaleTimeString(), event: 'BotUpdateHandler.cs executed', details: 'Status 200 OK — ReplyKeyboard rendered', type: 'success' }
  ]);

  const addLog = (event: string, details: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setLogs(prev => [
      ...prev,
      { id: `l_${Date.now()}`, timestamp: new Date().toLocaleTimeString(), event, details, type }
    ]);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: TelegramMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    addLog(`Message received: "${text}"`, 'Processing update via Telegram Bot API');

    setTimeout(() => {
      respondToUser(text);
    }, 400);
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
      addLog('SendWelcomeMessageAsync called', 'Status 200 OK', 'success');

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
      addLog('SendMenuAsync executed', 'InlineKeyboard returned 4 options', 'success');

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
      addLog('CartHandler.cs executed', `Items count: ${cartItems.length}`, 'info');

    } else if (lower.includes('buyurtma') || lower.includes('/orders')) {
      const botMsg: TelegramMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: '📦 **Sizning oxirgi buyurtmalaringiz:**\n\n#ORD-8492 | Status: **Tayyorlanmoqda 👨‍🍳** | Jami: 47,000 UZS\n#ORD-7193 | Status: **Yuborildi 🚚** | Jami: 65,000 UZS',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMsg]);
      addLog('GetOrdersAsync DB query', 'Fetched 2 records from PostgreSQL', 'success');

    } else {
      const botMsg: TelegramMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: `Kechirasiz, "${userText}" buyrug'i tushunilmadi. Menyudan foydalanish uchun /start bosing.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMsg]);
      addLog('Fallback handler triggered', 'Unknown command input', 'warning');
    }
  };

  const handleInlineClick = (btn: InlineKeyboardButton) => {
    addLog(`InlineCallback: "${btn.callback_data}"`, 'CallbackQuery received from client');

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

    } else if (btn.callback_data === 'checkout') {
      const botMsg: TelegramMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: '📍 **Yetkazib berish manzilingiz va telefon raqamingizni yuboring:**',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMsg]);
      setCartItems([]);
      addLog('OrderService.CreateOrderAsync', 'Inserted into PostgreSQL database', 'success');
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
              <span className="bot-status">bot • online</span>
            </div>
            <button className="btn-icon text-muted" onClick={() => setMessages([])} title="Reset Chat">
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="telegram-chat-body">
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble-wrapper ${m.sender}`}>
                <div className="chat-bubble">
                  <div className="bubble-text">{m.text}</div>
                  <span className="bubble-time">{m.timestamp}</span>

                  {/* Inline Keyboard */}
                  {m.inlineKeyboard && (
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
          {messages.length > 0 && messages[messages.length - 1].replyKeyboard && (
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
              placeholder="Message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="send-btn" onClick={() => handleSendMessage()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Logs Box */}
      <div className="simulator-log-panel">
        <div className="log-panel-header">
          <Terminal size={16} color="#38bdf8" />
          <span>Telegram Bot API Trace Logs</span>
        </div>
        <div className="log-panel-body">
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
