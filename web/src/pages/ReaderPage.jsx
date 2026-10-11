import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Heart,
  Download,
  MessageSquare,
  Send,
  Star,
  BookOpen,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import BookLoader from '../components/BookLoader';

export default function ReaderPage({
  book,
  onBack,
  onToggleLike,
  isLiked,
  likesCount,
}) {
  const [paperTheme, setPaperTheme] = useState('sepia'); // 'sepia' | 'light' | 'dark'
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(true);
  const [viewerMode, setViewerMode] = useState('pdfjs'); // 'pdfjs' | 'gdocs' | 'text'
  const [pdfLoading, setPdfLoading] = useState(true);

  useEffect(() => {
    setPdfLoading(true);
    const timer = setTimeout(() => {
      setPdfLoading(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, [book, viewerMode]);

  useEffect(() => {
    if (book) {
      loadComments();
    }
  }, [book]);

  const loadComments = async () => {
    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase
          .from('comments')
          .select('*')
          .eq('book_id', book.id)
          .order('created_at', { ascending: false });
        if (data && data.length > 0) {
          setComments(data);
          return;
        }
      } catch (e) {}
    }

    setComments([
      {
        id: '1',
        user_name: 'Alex Morgan',
        content: 'Juda chuqur ma\'noli va go\'zal yozilgan asar. Qahramonlarning ruhiy holati ajoyib tasvirlangan.',
        rating: 5,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '2',
        user_name: 'Farrux',
        content: 'Har bir kitobxon o\'qishi shart bo\'lgan asarlardan biri!',
        rating: 5,
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ]);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    const commentPayload = {
      book_id: book.id,
      user_name: userName.trim() || 'Kitobxon',
      content: newComment.trim(),
      rating: Number(rating),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('comments').insert([commentPayload]).select();
        if (!error && data) {
          setComments([data[0], ...comments]);
        }
      } catch (e) {}
    } else {
      setComments([
        { ...commentPayload, id: 'c_' + Date.now(), created_at: new Date().toISOString() },
        ...comments,
      ]);
    }

    setNewComment('');
    setSubmitting(false);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = book.pdf_url;
    a.download = `${book.title.replace(/\s+/g, '_')}.pdf`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // PDF.js or Google Docs viewer URL that prevents direct auto-downloading in browser
  const getViewerUrl = () => {
    if (!book || !book.pdf_url) return '';
    // If it's a blob URL (locally uploaded by user), iframe can view directly
    if (book.pdf_url.startsWith('blob:')) {
      return book.pdf_url;
    }
    // Mozilla PDF.js official online viewer (renders PDF directly in canvas without downloading)
    if (viewerMode === 'pdfjs') {
      return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(book.pdf_url)}`;
    }
    // Google Docs embedded viewer fallback
    return `https://docs.google.com/viewer?url=${encodeURIComponent(book.pdf_url)}&embedded=true`;
  };

  const themeStyles = {
    sepia: {
      background: '#fbf7ee',
      color: '#2e261d',
      headerBg: '#f2ecdc',
      border: '#e4dcbe',
      drawerBg: '#f6f0e2',
    },
    light: {
      background: '#ffffff',
      color: '#0f172a',
      headerBg: '#f8fafc',
      border: '#e2e8f0',
      drawerBg: '#ffffff',
    },
    dark: {
      background: '#0d111a',
      color: '#f8fafc',
      headerBg: '#151b28',
      border: 'rgba(255,255,255,0.08)',
      drawerBg: '#151b28',
    },
  };

  const currentTheme = themeStyles[paperTheme];

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: currentTheme.background,
        color: currentTheme.color,
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* Top Reading Toolbar */}
      <header
        style={{
          height: '60px',
          backgroundColor: currentTheme.headerBg,
          borderBottom: `1px solid ${currentTheme.border}`,
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          zIndex: 30,
        }}
      >
        {/* Left: Back & Book details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: paperTheme === 'dark' ? '#222b40' : '#ffffff',
              color: currentTheme.color,
              border: `1px solid ${currentTheme.border}`,
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            <span>Kutubxonaga qaytish</span>
          </button>

          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '800', lineHeight: 1.2 }}>{book.title}</h2>
            <p style={{ fontSize: '12px', opacity: 0.75 }}>
              {book.author} • {book.file_size || '2.4 MB'}
            </p>
          </div>
        </div>

        {/* Center: Reading theme switchers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setPaperTheme('sepia')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              backgroundColor: '#fbf7ee',
              color: '#2e261d',
              border: paperTheme === 'sepia' ? '2px solid #4f46e5' : '1px solid #d4c5a9',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Sepia
          </button>
          <button
            onClick={() => setPaperTheme('light')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              border: paperTheme === 'light' ? '2px solid #4f46e5' : '1px solid #cbd5e1',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Yorug'
          </button>
          <button
            onClick={() => setPaperTheme('dark')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              backgroundColor: '#0d111a',
              color: '#f8fafc',
              border: paperTheme === 'dark' ? '2px solid #4f46e5' : '1px solid rgba(255,255,255,0.2)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Tungi
          </button>
        </div>

        {/* Right action tools: Likes, Download, Notes Drawer Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Like button with counter */}
          <button
            onClick={() => onToggleLike(book.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: isLiked ? 'rgba(244,63,94,0.15)' : (paperTheme === 'dark' ? '#222b40' : '#ffffff'),
              border: isLiked ? '1px solid #f43f5e' : `1px solid ${currentTheme.border}`,
              color: isLiked ? '#f43f5e' : (paperTheme === 'dark' ? '#94a3b8' : '#64748b'),
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <Heart size={16} fill={isLiked ? '#f43f5e' : 'none'} />
            <span>{likesCount}</span>
          </button>

          {/* Download button */}
          <button
            onClick={handleDownload}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: paperTheme === 'dark' ? '#222b40' : '#ffffff',
              border: `1px solid ${currentTheme.border}`,
              color: currentTheme.color,
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <Download size={16} />
            <span>PDF Yuklab olish</span>
          </button>

          {/* Toggle Notes Drawer */}
          <button
            onClick={() => setShowNotesDrawer(!showNotesDrawer)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: showNotesDrawer ? '#4f46e5' : (paperTheme === 'dark' ? '#222b40' : '#ffffff'),
              color: showNotesDrawer ? '#ffffff' : currentTheme.color,
              border: showNotesDrawer ? 'none' : `1px solid ${currentTheme.border}`,
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            <MessageSquare size={16} />
            <span>Izohlar ({comments.length})</span>
          </button>
        </div>
      </header>

      {/* Reader Body Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* PDF Embedded Canvas */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {pdfLoading && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: currentTheme.background }}>
              <BookLoader text="PDF sahifalari ochilmoqda..." />
            </div>
          )}
          <iframe
            src={getViewerUrl()}
            title={book.title}
            width="100%"
            height="100%"
            onLoad={() => setPdfLoading(false)}
            style={{
              border: 'none',
              flex: 1,
              backgroundColor: currentTheme.background,
            }}
          />
        </div>

        {/* Side Drawer: Notes and Reflections */}
        {showNotesDrawer && (
          <aside
            style={{
              width: '380px',
              borderLeft: `1px solid ${currentTheme.border}`,
              backgroundColor: currentTheme.drawerBg,
              display: 'flex',
              flexDirection: 'column',
              padding: '24px',
              boxSizing: 'border-box',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="#4f46e5" />
                Kitobxonlar Izohlari ({comments.length})
              </h3>
            </div>

            {/* Fixed Comment Form Styling */}
            <form onSubmit={handleAddComment} style={{ marginBottom: '24px', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ marginBottom: '10px', width: '100%' }}>
                <input
                  type="text"
                  placeholder="Ismingiz (ixtiyoriy)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'block',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    backgroundColor: paperTheme === 'dark' ? '#0d111a' : '#ffffff',
                    border: `1px solid ${currentTheme.border}`,
                    color: currentTheme.color,
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px', width: '100%' }}>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'block',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    backgroundColor: paperTheme === 'dark' ? '#0d111a' : '#ffffff',
                    border: `1px solid ${currentTheme.border}`,
                    color: currentTheme.color,
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5 - A'lo)</option>
                  <option value="4">⭐⭐⭐⭐ (4 - Yaxshi)</option>
                  <option value="3">⭐⭐⭐ (3 - O'rtacha)</option>
                  <option value="2">⭐⭐ (2 - Qoniqarsiz)</option>
                  <option value="1">⭐ (1 - Yomon)</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px', width: '100%' }}>
                <textarea
                  placeholder="Shaxsiy fikringiz yoki qaydingizni yozing..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'block',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    backgroundColor: paperTheme === 'dark' ? '#0d111a' : '#ffffff',
                    border: `1px solid ${currentTheme.border}`,
                    color: currentTheme.color,
                    fontSize: '14px',
                    lineHeight: '1.5',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s',
                }}
              >
                <Send size={15} />
                <span>{submitting ? 'Yuborilmoqda...' : 'Izoh qoldirish'}</span>
              </button>
            </form>

            {/* Comments List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {comments.map((c) => (
                <div
                  key={c.id}
                  style={{
                    backgroundColor: paperTheme === 'dark' ? '#0d111a' : '#ffffff',
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '12px',
                    padding: '14px 16px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '700', fontSize: '14px', color: currentTheme.color }}>
                      {c.user_name}
                    </span>
                    <span style={{ color: '#f59e0b', fontSize: '12px' }}>
                      {'★'.repeat(c.rating || 5)}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', opacity: 0.85, lineHeight: 1.5, margin: 0 }}>
                    {c.content}
                  </p>
                  <span style={{ fontSize: '11px', opacity: 0.5, marginTop: '8px', display: 'block' }}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
