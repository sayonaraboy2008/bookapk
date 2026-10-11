import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Award,
  BookOpen,
  Heart,
  Bookmark,
  LogOut,
  Sparkles,
  Phone,
  Mail,
  Send,
  AtSign,
} from 'lucide-react';
import BookCard from '../components/BookCard';

export default function UserProfilePage({
  user,
  books,
  savedBookIds,
  likedBookIds,
  onBack,
  onLogout,
  onOpenReader,
  onToggleBookmark,
  onToggleLike,
  onDownload,
}) {
  const [profileTab, setProfileTab] = useState('saved'); // 'saved' | 'liked' | 'history'

  const savedBooks = books.filter((b) => savedBookIds.includes(b.id));
  const likedBooks = books.filter((b) => likedBookIds.includes(b.id));

  // Determine user badges based on books read
  const booksReadCount = user?.booksRead || 4;
  const userBadges = [
    { title: 'Boshlang\'ich Kitobxon', icon: '🥉', desc: '1+ kitob o\'qilgan', unlocked: booksReadCount >= 1 },
    { title: 'Kutubxona Do\'sti', icon: '🥈', desc: '5+ kitob o\'qilgan', unlocked: booksReadCount >= 5 },
    { title: 'Mutolaa Ustasi', icon: '🥇', desc: '10+ kitob o\'qilgan', unlocked: booksReadCount >= 10 },
    { title: 'Kitobxonlar Qiroli', icon: '👑', desc: '20+ kitob o\'qilgan', unlocked: booksReadCount >= 20 },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', padding: '16px 0', position: 'sticky', top: 0, zIndex: 30 }}>
        <div className="folio-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            <span>Kutubxonaga qaytish</span>
          </button>

          <h1 style={{ fontSize: '18px', fontWeight: '800' }}>Mening Profilim</h1>

          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239,68,68,0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.2)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <LogOut size={15} />
            <span>Chiqish</span>
          </button>
        </div>
      </header>

      {/* Main Profile Info */}
      <main className="folio-container" style={{ padding: '32px 0 60px 0' }}>
        {/* User Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '28px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160"
              alt={user?.name}
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #6366f1' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800' }}>{user?.name || 'Kitobxon'}</h2>
                <span className="card-genre-tag" style={{ margin: 0 }}>
                  {user?.role === 'admin' ? '🛡️ Administrator' : 'Kitobxon'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', flexWrap: 'wrap' }}>
                <span>📱 {user?.identifier || user?.email || '+998 90 123-45-67'}</span>
                {user?.telegram && (
                  <span style={{ color: '#6366f1', fontWeight: '700' }}>
                    ✈️ {user.telegram}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick stats counter */}
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#6366f1' }}>{booksReadCount}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>O'qilgan</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>{savedBooks.length}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Saqlangan</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#f43f5e' }}>{likedBooks.length}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Yoqtirilgan</div>
            </div>
          </div>
        </div>

        {/* User Badges Section (Nishonlar) */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Award size={22} color="#eab308" />
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Sizning Mutolaa Nishonlaringiz (Badges)</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {userBadges.map((badge, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: badge.unlocked ? '2px solid #6366f1' : '1px dashed var(--border-color)',
                  backgroundColor: badge.unlocked ? 'rgba(99,102,241,0.08)' : 'var(--bg-card-subtle)',
                  opacity: badge.unlocked ? 1 : 0.45,
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{badge.icon}</div>
                <h4 style={{ fontSize: '15px', fontWeight: '800' }}>{badge.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{badge.desc}</p>
                <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: '700', color: badge.unlocked ? '#10b981' : 'var(--text-muted)' }}>
                  {badge.unlocked ? '✓ Qo\'lga kiritilgan' : '🔒 Qulflangan'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Books Section (Mening kitoblarim) */}
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              className={`cat-pill ${profileTab === 'saved' ? 'active' : ''}`}
              onClick={() => setProfileTab('saved')}
            >
              🔖 Saqlangan Kitoblarim ({savedBooks.length})
            </button>
            <button
              className={`cat-pill ${profileTab === 'liked' ? 'active' : ''}`}
              onClick={() => setProfileTab('liked')}
            >
              ❤️ Yoqtirgan Kitoblarim ({likedBooks.length})
            </button>
          </div>

          {/* Cards grid */}
          <div className="books-4col-grid">
            {(profileTab === 'saved' ? savedBooks : likedBooks).map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onRead={() => onOpenReader(book)}
                onDownload={onDownload}
                onToggleBookmark={onToggleBookmark}
                isBookmarked={savedBookIds.includes(book.id)}
                onToggleLike={onToggleLike}
                isLiked={likedBookIds.includes(book.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
