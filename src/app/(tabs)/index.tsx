import * as Device from 'expo-device';
import { useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// AnimatedIcon removed per request — logo was coming from '@/components/animated-icon'
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, Spacing } from '@/constants/theme';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  

  function handleLogin() {
    router.push('/login');
  }

  function handleCreateAccount() {
    router.push('/registration');
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "right", "bottom"]}>
        <ThemedView style={styles.heroSection}>
          
          <View style={styles.brandingContainer}>
            <ThemedText style={styles.mainTitle}>BenJiks</ThemedText>
            <ThemedText style={styles.subTitle}> Brand Customization</ThemedText>
          </View>

          <View style={styles.buttonsWrap}>
            <Pressable 
              style={({pressed}) => [styles.primaryFull, pressed && { opacity: 0.8 }]} 
              onPress={handleLogin} 
              accessibilityRole="button"
            >
              <ThemedText style={styles.primaryFullText}>Log in</ThemedText>
            </Pressable>

            <Pressable
              style={({pressed}) => [styles.outlineFull, pressed && { backgroundColor: '#F3F4F6' }]}
              onPress={handleCreateAccount}
              accessibilityRole="button"
            >
              <ThemedText style={styles.outlineText}>Create new account</ThemedText>
            </Pressable>
          </View>

        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    paddingBottom: BottomTabInset + 20,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1,
    width: '100%',
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 42,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1E3A8A', // Deep blue
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  buttonsWrap: { 
    width: '100%', 
    gap: 16, 
    alignItems: 'center', 
  },
  primaryFull: { 
    width: '100%', 
    maxWidth: 380,
    height: 56, 
    backgroundColor: '#2563EB', // Modern vibrant blue connecting with login page
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryFullText: { color: '#ffffff', fontWeight: '700', fontSize: 18 },
  outlineFull: { 
    width: '100%', 
    maxWidth: 380,
    height: 56, 
    borderWidth: 1.5, 
    borderColor: '#D1D5DB', 
    borderRadius: 12, 
    alignItems: 'center', 
    backgroundColor: '#ffffff', 
    justifyContent: 'center' 
  },
  outlineText: { color: '#4B5563', fontSize: 18, fontWeight: '600' },
});
