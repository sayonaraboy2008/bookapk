import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Eye,
  Heart,
  Download,
  Star,
  Plus,
  Trash2,
  TrendingUp,
  Award,
  Users,
  Search,
  Edit3,
} from 'lucide-react';
import EditBookModal from '../components/EditBookModal';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function AdminPage({
  books,
  onBack,
  onOpenAddBook,
  onDeleteBook,
  onUpdateBook,
  onOpenReader,
}) {
  const [activeFilter, setActiveFilter] = useState('reads'); // 'reads' | 'likes' | 'downloads' | 'rating' | 'all'
  const [tableSearch, setTableSearch] = useState('');
  const [editingBook, setEditingBook] = useState(null);

  // 1. Eng ko'p o'qilganlar
  const topReads = [...books].sort((a, b) => (b.reads_count || 0) - (a.reads_count || 0));

  // 2. Eng ko'p layk olganlar
  const topLikes = [...books].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));

  // 3. Eng ko'p yuklanganlar
  const topDownloads = [...books].sort((a, b) => (b.downloads_count || 0) - (a.downloads_count || 0));

  // 4. Reytingi eng balandlar
  const topRated = [...books].sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));

  // Aggregated totals
  const totalReads = books.reduce((sum, b) => sum + (b.reads_count || 0), 0);
  const totalLikes = books.reduce((sum, b) => sum + (b.likes_count || 0), 0);
  const totalDownloads = books.reduce((sum, b) => sum + (b.downloads_count || 0), 0);

  const handleDelete = async (bookId) => {
    if (!window.confirm('Rostdan ham ushbu kitobni o\'chirishni xohlaysizmi?')) return;
    if (isSupabaseConfigured) {
      try {
        await supabase.from('books').delete().eq('id', bookId);
      } catch (e) {
        console.error(e);
      }
    }
    if (onDeleteBook) onDeleteBook(bookId);
  };

  const filteredTableBooks = books.filter((b) =>
    b.title.toLowerCase().includes(tableSearch.toLowerCase()) ||
    b.author.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <div className="admin-page-root" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {/* Admin Top Navigation */}
      <header style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', padding: '16px 0', position: 'sticky', top: 0, zIndex: 30 }}>
        <div className="folio-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
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
              <span>Saytga qaytish</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="brand-icon-box" style={{ width: '32px', height: '32px' }}>
                <Award size={18} color="#fff" />
              </div>
              <h1 style={{ fontSize: '18px', fontWeight: '800' }}>Admin Boshqaruv Paneli</h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="btn-read-now"
              style={{
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
              onClick={onOpenAddBook}
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>+ Yangi Kitob Qo'shish</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="folio-container" style={{ padding: '32px 0 60px 0' }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '32px' }}>
          {/* Reads */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em' }}>JAMI O'QISHLAR</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Eye size={18} color="#6366f1" />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800' }}>{totalReads.toLocaleString()}</div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px', fontWeight: '600' }}>
              ● Mutolaa qilingan barcha sahifalar
            </div>
          </div>

          {/* Likes */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em' }}>JAMI LAYKLAR</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={18} color="#f43f5e" fill="#f43f5e" />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800' }}>{totalLikes.toLocaleString()}</div>
            <div style={{ fontSize: '12px', color: '#f43f5e', marginTop: '6px', fontWeight: '600' }}>
              ● Foydalanuvchilar yoqtirishi
            </div>
          </div>

          {/* Downloads */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em' }}>YUKLAB OLISHLAR</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Download size={18} color="#10b981" />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800' }}>{totalDownloads.toLocaleString()}</div>
            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px', fontWeight: '600' }}>
              ● Qurilmaga keshlandi
            </div>
          </div>

          {/* Catalog */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em' }}>KATALOGDAGI KITOBLAR</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={18} color="#f59e0b" />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800' }}>{books.length} ta</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
              Bulutda faol mavjud
            </div>
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <button
            className={`cat-pill ${activeFilter === 'reads' ? 'active' : ''}`}
            onClick={() => setActiveFilter('reads')}
          >
            🔥 Eng Ko'p O'qilgan (Top Reads)
          </button>
          <button
            className={`cat-pill ${activeFilter === 'likes' ? 'active' : ''}`}
            onClick={() => setActiveFilter('likes')}
          >
            ❤️ Eng Ko'p Layk Olgan (Top Likes)
          </button>
          <button
            className={`cat-pill ${activeFilter === 'downloads' ? 'active' : ''}`}
            onClick={() => setActiveFilter('downloads')}
          >
            📥 Eng Ko'p Yuklangan (Top Downloads)
          </button>
          <button
            className={`cat-pill ${activeFilter === 'rating' ? 'active' : ''}`}
            onClick={() => setActiveFilter('rating')}
          >
            ⭐ Eng Yuqori Reyting (Top Rating)
          </button>
          <button
            className={`cat-pill ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            📋 Barcha Kitoblar Ro'yxati & Tahrirlash
          </button>
        </div>

        {/* Filter View 1: Top Reads */}
        {activeFilter === 'reads' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>
              Kitobxonlar eng ko'p mutolaa qilgan asarlar reytingi:
            </h2>
            {topReads.map((b, idx) => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: idx === 0 ? '#4f46e5' : idx === 1 ? '#6366f1' : 'var(--bg-card-subtle)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '13px',
                  }}>
                    #{idx + 1}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{b.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{b.author} • {b.genre || b.category}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1', fontWeight: '800', fontSize: '14px' }}>
                    <Eye size={17} />
                    <span>{(b.reads_count || 0).toLocaleString()} o'qish</span>
                  </div>

                  <button
                    onClick={() => setEditingBook(b)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(99,102,241,0.15)',
                      color: '#818cf8',
                      border: '1px solid rgba(99,102,241,0.3)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Edit3 size={13} />
                    <span>Tahrirlash</span>
                  </button>

                  <button
                    className="btn-read-now"
                    style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}
                    onClick={() => onOpenReader(b)}
                  >
                    O'qish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter View 2: Top Likes */}
        {activeFilter === 'likes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>
              Eng ko'p yoqtirish (Like) to'plagan kitoblar:
            </h2>
            {topLikes.map((b, idx) => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#f43f5e',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '13px',
                  }}>
                    #{idx + 1}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{b.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{b.author} • {b.genre || b.category}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f43f5e', fontWeight: '800', fontSize: '14px' }}>
                    <Heart size={16} fill="#f43f5e" />
                    <span>{(b.likes_count || 0).toLocaleString()} layk</span>
                  </div>

                  <button
                    onClick={() => setEditingBook(b)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(99,102,241,0.15)',
                      color: '#818cf8',
                      border: '1px solid rgba(99,102,241,0.3)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Edit3 size={13} />
                    <span>Tahrirlash</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter View 3: Top Downloads */}
        {activeFilter === 'downloads' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>
              Qurilmalarga eng ko'p yuklab olingan kitoblar:
            </h2>
            {topDownloads.map((b, idx) => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '13px',
                  }}>
                    #{idx + 1}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{b.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{b.author}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '800', fontSize: '14px' }}>
                    <Download size={16} />
                    <span>{(b.downloads_count || 0).toLocaleString()} yuklanish</span>
                  </div>

                  <button
                    onClick={() => setEditingBook(b)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(99,102,241,0.15)',
                      color: '#818cf8',
                      border: '1px solid rgba(99,102,241,0.3)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Edit3 size={13} />
                    <span>Tahrirlash</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter View 4: Top Rating */}
        {activeFilter === 'rating' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>
              Eng yuqori yulduzcha reytingiga ega durdona asarlar:
            </h2>
            {topRated.map((b, idx) => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#f59e0b',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '13px',
                  }}>
                    #{idx + 1}
                  </span>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{b.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{b.author}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#eab308', fontWeight: '800', fontSize: '15px' }}>
                    <Star size={16} fill="#eab308" />
                    <span>{b.rating} / 5.0</span>
                  </div>

                  <button
                    onClick={() => setEditingBook(b)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(99,102,241,0.15)',
                      color: '#818cf8',
                      border: '1px solid rgba(99,102,241,0.3)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Edit3 size={13} />
                    <span>Tahrirlash</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filter View 5: Table View (Barcha kitoblarni boshqarish va tahrirlash) */}
        {activeFilter === 'all' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div className="search-input-wrapper" style={{ maxWidth: '320px', width: '100%' }}>
                <Search size={16} className="search-icon" style={{ left: '12px' }} />
                <input
                  type="text"
                  className="search-input"
                  style={{ padding: '8px 14px 8px 36px', fontSize: '13px' }}
                  placeholder="Jadvaldan qidirish..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                />
              </div>

              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Jami: <strong>{filteredTableBooks.length} ta</strong> kitob
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>KITOB</th>
                    <th style={{ padding: '10px' }}>JANR</th>
                    <th style={{ padding: '10px' }}>O'QISHLAR</th>
                    <th style={{ padding: '10px' }}>LAYKLAR</th>
                    <th style={{ padding: '10px' }}>YUKLANISHLAR</th>
                    <th style={{ padding: '10px' }}>REYTING</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>AMALLAR</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTableBooks.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{b.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{b.author}</div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className="card-genre-tag" style={{ margin: 0 }}>{b.genre || b.category}</span>
                      </td>
                      <td style={{ padding: '12px 10px', fontWeight: '600', color: '#6366f1' }}>
                        {b.reads_count || 0}
                      </td>
                      <td style={{ padding: '12px 10px', fontWeight: '600', color: '#f43f5e' }}>
                        {b.likes_count || 0}
                      </td>
                      <td style={{ padding: '12px 10px', fontWeight: '600', color: '#10b981' }}>
                        {b.downloads_count || 0}
                      </td>
                      <td style={{ padding: '12px 10px', fontWeight: '700', color: '#eab308' }}>
                        ★ {b.rating}
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => setEditingBook(b)}
                            style={{
                              color: '#818cf8',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              background: 'rgba(99,102,241,0.15)',
                              border: '1px solid rgba(99,102,241,0.3)',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Edit3 size={13} />
                            Tahrirlash
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            style={{
                              color: '#ef4444',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              background: 'rgba(239,68,68,0.1)',
                              border: '1px solid rgba(239,68,68,0.3)',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Trash2 size={13} />
                            O'chirish
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Editing Book Modal */}
      {editingBook && (
        <EditBookModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onBookUpdated={(updated) => {
            if (onUpdateBook) onUpdateBook(updated);
            setEditingBook(null);
          }}
        />
      )}
    </div>
  );
}
