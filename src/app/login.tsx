
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import Constants from 'expo-constants';

// Automatically resolve the host IP that Expo used to serve the app
const debuggerHost = Constants.expoConfig?.hostUri;
const localHostIP = debuggerHost ? debuggerHost.split(':')[0] : '10.0.2.2';
const API_URL = `http://${localHostIP}:8000/api`;

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const textResponse = await response.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (err) {
        console.log("HTML RESPONSE RECEIVED: ", textResponse);
        throw new Error(`Server returned non-JSON response. Check Metro console`);
      }

      if (response.ok) {
        setUser({ id: data.user.id, email: data.user.email, name: data.user.name, token: data.token });
        router.replace('/dashboard');
      } else {
        // Laravel throws ValidationException which gives us a message or errors obj
        let firstError;
        if (data.errors && typeof data.errors === 'object') {
          const vals: any = Object.values(data.errors);
          if (vals.length > 0 && Array.isArray(vals[0])) firstError = vals[0][0];
        }
        const errMsg = data.message || firstError;
        Alert.alert('Login Failed', errMsg || 'Incorrect email or password.');
      }
    } catch (e: any) {
      console.log('FETCH ERROR:', e);
      Alert.alert('Network Error', String(e.message) || 'Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };

  function handleCreateAccount() {
    router.push('/registration');
  }

  function handleBack() {
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            style={styles.headerBack}
            onPress={handleBack}
            hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
            accessibilityRole="button"
            android_ripple={{ color: 'rgba(0,0,0,0.06)', radius: 28 }}
          >
            <View style={styles.backCircle}>
              <ThemedText style={styles.backChevron}>&lt;</ThemedText>
            </View>
          </Pressable>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <ThemedText style={styles.headline}>Welcome Back</ThemedText>
            <ThemedText style={styles.subHeadline}>Log in to access your dashboard</ThemedText>
          </View>

          <View style={styles.formCard}>
            <TextInput value={email} onChangeText={setEmail} placeholder="Email address" style={styles.input} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#9CA3AF" />
            <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input} placeholderTextColor="#9CA3AF" />

            <Pressable style={({pressed}) => [styles.buttonPrimary, pressed && { opacity: 0.8 }, loading && { opacity: 0.6 }]} onPress={handleLogin} disabled={loading}>
              <ThemedText style={styles.buttonPrimaryText}>{loading ? 'Logging in...' : 'Sign In'}</ThemedText>
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.line} />
              <ThemedText style={styles.orText}>or</ThemedText>
              <View style={styles.line} />
            </View>

            <Pressable style={({pressed}) => [styles.buttonOutline, pressed && { backgroundColor: '#F3F4F6' }]} onPress={handleCreateAccount}>
              <ThemedText style={styles.buttonOutlineText}>Create New Account</ThemedText>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' }, // Light modern background
  safeArea: { flex: 1, width: '100%', alignItems: 'center' },
  header: { width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.three, paddingVertical: 12 },
  headerBack: { padding: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.7)' },
  backCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  backChevron: { color: '#374151', fontWeight: '700', fontSize: 18 },
  contentContainer: { width: '100%', flex: 1, paddingHorizontal: Spacing.four, justifyContent: 'center', paddingBottom: 60 },
  titleContainer: { marginBottom: 32, alignItems: 'center' },
  headline: { fontSize: 36, fontWeight: '800', color: '#1E3A8A', marginBottom: 8, textAlign: 'center' }, // Deep blue
  subHeadline: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
  formCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 4 },
  input: { width: '100%', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', marginBottom: 16, fontSize: 16, color: '#111827' },
  buttonPrimary: { marginTop: 8, paddingVertical: 16, borderRadius: 10, alignItems: 'center', backgroundColor: '#2563EB', shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }, // Strong primary blue
  buttonPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  line: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  orText: { marginHorizontal: 16, color: '#9CA3AF', fontSize: 14, fontWeight: '500' },
  buttonOutline: { padding: 16, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' },
  buttonOutlineText: { color: '#4B5563', fontSize: 16, fontWeight: '600' },
});
