import React, { useState } from 'react';
import { X, Plus, Upload, FileText, CheckCircle, Eye } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function AddBookModal({ onClose, onBookAdded }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Fiction');
  const [rating, setRating] = useState('4.8');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [coverColor, setCoverColor] = useState('#101c34');
  const [pdfUrl, setPdfUrl] = useState('https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadSource, setUploadSource] = useState('file'); // 'file' | 'url'

  // Kompyuterdan lokal PDF faylni tanlash
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFileName(file.name);
    // Avtomatik kitob nomini to'ldirish (agar bo'sh bo'lsa)
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }
    // Hajmini hisoblash
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setFileSize(sizeInMb);

    // Brauzerda ochish uchun Blob URL yaratish
    const localBlobUrl = URL.createObjectURL(file);
    setPdfUrl(localBlobUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    setSubmitting(true);
    const newBook = {
      id: 'book_' + Date.now(),
      title: title.trim(),
      author: author.trim(),
      genre,
      category: genre,
      rating: parseFloat(rating) || 4.8,
      reviews: '1.2k',
      file_size: fileSize,
      fileSize: fileSize,
      cover_color: coverColor,
      coverColor,
      textColor: '#ffffff',
      pdf_url: pdfUrl.trim(),
      total_pages: 180,
      totalPages: 180,
      downloads_count: 0,
      reads_count: 0,
      likes_count: 0,
      description: description.trim() || 'Folio bulut kutubxonasiga yangi qo\'shilgan sara kitob.',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('books').insert([newBook]).select();
        if (!error && data) {
          onBookAdded(data[0]);
        }
      } catch (err) {
        console.error('Kitob qo\'shishda xatolik:', err);
      }
    } else {
      onBookAdded(newBook);
    }

    setSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div className="brand-icon-box" style={{ width: '38px', height: '38px', borderRadius: '10px' }}>
            <Plus size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Kutubxonaga Yangi Kitob Qo'shish</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              PDF fayl yuklang va ma'lumotlarni to'ldiring (Web va Mobil sinxronlanadi)
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* PDF Faylni tanlash usuli */}
          <div style={{ marginBottom: '18px', background: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                KITOB PDF FAYLI
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    backgroundColor: uploadSource === 'file' ? '#4f46e5' : 'var(--bg-card-subtle)',
                    color: uploadSource === 'file' ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setUploadSource('file')}
                >
                  📁 Kompyuterdan tanlash
                </button>
                <button
                  type="button"
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    backgroundColor: uploadSource === 'url' ? '#4f46e5' : 'var(--bg-card-subtle)',
                    color: uploadSource === 'url' ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setUploadSource('url')}
                >
                  🔗 URL manzil
                </button>
              </div>
            </div>

            {uploadSource === 'file' ? (
              <label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  borderRadius: '10px',
                  border: '2px dashed var(--border-color)',
                  backgroundColor: 'var(--bg-card-subtle)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                {selectedFileName ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '700' }}>
                    <CheckCircle size={20} />
                    <span>{selectedFileName} ({fileSize}) tanlandi</span>
                  </div>
                ) : (
                  <>
                    <Upload size={28} color="#6366f1" style={{ marginBottom: '8px' }} />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      PDF faylni tanlash uchun bu yerga bosing
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Maksimal hajm: 50MB (.pdf)
                    </span>
                  </>
                )}
              </label>
            ) : (
              <input
                type="url"
                required
                className="comment-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                placeholder="https://example.com/kitob.pdf"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
              />
            )}
          </div>

          {/* Kitob nomi va Muallif */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                KITOB NOMI *
              </label>
              <input
                type="text"
                required
                className="comment-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                placeholder="Masalan: Yulduzli Tunlar"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                MUALLIF *
              </label>
              <input
                type="text"
                required
                className="comment-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                placeholder="Masalan: Pirimqul Qodirov"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
          </div>

          {/* Janr, Rang, Hajm */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                JANR / KATEGORIYA
              </label>
              <select
                className="comment-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="Fiction">Fiction (Badiiy)</option>
                <option value="IT">IT & Dasturlash</option>
                <option value="Business">Business (Biznes)</option>
                <option value="Science">Science (Ilmiy)</option>
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
                  style={{ flex: 1, marginBottom: 0, boxSizing: 'border-box' }}
                  value={coverColor}
                  onChange={(e) => setCoverColor(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tavsif */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              KITOB HAQIDA MA'LUMOT (TAVSIF)
            </label>
            <textarea
              className="comment-textarea"
              style={{ width: '100%', boxSizing: 'border-box', minHeight: '80px' }}
              placeholder="Asar mazmuni, syujeti yoki asosiy g'oyasi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-read-now"
            style={{
              width: '100%',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              padding: '13px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
            disabled={submitting}
          >
            {submitting ? 'Yuklanmoqda...' : 'Kitobni Bulut Kutubxonasiga Saqlash'}
          </button>
        </form>
      </div>
    </div>
  );
}
