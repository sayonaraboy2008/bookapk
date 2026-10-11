import React, { useState } from 'react';
import { X, BookOpen, HelpCircle, ShieldCheck, Mail, Send, ExternalLink, CheckCircle } from 'lucide-react';

export default function FooterModal({ initialTab = 'about', onClose }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'about' | 'help' | 'terms'

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', width: '92%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="brand-icon-box" style={{ width: '32px', height: '32px' }}>
              <BookOpen size={18} strokeWidth={2.4} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Folio Platformasi</h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ma'lumotlar & Qo'llanma</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
          <button
            className={`cat-pill ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
            style={{ fontSize: '13px' }}
          >
            📖 About Folio
          </button>
          <button
            className={`cat-pill ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => setActiveTab('help')}
            style={{ fontSize: '13px' }}
          >
            ❓ Help Center
          </button>
          <button
            className={`cat-pill ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
            style={{ fontSize: '13px' }}
          >
            🛡️ Terms & Privacy
          </button>
        </div>

        {/* Content Body */}
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '6px' }}>
          {/* TAB 1: ABOUT FOLIO */}
          {activeTab === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(129, 140, 248, 0.05) 100%)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '18px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-accent)', marginBottom: '6px' }}>
                  Folio — Kitobsevarlar uchun zamonaviy raqamli maskan
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Folio — veb-brauzer va mobil ilova orqali birdek sinxron ishlaydigan, onlayn kitob mutolaasi, erkin PDF yuklab olish va shaxsiy qaydlarni yuritish platformasi.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '20px' }}>⚡</span>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginTop: '6px' }}>Brauzerda jonli PDF</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Yuklab olmasdan turib, qorong'i, yorug' yoki sepia rejimlarida to'g'ridan-to'g'ri o'qish imkoniyati.
                  </p>
                </div>

                <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '20px' }}>📱</span>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginTop: '6px' }}>Veb & Mobil sinxron</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Admin panelidan qo'shilgan yoki yangilangan kitoblar ilova va veb-saytda real vaqtda yangilanadi.
                  </p>
                </div>

                <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '20px' }}>🏆</span>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginTop: '6px' }}>Reyting & Nishonlar</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Eng faol kitobxonlar maxsus nishonlar va unvonlar bilan taqdirlanadi.
                  </p>
                </div>

                <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '20px' }}>📁</span>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginTop: '6px' }}>Lokal PDF boshqaruvi</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Telefon yoki kompyuteringiz xotirasidagi har qanday PDF faylni kutubxonangizga qo'shing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HELP CENTER */}
          {activeTab === 'help' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px' }}>
                  1. Qanday qilib kitobni kompyuterga yuklab olmasdan o'qish mumkin?
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Har bir kitob kartochkasidagi «Mutolaa» (yoki «Read now») tugmasini bosing. Siz uchun maxsus to'liq ekranli PDF o'quvchi rejimi ochiladi.
                </p>
              </div>

              <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px' }}>
                  2. Shaxsiy kompyuterimdagi PDF fayllarni qanday qo'shaman?
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Yuqori menyudagi «My library» bo'limiga kiring va «+ Qurilmadan PDF yuklash» tugmasini bosing. Fayl sizning shaxsiy kutubxonangizga joylashadi.
                </p>
              </div>

              <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px' }}>
                  3. Admin panelga qanday kiriladi?
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Admin login: <code>admin</code> va parol: <code>adminsomsa</code>. Ushbu akkaunt bilan kirganingizda navbarda binafsharang «Admin Panel» tugmasi paydo bo'ladi.
                </p>
              </div>

              {/* Contact box */}
              <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h5 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>Qo'shimcha savollaringiz bormi?</h5>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Telegram qo'llab-quvvatlash xizmati</p>
                </div>
                <a
                  href="https://t.me/folio_admin"
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#4f46e5', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', textDecoration: 'none' }}
                >
                  <Send size={13} />
                  <span>@folio_admin</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: TERMS & PRIVACY */}
          {activeTab === 'terms' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px' }}>
                  Foydalanish Shartlari (Terms of Use)
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Platformadagi barcha kitoblar, darsliklar va ma'lumotlar ommaviy ta'lim, madaniy savodxonlikni oshirish va shaxsiy mutolaa maqsadida taqdim etiladi. Tizimdan noqonuniy tijoriy maqsadlarda foydalanish taqiqlanadi.
                </p>
              </div>

              <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px' }}>
                  Maxfiylik Siyosati (Privacy Policy)
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Sizning telefon raqamingiz, elektron pochtangiz yoki shaxsiy o'qish statistikangiz mutlaqo xavfsiz saqlanadi va uchinchi shaxslarga taqdim etilmaydi. Shaxsiy lokal PDF fayllaringiz faqat sizning brauzeringiz yoki qurilmangiz xotirasida saqlanadi.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '12px', fontWeight: '700' }}>
                <CheckCircle size={15} />
                <span>Barcha xizmatlar ochiq va xavfsiz standartlarga muvofiq ishlaydi.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            className="btn-read-now"
            style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
