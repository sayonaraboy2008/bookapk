import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {
  BookOpen,
  CheckCircle,
  FileText,
  MoreHorizontal,
  Plus,
  ChevronRight,
  ArrowUpDown,
  LayoutGrid,
  List,
} from 'lucide-react-native';
import { StorageService } from '../services/storage';

export default function LibraryScreen({ onOpenBook }) {
  const [activePill, setActivePill] = useState('All 12');
  const [books, setBooks] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    const list = await StorageService.getLibraryBooks();
    setBooks(list);
  };

  const handlePickLocalPdf = async () => {
    try {
      const added = await StorageService.pickLocalPdf();
      if (added) {
        await loadLibrary();
        onOpenBook(added);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not open local PDF');
    }
  };

  // Filter based on selected pill
  const filteredBooks = books.filter((b) => {
    if (activePill === 'Downloaded 8') return b.type === 'downloaded';
    if (activePill === 'Local PDFs 4') return b.type === 'local';
    return true;
  });

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Top Brand & Profile */}
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

      {/* Title & Subtitle */}
      <View style={styles.headerTitleSection}>
        <Text style={styles.mainHeading}>My library</Text>
        <Text style={styles.subHeading}>
          12 books · Your next chapter, always with you.
        </Text>
      </View>

      {/* Filter Pills */}
      <View style={styles.filterPillsRow}>
        {['All 12', 'Downloaded 8', 'Local PDFs 4'].map((pill) => (
          <TouchableOpacity
            key={pill}
            style={[
              styles.pillBtn,
              activePill === pill && styles.activePillBtn,
            ]}
            onPress={() => setActivePill(pill)}
          >
            <Text
              style={[
                styles.pillText,
                activePill === pill && styles.activePillText,
              ]}
            >
              {pill}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sorting & Layout View Toggle */}
      <View style={styles.controlRow}>
        <TouchableOpacity style={styles.sortDropdown}>
          <ArrowUpDown size={14} color="#64748b" />
          <Text style={styles.sortText}>Recently read ⌄</Text>
        </TouchableOpacity>

        <View style={styles.viewToggleGroup}>
          <TouchableOpacity
            style={[
              styles.viewToggleBtn,
              viewMode === 'grid' && styles.activeViewToggle,
            ]}
            onPress={() => setViewMode('grid')}
          >
            <LayoutGrid
              size={16}
              color={viewMode === 'grid' ? '#0f172a' : '#94a3b8'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggleBtn,
              viewMode === 'list' && styles.activeViewToggle,
            ]}
            onPress={() => setViewMode('list')}
          >
            <List
              size={16}
              color={viewMode === 'list' ? '#0f172a' : '#94a3b8'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Book Items List */}
      <View style={styles.bookList}>
        {filteredBooks.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.bookCard}
            onPress={() => onOpenBook(item)}
            activeOpacity={0.85}
          >
            {/* Cover Thumbnail */}
            <View
              style={[
                styles.coverThumbnail,
                { backgroundColor: item.coverColor || '#1e293b' },
              ]}
            >
              <Text
                style={[
                  styles.thumbTitle,
                  { color: item.textColor || '#ffffff' },
                ]}
              >
                {item.title.toUpperCase()}
              </Text>
            </View>

            {/* Info and Progress */}
            <View style={styles.bookMeta}>
              <View style={styles.titleRow}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <TouchableOpacity style={styles.moreBtn}>
                  <MoreHorizontal size={18} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <Text style={styles.itemAuthor}>{item.author}</Text>

              {/* Badges */}
              <View style={styles.badgesRow}>
                <View style={styles.genreBadge}>
                  <Text style={styles.genreBadgeText}>{item.genre}</Text>
                </View>

                {item.type === 'downloaded' ? (
                  <View style={styles.statusBadge}>
                    <CheckCircle size={13} color="#10b981" />
                    <Text style={styles.statusText}>
                      Downloaded · {item.fileSize}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.statusBadge}>
                    <FileText size={13} color="#6366f1" />
                    <Text style={styles.statusText}>
                      Local PDF · {item.fileSize}
                    </Text>
                  </View>
                )}
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.round((item.progress || 0.3) * 100)}%` },
                  ]}
                />
              </View>

              <View style={styles.progressLabelRow}>
                <Text style={styles.progressPercent}>
                  {Math.round((item.progress || 0.3) * 100)}% read
                </Text>
                <Text style={styles.pagesText}>
                  {item.currentPage} / {item.totalPages}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Add PDF from device card */}
      <TouchableOpacity
        style={styles.addDeviceCard}
        onPress={handlePickLocalPdf}
        activeOpacity={0.8}
      >
        <View style={styles.plusBox}>
          <Plus size={20} color="#4f46e5" />
        </View>

        <View style={styles.addDeviceTextWrap}>
          <Text style={styles.addDeviceTitle}>Add a PDF from your device</Text>
          <Text style={styles.addDeviceSub}>
            24.6 MB stored · Available offline
          </Text>
        </View>

        <ChevronRight size={20} color="#94a3b8" />
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
  headerTitleSection: {
    marginBottom: 16,
  },
  mainHeading: {
    fontSize: 34,
    fontWeight: '800',
    fontFamily: 'serif',
    color: '#0f172a',
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 13,
    color: '#64748b',
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  pillBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activePillBtn: {
    backgroundColor: '#3b3896',
    borderColor: '#3b3896',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  activePillText: {
    color: '#ffffff',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sortDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  viewToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 2,
  },
  viewToggleBtn: {
    padding: 5,
    borderRadius: 6,
  },
  activeViewToggle: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bookList: {
    gap: 12,
    marginBottom: 16,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  coverThumbnail: {
    width: 64,
    height: 92,
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  thumbTitle: {
    fontSize: 8,
    fontWeight: '800',
    textAlign: 'center',
  },
  bookMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  moreBtn: {
    padding: 2,
  },
  itemAuthor: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  genreBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  genreBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    color: '#64748b',
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3b3896',
    borderRadius: 2,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3b3896',
  },
  pagesText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  addDeviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#ffffff',
  },
  plusBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addDeviceTextWrap: {
    flex: 1,
  },
  addDeviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  addDeviceSub: {
    fontSize: 12,
    color: '#64748b',
  },
});
