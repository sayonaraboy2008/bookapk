import React, { useState, useEffect } from 'react';
import { X, Download, MessageSquare, Star, Send, BookOpen, Bookmark } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function BookModal({
  book,
  onClose,
  onDownloadIncrement,
  onToggleBookmark,
  isBookmarked,
  onRead,
}) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [userName, setUserName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [showPdfReader, setShowPdfReader] = useState(false);

  useEffect(() => {
    if (!book) return;
    loadComments();
  }, [book]);

  const loadComments = async () => {
    if (!isSupabaseConfigured) {
      setComments([
        {
          id: '1',
          user_name: 'Alex Morgan',
          content: 'An incredible masterpiece! Changed my whole perspective on this topic.',
          rating: 5,
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: '2',
          user_name: 'Diyorbek',
          content: 'Tushunarli va chuqur ma\'noli kitob, barchaga o\'qishni tavsiya qilaman.',
          rating: 5,
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        }
      ]);
      return;
    }

    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('book_id', book.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setComments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    const commentPayload = {
      book_id: book.id,
      user_name: userName.trim() || 'Book Reader',
      content: newComment.trim(),
      rating: Number(rating),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('comments').insert([commentPayload]).select();
        if (!error && data) {
          setComments([data[0], ...comments]);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setComments([
        { ...commentPayload, id: Date.now().toString(), created_at: new Date().toISOString() },
        ...comments,
      ]);
    }

    setNewComment('');
    setSubmitting(false);
  };

  const handleDownload = () => {
    if (onDownloadIncrement) onDownloadIncrement(book.id);
    window.open(book.pdf_url, '_blank', 'noopener,noreferrer');
  };

  if (!book) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="modal-book-header">
          {/* Cover */}
          <div
            className="realistic-book-mock"
            style={{
              background: book.coverGradient || '#1e293b',
              width: '150px',
              height: '215px',
              flexShrink: 0,
            }}
          >
            {book.coverImg ? (
              <img
                src={book.coverImg}
                alt={book.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ textAlign: 'center', marginTop: '10px', padding: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', color: book.textColor || '#fff' }}>
                  {book.title}
                </span>
                <span style={{ fontSize: '10px', color: book.textColor || '#fff', opacity: 0.8, display: 'block', marginTop: '4px' }}>
                  {book.author}
                </span>
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="modal-book-info" style={{ flex: 1 }}>
            <span className="card-genre-tag" style={{ marginBottom: '6px' }}>
              {book.genre || book.category}
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.02em' }}>
              {book.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '12px' }}>
              By <strong style={{ color: 'var(--text-primary)' }}>{book.author}</strong>
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', fontSize: '13px' }}>
              <div className="rating-indicator">
                <Star size={14} className="star-gold" fill="#eab308" />
                <span>{book.rating}</span>
                <span className="reviews-bracket">({book.reviews})</span>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ color: 'var(--text-muted)' }}>PDF · {book.fileSize || '2.4 MB'}</span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              {book.description ||
                'Immerse yourself into this celebrated work. Download for offline reading or open our built-in viewer.'}
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                className="btn-read-now"
                style={{ background: '#4f46e5', color: '#fff', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}
                onClick={() => {
                  onClose();
                  if (onRead) onRead(book);
                }}
              >
                <BookOpen size={16} />
                <span>Kitobni Mutolaa Qilish (Read Now)</span>
              </button>

              <button
                className="btn-download-pdf"
                style={{ marginTop: 0, padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}
                onClick={handleDownload}
              >
                <Download size={16} />
                <span>PDF Yuklab Olish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3 className="comments-title">
            <MessageSquare size={18} color="#6366f1" />
            Reader Reviews & Thoughts ({comments.length})
          </h3>

          <form onSubmit={handleAddComment} className="comment-form">
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Your Name"
                className="comment-input"
                style={{ flex: 1, marginBottom: 0 }}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <select
                className="comment-input"
                style={{ width: '130px', marginBottom: 0 }}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
                <option value="2">⭐⭐ (2)</option>
                <option value="1">⭐ (1)</option>
              </select>
            </div>

            <textarea
              placeholder="Share your personal reflection, review, or thoughts on this book..."
              className="comment-textarea"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />

            <button type="submit" className="comment-submit-btn" disabled={submitting}>
              <Send size={14} style={{ display: 'inline', marginRight: '6px' }} />
              {submitting ? 'Posting...' : 'Post review'}
            </button>
          </form>

          <div className="comments-list">
            {loadingComments ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading reviews...</p>
            ) : comments.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No reviews yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="comment-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="comment-author">
                      {c.user_name}
                      <span className="comment-date">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ color: '#eab308', fontSize: '12px' }}>
                      {'★'.repeat(c.rating || 5)}
                    </div>
                  </div>
                  <div className="comment-body">{c.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
