import React, { useState } from 'react';
import {
  ArrowLeft,
  Trophy,
  Award,
  BookOpen,
  Eye,
  Heart,
  Star,
  Download,
  Users,
  Sparkles,
  Flame,
} from 'lucide-react';

const TOP_READERS_DATA = [
  {
    rank: 1,
    name: 'Sardor Aliyev',
    identifier: '+998 90 123-45-67',
    telegram: '@sardor_reader',
    booksRead: 34,
    points: 1360,
    badges: [
      { title: 'Kitobxonlar Qiroli', icon: '👑', color: '#f59e0b' },
      { title: 'Top-1 Mutolaachi', icon: '⚡', color: '#6366f1' },
      { title: 'Mutolaa Ustasi', icon: '🥇', color: '#eab308' },
    ],
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
  },
  {
    rank: 2,
    name: 'Madina Karimova',
    identifier: 'madina@kitob.uz',
    telegram: '@madina_k',
    booksRead: 26,
    points: 1040,
    badges: [
      { title: 'Kitobxonlar Qiroli', icon: '👑', color: '#f59e0b' },
      { title: 'Mutolaa Ustasi', icon: '🥇', color: '#eab308' },
    ],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
  },
  {
    rank: 3,
    name: 'Jasurbek Rashidov',
    identifier: '+998 93 555-88-99',
    telegram: '@jasur_books',
    booksRead: 19,
    points: 760,
    badges: [
      { title: 'Mutolaa Ustasi', icon: '🥇', color: '#eab308' },
      { title: 'Kutubxona Do\'sti', icon: '🥈', color: '#94a3b8' },
    ],
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120',
  },
  {
    rank: 4,
    name: 'Alex Morgan',
    identifier: 'alex@folio.com',
    telegram: '@alex_morgan',
    booksRead: 15,
    points: 600,
    badges: [
      { title: 'Mutolaa Ustasi', icon: '🥇', color: '#eab308' },
    ],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
  },
  {
    rank: 5,
    name: 'Nilufar Omonova',
    identifier: 'nilufar@mail.uz',
    telegram: '@nilu_books',
    booksRead: 11,
    points: 440,
    badges: [
      { title: 'Kutubxona Do\'sti', icon: '🥈', color: '#94a3b8' },
    ],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120',
  },
  {
    rank: 6,
    name: 'Bekzod Toxirov',
    identifier: '+998 99 777-11-22',
    telegram: '@bekzod_t',
    booksRead: 8,
    points: 320,
    badges: [
      { title: 'Kutubxona Do\'sti', icon: '🥈', color: '#94a3b8' },
    ],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
  },
];

