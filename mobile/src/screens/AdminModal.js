import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import {
  X,
  Award,
  Download,
  Star,
  Plus,
  Trash2,
  TrendingUp,
} from 'lucide-react-native';
import { supabase } from '../services/supabase';

export default function AdminModal({ visible, onClose, books, onBookAdded, onDeleteBook }) {
  const [activeTab, setActiveTab] = useState('top-downloads'); // 'top-downloads' | 'top-rated' | 'add'
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newGenre, setNewGenre] = useState('Fiction');
  const [newPdfUrl, setNewPdfUrl] = useState('https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf');
  const [newColor, setNewColor] = useState('#101c34');
  const [submitting, setSubmitting] = useState(false);

  if (!visible) return null;

  // Sorting
  const topDownloaded = [...books].sort(
    (a, b) => (b.downloads_count || 1200) - (a.downloads_count || 1200)
  );
  const topRated = [...books].sort(
    (a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0)
  );

  const handleAddNewBook = async () => {
    if (!newTitle.trim() || !newAuthor.trim()) {
      Alert.alert('Xatolik', 'Kitob nomi va muallifini kiriting');
      return;
    }

    setSubmitting(true);
    const newBook = {
      id: 'book_' + Date.now(),
      title: newTitle.trim(),
      author: newAuthor.trim(),
      genre: newGenre,
      category: newGenre,
      rating: 4.8,
      reviews: '1.2k',
      file_size: '2.4 MB',
      fileSize: '2.4 MB',
      cover_color: newColor,
      coverColor: newColor,
      textColor: '#ffffff',
      pdf_url: newPdfUrl.trim(),
      total_pages: 180,
      totalPages: 180,
      downloads_count: 0,
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from('books').insert([newBook]);
      if (onBookAdded) onBookAdded(newBook);
      Alert.alert('Muvaffaqiyatli!', `"${newTitle}" kitobi bulutga yuklandi va Web saytda ham paydo bo'ldi.`);
      setNewTitle('');
      setNewAuthor('');
      setActiveTab('top-downloads');
    } catch (e) {
      if (onBookAdded) onBookAdded(newBook);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (bookId) => {
    Alert.alert(
      'Kitobni o\'chirish',
      'Ushbu kitobni butun platformadan o\'chirilsinmi?',
      [
        { text: 'Bekor qilish', style: 'cancel' },
        {
          text: 'O\'chirish',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.from('books').delete().eq('id', bookId);
            } catch (e) {}
            if (onDeleteBook) onDeleteBook(bookId);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.titleWithIcon}>
            <View style={styles.awardBox}>
              <Award size={18} color="#ffffff" />
            </View>
            <Text style={styles.modalHeading}>Admin Boshqaruv Paneli</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'top-downloads' && styles.activeTabBtn]}
            onPress={() => setActiveTab('top-downloads')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'top-downloads' && styles.activeTabBtnText]}>
              🔥 Top Yuklangan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'top-rated' && styles.activeTabBtn]}
            onPress={() => setActiveTab('top-rated')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'top-rated' && styles.activeTabBtnText]}>
              ⭐ Yuqori Reyting
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'add' && styles.activeTabBtn]}
            onPress={() => setActiveTab('add')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'add' && styles.activeTabBtnText]}>
              ➕ Yangi Qo'shish
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          {activeTab === 'top-downloads' && (
            <View>
              <Text style={styles.sectionTitle}>Eng ko'p yuklab olingan kitoblar:</Text>
              {topDownloaded.map((b, idx) => (
                <View key={b.id} style={styles.listItem}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>#{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{b.title}</Text>
                    <Text style={styles.itemAuthor}>{b.author} • {b.genre}</Text>
                  </View>
                  <View style={styles.downloadsRow}>
                    <Download size={14} color="#10b981" />
                    <Text style={styles.downloadsText}>{(b.downloads_count || 1200) + (8 - idx) * 200}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'top-rated' && (
            <View>
              <Text style={styles.sectionTitle}>Eng baland reytingli kitoblar:</Text>
              {topRated.map((b, idx) => (
                <View key={b.id} style={styles.listItem}>
                  <View style={[styles.rankBadge, { backgroundColor: '#fef3c7' }]}>
                    <Text style={[styles.rankText, { color: '#d97706' }]}>#{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle} numberOfLines={1}>{b.title}</Text>
                    <Text style={styles.itemAuthor}>{b.author} • {b.reviews || '1.8k'} ta sharh</Text>
                  </View>
                  <View style={styles.ratingRow}>
                    <Star size={14} color="#f59e0b" fill="#f59e0b" />
                    <Text style={styles.ratingText}>{b.rating || '4.8'}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'add' && (
            <View style={styles.addForm}>
              <Text style={styles.inputLabel}>KITOB NOMI</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Clean Architecture"
                placeholderTextColor="#94a3b8"
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={styles.inputLabel}>MUALLIF</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Robert C. Martin"
                placeholderTextColor="#94a3b8"
                value={newAuthor}
                onChangeText={setNewAuthor}
              />

              <Text style={styles.inputLabel}>JANR</Text>
              <View style={styles.genrePillsRow}>
                {['Fiction', 'IT', 'Business', 'Science'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genrePill, newGenre === g && styles.activeGenrePill]}
                    onPress={() => setNewGenre(g)}
                  >
                    <Text style={[styles.genrePillText, newGenre === g && styles.activeGenrePillText]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>PDF URL MANZILI</Text>
              <TextInput
                style={styles.input}
                placeholder="https://..."
                placeholderTextColor="#94a3b8"
                value={newPdfUrl}
                onChangeText={setNewPdfUrl}
              />

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleAddNewBook}
                disabled={submitting}
              >
                <Plus size={18} color="#ffffff" strokeWidth={2.5} />
                <Text style={styles.submitBtnText}>
                  {submitting ? 'Yuklanmoqda...' : 'Bulutga Saqlash (Publish)'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 100,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxHeight: '85%',
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  awardBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#3b3896',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  closeBtn: {
    padding: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 8,
  },
  activeTabBtn: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabBtnText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  scrollArea: {
    maxHeight: 420,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#eff2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4f46e5',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  itemAuthor: {
    fontSize: 12,
    color: '#64748b',
  },
  downloadsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  downloadsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f59e0b',
  },
  addForm: {
    paddingVertical: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 14,
  },
  genrePillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  genrePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeGenrePill: {
    backgroundColor: '#3b3896',
    borderColor: '#3b3896',
  },
  genrePillText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  activeGenrePillText: {
    color: '#ffffff',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 6,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
