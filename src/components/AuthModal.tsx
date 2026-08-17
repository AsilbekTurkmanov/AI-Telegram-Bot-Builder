import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, ShieldCheck, Key } from 'lucide-react';
import { User } from '../types/project';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  lang: 'uz' | 'en';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  lang
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('Dilshodbek');
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<'User' | 'Admin'>('User');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name || 'Foydalanuvchi',
      email: email || 'user@example.com',
      role,
      plan: role === 'Admin' ? 'Enterprise' : 'Pro',
      apiGenerationsUsed: 3,
      apiGenerationsLimit: 50
    };
    onLogin(newUser);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {currentUser ? (
          <div className="auth-profile-view">
            <div className="auth-header">
              <ShieldCheck size={48} color="#38bdf8" />
              <h2>{currentUser.name}</h2>
              <p>{currentUser.email}</p>
              <div className="badge-group">
                <span className="badge badge-primary">Role: {currentUser.role}</span>
                <span className="badge badge-success">Plan: {currentUser.plan}</span>
              </div>
            </div>

            <div className="jwt-box">
              <label><Key size={14} /> Simulated JWT Bearer Token:</label>
              <code>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRpbHNob2RiZWsiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</code>
            </div>

            <div className="modal-actions">
              <button className="btn-danger w-full" onClick={() => { onLogout(); onClose(); }}>
                {lang === 'uz' ? 'Tizimdan chiqish' : 'Logout'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <h2>{isRegister ? (lang === 'uz' ? 'Ro\'yxatdan o\'tish' : 'Create Account') : (lang === 'uz' ? 'Tizimga kirish' : 'Sign In')}</h2>
            <p className="auth-subtitle">
              {lang === 'uz' ? 'AI Telegram Bot Builder platformasiga kirish' : 'Access your AI Bot workspace'}
            </p>

            {isRegister && (
              <div className="form-group">
                <label><UserIcon size={16} /> {lang === 'uz' ? 'Ismingiz' : 'Full Name'}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ismingizni kiriting"
                />
              </div>
            )}

            <div className="form-group">
              <label><Mail size={16} /> Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <div className="form-group">
              <label><Lock size={16} /> Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label>{lang === 'uz' ? 'Rolingiz' : 'Select Role'}</label>
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-btn ${role === 'User' ? 'active' : ''}`}
                  onClick={() => setRole('User')}
                >
                  Developer User
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === 'Admin' ? 'active' : ''}`}
                  onClick={() => setRole('Admin')}
                >
                  System Admin
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full btn-lg">
              {isRegister ? (lang === 'uz' ? 'Ro\'yxatdan o\'tish' : 'Register') : (lang === 'uz' ? 'Kirish' : 'Login')}
            </button>

            <div className="auth-toggle-link">
              <span onClick={() => setIsRegister(!isRegister)}>
                {isRegister
                  ? (lang === 'uz' ? 'Akkauntingiz bormi? Kirish' : 'Already have account? Login')
                  : (lang === 'uz' ? 'Akkauntingiz yo\'qmi? Ro\'yxatdan o\'tish' : 'Need an account? Register')}
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
