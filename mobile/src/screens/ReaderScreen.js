import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {
  ChevronLeft,
  Search,
  Bookmark,
  List,
  Type,
  Sun,
  Edit,
  X,
  MoreHorizontal,
  MessageSquare,
  ArrowUp,
  Square,
} from 'lucide-react-native';
import { StorageService } from '../services/storage';

export default function ReaderScreen({ book, onBack }) {
  const currentBook = book || {
    id: 'f1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    currentPage: 81,
    totalPages: 180,
  };

  const [notesSheetVisible, setNotesSheetVisible] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All 6');
  const [notes, setNotes] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(true);

  useEffect(() => {
    loadNotes();
  }, [currentBook.id]);

  const loadNotes = async () => {
    const list = await StorageService.getNotes(currentBook.id);
    setNotes(list);
  };

  const handleAddNote = async () => {
    if (!newComment.trim()) return;
    try {
      const updated = await StorageService.saveNote(currentBook.id, {
        type: 'highlight',
        quote: '“It had gone beyond her, beyond everything.”',
        comment: newComment.trim(),
        page: currentBook.currentPage || 81,
        chapter: 'Chapter V',
      });
      setNotes(updated);
      setNewComment('');
    } catch (e) {
      Alert.alert('Error', 'Failed to save note');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Reading Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.iconBtn} onPress={onBack}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.bookHeaderTitle} numberOfLines={1}>
            {currentBook.title}
          </Text>
          <Text style={styles.bookHeaderAuthor} numberOfLines={1}>
            {currentBook.author}
          </Text>
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Search size={20} color="#0f172a" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark
              size={20}
              color={isBookmarked ? '#3b3896' : '#0f172a'}
              fill={isBookmarked ? '#3b3896' : 'none'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Reader Paper Page Area */}
      <ScrollView
        style={styles.paperContainer}
        contentContainerStyle={styles.paperContent}
      >
        <View style={styles.pageMetaRow}>
          <Text style={styles.paperMetaTag}>{currentBook.title.toUpperCase()}</Text>
          <Text style={styles.paperMetaTag}>PDF · {currentBook.currentPage || 81}</Text>
        </View>

        <Text style={styles.chapterHeading}>Chapter V</Text>

        <Text style={styles.readerBodyText}>
          There must have been moments even that afternoon when Daisy tumbled short of
          his dreams—not through her own fault, but because of the colossal vitality of
          his illusion.
        </Text>

        {/* Yellow highlighted excerpt */}
        <TouchableOpacity
          style={styles.highlightBlock}
          onPress={() => setNotesSheetVisible(true)}
          activeOpacity={0.9}
        >
          <Text style={styles.highlightText}>
            It had gone beyond her, beyond everything.
          </Text>
        </TouchableOpacity>

        <Text style={styles.readerBodyText}>
          It had gone beyond her, beyond everything. He had thrown himself into it with a
          creative passion, adding to it all the time, decking it out with every bright
          feather that drifted his way. No amount of fire or freshness can challenge what
          a man will store up in his ghostly heart.
        </Text>
      </ScrollView>

      {/* Reader Toolbar (Bottom) */}
      <View style={styles.readerToolbar}>
        <TouchableOpacity style={styles.toolbarBtn}>
          <List size={20} color="#334155" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolbarBtn}>
          <Text style={styles.typographyBtnText}>Aa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolbarBtn}>
          <Sun size={20} color="#334155" />
        </TouchableOpacity>

        <Text style={styles.pageRatioText}>
          {currentBook.currentPage || 81} / {currentBook.totalPages || 180}
        </Text>

        <TouchableOpacity
          style={styles.notesPillBtn}
          onPress={() => setNotesSheetVisible(true)}
        >
          <Bookmark size={15} color="#3b3896" fill="#3b3896" />
          <Text style={styles.notesPillText}>Notes</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Modal: Notes & Highlights */}
      {notesSheetVisible && (
        <View style={styles.sheetOverlay}>
          <View style={styles.sheetCard}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeaderRow}>
              <Text style={styles.sheetTitle}>Notes & highlights</Text>
              <TouchableOpacity onPress={() => setNotesSheetVisible(false)}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Filter Pills */}
            <View style={styles.sheetFilterRow}>
              {['All 6', 'Highlights 4', 'Comments 2'].map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.sheetPill,
                    activeFilter === f && styles.activeSheetPill,
                  ]}
                  onPress={() => setActiveFilter(f)}
                >
                  <Text
                    style={[
                      styles.sheetPillText,
                      activeFilter === f && styles.activeSheetPillText,
                    ]}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Highlight & Note Item */}
            <ScrollView style={styles.notesListScroll} showsVerticalScrollIndicator={false}>
              {notes.map((note) => (
                <View key={note.id} style={styles.noteBox}>
                  <View style={styles.noteTopRow}>
                    <View style={styles.noteChapterTagRow}>
                      <View style={styles.yellowSquare} />
                      <Text style={styles.notePageText}>
                        Page {note.page || 81} · {note.chapter || 'Chapter V'}
                      </Text>
                    </View>
                    <TouchableOpacity>
                      <MoreHorizontal size={16} color="#94a3b8" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.noteQuoteText}>
                    {note.quote || '“It had gone beyond her, beyond everything.”'}
                  </Text>

                  <View style={styles.noteDivider} />

                  <View style={styles.commentRow}>
                    <MessageSquare size={13} color="#3b3896" style={{ marginRight: 6 }} />
                    <Text style={styles.commentHeaderTag}>MY COMMENT · TODAY</Text>
                  </View>
                  <Text style={styles.commentBodyText}>
                    {note.comment || 'He’s in love with an idea, not the person.'}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {/* Add a Personal Note Input */}
            <View style={styles.addNoteInputRow}>
              <Edit size={16} color="#94a3b8" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.addNoteInput}
                placeholder="Add a personal note..."
                placeholderTextColor="#94a3b8"
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity
                style={styles.sendNoteBtn}
                onPress={handleAddNote}
              >
                <ArrowUp size={16} color="#ffffff" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  iconBtn: {
    padding: 6,
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 8,
  },
  bookHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  bookHeaderAuthor: {
    fontSize: 12,
    color: '#64748b',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paperContainer: {
    flex: 1,
    backgroundColor: '#fffdf9',
  },
  paperContent: {
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  pageMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paperMetaTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  chapterHeading: {
    fontSize: 28,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
  },
  readerBodyText: {
    fontSize: 17,
    lineHeight: 28,
    fontFamily: 'serif',
    color: '#1e293b',
    marginBottom: 16,
  },
  highlightBlock: {
    backgroundColor: '#fef08a',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 16,
  },
  highlightText: {
    fontSize: 17,
    lineHeight: 28,
    fontFamily: 'serif',
    color: '#0f172a',
    fontWeight: '600',
  },
  readerToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  toolbarBtn: {
    padding: 6,
  },
  typographyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  pageRatioText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  notesPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff2fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  notesPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3b3896',
  },
  sheetOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    height: '100%',
  },
  sheetCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '62%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  sheetFilterRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
  },
  sheetPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeSheetPill: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sheetPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  activeSheetPillText: {
    color: '#0f172a',
  },
  notesListScroll: {
    maxHeight: 180,
    marginBottom: 14,
  },
  noteBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  noteTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteChapterTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  yellowSquare: {
    width: 8,
    height: 8,
    backgroundColor: '#facc15',
    borderRadius: 2,
  },
  notePageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  noteQuoteText: {
    fontSize: 14,
    fontFamily: 'serif',
    color: '#0f172a',
    lineHeight: 20,
    marginBottom: 10,
  },
  noteDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 10,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentHeaderTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3b3896',
    letterSpacing: 0.5,
  },
  commentBodyText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  addNoteInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  addNoteInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  sendNoteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#3b3896',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
