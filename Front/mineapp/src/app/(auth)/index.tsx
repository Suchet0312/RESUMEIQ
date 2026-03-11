import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const bgImage = require('../../assets/images/mine.png');

const Index = () => {
  const [loading, setLoading] = useState(true);

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.9);
  const textTranslateY = useSharedValue(10);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo animation
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, { duration: 800 });

    // Text animation (slightly delayed)
    textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    textTranslateY.value = withDelay(400, withTiming(0, { duration: 600 }));

    // Redirect after splash (set false to leave splash and navigate)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Animated styles
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  if (!loading) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={bgImage}
        style={styles.background}
        resizeMode="contain"
      >
        {/* <Animated.View style={[styles.logoCorner, logoStyle]}>
          <Text style={styles.logoText}>ResumeIQ</Text>
        </Animated.View>

        <Animated.View style={[styles.center, textStyle]}>
          <Text style={styles.title}>ResumeIQ</Text>
          <Text style={styles.subtitle}>Smarter resumes. Better jobs.</Text>
        </Animated.View> */}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0F2B',
    padding:5
  },
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  center: {
    alignItems: 'center',
    marginBottom: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  logoCorner: {
    position: 'absolute',
    top: 16,
    left: 12,
    zIndex: 20,
    alignItems: 'flex-start',
  },
  logoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#d1d5db',
    textAlign: 'center',
  },
});


export default Index;
