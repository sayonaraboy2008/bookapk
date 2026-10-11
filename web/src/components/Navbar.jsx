import React, { useState } from 'react';
import { BookOpen, Search, Sun, Moon, ChevronDown, Shield, User, LogOut, Trophy, Smartphone, Menu, X } from 'lucide-react';

export default function Navbar({
  theme,
  setTheme,
  lang = 'uz',
  setLang,
  t,
  searchQuery,
  setSearchQuery,
  savedCount,
  currentView = 'catalog',
  onOpenExplore,
  onOpenMyLibrary,
  onOpenAdminDashboard,
  onOpenLeaderboard,
  onOpenProfile,
  onOpenDownloadApp,
  currentUser,
  onOpenAuth,
  onLogout,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (callback) => {
    if (callback) callback();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="folio-header">
      <div className="folio-container folio-header-inner">
        {/* Logo */}
        <div
          className="brand-wrapper"
          onClick={() => {
            if (onOpenExplore) onOpenExplore();
            else setSearchQuery('');
            setIsMobileMenuOpen(false);
          }}
          style={{ cursor: 'pointer' }}
          title="Bosh sahifa (Explore)"
        >
          <div className="brand-icon-box">
            <BookOpen size={20} strokeWidth={2.4} />
          </div>
          <span className="brand-name">folio</span>
        </div>

        {/* Centered Search Bar */}
        <div className="folio-search-bar">
          <Search size={18} className="folio-search-icon" />
          <input
            type="text"
            className="folio-search-input"
            placeholder={t?.searchPlaceholder || "Search books, authors, or topics..."}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentView !== 'catalog' && onOpenExplore) {
                onOpenExplore();
              }
            }}
          />
          <div className="search-badges">
            <span className="live-badge">LIVE</span>
            <span className="kbd-badge">⌘ K</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="header-actions desktop-nav-actions">
          {/* Mobile App Download Button */}
          <button
            className="btn-download-app-nav"
            onClick={onOpenDownloadApp}
            title={lang === 'uz' ? "Mobil ilovani yuklab olish (Android APK)" : "Download Mobile App (Android APK)"}
          >
            <Smartphone size={15} />
            <span>{lang === 'uz' ? "Ilova (APK)" : "App (APK)"}</span>
          </button>

          {/* Reyting / Leaderboard button */}
          <span
            className={`nav-link ${currentView === 'leaderboard' ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#eab308', fontWeight: '700', cursor: 'pointer' }}
            onClick={onOpenLeaderboard}
            title={lang === 'uz' ? "Reyting va Nishonlar" : "Leaderboard & Badges"}
          >
            <Trophy size={16} />
            <span>{t?.leaderboard || 'Reyting'}</span>
          </span>

          {/* Admin Panel button (only shown if user is admin) */}
          {currentUser?.role === 'admin' && (
            <button
              className="btn-read-now"
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: currentView === 'admin' ? '#4f46e5' : 'rgba(99, 102, 241, 0.15)',
                border: '1px solid #6366f1',
                color: currentView === 'admin' ? '#ffffff' : '#818cf8',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
              onClick={onOpenAdminDashboard}
            >
              <Shield size={15} />
              <span>{t?.adminPanel || 'Admin Panel'}</span>
            </button>
          )}

          {/* Explore Link */}
          <span
            className={`nav-link ${currentView === 'catalog' ? 'active' : ''}`}
            onClick={onOpenExplore}
            style={{ cursor: 'pointer' }}
            title={lang === 'uz' ? "Kitoblar katalogi (Explore)" : "Book catalog (Explore)"}
          >
            {t?.explore || 'Explore'}
          </span>

          {/* My library Link */}
          <span
            className={`nav-link ${currentView === 'library' ? 'active' : ''}`}
            onClick={onOpenMyLibrary}
            style={{ cursor: 'pointer' }}
            title={lang === 'uz' ? "Shaxsiy kutubxonam (My library)" : "My library"}
          >
            {t?.myLibrary || 'My library'} {savedCount > 0 && `(${savedCount})`}
          </span>

          {/* Language Switcher (UZ / EN) */}
          <div className="lang-switch-pill" title={lang === 'uz' ? "Tilni tanlash (Language)" : "Switch language"}>
            <button
              className={`lang-btn ${lang === 'uz' ? 'active' : ''}`}
              onClick={() => setLang && setLang('uz')}
            >
              UZ
            </button>
            <button
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang && setLang('en')}
            >
              EN
            </button>
          </div>

          {/* Theme switcher */}
          <div className="theme-switch-pill">
            <button
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
              title="Light mode"
            >
              <Sun size={15} />
            </button>
            <button
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
              title="Dark mode"
            >
              <Moon size={15} />
            </button>
          </div>

          {/* User profile / Auth status */}
          {currentUser ? (
            <div className="user-profile-menu" onClick={onOpenProfile}>
              <div className="avatar-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                  alt={currentUser.name}
                  className="user-avatar"
                />
                <span className="online-dot"></span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="user-name-text">{currentUser.name}</span>
                {currentUser.role === 'admin' ? (
                  <span style={{ fontSize: '10px', color: '#818cf8', fontWeight: '800', textTransform: 'uppercase' }}>
                    Admin
                  </span>
                ) : (
                  <span style={{ fontSize: '10px', color: '#10b981', fontWeight: '700' }}>
                    {t?.profile || 'Profilim'}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLogout();
                }}
                title={t?.logout || "Chiqish (Logout)"}
                style={{ color: 'var(--text-muted)', marginLeft: '4px', padding: '4px', cursor: 'pointer' }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              <User size={15} />
              <span>{t?.loginGuest || 'Kirish (Guest)'}</span>
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-hamburger-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          title="Menyu"
          aria-label="Menyu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-drawer-inner">
            {/* Nav links */}
            <button
              className={`mobile-drawer-item ${currentView === 'catalog' ? 'active' : ''}`}
              onClick={() => handleNavClick(onOpenExplore)}
            >
              <BookOpen size={18} />
              <span>{t?.explore || 'Explore'}</span>
            </button>

            <button
              className={`mobile-drawer-item ${currentView === 'library' ? 'active' : ''}`}
              onClick={() => handleNavClick(onOpenMyLibrary)}
            >
              <span>📚</span>
              <span>{t?.myLibrary || 'My library'} {savedCount > 0 && `(${savedCount})`}</span>
            </button>

            <button
              className={`mobile-drawer-item ${currentView === 'leaderboard' ? 'active' : ''}`}
              onClick={() => handleNavClick(onOpenLeaderboard)}
            >
              <Trophy size={18} color="#eab308" />
              <span>{t?.leaderboard || 'Reyting'}</span>
            </button>

            {currentUser?.role === 'admin' && (
              <button
                className={`mobile-drawer-item ${currentView === 'admin' ? 'active' : ''}`}
                onClick={() => handleNavClick(onOpenAdminDashboard)}
              >
                <Shield size={18} color="#818cf8" />
                <span>{t?.adminPanel || 'Admin Panel'}</span>
              </button>
            )}

            {/* Mobile App Download */}
            <button
              className="mobile-drawer-item highlight"
              onClick={() => handleNavClick(onOpenDownloadApp)}
            >
              <Smartphone size={18} color="#6366f1" />
              <span>{lang === 'uz' ? "Mobil ilovani yuklab olish (.APK)" : "Download Mobile App (.APK)"}</span>
            </button>

            {/* Controls: Lang & Theme */}
            <div className="mobile-drawer-controls">
              <div className="lang-switch-pill">
                <button
                  className={`lang-btn ${lang === 'uz' ? 'active' : ''}`}
                  onClick={() => setLang && setLang('uz')}
                >
                  UZ
                </button>
                <button
                  className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => setLang && setLang('en')}
                >
                  EN
                </button>
              </div>

              <div className="theme-switch-pill">
                <button
                  className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <Sun size={15} />
                </button>
                <button
                  className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon size={15} />
                </button>
              </div>
            </div>

            {/* User profile / Login */}
            <div className="mobile-drawer-user">
              {currentUser ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => handleNavClick(onOpenProfile)}>
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                      alt={currentUser.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700' }}>{currentUser.name}</div>
                      <div style={{ fontSize: '11px', color: '#10b981' }}>{currentUser.role === 'admin' ? 'Admin' : 'Profilim'}</div>
                    </div>
                  </div>
                  <button onClick={() => handleNavClick(onLogout)} style={{ color: '#ef4444', padding: '6px', cursor: 'pointer' }}>
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleNavClick(onOpenAuth)}
                  className="btn-read-now"
                  style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                >
                  <User size={16} />
                  <span>{t?.loginGuest || 'Kirish (Guest)'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
