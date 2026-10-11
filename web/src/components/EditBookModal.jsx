import React, { useState } from 'react';
import { X, Edit3, Upload, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function EditBookModal({ book, onClose, onBookUpdated }) {
  const [title, setTitle] = useState(book.title || '');
  const [author, setAuthor] = useState(book.author || '');
  const [genre, setGenre] = useState(book.genre || book.category || 'Fiction');
  const [coverColor, setCoverColor] = useState(book.coverColor || book.cover_color || '#101c34');
  const [pdfUrl, setPdfUrl] = useState(book.pdf_url || '');
  const [fileSize, setFileSize] = useState(book.fileSize || book.file_size || '2.4 MB');
  const [rating, setRating] = useState(book.rating || '4.8');
  const [description, setDescription] = useState(book.description || '');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFileName(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setFileSize(sizeInMb);
    const localBlobUrl = URL.createObjectURL(file);
    setPdfUrl(localBlobUrl);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    setSubmitting(true);
    const updatedBook = {
      ...book,
      title: title.trim(),
      author: author.trim(),
      genre,
      category: genre,
      cover_color: coverColor,
      coverColor,
      pdf_url: pdfUrl.trim(),
      file_size: fileSize,
      fileSize: fileSize,
      rating: parseFloat(rating) || 4.8,
      description: description.trim(),
    };

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('books')
          .update({
            title: updatedBook.title,
            author: updatedBook.author,
            genre: updatedBook.genre,
            category: updatedBook.category,
            cover_color: updatedBook.cover_color,
            pdf_url: updatedBook.pdf_url,
            file_size: updatedBook.file_size,
            rating: updatedBook.rating,
            description: updatedBook.description,
          })
          .eq('id', book.id);
      } catch (err) {
        console.error('Kitobni yangilashda xatolik:', err);
      }
    }

    onBookUpdated(updatedBook);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '620px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div className="brand-icon-box" style={{ width: '38px', height: '38px', borderRadius: '10px' }}>
            <Edit3 size={20} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Kitob Ma'lumotlarini Tahrirlash</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              "{book.title}" kitobini o'zgartirish va qayta saqlash
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdate}>
          {/* PDF Fayl yangilash */}
          <div style={{ marginBottom: '16px', background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              PDF FAYL YOKI HAVOLASI
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
              <input
                type="url"
                required
                className="comment-input"
                style={{ flex: 1, marginBottom: 0 }}
                placeholder="https://..."
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
              />
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <Upload size={14} />
                <span>Yangi PDF</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            {selectedFileName && (
              <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={14} />
                <span>Yangi fayl yuklandi: {selectedFileName} ({fileSize})</span>
              </div>
            )}
          </div>

          {/* Sarlavha va Muallif */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                KITOB NOMI
              </label>
              <input
                type="text"
                required
                className="comment-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                MUALLIF
              </label>
              <input
                type="text"
                required
                className="comment-input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
          </div>

          {/* Janr, Rang, Reyting */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                JANR
              </label>
              <select
                className="comment-input"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="Fiction">Fiction</option>
                <option value="IT">IT</option>
                <option value="Business">Business</option>
                <option value="Science">Science</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                MUQOVA RANGI
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={coverColor}
                  onChange={(e) => setCoverColor(e.target.value)}
                  style={{ width: '42px', height: '42px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'none' }}
                />
                <input
                  type="text"
                  className="comment-input"
                  style={{ flex: 1, marginBottom: 0 }}
                  value={coverColor}
                  onChange={(e) => setCoverColor(e.target.value)}
                />
              </div>
            </div>

            <div style={{ width: '90px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                REYTING
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                className="comment-input"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </div>
          </div>

          {/* Tavsif */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              TAVSIF
            </label>
            <textarea
              className="comment-textarea"
              style={{ minHeight: '80px' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-card-subtle)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 2,
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {submitting ? 'Saqlanmoqda...' : 'O\'zgarishlarni Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
