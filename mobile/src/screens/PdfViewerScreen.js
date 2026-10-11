import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { ArrowLeft, Edit3, X, Plus, Calendar } from 'lucide-react-native';
import { StorageService } from '../services/storage';

export default function PdfViewerScreen({ book, onBack }) {
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNoteText, setNewNoteText] = useState('');

  useEffect(() => {
    if (book && book.id) {
      loadNotes();
    }
  }, [book]);

  const loadNotes = async () => {
    const list = await StorageService.getNotes(book.id);
    setNotes(list);
  };

  const handleSaveNote = async () => {
    if (!newNoteText.trim()) return;

    try {
      const updated = await StorageService.saveNote(book.id, newNoteText.trim());
      setNotes(updated);
      setNewNoteText('');
    } catch (e) {
      Alert.alert('Xatolik', 'Qaydni saqlashda xatolik yuz berdi');
    }
  };

  // PDF URL manzilini WebView moslashtirish
  // Remote URL bo'lsa Google Docs PDF viewer orqali ochish eng qulay va barqaror
  const getPdfViewerUrl = () => {
    if (!book || !book.uri) return '';
    if (book.uri.startsWith('http')) {
      return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(book.uri)}`;
    }
    // Lokal fayl bo'lsa (file://)
    return book.uri;
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Yuqori Panel */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={22} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {book.title}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {book.author}
          </Text>
        </View>

        {/* Shaxsiy qaydlar tugmasi */}
        <TouchableOpacity
          style={styles.notesButton}
          onPress={() => setNotesModalVisible(true)}
        >
          <Edit3 size={18} color="#ffffff" />
          <Text style={styles.notesButtonText}>Qaydlar ({notes.length})</Text>
        </TouchableOpacity>
      </View>

      {/* PDF O'quvchi (WebView) */}
      <View style={styles.viewerContainer}>
        <WebView
          source={{ uri: getPdfViewerUrl() }}
          style={styles.webview}
          startInLoadingState={true}
          originWhitelist={['*']}
          allowFileAccess={true}
          scalesPageToFit={true}
        />
      </View>

      {/* Shaxsiy Qaydlar Modali */}
      <Modal
        visible={notesModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setNotesModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Shaxsiy qaydlar va fikrlar</Text>
              <TouchableOpacity onPress={() => setNotesModalVisible(false)}>
                <X size={22} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Yangi qayd kiritish maydoni */}
            <View style={styles.inputArea}>
              <TextInput
                style={styles.noteInput}
                placeholder="Ushbu sahifa yoki kitob bo'yicha fikringizni yozing..."
                placeholderTextColor="#64748b"
                multiline
                value={newNoteText}
                onChangeText={setNewNoteText}
              />
              <TouchableOpacity style={styles.saveNoteBtn} onPress={handleSaveNote}>
                <Plus size={16} color="#ffffff" />
                <Text style={styles.saveNoteBtnText}>Saqlash</Text>
              </TouchableOpacity>
            </View>

            {/* Mavjud qaydlar ro'yxati */}
            <Text style={styles.savedNotesLabel}>Mavjud qaydlar ({notes.length}):</Text>
            <FlatList
              data={notes}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.noteItem}>
                  <Text style={styles.noteText}>{item.text}</Text>
                  <View style={styles.noteMeta}>
                    <Calendar size={12} color="#64748b" />
                    <Text style={styles.noteDate}>
                      {new Date(item.createdAt).toLocaleString('uz-UZ')}
                    </Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.noNotesText}>
                  Hozircha hech qanday shaxsiy qayd yo'q. Birinchi qaydni qo'shing!
                </Text>
              }
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#111827',
  },
  backButton: {
    padding: 6,
    marginRight: 8,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  notesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  notesButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#151d2f',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
  },
  inputArea: {
    marginBottom: 20,
  },
  noteInput: {
    backgroundColor: '#0b0f19',
    borderRadius: 10,
    padding: 12,
    color: '#f8fafc',
    fontSize: 14,
    minHeight: 70,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10,
  },
  saveNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  saveNoteBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  savedNotesLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  noteItem: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
  },
  noteText: {
    color: '#f8fafc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  noteDate: {
    fontSize: 11,
    color: '#64748b',
  },
  noNotesText: {
    color: '#64748b',
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 13,
  },
});
