import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {
  BookOpen,
  Search,
  SlidersHorizontal,
  Cloud,
  Bookmark,
  Star,
  ArrowRight,
} from 'lucide-react-native';
import { supabase } from '../services/supabase';

const INITIAL_BOOKS = [
  {
    id: 'f1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    rating: '4.7',
    fileSize: '1.8 MB',
    coverColor: '#101c34',
    textColor: '#e6c875',
    progress: 0.45,
    currentPage: 81,
    totalPages: 180,
    uri: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    id: 'f2',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Fiction',
    rating: '4.8',
    fileSize: '2.2 MB',
    coverColor: '#fdf8f2',
    textColor: '#3b2214',
    progress: 0.15,
    currentPage: 32,
    totalPages: 240,
    uri: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
];

const CATEGORIES = ['All', 'Fiction', 'IT', 'Business', 'Science'];

export default function HomeScreen({ onOpenBook, onNavigateToLibrary }) {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState(['f1']);

  useEffect(() => {
    fetchCloudBooks();

    // Supabase Realtime Sync obunasi
    const channel = supabase
      .channel('mobile-books-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, () => {
        fetchCloudBooks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCloudBooks = async () => {
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
          textColor: b.text_color || '#ffffff',
          totalPages: b.total_pages || 180,
          currentPage: b.currentPage || 1,
          progress: b.progress || 0.1,
          uri: b.pdf_url,
        }));
        setBooks(mapped);
      }
    } catch (e) {
      // offline fallback
    }
  };

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredTrending = books.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      (b.genre && b.genre.toLowerCase().includes(q));

    const cat = (b.genre || b.category || '').toLowerCase();
    const sel = selectedCat.toLowerCase();
    const matchesCat =
      sel === 'all' ||
      cat === sel ||
      cat.includes(sel);

    return matchesQuery && matchesCat;
  });

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.logoRow}>
          <View style={styles.brandIconBox}>
            <BookOpen size={20} color="#ffffff" strokeWidth={2.5} />
          </View>
          <Text style={styles.brandTitle}>folio</Text>
        </View>

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
          }}
          style={styles.userAvatar}
        />
      </View>

      {/* Hero Headline */}
      <View style={styles.heroSection}>
        <Text style={styles.chapterTag}>YOUR NEXT CHAPTER</Text>
        <Text style={styles.heroTitle}>A whole world,{'\n'}one page away.</Text>
      </View>

      {/* Search Cloud Catalog Card */}
      <View style={styles.searchCard}>
        <View style={styles.searchCardHeader}>
          <View style={styles.cloudRow}>
            <Cloud size={16} color="#4f46e5" />
            <Text style={styles.cloudTitle}>Search cloud catalog</Text>
          </View>
          <Text style={styles.booksCountText}>{books.length} books</Text>
        </View>

        <View style={styles.searchInputRow}>
          <Search size={18} color="#94a3b8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Books, authors, or topics..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <SlidersHorizontal size={18} color="#4f46e5" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryPills}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catPill, selectedCat === cat && styles.activeCatPill]}
            onPress={() => setSelectedCat(cat)}
          >
            <Text
              style={[
                styles.catPillText,
                selectedCat === cat && styles.activeCatPillText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trending on Folio Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>
          {selectedCat === 'All' ? 'Trending on Folio' : `${selectedCat} Kitoblari`}
        </Text>
        <TouchableOpacity onPress={onNavigateToLibrary}>
          <Text style={styles.seeAllText}>See all ({filteredTrending.length})</Text>
        </TouchableOpacity>
      </View>

      {filteredTrending.length === 0 ? (
        <View style={{ padding: 24, alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 16, marginVertical: 12 }}>
          <Text style={{ fontSize: 28, marginBottom: 6 }}>🔍</Text>
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#0f172a' }}>Kitoblar topilmadi</Text>
          <Text style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 4 }}>
            "{selectedCat}" toifasi yoki qidiruv bo'yicha kitob mavjud emas
          </Text>
          <TouchableOpacity
            style={{ marginTop: 12, backgroundColor: '#4f46e5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
            onPress={() => {
              setSelectedCat('All');
              setSearchQuery('');
            }}
          >
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Barchasini ko'rsatish</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 14, paddingBottom: 6 }}
          style={{ marginBottom: 22 }}
        >
          {filteredTrending.map((book) => {
            const isSaved = bookmarkedIds.includes(book.id);
            return (
              <TouchableOpacity
                key={book.id}
                style={[styles.trendingCard, { width: 165 }]}
                onPress={() => onOpenBook(book)}
                activeOpacity={0.9}
              >
                {/* Cover Frame */}
                <View
                  style={[
                    styles.coverFrame,
                    { backgroundColor: book.coverColor ? book.coverColor + '20' : '#f0f3f8' },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.bookmarkBtn}
                    onPress={() => toggleBookmark(book.id)}
                  >
                    <Bookmark
                      size={16}
                      color={isSaved ? '#4f46e5' : '#475569'}
                      fill={isSaved ? '#4f46e5' : 'none'}
                    />
                  </TouchableOpacity>

                  {/* 3D Book Graphic */}
                  <View
                    style={[
                      styles.mockCover,
                      { backgroundColor: book.coverColor || '#101c34' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.mockTitle,
                        { color: book.textColor || '#ffffff' },
                      ]}
                    >
                      {book.title.toUpperCase()}
                    </Text>
                    <View style={styles.mockPattern}>
                      <Text style={{ fontSize: 16 }}>
                        {book.id === 'f1' ? '⚜️' : '📖'}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.cardTitle} numberOfLines={1}>
                  {book.title}
                </Text>
                <Text style={styles.cardAuthor} numberOfLines={1}>{book.author}</Text>

                <View style={styles.cardMetaRow}>
                  <View style={styles.ratingBox}>
                    <Star size={13} color="#eab308" fill="#eab308" />
                    <Text style={styles.ratingText}>{book.rating || '4.8'}</Text>
                  </View>
                  <Text style={styles.pdfSizeText}>PDF · {book.fileSize}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Pick Up Where You Left Off Card */}
      <TouchableOpacity
        style={styles.resumeCard}
        onPress={() => onOpenBook(books[0] || INITIAL_BOOKS[0])}
        activeOpacity={0.9}
      >
        <View style={styles.resumeCoverThumb}>
          <Text style={{ fontSize: 8, color: '#e6c875', fontWeight: 'bold', textAlign: 'center' }}>
            {(books[0]?.title || 'GATSBY').toUpperCase()}
          </Text>
        </View>

        <View style={styles.resumeDetails}>
          <Text style={styles.resumeTag}>PICK UP WHERE YOU LEFT OFF</Text>
          <Text style={styles.resumeTitle}>{books[0]?.title || 'The Great Gatsby'}</Text>

          {/* Progress bar */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: '45%' }]} />
          </View>
          <Text style={styles.progressLabel}>45% read · Page 81 of 180</Text>
        </View>

        <View style={styles.resumeArrowBox}>
          <ArrowRight size={18} color="#4f46e5" />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#3b3896',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  heroSection: {
    marginBottom: 20,
  },
  chapterTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4f46e5',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  searchCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  searchCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cloudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cloudTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  booksCountText: {
    fontSize: 12,
    color: '#64748b',
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  filterBtn: {
    padding: 4,
  },
  categoryPills: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  catPill: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeCatPill: {
    borderColor: '#4f46e5',
    backgroundColor: '#eff2fe',
  },
  catPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  activeCatPillText: {
    color: '#4f46e5',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f46e5',
  },
  booksRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 22,
  },
  trendingCard: {
    flex: 1,
  },
  coverFrame: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },
  mockCover: {
    width: 110,
    height: 155,
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  mockTitle: {
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  mockPattern: {
    marginVertical: 'auto',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  cardAuthor: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  pdfSizeText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4fd',
    borderRadius: 16,
    padding: 14,
  },
  resumeCoverThumb: {
    width: 44,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#101c34',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resumeDetails: {
    flex: 1,
  },
  resumeTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4f46e5',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  resumeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  resumeArrowBox: {
    padding: 6,
    marginLeft: 8,
  },
});
