import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BookCard from './components/BookCard';
import BookModal from './components/BookModal';
import AddBookModal from './components/AddBookModal';
import AuthModal from './components/AuthModal';
import AdminPage from './pages/AdminPage';
import ReaderPage from './pages/ReaderPage';
import LeaderboardPage from './pages/LeaderboardPage';
import UserProfilePage from './pages/UserProfilePage';
import MyLibraryPage from './pages/MyLibraryPage';
import BookLoader from './components/BookLoader';
import FooterModal from './components/FooterModal';
import DownloadAppModal from './components/DownloadAppModal';
import { translations } from './lib/translations';
import { Bookmark, ArrowUpRight, ChevronDown, SlidersHorizontal, ChevronLeft, ChevronRight, Trophy, Smartphone, Download, Search } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';

const INITIAL_FOLIO_BOOKS = [
  {
    id: 'f1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    rating: '4.7',
    reviews: '2.4k',
    fileSize: '1.8 MB',
    file_size: '1.8 MB',
    downloads_count: 3200,
    reads_count: 4820,
    likes_count: 1420,
    description: 'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with mysterious Jay Gatsby.',
    coverGradient: 'linear-gradient(145deg, #101c34 0%, #060a14 100%)',
    coverColor: '#101c34',
    textColor: '#e6c875',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    id: 'f2',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Fiction',
    rating: '4.8',
    reviews: '3.1k',
    fileSize: '2.2 MB',
    file_size: '2.2 MB',
    downloads_count: 2850,
    reads_count: 3910,
    likes_count: 1150,
    description: 'A romantic novel following Elizabeth Bennet as she deals with issues of manners and marriage.',
    coverGradient: 'linear-gradient(145deg, #fdf8f2 0%, #ebdcc8 100%)',
    coverColor: '#fdf8f2',
    textColor: '#3b2214',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    id: 'f3',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'IT',
    rating: '4.6',
    reviews: '1.8k',
    fileSize: '5.4 MB',
    file_size: '5.4 MB',
    downloads_count: 4100,
    reads_count: 6100,
    likes_count: 1890,
    description: 'A handbook of agile software craftsmanship for creating readable, robust code.',
    coverGradient: 'linear-gradient(145deg, #e35a1f 0%, #b83d09 100%)',
    coverColor: '#e35a1f',
    textColor: '#ffffff',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    id: 'f4',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    genre: 'IT',
    rating: '4.9',
    reviews: '1.2k',
    fileSize: '8.6 MB',
    file_size: '8.6 MB',
    downloads_count: 3600,
    reads_count: 5240,
    likes_count: 1680,
    description: 'The definitive guide to the architecture and scalability of modern data storage systems.',
    coverGradient: 'linear-gradient(145deg, #1b539c 0%, #0d2c54 100%)',
    coverColor: '#1b539c',
    textColor: '#ffffff',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    id: 'f5',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Business',
    rating: '4.8',
    reviews: '4.6k',
    fileSize: '3.1 MB',
    file_size: '3.1 MB',
    downloads_count: 5200,
    reads_count: 8420,
    likes_count: 2530,
    description: 'An easy and proven way to build good habits and break bad ones.',
    coverGradient: 'linear-gradient(145deg, #fdfbf7 0%, #eaddc4 100%)',
    coverColor: '#fdfbf7',
    textColor: '#1a1f2c',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    id: 'f6',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    genre: 'Business',
    rating: '4.7',
    reviews: '2.8k',
    fileSize: '2.6 MB',
    file_size: '2.6 MB',
    downloads_count: 3900,
    reads_count: 4930,
    likes_count: 1340,
    description: 'Timeless lessons on wealth, greed, and happiness.',
    coverGradient: 'linear-gradient(145deg, #224233 0%, #10241b 100%)',
    coverColor: '#224233',
    textColor: '#ffffff',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    id: 'f7',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    genre: 'Science',
    rating: '4.6',
    reviews: '2.1k',
    fileSize: '4.2 MB',
    file_size: '4.2 MB',
    downloads_count: 2400,
    reads_count: 3200,
    likes_count: 980,
    description: 'From the Big Bang to black holes, exploring cosmological evolution.',
    coverGradient: 'linear-gradient(145deg, #0e172a 0%, #020617 100%)',
    coverColor: '#0e172a',
    textColor: '#ffffff',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    id: 'f8',
    title: 'The Hidden Life of Trees',
    author: 'Peter Wohlleben',
    genre: 'Science',
    rating: '4.5',
    reviews: '964',
    fileSize: '3.8 MB',
    file_size: '3.8 MB',
    downloads_count: 1800,
    reads_count: 2600,
    likes_count: 740,
    description: 'How trees communicate, support one another, and live in community networks.',
    coverGradient: 'linear-gradient(145deg, #44543b 0%, #222d1c 100%)',
    coverColor: '#44543b',
    textColor: '#ffffff',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  }
];

