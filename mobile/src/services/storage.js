import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

const NOTES_KEY_PREFIX = '@folio_book_notes_';
const DOWNLOADED_BOOKS_KEY = '@folio_library_books';

const DEFAULT_LIBRARY_BOOKS = [
  {
    id: 'f1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    type: 'downloaded',
    fileSize: '1.8 MB',
    progress: 0.45,
    currentPage: 81,
    totalPages: 180,
    coverColor: '#101c34',
    textColor: '#e6c875',
    uri: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    id: 'f3',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'IT',
    type: 'local',
    fileSize: '5.4 MB',
    progress: 0.28,
    currentPage: 130,
    totalPages: 464,
    coverColor: '#e35a1f',
    textColor: '#ffffff',
    uri: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
  {
    id: 'f5',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Business',
    type: 'downloaded',
    fileSize: '3.1 MB',
    progress: 0.72,
    currentPage: 230,
    totalPages: 320,
    coverColor: '#fdfbf7',
    textColor: '#1a1f2c',
    uri: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    pdf_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
  },
];

const DEFAULT_GATSBY_NOTES = [
  {
    id: 'n1',
    type: 'highlight',
    quote: '“It had gone beyond her, beyond everything.”',
    comment: 'He’s in love with an idea, not the person.',
    page: 81,
    chapter: 'Chapter V',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    type: 'highlight',
    quote: '“So we beat on, boats against the current, borne back ceaselessly into the past.”',
    comment: 'The quintessential tragedy of human hope and nostalgia.',
    page: 180,
    chapter: 'Chapter IX',
    createdAt: new Date().toISOString(),
  },
];

export const StorageService = {
  // 1. Shaxsiy qaydlar va izohlarni saqlash
  async saveNote(bookId, noteData) {
    try {
      const key = `${NOTES_KEY_PREFIX}${bookId}`;
      const existing = await this.getNotes(bookId);
      const newNote = {
        id: Date.now().toString(),
        type: noteData.type || 'comment',
        quote: noteData.quote || '',
        comment: noteData.comment || noteData.text || '',
        page: noteData.page || 81,
        chapter: noteData.chapter || 'Chapter V',
        createdAt: new Date().toISOString(),
      };
      const updatedNotes = [newNote, ...existing];
      await AsyncStorage.setItem(key, JSON.stringify(updatedNotes));
      return updatedNotes;
    } catch (error) {
      console.error('Qayd saqlashda xatolik:', error);
      throw error;
    }
  },

  async getNotes(bookId) {
    try {
      const key = `${NOTES_KEY_PREFIX}${bookId}`;
      const json = await AsyncStorage.getItem(key);
      if (json) return JSON.parse(json);
      if (bookId === 'f1') return DEFAULT_GATSBY_NOTES;
      return [];
    } catch (error) {
      console.error('Qaydlarni olishda xatolik:', error);
      return [];
    }
  },

  // 2. Telefon xotirasidan PDF faylni tanlash (Local PDF)
  async pickLocalPdf() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const newLocalBook = {
          id: 'local_' + Date.now(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          author: 'Local Device',
          genre: 'Local',
          type: 'local',
          fileSize: file.size ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : '3.2 MB',
          progress: 0.05,
          currentPage: 1,
          totalPages: 120,
          coverColor: '#1e293b',
          textColor: '#ffffff',
          uri: file.uri,
          isLocal: true,
        };
        await this.addBookToLibrary(newLocalBook);
        return newLocalBook;
      }
      return null;
    } catch (error) {
      console.error('Lokal PDF tanlashda xatolik:', error);
      throw error;
    }
  },

  // 3. Onlayn kitobni to'g'ridan-to'g'ri telefonga yuklab olish
  async downloadBookPdf(book, onProgress) {
    try {
      const fileName = `${book.id || 'book'}_${Date.now()}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        book.pdf_url,
        fileUri,
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          if (onProgress) onProgress(progress);
        }
      );

      const downloadResult = await downloadResumable.downloadAsync();

      if (downloadResult && downloadResult.uri) {
        const savedBook = {
          ...book,
          type: 'downloaded',
          uri: downloadResult.uri,
          localUri: downloadResult.uri,
          progress: book.progress || 0.1,
          currentPage: book.currentPage || 1,
          totalPages: book.totalPages || 200,
          downloadedAt: new Date().toISOString(),
        };
        await this.addBookToLibrary(savedBook);
        return savedBook;
      }
      throw new Error('Faylni yuklab bo‘lmadi');
    } catch (error) {
      console.error('PDF yuklab olishda xatolik:', error);
      throw error;
    }
  },

  async addBookToLibrary(book) {
    try {
      const current = await this.getLibraryBooks();
      const filtered = current.filter((b) => b.id !== book.id);
      const updated = [book, ...filtered];
      await AsyncStorage.setItem(DOWNLOADED_BOOKS_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Library ga qo\'shishda xatolik:', error);
    }
  },

  async getLibraryBooks() {
    try {
      const json = await AsyncStorage.getItem(DOWNLOADED_BOOKS_KEY);
      if (json) return JSON.parse(json);
      return DEFAULT_LIBRARY_BOOKS;
    } catch (error) {
      return DEFAULT_LIBRARY_BOOKS;
    }
  },
};
