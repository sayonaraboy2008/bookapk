import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { BookOpen } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function BookLoader({ text = "Sahifalar ochilmoqda..." }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pageFlipAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Page flip simulation
    Animated.loop(
      Animated.timing(pageFlipAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();

    // Progress bar slide
    Animated.loop(
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const flipInterpolate = pageFlipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '-90deg', '-180deg'],
  });

  const slideInterpolate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, 100],
  });

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {/* Animated Book Emblem */}
        <Animated.View
          style={[
            styles.bookEmblemWrap,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <View style={styles.bookBase}>
            <BookOpen size={36} color="#ffffff" strokeWidth={2.5} />
          </View>
        </Animated.View>

        {/* Flipping Page Effect */}
        <View style={styles.miniBookRow}>
          <View style={styles.miniPageLeft} />
          <Animated.View
            style={[
              styles.miniPageFlip,
              {
                transform: [
                  { perspective: 400 },
                  { rotateY: flipInterpolate },
                ],
              },
            ]}
          />
          <View style={styles.miniPageRight} />
        </View>

        {/* Brand Text */}
        <View style={styles.brandRow}>
          <Text style={styles.brandTitle}>folio</Text>
        </View>

        {/* Loading Caption */}
        <Text style={styles.captionText}>{text}</Text>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressBar,
              { transform: [{ translateX: slideInterpolate }] },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: width * 0.82,
    maxWidth: 320,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  bookEmblemWrap: {
    marginBottom: 16,
  },
  bookBase: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  miniBookRow: {
    flexDirection: 'row',
    width: 60,
    height: 38,
    position: 'relative',
    marginBottom: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniPageLeft: {
    width: 28,
    height: 38,
    backgroundColor: '#334155',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderRightWidth: 1,
    borderRightColor: '#4f46e5',
  },
  miniPageRight: {
    width: 28,
    height: 38,
    backgroundColor: '#334155',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  miniPageFlip: {
    position: 'absolute',
    right: 32,
    width: 28,
    height: 38,
    backgroundColor: '#e2e8f0',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  captionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 18,
    textAlign: 'center',
  },
  progressTrack: {
    width: 110,
    height: 4,
    backgroundColor: '#0f172a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    width: 40,
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 2,
  },
});
