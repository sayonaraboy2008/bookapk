import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {
  Settings,
  Bookmark,
  Shield,
  User,
  LogOut,
  ChevronRight,
  LogIn,
  Award,
  Trophy,
  Sparkles,
} from 'lucide-react-native';
import AdminModal from './AdminModal';

export default function ProfileScreen({ books, onBookAdded, onDeleteBook }) {
  const [currentUser, setCurrentUser] = useState({
    name: 'Bosh Administrator',
    identifier: 'admin',
    role: 'admin',
    telegram: '@folio_admin',
    booksRead: 15,
  });
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);

  // Form fields
  const [isSignUp, setIsSignUp] = useState(false);
  const [identifierInput, setIdentifierInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [telegramInput, setTelegramInput] = useState('');

  const handleLoginSubmit = () => {
    const cleanId = identifierInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    // 1. ADMIN TEKSHIRUVI
    if (!isSignUp && cleanId === 'admin') {
      if (cleanPass === 'adminsomsa') {
        setCurrentUser({
          name: 'Bosh Administrator',
          identifier: 'admin',
          role: 'admin',
          telegram: '@folio_admin',
          booksRead: 40,
        });
        setIsAuthModalVisible(false);
        return;
      } else {
        Alert.alert('Xatolik', 'Admin paroli noto\'g\'ri! (Standart parol: adminsomsa)');
        return;
      }
    }

    // 2. RO'YXATDAN O'TISH CHEKLOVI
    if (isSignUp) {
      if (cleanId === 'admin' || cleanId.startsWith('admin@')) {
        Alert.alert('Taqiqlangan', '"admin" logini himoyalangan va unga ro\'yxatdan o\'tish mumkin emas!');
        return;
      }

      if (!firstNameInput.trim()) {
        Alert.alert('Xatolik', 'Ismingizni kiritish majburiy!');
        return;
      }

      if (!cleanId) {
        Alert.alert('Xatolik', 'Telefon raqam yoki email majburiy!');
        return;
      }

      const newUser = {
        name: `${firstNameInput.trim()} ${lastNameInput.trim()}`.trim(),
        identifier: cleanId,
        telegram: telegramInput.trim(),
        role: 'user',
        booksRead: 1,
      };

      setCurrentUser(newUser);
      setIsAuthModalVisible(false);
      return;
    }

    // 3. ODDIY USER KIRISHI
    if (cleanId && cleanPass) {
      setCurrentUser({
        name: cleanId.includes('@') ? cleanId.split('@')[0] : 'Kitobxon',
        identifier: cleanId,
        role: 'user',
        booksRead: 3,
      });
      setIsAuthModalVisible(false);
      return;
    }

    Alert.alert('Xatolik', 'Login va parolni to\'ldiring');
  };

  const handleGuestMode = () => {
    setCurrentUser(null);
  };

  const booksReadCount = currentUser?.booksRead || 4;

  const badges = [
    { title: 'Boshlang\'ich Kitobxon', icon: '🥉', desc: '1+ kitob', unlocked: booksReadCount >= 1 },
    { title: 'Kutubxona Do\'sti', icon: '🥈', desc: '5+ kitob', unlocked: booksReadCount >= 5 },
    { title: 'Mutolaa Ustasi', icon: '🥇', desc: '10+ kitob', unlocked: booksReadCount >= 10 },
    { title: 'Kitobxonlar Qiroli', icon: '👑', desc: '20+ kitob', unlocked: booksReadCount >= 20 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Profile Card */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: currentUser
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
              : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {currentUser ? currentUser.name : 'Mehmon Kitobxon (Guest)'}
        </Text>
        <Text style={styles.bio}>
          {currentUser ? currentUser.identifier : 'Akkauntsiz mutolaa rejimi'}
        </Text>

        {currentUser?.telegram ? (
          <Text style={{ fontSize: 12, color: '#4f46e5', fontWeight: '700', marginTop: 2 }}>
            Telegram: {currentUser.telegram}
          </Text>
        ) : null}

        {currentUser && (
          <View
            style={[
              styles.roleBadge,
              currentUser.role === 'admin' ? styles.adminBadge : styles.userBadge,
            ]}
          >
            <Text
              style={[
                styles.roleBadgeText,
                currentUser.role === 'admin' ? styles.adminBadgeText : styles.userBadgeText,
              ]}
            >
              {currentUser.role === 'admin' ? '🛡️ Administrator' : 'Kitobxon'}
            </Text>
          </View>
        )}
      </View>

      {/* Reading Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{booksReadCount}</Text>
          <Text style={styles.statLabel}>O'qilgan</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>8</Text>
          <Text style={styles.statLabel}>Lokal PDF</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>6</Text>
          <Text style={styles.statLabel}>Qaydlar</Text>
        </View>
      </View>

      {/* Badges Section */}
      <View style={styles.badgesCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Award size={18} color="#eab308" />
          <Text style={{ fontSize: 15, fontWeight: '800', color: '#0f172a' }}>
            Mutolaa Nishonlari
          </Text>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {badges.map((b, i) => (
            <View
              key={i}
              style={[
                styles.badgeItem,
                b.unlocked ? styles.unlockedBadge : styles.lockedBadge,
              ]}
            >
              <Text style={{ fontSize: 18 }}>{b.icon}</Text>
              <View>
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#0f172a' }}>{b.title}</Text>
                <Text style={{ fontSize: 9, color: '#64748b' }}>{b.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Admin Panel Access Button (Only for Admin) */}
      {currentUser?.role === 'admin' && (
        <TouchableOpacity
          style={styles.adminActionCard}
          onPress={() => setIsAdminModalVisible(true)}
          activeOpacity={0.85}
        >
          <View style={styles.adminIconBox}>
            <Shield size={22} color="#ffffff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.adminCardTitle}>Admin Boshqaruv Paneli</Text>
            <Text style={styles.adminCardSub}>
              Top yuklanganlar, reytinglar va kitob qo'shish/tahrirlash
            </Text>
          </View>
          <ChevronRight size={20} color="#6366f1" />
        </TouchableOpacity>
      )}

      {/* Menu Actions */}
      <View style={styles.menuCard}>
        {currentUser ? (
          <TouchableOpacity style={styles.menuItem} onPress={handleGuestMode}>
            <LogOut size={20} color="#ef4444" />
            <Text style={[styles.menuText, { color: '#ef4444' }]}>Akkauntdan chiqish (Guest)</Text>
            <ChevronRight size={18} color="#94a3b8" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setIsAuthModalVisible(true)}
          >
            <LogIn size={20} color="#4f46e5" />
            <Text style={[styles.menuText, { color: '#4f46e5' }]}>Tizimga kirish / Akkaunt ochish</Text>
            <ChevronRight size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.menuItem}>
          <Bookmark size={20} color="#475569" />
          <Text style={styles.menuText}>Saqlangan kitoblarim</Text>
          <ChevronRight size={18} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Settings size={20} color="#475569" />
          <Text style={styles.menuText}>Sozlamalar</Text>
          <ChevronRight size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Auth Modal for mobile */}
      {isAuthModalVisible && (
        <View style={styles.authModalBackdrop}>
          <View style={styles.authCard}>
            <Text style={styles.authTitle}>
              {isSignUp ? 'Yangi Akkaunt Ochish' : 'Tizimga Kirish'}
            </Text>

            {isSignUp && (
              <>
                <TextInput
                  style={styles.authInput}
                  placeholder="Ismingiz * (majburiy)"
                  placeholderTextColor="#94a3b8"
                  value={firstNameInput}
                  onChangeText={setFirstNameInput}
                />
                <TextInput
                  style={styles.authInput}
                  placeholder="Familiyangiz (ixtiyoriy)"
                  placeholderTextColor="#94a3b8"
                  value={lastNameInput}
                  onChangeText={setLastNameInput}
                />
                <TextInput
                  style={styles.authInput}
                  placeholder="Telegram manzil (@username)"
                  placeholderTextColor="#94a3b8"
                  value={telegramInput}
                  onChangeText={setTelegramInput}
                />
              </>
            )}

            <TextInput
              style={styles.authInput}
              placeholder={isSignUp ? "Telefon yoki email * (majburiy)" : "Login, telefon yoki email"}
              placeholderTextColor="#94a3b8"
              value={identifierInput}
              onChangeText={setIdentifierInput}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.authInput}
              placeholder="Parol * (majburiy)"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              value={passwordInput}
              onChangeText={setPasswordInput}
            />

            <TouchableOpacity style={styles.authSubmitBtn} onPress={handleLoginSubmit}>
              <Text style={styles.authSubmitText}>
                {isSignUp ? 'Ro\'yxatdan o\'tish' : 'Kirish'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 12, alignItems: 'center' }}
              onPress={() => setIsSignUp(!isSignUp)}
            >
              <Text style={{ color: '#4f46e5', fontSize: 13, fontWeight: '700' }}>
                {isSignUp ? 'Akkauntingiz bormi? Kirish' : 'Akkaunt yo\'qmi? Ro\'yxatdan o\'tish'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 10, alignItems: 'center' }}
              onPress={() => setIsAuthModalVisible(false)}
            >
              <Text style={{ color: '#64748b', fontSize: 12 }}>Bekor qilish</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Admin Panel Modal */}
      <AdminModal
        visible={isAdminModalVisible}
        onClose={() => setIsAdminModalVisible(false)}
        books={books || []}
        onBookAdded={onBookAdded}
        onDeleteBook={onDeleteBook}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 14,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  bio: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 6,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  adminBadge: {
    backgroundColor: '#eff2fe',
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  userBadge: {
    backgroundColor: '#f1f5f9',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  adminBadgeText: {
    color: '#4f46e5',
  },
  userBadgeText: {
    color: '#64748b',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  badgesCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  unlockedBadge: {
    backgroundColor: '#eff2fe',
    borderColor: '#c7d2fe',
  },
  lockedBadge: {
    backgroundColor: '#f8fafc',
    opacity: 0.5,
  },
  adminActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    gap: 12,
  },
  adminIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  adminCardSub: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  authModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  authCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
  },
  authTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'center',
  },
  authInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  authSubmitBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  authSubmitText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
