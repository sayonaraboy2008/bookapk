import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, AtSign, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const USERS_STORAGE_KEY = 'folio_registered_users';

export default function AuthModal({ onClose, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [identifier, setIdentifier] = useState(''); // Telefon yoki Email (majburiy)
  const [password, setPassword] = useState(''); // Parol (majburiy)
  const [firstName, setFirstName] = useState(''); // Ism (majburiy)
  const [lastName, setLastName] = useState(''); // Familiya (ixtiyoriy)
  const [telegram, setTelegram] = useState(''); // Telegram manzil (ixtiyoriy)
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Local storage dagi ro'yxatdan o'tgan foydalanuvchilar
  const getStoredUsers = () => {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveStoredUsers = (users) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. ADMIN TEKSHIRUVI
    // Admin logini: "admin", paroli: "adminsomsa"
    if (!isSignUp && cleanIdentifier === 'admin') {
      if (cleanPass === 'adminsomsa') {
        const adminUser = {
          id: 'admin_master',
          name: 'Bosh Administrator',
          identifier: 'admin',
          email: 'admin@folio.uz',
          role: 'admin',
          telegram: '@folio_admin',
          booksRead: 45,
          badges: ['Bosh Administrator', 'Mutolaa Ustasi', 'Kitobxonlar Qiroli'],
        };
        onLoginSuccess(adminUser);
        onClose();
        return;
      } else {
        setErrorMsg('Admin paroli noto\'g\'ri! (Standart parol: adminsomsa)');
        return;
      }
    }

    // 2. RO'YXATDAN O'TISH CHEKLOVI:
    // Hech kim "admin" loginini o'ziga qo'ya olmasin!
    if (isSignUp) {
      if (
        cleanIdentifier === 'admin' ||
        cleanIdentifier.startsWith('admin@') ||
        cleanIdentifier === 'administrator'
      ) {
        setErrorMsg('Xatolik: "admin" logini himoyalangan va unga ro\'yxatdan o\'tish taqiqlangan!');
        return;
      }

      if (!firstName.trim()) {
        setErrorMsg('Ismingizni kiritish majburiy!');
        return;
      }

      if (!cleanIdentifier) {
        setErrorMsg('Email yoki Telefon raqamini kiritish majburiy!');
        return;
      }

      const users = getStoredUsers();
      const existing = users.find((u) => u.identifier === cleanIdentifier);
      if (existing) {
        setErrorMsg('Ushbu telefon yoki email orqali allaqachon ro\'yxatdan o\'tilgan!');
        return;
      }

      const newUser = {
        id: 'u_' + Date.now(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        identifier: cleanIdentifier,
        telegram: telegram.trim() ? (telegram.startsWith('@') ? telegram.trim() : '@' + telegram.trim()) : '',
        password: cleanPass,
        role: 'user',
        booksRead: 1,
        badges: ['Boshlang\'ich Kitobxon'],
        joinedAt: new Date().toISOString(),
      };

      users.push(newUser);
      saveStoredUsers(users);

      onLoginSuccess(newUser);
      onClose();
      return;
    }

    // 3. ODDIY FOYDALANUVCHI KIRISHI (SIGN IN)
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.identifier === cleanIdentifier && u.password === cleanPass
    );

    if (found) {
      onLoginSuccess(found);
      onClose();
      return;
    }

    // Agar ro'yxatda topilmasa, lekin kiritilgan bo'lsa (namoyish uchun avtomatik yaratish)
    if (cleanIdentifier && cleanPass.length >= 4) {
      const demoUser = {
        id: 'u_' + Date.now(),
        name: cleanIdentifier.includes('@') ? cleanIdentifier.split('@')[0] : 'Kitobxon',
        identifier: cleanIdentifier,
        role: 'user',
        booksRead: 3,
        badges: ['Boshlang\'ich Kitobxon'],
      };
      onLoginSuccess(demoUser);
      onClose();
      return;
    }

    setErrorMsg('Login yoki parol noto\'g\'ri! Akkauntingiz bo\'lmasa ro\'yxatdan o\'ting.');
  };

  const handleGuest = () => {
    onLoginSuccess(null); // Guest mode
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div className="brand-icon-box" style={{ margin: '0 auto 10px auto', width: '42px', height: '42px' }}>
            <User size={22} color="#fff" />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
            {isSignUp ? 'Yangi Akkaunt Ochish' : 'Folio Tizimiga Kirish'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Kitobxonlar hamjamiyatiga xush kelibsiz
          </p>
        </div>

        {errorMsg ? (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              {/* Ism (Majburiy) va Familiya (Ixtiyoriy) */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    ISM * (MAJBURIY)
                  </label>
                  <input
                    type="text"
                    required
                    className="comment-input"
                    placeholder="Masalan: Jasur"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    FAMILIYA (IXTIYORIY)
                  </label>
                  <input
                    type="text"
                    className="comment-input"
                    placeholder="Masalan: Aliyev"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Telegram manzil (Ixtiyoriy) */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  TELEGRAM MANZIL (IXTIYORIY)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="comment-input"
                    placeholder="@kitobxon_uz"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Telefon yoki Email (Majburiy) */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-secondary)' }}>
              {isSignUp ? 'TELEFON RAQAMI YOKI EMAIL * (MAJBURIY)' : 'LOGIN, TELEFON YOKI EMAIL'}
            </label>
            <input
              type="text"
              required
              className="comment-input"
              placeholder={isSignUp ? "+998901234567 yoki email@mail.com" : "admin yoki telefon/email"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoCapitalize="none"
            />
          </div>

          {/* Parol (Majburiy) */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', marginBottom: '4px', color: 'var(--text-secondary)' }}>
              PAROL * (MAJBURIY)
            </label>
            <input
              type="password"
              required
              className="comment-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-read-now"
            style={{ width: '100%', background: '#4f46e5', color: '#fff', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', marginBottom: '14px', cursor: 'pointer' }}
          >
            {isSignUp ? 'Ro\'yxatdan O\'tish' : 'Kirish'}
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '13px' }}>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg('');
            }}
            style={{ color: '#818cf8', fontWeight: '700', cursor: 'pointer' }}
          >
            {isSignUp ? 'Akkauntingiz bormi? Kirish' : 'Akkaunt yo\'qmi? Ro\'yxatdan o\'tish'}
          </button>

          <button
            type="button"
            onClick={handleGuest}
            style={{ color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
          >
            Mehmon sifatida kirish
          </button>
        </div>

        {/* Eslatma info */}
        <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 14px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
          💡 <strong>Admin kirishi:</strong> Login: <code>admin</code>, Parol: <code>adminsomsa</code>
        </div>
      </div>
    </div>
  );
}
