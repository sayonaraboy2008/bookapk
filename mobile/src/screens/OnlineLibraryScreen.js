import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Search, Download, BookOpen, CheckCircle } from 'lucide-react-native';
import { supabase } from '../services/supabase';
import { StorageService } from '../services/storage';

const INITIAL_DEMO_BOOKS = [
  {
    id: 'b1',
    title: "O'tkan Kunlar",
    author: "Abdulla Qodiriy",
    description: "O'zbek adabiyotidagi ilk roman. Tarixiy voqealar va chin sevgi qissasi.",
    category: 'Badiiy',
    cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    id: 'b2',
    title: 'Atom Odatlar',
    author: 'James Clear',
    description: "Kichik o'zgarishlar orqali katta muvaffaqiyatlarga erishish qo'llanmasi.",
    category: 'Rivojlanish',
    cover_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=400',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
];

export default function OnlineLibraryScreen({ onOpenPdf }) {
  const [books, setBooks] = useState(INITIAL_DEMO_BOOKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchOnlineBooks();
  }, []);

  const fetchOnlineBooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setBooks(data);
      }
    } catch (e) {
      console.log('Online fetch xatolik:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (book) => {
    try {
      setDownloadingId(book.id);
      const downloaded = await StorageService.downloadBookPdf(book);
      Alert.alert(
        'Muvaffaqiyatli!',
        `"${book.title}" telefonga saqlandi. Endi internetsiz ham o'qishingiz mumkin.`
      );
    } catch (err) {
      Alert.alert('Xatolik', 'Kitobni yuklab olishda muammo yuz berdi: ' + err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBookItem = ({ item }) => {
    const isDownloading = downloadingId === item.id;

    return (
      <View style={styles.bookCard}>
        <Image
          source={{ uri: item.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400' }}
          style={styles.bookCover}
        />
        <View style={styles.bookInfo}>
          <Text style={styles.categoryBadge}>{item.category || 'Umumiy'}</Text>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>

          <View style={styles.buttonRow}>
            {/* O'qish tugmasi */}
            <TouchableOpacity
              style={styles.readButton}
              onPress={() => onOpenPdf({ ...item, uri: item.pdf_url })}
            >
              <BookOpen size={16} color="#fff" />
              <Text style={styles.buttonText}>O'qish</Text>
            </TouchableOpacity>

            {/* Yuklab olish tugmasi */}
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownload(item)}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <ActivityIndicator size="small" color="#6366f1" />
              ) : (
                <>
                  <Download size={16} color="#6366f1" />
                  <Text style={styles.downloadButtonText}>Yuklash</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Qidiruv panel */}
      <View style={styles.searchBox}>
        <Search size={20} color="#94a3b8" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Kitob yoki muallif qidirish..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Kitoblar yuklanmoqda...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBookItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>Kitob topilmadi</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  searchInput: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 15,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#151d2f',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  bookCover: {
    width: 80,
    height: 110,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  bookInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  categoryBadge: {
    fontSize: 11,
    color: '#818cf8',
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  downloadButtonText: {
    color: '#818cf8',
    fontSize: 13,
    fontWeight: '600',
  },
  centerContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#94a3b8',
    fontSize: 14,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 15,
  },
});
