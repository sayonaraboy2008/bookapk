import React, { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  CheckCircle,
  FileText,
  Plus,
  LayoutGrid,
  List,
  Download,
  Trash2,
  HardDrive,
  Clock,
  ArrowUpDown,
  Search,
} from 'lucide-react';
import BookCard from '../components/BookCard';

export default function MyLibraryPage({
  books,
  savedBookIds,
  likedBookIds,
  onBack,
  onOpenReader,
  onDownload,
  onToggleBookmark,
  onToggleLike,
  onAddLocalBook,
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'reading' | 'saved' | 'downloaded' | 'local'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [searchFilter, setSearchFilter] = useState('');
  const [localBooks, setLocalBooks] = useState([
    {
      id: 'local_1',
      title: 'Dasturlash San\'ati (Clean Architecture)',
      author: 'Robert C. Martin',
      genre: 'IT',
      fileSize: '5.4 MB',
      progress: 0.35,
      currentPage: 70,
      totalPages: 200,
      coverColor: '#1e293b',
      textColor: '#ffffff',
      isLocal: true,
      pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    },
  ]);

  // Handle local PDF upload from device
  const handleLocalFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newLocal = {
      id: 'local_' + Date.now(),
      title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      author: 'Lokal Fayl (Qurilmangizdan)',
      genre: 'Lokal',
      fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      progress: 0.05,
      currentPage: 1,
      totalPages: 150,
      coverColor: '#0f172a',
      textColor: '#ffffff',
      isLocal: true,
      pdf_url: URL.createObjectURL(file),
    };

    setLocalBooks([newLocal, ...localBooks]);
    if (onAddLocalBook) onAddLocalBook(newLocal);
  };

  // Delete local book
  const handleDeleteLocalBook = (bookId) => {
    setLocalBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  // Saved and liked books
  const savedBooks = books.filter((b) => savedBookIds.includes(b.id));

  // In-progress reading books
  const inProgressBooks = [
    { ...books[0], progress: 0.45, currentPage: 81, totalPages: 180 },
    { ...books[2], progress: 0.28, currentPage: 130, totalPages: 464 },
    { ...books[4], progress: 0.72, currentPage: 230, totalPages: 320 },
  ];

  // Combined library pool
  const allLibraryBooks = [...savedBooks, ...inProgressBooks.filter(b => !savedBookIds.includes(b.id)), ...localBooks];

  // Filter based on active tab
  let displayBooks = allLibraryBooks;
  if (activeTab === 'reading') displayBooks = inProgressBooks;
  if (activeTab === 'saved') displayBooks = savedBooks;
  if (activeTab === 'local') displayBooks = localBooks;
  if (activeTab === 'downloaded') displayBooks = books.slice(0, 4);

  // Search filter
  if (searchFilter.trim()) {
    displayBooks = displayBooks.filter(
      (b) =>
        b.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        b.author.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {/* Header Toolbar */}
      <header style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', padding: '16px 0', position: 'sticky', top: '72px', zIndex: 30, backdropFilter: 'blur(8px)' }}>
        <div className="folio-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
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
              <span>Katalogga qaytish</span>
            </button>

            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '800' }}>My library</h1>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {allLibraryBooks.length} ta kitob • Shaxsiy mutolaa to'plamingiz
              </p>
            </div>
          </div>

          {/* Add Local PDF Button */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              borderRadius: '10px',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Qurilmadan PDF yuklash</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleLocalFileUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </header>

      {/* Main Library View */}
      <main className="folio-container" style={{ padding: '28px 0 60px 0' }}>
        {/* Filter Pills & Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className={`cat-pill ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Barchasi ({allLibraryBooks.length})
            </button>
            <button
              className={`cat-pill ${activeTab === 'reading' ? 'active' : ''}`}
              onClick={() => setActiveTab('reading')}
            >
              📖 O'qilayotganlar ({inProgressBooks.length})
            </button>
            <button
              className={`cat-pill ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              🔖 Saqlanganlar ({savedBooks.length})
            </button>
            <button
              className={`cat-pill ${activeTab === 'local' ? 'active' : ''}`}
              onClick={() => setActiveTab('local')}
            >
              📁 Lokal PDF-lar ({localBooks.length})
            </button>
            <button
              className={`cat-pill ${activeTab === 'downloaded' ? 'active' : ''}`}
              onClick={() => setActiveTab('downloaded')}
            >
              ✓ Yuklab olinganlar
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* View Switcher: List vs Grid */}
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '8px', padding: '3px', border: '1px solid var(--border-color)' }}>
              <button
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: viewMode === 'list' ? 'var(--bg-card)' : 'transparent',
                  color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => setViewMode('list')}
                title="Ro'yxat ko'rinishi"
              >
                <List size={16} />
              </button>
              <button
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: viewMode === 'grid' ? 'var(--bg-card)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => setViewMode('grid')}
                title="Katakcha ko'rinishi"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Search within Library */}
        <div style={{ marginBottom: '20px', maxWidth: '380px' }}>
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" style={{ left: '12px' }} />
            <input
              type="text"
              className="search-input"
              style={{ padding: '10px 14px 10px 38px', fontSize: '13px' }}
              placeholder="Kutubxonamdan qidirish..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Books Content: List View or Grid View */}
        {displayBooks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <Bookmark size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>Bu bo'limda kitoblar mavjud emas</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Katalogdan kitoblarni xatcho'p (bookmark) qiling yoki qurilmangizdan PDF fayl yuklang.
            </p>
            <button
              className="btn-read-now"
              style={{ padding: '8px 18px', backgroundColor: '#4f46e5', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}
              onClick={onBack}
            >
              Katalogni ko'rish
            </button>
          </div>
        ) : viewMode === 'list' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayBooks.map((book) => {
              const progressPct = Math.round((book.progress || 0.45) * 100);
              return (
                <div
                  key={book.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    flexWrap: 'wrap',
                    gap: '16px',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Left: Thumbnail & Details */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '56px',
                        height: '76px',
                        borderRadius: '6px',
                        backgroundColor: book.coverColor || '#101c34',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        textAlign: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                      }}
                    >
                      <span style={{ fontSize: '9px', fontWeight: '800', color: book.textColor || '#fff', textTransform: 'uppercase' }}>
                        {book.title}
                      </span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span className="card-genre-tag" style={{ margin: 0 }}>{book.genre || 'Fiction'}</span>
                        {book.isLocal ? (
                          <span style={{ fontSize: '11px', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '700' }}>
                            <HardDrive size={12} /> Lokal PDF
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '700' }}>
                            <CheckCircle size={12} /> Saqlangan
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '2px' }}>{book.title}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{book.author} • {book.fileSize || '2.4 MB'}</p>

                      {/* Progress bar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', maxWidth: '280px' }}>
                        <div style={{ flex: 1, height: '5px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${progressPct}%`, height: '100%', backgroundColor: '#4f46e5', borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#4f46e5' }}>{progressPct}% o'qildi</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      className="btn-read-now"
                      style={{ padding: '9px 18px', borderRadius: '8px', backgroundColor: '#4f46e5', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                      onClick={() => onOpenReader(book)}
                    >
                      <BookOpen size={15} />
                      <span>O'qish</span>
                    </button>

                    <button
                      className="btn-download-icon"
                      onClick={() => onDownload(book)}
                      title="PDF yuklab olish"
                      style={{ width: '38px', height: '38px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Download size={16} />
                    </button>

                    {book.isLocal && (
                      <button
                        className="btn-download-icon"
                        onClick={() => handleDeleteLocalBook(book.id)}
                        title="Lokal faylni o'chirish"
                        style={{ width: '38px', height: '38px', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="books-4col-grid">
            {displayBooks.map((book) => (
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
        )}
      </main>
    </div>
  );
}
