import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Home, Library, BookOpen, User } from 'lucide-react-native';
import HomeScreen from './src/screens/HomeScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import ReaderScreen from './src/screens/ReaderScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import BookLoader from './src/components/BookLoader';
import { supabase } from './src/services/supabase';

const INITIAL_BOOKS = [
  {
    id: 'f1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    rating: '4.7',
    reviews: '2.4k',
    fileSize: '1.8 MB',
    coverColor: '#101c34',
    textColor: '#e6c875',
    progress: 0.45,
    currentPage: 81,
    totalPages: 180,
    downloads_count: 3200,
    uri: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
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
    coverColor: '#fdf8f2',
    textColor: '#3b2214',
    progress: 0.15,
    currentPage: 32,
    totalPages: 240,
    downloads_count: 2850,
    uri: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'library' | 'reader' | 'profile'
  const [currentBook, setCurrentBook] = useState(null);
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchBooks();

    // Realtime listener
    const channel = supabase
      .channel('mobile-app-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, () => {
        fetchBooks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map((b) => ({
          ...b,
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
    } catch (e) {}
  };

  const handleOpenBook = (book) => {
    setCurrentBook(book);
    setActiveTab('reader');
  };

  const handleBookAdded = (newBook) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  const handleDeleteBook = (bookId) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Screen Content */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && (
          <HomeScreen
            books={books}
            onOpenBook={handleOpenBook}
            onNavigateToLibrary={() => setActiveTab('library')}
          />
        )}
        {activeTab === 'library' && (
          <LibraryScreen onOpenBook={handleOpenBook} />
        )}
        {activeTab === 'reader' && (
          <ReaderScreen
            book={currentBook}
            onBack={() => setActiveTab('library')}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileScreen
            books={books}
            onBookAdded={handleBookAdded}
            onDeleteBook={handleDeleteBook}
          />
        )}
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('home')}
        >
          <View
            style={[
              styles.tabIconWrap,
              activeTab === 'home' && styles.activeTabPill,
            ]}
          >
            <Home
              size={20}
              color={activeTab === 'home' ? '#3b3896' : '#64748b'}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'home' && styles.activeTabLabel,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('library')}
        >
          <View
            style={[
              styles.tabIconWrap,
              activeTab === 'library' && styles.activeTabPill,
            ]}
          >
            <Library
              size={20}
              color={activeTab === 'library' ? '#3b3896' : '#64748b'}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'library' && styles.activeTabLabel,
            ]}
          >
            My library
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('reader')}
        >
          <View
            style={[
              styles.tabIconWrap,
              activeTab === 'reader' && styles.activeTabPill,
            ]}
          >
            <BookOpen
              size={20}
              color={activeTab === 'reader' ? '#3b3896' : '#64748b'}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'reader' && styles.activeTabLabel,
            ]}
          >
            Reader
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('profile')}
        >
          <View
            style={[
              styles.tabIconWrap,
              activeTab === 'profile' && styles.activeTabPill,
            ]}
          >
            <User
              size={20}
              color={activeTab === 'profile' ? '#3b3896' : '#64748b'}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'profile' && styles.activeTabLabel,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Book Loader Animation */}
      {isLoading && <BookLoader text="Folio — Sahifalar ochilmoqda..." />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  screenContainer: {
    flex: 1,
  },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrap: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 2,
  },
  activeTabPill: {
    backgroundColor: '#eff2fe',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabLabel: {
    color: '#3b3896',
    fontWeight: '700',
  },
});
