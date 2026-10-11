import React from 'react';
import { Bookmark, BookOpen, Download, Star, Heart, Eye } from 'lucide-react';

export default function BookCard({
  book,
  onRead,
  onDownload,
  onToggleBookmark,
  isBookmarked,
  onToggleLike,
  isLiked,
}) {
  return (
    <div className="folio-book-card">
      {/* Cover frame with bookmark button, like button, and 3D mock book */}
      <div className="cover-display-frame">
        {/* Like Button */}
        <button
          className="bookmark-icon-btn"
          style={{
            left: '10px',
            right: 'auto',
            color: isLiked ? '#f43f5e' : '#cbd5e1',
            backgroundColor: isLiked ? 'rgba(244, 63, 94, 0.2)' : undefined,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(book.id);
          }}
          title={isLiked ? 'Layk olib tashlash' : 'Layk bosish'}
        >
          <Heart size={15} fill={isLiked ? '#f43f5e' : 'none'} />
        </button>

        {/* Bookmark Button */}
        <button
          className={`bookmark-icon-btn ${isBookmarked ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(book.id);
          }}
          title={isBookmarked ? 'Remove bookmark' : 'Save for later'}
        >
          <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>

        {/* 3D Realistic Book Mockup */}
        <div
          className="realistic-book-mock"
          style={{
            background: book.coverGradient || '#1e293b',
            border: book.coverBorder || 'none',
          }}
          onClick={() => onRead(book)}
        >
          {book.coverImg ? (
            <img
              src={book.coverImg}
              alt={book.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '4px 8px 8px 4px',
              }}
            />
          ) : (
            <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 1, padding: '10px 8px' }}>
              <div style={{ textAlign: 'center', marginTop: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', color: book.textColor || '#fff' }}>
                  {book.title}
                </span>
                <span style={{ fontSize: '9px', opacity: 0.85, color: book.textColor || '#fff', marginTop: '4px', display: 'block' }}>
                  {book.author}
                </span>
              </div>

              {book.symbolGraphic && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 'auto' }}>
                  {book.symbolGraphic}
                </div>
              )}

              <div style={{ height: '10px' }} />
            </div>
          )}
        </div>
      </div>

      {/* Meta text */}
      <span className="card-genre-tag">{book.genre || book.category}</span>
      <h3 className="card-book-title" title={book.title} onClick={() => onRead(book)} style={{ cursor: 'pointer' }}>
        {book.title}
      </h3>
      <p className="card-book-author">{book.author}</p>

      {/* Rating & Real Metrics (Likes & Reads counter) */}
      <div className="card-meta-row" style={{ marginBottom: '8px' }}>
        <div className="rating-indicator">
          <Star size={13} className="star-gold" fill="#eab308" />
          <span>{book.rating}</span>
          <span className="reviews-bracket">({book.reviews})</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#f43f5e' }}>
            <Heart size={12} fill="#f43f5e" /> {book.likes_count || 0}
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#6366f1' }}>
            <Eye size={12} /> {book.reads_count || 0}
          </span>
        </div>
      </div>

      {/* Bottom Action buttons */}
      <div className="card-actions-row">
        <button className="btn-read-now" onClick={() => onRead(book)}>
          <BookOpen size={14} />
          <span>Read now</span>
        </button>
        <button
          className="btn-download-icon"
          onClick={() => onDownload(book)}
          title="Download PDF"
        >
          <Download size={14} />
        </button>
      </div>
    </div>
  );
}