export default function LeaderboardPage({
  books,
  onBack,
  onOpenReader,
  currentUser,
}) {
  const [activeTab, setActiveTab] = useState('readers'); // 'readers' | 'books'

  // Eng ko'p o'qilgan kitoblar
  const topBooks = [...books].sort((a, b) => (b.reads_count || 0) - (a.reads_count || 0));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', padding: '16px 0', position: 'sticky', top: 0, zIndex: 30 }}>
        <div className="folio-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={onBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-card-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} />
              <span>Bosh sahifaga qaytish</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="brand-icon-box" style={{ width: '32px', height: '32px', backgroundColor: '#eab308' }}>
                <Trophy size={18} color="#fff" />
              </div>
              <h1 style={{ fontSize: '18px', fontWeight: '800' }}>Platforma Reytingi & Nishonlar</h1>
            </div>
          </div>

          {/* Nishonlar haqida qisqa info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#eab308', fontWeight: '700' }}>
            <Sparkles size={16} />
            <span>Faol kitobxonlar taqdirlanadi</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="folio-container" style={{ padding: '32px 0 60px 0' }}>
        {/* Nishonlar tavsifi banner */}
        <div style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(234, 179, 8, 0.12) 100%)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Award size={20} color="#eab308" />
            <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Kitobxonlar uchun Maxsus Nishonlar (Badges)</h2>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Platformada qancha ko'p kitob o'qisangiz, profilingiz darajasi va nishonlaringiz shuncha ortadi:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <span>👑</span>
              <div>
                <strong>Kitobxonlar Qiroli</strong>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>20+ kitob o'qigan</span>
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <span>🥇</span>
              <div>
                <strong>Mutolaa Ustasi</strong>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>10+ kitob o'qigan</span>
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <span>🥈</span>
              <div>
                <strong>Kutubxona Do'sti</strong>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>5+ kitob o'qigan</span>
              </div>
            </div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '8px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <span>🥉</span>
              <div>
                <strong>Boshlang'ich Kitobxon</strong>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>1+ kitob o'qigan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Readers vs Books */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button
            className={`cat-pill ${activeTab === 'readers' ? 'active' : ''}`}
            style={{ fontSize: '14px', padding: '10px 22px' }}
            onClick={() => setActiveTab('readers')}
          >
            🏆 Eng Ko'p Kitob O'qiganlar (Top Readers)
          </button>
          <button
            className={`cat-pill ${activeTab === 'books' ? 'active' : ''}`}
            style={{ fontSize: '14px', padding: '10px 22px' }}
            onClick={() => setActiveTab('books')}
          >
            📚 Eng Ko'p O'qilgan Kitoblar (Top Books)
          </button>
        </div>

        {/* TAB 1: TOP READERS LEADERBOARD */}
        {activeTab === 'readers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {TOP_READERS_DATA.map((user) => (
              <div
                key={user.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-card)',
                  border: user.rank === 1 ? '2px solid #eab308' : '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '16px 22px',
                  flexWrap: 'wrap',
                  gap: '14px',
                  boxShadow: user.rank === 1 ? '0 8px 24px rgba(234, 179, 8, 0.15)' : 'none',
                }}
              >
                {/* Left: Rank, Avatar, Name & Telegram */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: user.rank === 1 ? '#eab308' : user.rank === 2 ? '#94a3b8' : user.rank === 3 ? '#b45309' : 'var(--bg-card-subtle)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '800',
                    }}
                  >
                    #{user.rank}
                  </div>

                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{user.name}</h3>
                      {user.rank === 1 && <span title="Top 1">👑</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {user.telegram && <span style={{ color: '#6366f1', fontWeight: '600' }}>{user.telegram}</span>}
                      <span>•</span>
                      <span>{user.identifier}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Badges & Read count */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  {/* Badges pills */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {user.badges.map((b, i) => (
                      <span
                        key={i}
                        style={{
                          backgroundColor: 'var(--bg-card-subtle)',
                          border: '1px solid var(--border-color)',
                          padding: '4px 10px',
                          borderRadius: '16px',
                          fontSize: '11px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>{b.icon}</span>
                        <span>{b.title}</span>
                      </span>
                    ))}
                  </div>

                  {/* Read counter */}
                  <div style={{ textAlign: 'right', minWidth: '110px' }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#4f46e5' }}>
                      {user.booksRead} ta kitob
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      o'qib tugatilgan
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: TOP BOOKS */}
        {activeTab === 'books' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topBooks.map((book, idx) => (
              <div
                key={book.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-card)',
                  border: idx === 0 ? '2px solid #4f46e5' : '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: idx === 0 ? '#4f46e5' : 'var(--bg-card-subtle)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: '800',
                    }}
                  >
                    #{idx + 1}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{book.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{book.author} • {book.genre || book.category}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1', fontWeight: '800', fontSize: '14px' }}>
                    <Eye size={16} />
                    <span>{(book.reads_count || 0).toLocaleString()} o'qilgan</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f43f5e', fontWeight: '700', fontSize: '13px' }}>
                    <Heart size={14} fill="#f43f5e" />
                    <span>{book.likes_count || 0}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308', fontWeight: '800', fontSize: '13px' }}>
                    <Star size={14} fill="#eab308" />
                    <span>{book.rating}</span>
                  </div>

                  <button
                    className="btn-read-now"
                    style={{ padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}
                    onClick={() => onOpenReader(book)}
                  >
                    Mutolaa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
