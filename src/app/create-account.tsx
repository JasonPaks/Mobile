import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import Constants from 'expo-constants';

// Automatically resolve the host IP that Expo used to serve the app
const debuggerHost = Constants.expoConfig?.hostUri;
const localHostIP = debuggerHost ? debuggerHost.split(':')[0] : '10.0.2.2';
const API_URL = `http://${localHostIP}:8000/api`;

export default function CreateAccount() {
  const { setUser } = useAppState();
  const router = useRouter();

  const [form, setForm] = useState({ name: '', company_name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const textResponse = await response.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (err) {
        console.log("NON-JSON RESPONSE RECEIVED: ", textResponse);
        // If it's a 422, see if we can extract JSON from the text or something, but realistically we should just alert
        Alert.alert('Server Error', `Response: ${textResponse.substring(0, 100)}...`);
        throw new Error(`Server returned non-JSON response.`);
      }

      if (response.ok) {
        setUser({ id: data.user.id, email: data.user.email, name: data.user.name, token: data.token });
        router.replace('/dashboard');
      } else {
        let errorMsg = data.message || 'Check your details and try again.';
        if (data.errors) {
          errorMsg = Object.values(data.errors).flat().join('\n');
        }
        Alert.alert('Registration Failed', errorMsg);
      }
    } catch (e: any) {
      console.log('FETCH ERROR:', e);
      Alert.alert('Network Error', String(e.message) || 'Could not reach the server.');
    } finally {
      setLoading(false);
    }
  };
  const onSocial = (provider: 'google' | 'facebook') => {
    // placeholder social sign-in flow — set a user and navigate to dashboard
    setUser({ id: `${Date.now()}`, email: `${provider}@example.com`, provider });
    router.replace('/dashboard');
  };
  const handleBack = () => {
    router.replace('/');
  };
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top","right","bottom"]}>
        <View style={styles.header}>
          <Pressable
            style={styles.headerBack}
            onPress={handleBack}
            hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
            accessibilityRole="button"
            android_ripple={{ color: 'rgba(0,0,0,0.06)', radius: 28 }}
          >
            <ThemedView style={styles.backCircle}>
              <ThemedText style={styles.backChevron}>&lt;</ThemedText>
            </ThemedView>
          </Pressable>
        </View>
        <ThemedText type="title" style={styles.titleSpacing}>Account creation</ThemedText>
        <ThemedText type="small">Create accounts creating to your company's accounts.</ThemedText>

        <ThemedText style={styles.label}>Full Name</ThemedText>
        <TextInput placeholder="Full name" style={styles.input} placeholderTextColor="#6b7280" value={form.name} onChangeText={(txt) => setForm({...form, name: txt})} />

        <ThemedText style={styles.label}>Company Name</ThemedText>
        <TextInput placeholder="Company name" style={styles.input} placeholderTextColor="#6b7280" value={form.company_name} onChangeText={(txt) => setForm({...form, company_name: txt})} />

        <ThemedText style={styles.label}>Email</ThemedText>
        <TextInput placeholder="Email" style={styles.input} placeholderTextColor="#6b7280" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={(txt) => setForm({...form, email: txt})} />

        <ThemedText style={styles.label}>Password</ThemedText>
        <TextInput placeholder="Password" secureTextEntry style={styles.input} placeholderTextColor="#6b7280" value={form.password} onChangeText={(txt) => setForm({...form, password: txt})} />

        <Pressable style={[styles.primaryButton, loading && { opacity: 0.7 }]} onPress={onCreate} disabled={loading}>
          <ThemedText type="link" style={styles.primaryButtonText}>{loading ? 'Registering...' : 'Register'}</ThemedText>
        </Pressable>

        <ThemedText type="small" style={styles.socialLabel}>Sign up with social account</ThemedText>
        <ThemedView style={styles.socialRow}>
          <Pressable style={[styles.socialBtn, styles.google]} onPress={() => onSocial('google')}>
            <ThemedText style={styles.socialChar}>G</ThemedText>
          </Pressable>
          <Pressable style={[styles.socialBtn, styles.facebook]} onPress={() => onSocial('facebook')}>
            <ThemedText style={styles.socialChar}>f</ThemedText>
          </Pressable>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  safeArea: { width: '100%', padding: Spacing.four, alignItems: 'center', gap: Spacing.three },
  header: { width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.three, paddingVertical: 8, justifyContent: 'flex-start' },
  headerBack: { marginRight: 8, alignSelf: 'flex-start', padding: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.04)' },
  backCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  backChevron: { color: '#111827', fontWeight: '700', fontSize: 18 },
  titleSpacing: { marginTop: 6, marginBottom: 4 },
  label: { alignSelf: 'flex-start', color: '#374151', fontSize: 13, marginTop: 6 },
  input: { width: '100%', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, borderColor: '#e6eef9', backgroundColor: '#fff' },
  button: { padding: Spacing.three, borderRadius: 8 },
  primaryButton: { marginTop: Spacing.two, paddingVertical: 14, paddingHorizontal: Spacing.three, borderRadius: 28, alignItems: 'center', backgroundColor: '#208AEF', width: '100%' },
  primaryButtonText: { color: '#ffffff', fontWeight: '600' },
  socialLabel: { marginTop: Spacing.two, color: '#6b7280' },
  socialRow: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.two },
  socialBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  socialChar: { color: '#fff', fontWeight: '700' },
  google: { backgroundColor: '#DB4437' },
  facebook: { backgroundColor: '#1877F2' },
  smallLink: { color: '#6b7280', marginTop: Spacing.one },
});
