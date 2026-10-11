import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { FolderOpen, FileText, ChevronRight, HardDrive } from 'lucide-react-native';
import { StorageService } from '../services/storage';

export default function LocalBooksScreen({ onOpenPdf }) {
  const [downloadedBooks, setDownloadedBooks] = useState([]);

  useEffect(() => {
    loadDownloadedBooks();
  }, []);

  const loadDownloadedBooks = async () => {
    const list = await StorageService.getDownloadedBooks();
    setDownloadedBooks(list);
  };

  // Telefon xotirasidan yangi PDF tanlash
  const handlePickDocument = async () => {
    try {
      const file = await StorageService.pickLocalPdf();
      if (file) {
        // Tanlangan faylni darhol o'quvchida ochish
        onOpenPdf({
          id: file.id,
          title: file.title,
          author: 'Lokal Fayl',
          uri: file.uri,
          isLocal: true,
        });
      }
    } catch (e) {
      Alert.alert('Xatolik', 'Faylni tanlab bo‘lmadi: ' + e.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => onOpenPdf({ ...item, uri: item.localUri || item.uri })}
    >
      <View style={styles.iconBox}>
        <FileText size={24} color="#6366f1" />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.itemSubtitle}>
          {item.author} • {item.downloadedAt ? 'Yuklab olingan' : 'Telefon xotirasidan'}
        </Text>
      </View>
      <ChevronRight size={18} color="#64748b" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Telefon xotirasidan tanlash tugmasi */}
      <TouchableOpacity style={styles.pickButton} onPress={handlePickDocument}>
        <HardDrive size={20} color="#ffffff" />
        <Text style={styles.pickButtonText}>Telefon xotirasidan PDF tanlash</Text>
      </TouchableOpacity>

      <Text style={styles.sectionHeader}>Yuklab olingan va saqlangan kitoblar</Text>

      <FlatList
        data={downloadedBooks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FolderOpen size={48} color="#475569" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>Hozircha lokal kitoblar yo'q</Text>
            <Text style={styles.emptySubtitle}>
              Onlayn bo'limdan kitob yuklab oling yoki yuqoridagi tugma orqali telefoningizdagi PDF faylni oching.
            </Text>
          </View>
        }
      />
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
  pickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    marginBottom: 24,
    shadowColor: '#4f46e5',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  pickButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 12,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151d2f',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 3,
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