const CATEGORIES = ['All books', 'Fiction', 'IT', 'Business', 'Science'];

export default function App() {
  const [currentView, setCurrentView] = useState('catalog'); // 'catalog' | 'leaderboard' | 'profile' | 'admin' | 'reader'
  const [theme, setTheme] = useState('dark');
  const [books, setBooks] = useState(INITIAL_FOLIO_BOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All books');
  const [selectedBook, setSelectedBook] = useState(null);
  const [readingBook, setReadingBook] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Bosh Administrator',
    identifier: 'admin',
    role: 'admin',
    telegram: '@folio_admin',
    booksRead: 15,
  });
  const [bookmarkedIds, setBookmarkedIds] = useState(['f1', 'f3', 'f5']);
  const [likedIds, setLikedIds] = useState(['f1', 'f5']);
  const [sortBy, setSortBy] = useState('Most popular');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [footerModalTab, setFooterModalTab] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState(() => localStorage.getItem('folio_lang') || 'uz');
  const [currentPage, setCurrentPage] = useState(1);
  const [loaderText, setLoaderText] = useState('Folio — Sahifalar ochilmoqda...');

  const t = translations[lang] || translations.uz;

  const handleSetLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('folio_lang', newLang);
  };

  const navigateToView = (newView) => {
    if (newView === currentView) return;
    setIsLoading(true);
    setLoaderText(
      newView === 'library'
        ? (lang === 'uz' ? "Kutubxonangiz ochilmoqda..." : "Opening your library...")
        : newView === 'leaderboard'
        ? (lang === 'uz' ? "Reyting jadvali yuklanmoqda..." : "Loading leaderboard...")
        : newView === 'profile'
        ? (lang === 'uz' ? "Profilingiz ochilmoqda..." : "Opening your profile...")
        : newView === 'admin'
        ? (lang === 'uz' ? "Admin panel yuklanmoqda..." : "Loading admin dashboard...")
        : (lang === 'uz' ? "Folio — Sahifalar ochilmoqda..." : "Folio — Opening pages...")
    );
    setCurrentView(newView);
    setTimeout(() => {
      setIsLoading(false);
    }, 750);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Show book flipping loader animation initially for 1.4s
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  useEffect(() => {
    fetchLiveBooks();

    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('web-books-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, () => {
          fetchLiveBooks();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const fetchLiveBooks = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map((b) => ({
          ...b,
          genre: b.genre || b.category || 'Fiction',
          category: b.category || b.genre || 'Fiction',
          fileSize: b.file_size || b.fileSize || '2.4 MB',
          coverColor: b.cover_color || b.coverColor || '#101c34',
          coverGradient: b.cover_color ? `linear-gradient(145deg, ${b.cover_color} 0%, #0b0f19 100%)` : undefined,
          reads_count: b.reads_count || 0,
          likes_count: b.likes_count || 0,
          downloads_count: b.downloads_count || 0,
        }));
        setBooks(mapped);
      }
    } catch (e) {
      console.warn('Realtime fetch warning:', e);
    }
  };

  const handleToggleLike = async (bookId) => {
    const isCurrentlyLiked = likedIds.includes(bookId);
    setLikedIds((prev) =>
      isCurrentlyLiked ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );

    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? { ...b, likes_count: Math.max(0, (b.likes_count || 0) + (isCurrentlyLiked ? -1 : 1)) }
          : b
      )
    );

    if (isSupabaseConfigured) {
      try {
        if (isCurrentlyLiked) {
          await supabase.rpc('decrement_book_likes', { book_id_param: bookId });
        } else {
          await supabase.rpc('increment_book_likes', { book_id_param: bookId });
        }
      } catch (err) {}
    }
  };

  const handleOpenReader = async (book) => {
    setReadingBook(book);
    setCurrentView('reader');

    setBooks((prev) =>
      prev.map((b) =>
        b.id === book.id ? { ...b, reads_count: (b.reads_count || 0) + 1 } : b
      )
    );

    if (currentUser) {
      setCurrentUser((prev) => ({
        ...prev,
        booksRead: (prev.booksRead || 0) + 1,
      }));
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.rpc('increment_book_reads', { book_id_param: book.id });
      } catch (err) {}
    }
  };

  const handleDownload = async (book) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === book.id ? { ...b, downloads_count: (b.downloads_count || 0) + 1 } : b
      )
    );

    if (isSupabaseConfigured) {
      try {
        await supabase.rpc('increment_book_downloads', { book_id_param: book.id });
      } catch (err) {}
    }

    const a = document.createElement('a');
    a.href = book.pdf_url;
    a.download = `${book.title.replace(/\s+/g, '_')}.pdf`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleBookAdded = (newBook) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  const handleDeleteBook = (bookId) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  const handleUpdateBook = (updatedBook) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === updatedBook.id ? { ...b, ...updatedBook } : b))
    );
  };

  const handleToggleBookmark = (bookId) => {
    setBookmarkedIds((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  // 1. ADMIN VIEW
  if (currentView === 'admin') {
    return (
      <div className="folio-app">
        <AdminPage
          books={books}
          onBack={() => navigateToView('catalog')}
          onOpenAddBook={() => setShowAddModal(true)}
          onDeleteBook={handleDeleteBook}
          onUpdateBook={handleUpdateBook}
          onOpenReader={handleOpenReader}
        />
        {showAddModal && (
          <AddBookModal
            onClose={() => setShowAddModal(false)}
            onBookAdded={handleBookAdded}
          />
        )}
      </div>
    );
  }

  // 2. READER VIEW
  if (currentView === 'reader' && readingBook) {
    return (
      <ReaderPage
        book={readingBook}
        onBack={() => navigateToView('catalog')}
        onToggleLike={handleToggleLike}
        isLiked={likedIds.includes(readingBook.id)}
        likesCount={
          books.find((b) => b.id === readingBook.id)?.likes_count || readingBook.likes_count || 0
        }
      />
    );
  }

  // 3. LEADERBOARD VIEW (Reyting va Nishonlar)
  if (currentView === 'leaderboard') {
    return (
      <div className="folio-app">
        <LeaderboardPage
          books={books}
          onBack={() => navigateToView('catalog')}
          onOpenReader={handleOpenReader}
          currentUser={currentUser}
        />
      </div>
    );
  }

  // 4. USER PROFILE VIEW (Mening profilim)
  if (currentView === 'profile') {
    return (
      <div className="folio-app">
        <UserProfilePage
          user={currentUser}
          books={books}
          savedBookIds={bookmarkedIds}
          likedBookIds={likedIds}
          onBack={() => navigateToView('catalog')}
          onLogout={() => {
            setCurrentUser(null);
            navigateToView('catalog');
          }}
          onOpenReader={handleOpenReader}
          onToggleBookmark={handleToggleBookmark}
          onToggleLike={handleToggleLike}
          onDownload={handleDownload}
        />
      </div>
    );
  }

  // 5. MY LIBRARY VIEW (Shaxsiy kutubxonam - To'liq interaktiv)
  if (currentView === 'library') {
    return (
      <div className="folio-app">
        <Navbar
          theme={theme}
          setTheme={setTheme}
          lang={lang}
          setLang={handleSetLang}
          t={t}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          savedCount={bookmarkedIds.length}
          currentView={currentView}
          onOpenExplore={() => {
            setSearchQuery('');
            navigateToView('catalog');
          }}
          onOpenMyLibrary={() => navigateToView('library')}
          onOpenAdminDashboard={() => navigateToView('admin')}
          onOpenLeaderboard={() => navigateToView('leaderboard')}
          onOpenProfile={() => navigateToView('profile')}
          onOpenDownloadApp={() => setShowDownloadModal(true)}
          currentUser={currentUser}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={() => setCurrentUser(null)}
        />
        <MyLibraryPage
          books={books}
          savedBookIds={bookmarkedIds}
          likedBookIds={likedIds}
          onBack={() => navigateToView('catalog')}
          onOpenReader={handleOpenReader}
          onDownload={handleDownload}
          onToggleBookmark={handleToggleBookmark}
          onToggleLike={handleToggleLike}
        />
        {isLoading && <BookLoader text={loaderText} />}
      </div>
    );
  }

  const filteredBooks = books
    .filter((book) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        (book.genre && book.genre.toLowerCase().includes(query)) ||
        (book.category && book.category.toLowerCase().includes(query));

      const bookCat = (book.genre || book.category || '').toLowerCase().trim();
      const selectedCat = selectedCategory.toLowerCase().trim();
      const matchesCategory =
        selectedCat === 'all books' ||
        bookCat === selectedCat ||
        (selectedCat === 'fiction' && (bookCat.includes('fiction') || bookCat.includes('badiiy'))) ||
        (selectedCat === 'it' && (bookCat.includes('it') || bookCat.includes('tech') || bookCat.includes('dasturlash'))) ||
        (selectedCat === 'business' && (bookCat.includes('business') || bookCat.includes('biznes') || bookCat.includes('iqtisod') || bookCat.includes('moliya'))) ||
        (selectedCat === 'science' && (bookCat.includes('science') || bookCat.includes('ilm') || bookCat.includes('fan') || bookCat.includes('tarix')));

      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'Most popular') {
        const popA = (a.downloads_count || 0) + (a.reads_count || 0) + (a.likes_count || 0);
        const popB = (b.downloads_count || 0) + (b.reads_count || 0) + (b.likes_count || 0);
        return popB - popA;
      }
      if (sortBy === 'Highest rated') {
        return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
      }
      if (sortBy === 'Most read') {
        return (b.reads_count || 0) - (a.reads_count || 0);
      }
      if (sortBy === 'Most liked') {
        return (b.likes_count || 0) - (a.likes_count || 0);
      }
      if (sortBy === 'Title (A-Z)') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  // Dynamic Pagination
  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="folio-app">
      {/* Header */}
      <Navbar
        theme={theme}
        setTheme={setTheme}
        lang={lang}
        setLang={handleSetLang}
        t={t}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        savedCount={bookmarkedIds.length}
        currentView={currentView}
        onOpenExplore={() => {
          setSearchQuery('');
          navigateToView('catalog');
        }}
        onOpenMyLibrary={() => navigateToView('library')}
        onOpenAdminDashboard={() => navigateToView('admin')}
        onOpenLeaderboard={() => navigateToView('leaderboard')}
        onOpenProfile={() => navigateToView('profile')}
        onOpenDownloadApp={() => setShowDownloadModal(true)}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={() => setCurrentUser(null)}
      />

      <main className="folio-container">
        {/* Hero Section */}
        <section className="folio-hero">
          <div className="hero-left">
            <span className="chapter-tag">{t.brandTag}</span>
            <h1 className="hero-main-title">{t.heroTitle}</h1>
            <p className="hero-lead-text">{t.heroSubtitle}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' }}>
              <button
                className="btn-read-now"
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                  cursor: 'pointer',
                }}
                onClick={() => setShowDownloadModal(true)}
              >
                <Smartphone size={16} />
                <span>{lang === 'uz' ? "Mobil ilovani yuklab olish (.APK)" : "Download Mobile App (.APK)"}</span>
              </button>
            </div>
          </div>

          {/* Reading list card */}
          <div className="reading-list-card" onClick={() => navigateToView('library')}>
            <div className="reading-icon-box">
              <Bookmark size={20} fill="currentColor" />
            </div>
            <div>
              <h4 className="reading-title">{t.readingListTitle}</h4>
              <p className="reading-count">{bookmarkedIds.length} {t.readingListSubtitle}</p>
            </div>
            <ArrowUpRight size={18} className="external-arrow" />
          </div>
        </section>

        {/* Mobile Dedicated Search Bar (Visible on mobile/tablet) */}
        <div className="mobile-search-banner">
          <Search size={16} className="mobile-search-icon" />
          <input
            type="text"
            className="mobile-search-input"
            placeholder={t?.searchPlaceholder || "Search books, authors, or topics..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="mobile-search-clear" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>

        {/* Filter Bar & Controls */}
        <section className="controls-bar">
          <div className="category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'All books' ? t.allBooks : cat}
              </button>
            ))}
          </div>

          <div className="controls-right">
            <span className="total-books-counter">{filteredBooks.length} / {books.length} {t.booksCount}</span>
            <div className="sort-dropdown-container">
              <button
                className="sort-dropdown-btn"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
              >
                <SlidersHorizontal size={14} />
                <span>{sortBy}</span>
                <ChevronDown size={14} />
              </button>

              {showSortDropdown && (
                <div className="sort-dropdown-menu">
                  {['Most popular', 'Highest rated', 'Most read', 'Most liked', 'Title (A-Z)'].map((option) => (
                    <button
                      key={option}
                      className={`sort-dropdown-item ${sortBy === option ? 'active' : ''}`}
                      onClick={() => {
                        setSortBy(option);
                        setShowSortDropdown(false);
                      }}
                    >
                      <span>{option}</span>
                      {sortBy === option && <span>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section Subhead */}
        <div className="section-subhead-row">
          <h2 className="section-h2">{t.popularSection}</h2>
          <span className="section-tagline">{t.popularTagline}</span>
        </div>

        {/* 4-Column Book Cards Grid with Real Like & Read counters */}
        {filteredBooks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', margin: '20px 0' }}>
            <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>🔍</span>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px' }}>{t.noBooksFound}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              «{selectedCategory}» {t.noBooksDesc}
            </p>
            <button
              className="btn-read-now"
              style={{ padding: '8px 20px', backgroundColor: '#4f46e5', color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}
              onClick={() => {
                setSelectedCategory('All books');
                setSearchQuery('');
              }}
            >
              {t.resetFilters}
            </button>
          </div>
        ) : (
          <section className="books-4col-grid">
            {paginatedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onRead={() => handleOpenReader(book)}
                onDownload={handleDownload}
                onToggleBookmark={handleToggleBookmark}
                isBookmarked={bookmarkedIds.includes(book.id)}
                onToggleLike={handleToggleLike}
                isLiked={likedIds.includes(book.id)}
              />
            ))}
          </section>
        )}

        {/* Dynamic Real Pagination Bar */}
        {totalPages > 1 && (
          <div className="folio-pagination-bar">
            <span className="showing-indicator">
              {t.showing} {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredBooks.length)} {t.of} {filteredBooks.length} {t.booksCount}
            </span>

            <div className="pagination-controls">
              <button
                className="page-btn"
                title="Previous page"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={{ opacity: currentPage === 1 ? 0.35 : 1, cursor: currentPage === 1 ? 'default' : 'pointer' }}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  className={`page-btn ${currentPage === num ? 'active' : ''}`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              ))}

              <button
                className="page-btn"
                title="Next page"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={{ opacity: currentPage === totalPages ? 0.35 : 1, cursor: currentPage === totalPages ? 'default' : 'pointer' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile App Platform Showcase Banner */}
        <section
          className="mobile-app-showcase-banner"
          style={{
            marginTop: '40px',
            marginBottom: '10px',
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(124, 58, 237, 0.08) 100%)',
            border: '1px solid rgba(79, 70, 229, 0.25)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ maxWidth: '620px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', fontWeight: '700', fontSize: '13px', marginBottom: '6px' }}>
              <Smartphone size={18} />
              <span>{lang === 'uz' ? 'FOLIO MOBIL ILOVASI' : 'FOLIO MOBILE APP'}</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-main)' }}>
              {lang === 'uz'
                ? 'Kitobxonlik endi cho‘ntagingizda va oflayn!'
                : 'Reading in your pocket, anywhere and offline!'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
              {lang === 'uz'
                ? 'Web sayt va mobil ilova yagona platforma sifatida birgalikda ishlaydi. Ilovani yuklab oling va internet bo‘lmaganda ham sevimli kitoblaringizni o‘qing, qurilmadagi PDF fayllarni oching!'
                : 'Folio web and mobile function as one unified ecosystem. Download the Android APK to read offline and open local device PDFs anytime!'}
            </p>
          </div>
          <button
            type="button"
            className="btn-download-app-cta"
            onClick={() => setShowDownloadModal(true)}
            style={{
              padding: '12px 20px',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
            }}
          >
            <Download size={16} />
            <span>{lang === 'uz' ? 'Ilovani yuklab olish (.APK)' : 'Download App (.APK)'}</span>
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="folio-footer">
        <div className="folio-container folio-footer-inner">
          <p>{t.footerMotto}</p>
          <div className="footer-links">
            <button
              type="button"
              className="footer-link"
              onClick={() => setShowDownloadModal(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: '#6366f1', fontWeight: '700' }}
            >
              📱 {lang === 'uz' ? 'Mobil ilova (.APK)' : 'Mobile App (.APK)'}
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={() => setFooterModalTab('about')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {t.aboutFolio}
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={() => setFooterModalTab('help')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {t.helpCenter}
            </button>
            <button
              type="button"
              className="footer-link"
              onClick={() => setFooterModalTab('terms')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {t.termsPrivacy}
            </button>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onDownloadIncrement={() => handleDownload(selectedBook)}
          onToggleBookmark={handleToggleBookmark}
          isBookmarked={bookmarkedIds.includes(selectedBook.id)}
          onRead={handleOpenReader}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
          }}
        />
      )}

      {/* Footer Modal (About, Help, Terms) */}
      {footerModalTab && (
        <FooterModal
          initialTab={footerModalTab}
          onClose={() => setFooterModalTab(null)}
        />
      )}

      {/* Mobile App Download Modal */}
      {showDownloadModal && (
        <DownloadAppModal
          onClose={() => setShowDownloadModal(false)}
          lang={lang}
        />
      )}

      {/* 3D Flipping Book Loader */}
      {isLoading && <BookLoader text={loaderText} />}
    </div>
  );
}
