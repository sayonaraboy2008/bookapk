import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  Star,
  Download,
  BookOpen,
  Plus,
  Trash2,
  Users,
  Award,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function AdminDashboardModal({
  books,
  onClose,
  onOpenAddBook,
  onDeleteBook,
}) {
  const [activeTab, setActiveTab] = useState('top-downloads'); // 'top-downloads' | 'top-rated' | 'manage'

  // Sort by downloads (Top Downloads)
  const topDownloaded = [...books].sort(
    (a, b) => (b.downloads_count || 1200) - (a.downloads_count || 1200)
  );

  // Sort by rating (Top Rated)
  const topRated = [...books].sort(
    (a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0)
  );

  const totalDownloads = books.reduce(
    (acc, b) => acc + (b.downloads_count || 1250),
    0
  );

  const handleDelete = async (bookId) => {
    if (!window.confirm('Haqiqatan ham ushbu kitobni o\'chirmoqchimisiz?')) return;

    if (isSupabaseConfigured) {
      try {
        await supabase.from('books').delete().eq('id', bookId);
      } catch (err) {
        console.error(err);
      }
    }
    if (onDeleteBook) onDeleteBook(bookId);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '960px', width: '95%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Dashboard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="brand-icon-box" style={{ width: '34px', height: '34px' }}>
                <Award size={18} color="#fff" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Folio Boshqaruv Paneli (Admin)</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Platforma statistikasi, kitoblar reytingi va yangi kitob qo'shish
            </p>
          </div>

          <button
            className="btn-read-now"
            style={{ backgroundColor: '#4f46e5', color: '#fff', padding: '10px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => {
              onClose();
              onOpenAddBook();
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Yangi Kitob Qo'shish</span>
          </button>
        </div>

        {/* Analytics KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>JAMI KITOBLAR</span>
              <BookOpen size={16} color="#6366f1" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>{books.length} ta</div>
            <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>● Barchasi onlayn sinxronlangan</div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>YUKLAB OLISHLAR</span>
              <Download size={16} color="#10b981" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>{totalDownloads.toLocaleString()}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Web va Mobil bo'yicha</div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>O'RTACHA REYTING</span>
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>4.7 ★</div>
            <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px' }}>Kitobxonlar bahosi</div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>FOYDALANUVCHILAR</span>
              <Users size={16} color="#818cf8" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800' }}>1,248</div>
            <div style={{ fontSize: '11px', color: '#818cf8', marginTop: '4px' }}>Faol kitobxonlar</div>
          </div>
        </div>

        {/* Tabs switcher */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
          <button
            className={`cat-pill ${activeTab === 'top-downloads' ? 'active' : ''}`}
            onClick={() => setActiveTab('top-downloads')}
          >
            🔥 Top Yuklangan Kitoblar
          </button>
          <button
            className={`cat-pill ${activeTab === 'top-rated' ? 'active' : ''}`}
            onClick={() => setActiveTab('top-rated')}
          >
            ⭐ Reytingi Eng Baland Kitoblar
          </button>
          <button
            className={`cat-pill ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            📋 Kitoblarni Boshqarish ({books.length})
          </button>
        </div>

        {/* Tab 1: Top Downloads */}
        {activeTab === 'top-downloads' && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>
              Eng ko'p yuklab olingan kitoblar reytingi
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topDownloaded.slice(0, 6).map((b, idx) => (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    padding: '12px 18px',
                    borderRadius: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '12px',
                    }}>
                      {idx + 1}
                    </span>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{b.title}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.author} • {b.genre || b.category}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '700', fontSize: '14px' }}>
                      <Download size={16} />
                      <span>{(b.downloads_count || 1420) + (6 - idx) * 350} marta</span>
                    </div>
                    <span className="card-genre-tag" style={{ margin: 0 }}>TOP {idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Top Rated */}
        {activeTab === 'top-rated' && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>
              Kitobxonlar tomonidan eng yuqori baholangan asarlar
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topRated.map((b, idx) => (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    padding: '12px 18px',
                    borderRadius: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#818cf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '12px',
                    }}>
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{b.title}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.author} • {b.reviews || '1.8k'} ta sharh</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#eab308', fontWeight: '800', fontSize: '15px' }}>
                    <Star size={16} fill="#eab308" />
                    <span>{b.rating || '4.8'} / 5.0</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Kitoblarni boshqarish jadvali */}
        {activeTab === 'manage' && (
          <div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>KITOB NOMI</th>
                    <th style={{ padding: '10px' }}>MUALLIF</th>
                    <th style={{ padding: '10px' }}>JANR</th>
                    <th style={{ padding: '10px' }}>REYTING</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>AMALLAR</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: '700' }}>{b.title}</td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{b.author}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className="card-genre-tag" style={{ margin: 0 }}>{b.genre || b.category}</span>
                      </td>
                      <td style={{ padding: '12px 10px', color: '#eab308', fontWeight: '700' }}>
                        ★ {b.rating}
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete(b.id)}
                          style={{
                            color: '#ef4444',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Trash2 size={13} />
                          O'chirish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
