import React from 'react';
import { X, Smartphone, Download, QrCode, CheckCircle2, Shield, HardDrive, WifiOff, RefreshCw } from 'lucide-react';

export default function DownloadAppModal({ onClose, lang = 'uz' }) {
  const handleDownloadApk = () => {
    const a = document.createElement('a');
    a.href = '/folio-app.apk';
    a.download = 'folio-mobile-v2.4.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isUz = lang === 'uz';

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: '94%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px',
          borderRadius: '20px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'rgba(79, 70, 229, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
              <Smartphone size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800' }}>
                {isUz ? "Folio Mobile Ilovasi (Android)" : "Folio Mobile App (Android)"}
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isUz ? "Versiya: v2.4.0 • Android 8.0+ uchun" : "Version: v2.4.0 • For Android 8.0+"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Hero Card inside Modal */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '16px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#818cf8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              {isUz ? "Barcha Kitoblar Cho'ntagingizda" : "All Books In Your Pocket"}
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginTop: '4px', marginBottom: '6px' }}>
              {isUz ? "Oflayn mutolaa va lokal PDF o'quvchi" : "Offline reading & local PDF viewer"}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '360px', lineHeight: 1.5 }}>
              {isUz
                ? "Veb-sayt bilan to'liq sinxronlashuvchi Folio mobil ilovasi orqali internet bo'lmaganda ham sevimli kitoblaringizni o'qing."
                : "Read books offline and open local PDFs from your phone, fully synchronized with the website."}
            </p>
          </div>

          <button
            onClick={handleDownloadApk}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              padding: '12px 22px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.35)',
            }}
          >
            <Download size={18} />
            <span>{isUz ? "APK Yuklab Olish (.apk)" : "Download APK (.apk)"}</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px', display: 'flex', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <WifiOff size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{isUz ? "Oflayn Rejim" : "Offline Mode"}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isUz ? "Yuklangan kitoblarni internetsiz bemalol o'qing" : "Read downloaded books without internet connection"}
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px', display: 'flex', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <HardDrive size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{isUz ? "Lokal PDF Fayllar" : "Local PDF Files"}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isUz ? "Telefon xotirasidagi har qanday PDF-ni oching" : "Open and read any PDF from your device storage"}
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px', display: 'flex', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(234, 179, 8, 0.12)', color: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <RefreshCw size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{isUz ? "Sayt Bilan Sinxron" : "Synced with Web"}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isUz ? "Admin panelidagi yangi kitoblar ilovada darhol chiqadi" : "New books and edits appear in the app in realtime"}
              </p>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px', display: 'flex', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{isUz ? "Xavfsiz va Bepul" : "Safe & Free"}</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isUz ? "Reklamasiz, qulay va to'liq bepul ilova" : "No annoying ads, lightweight and completely free"}
              </p>
            </div>
          </div>
        </div>

        {/* Installation Guide & QR Code */}
        <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '8px' }}>
              {isUz ? "Qanday o'rnatiladi?" : "How to install?"}
            </h4>
            <ol style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: 1.6 }}>
              <li>{isUz ? "«APK Yuklab Olish» tugmasini bosing." : "Click the «Download APK» button."}</li>
              <li>{isUz ? "Fayl yuklangach, telefoningiz bildirishnomalaridan uni bosing." : "When downloaded, tap the file in your notifications."}</li>
              <li>{isUz ? "Agar so'ralsa: «Noma'lum manbalardan o'rnatishga ruxsat berish»ni yoqing." : "Allow installation from unknown sources if prompted."}</li>
              <li>{isUz ? "O'rnatishni yakunlang va Folio'dan rohatlaning!" : "Complete installation and enjoy reading!"}</li>
            </ol>
          </div>

          <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#ffffff', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '90px', height: '90px', backgroundColor: '#0f172a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={64} color="#ffffff" />
            </div>
            <span style={{ fontSize: '10px', color: '#475569', fontWeight: '700', marginTop: '6px' }}>
              {isUz ? "Kamera bilan skanerlang" : "Scan with phone camera"}
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981', fontWeight: '700' }}>
            <CheckCircle2 size={16} />
            <span>{isUz ? "Tekshirilgan va xavfsiz APK" : "Verified & safe APK build"}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-card-subtle)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {isUz ? "Yopish" : "Close"}
            </button>
            <button
              onClick={handleDownloadApk}
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                backgroundColor: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Download size={15} />
              <span>{isUz ? "Yuklab olish" : "Download"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
