import { useGlobalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri;
const localHostIP = debuggerHost ? debuggerHost.split(':')[0] : '10.0.2.2';
const API_URL = `http://${localHostIP}:8000/api`;

export default function MOQRequest() {
  const { user, addInquiry, updateInquiry } = useAppState();
  const searchParams = useGlobalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const inquiryId = typeof searchParams.inquiryId === 'string' ? searchParams.inquiryId : undefined;
  const productType = typeof searchParams.productType === 'string' ? searchParams.productType : 'Product';
  const brandName = typeof searchParams.brandName === 'string' ? searchParams.brandName : '';
  const designDetails = typeof searchParams.designDetails === 'string' ? searchParams.designDetails : '';
  const initialQuantity = typeof searchParams.quantity === 'string' ? searchParams.quantity : (typeof searchParams.quantity === 'number' ? String(searchParams.quantity) : '');

  const [quantity, setQuantity] = useState(initialQuantity);

  async function handleSubmit() {
    const qtyNum = parseInt(quantity, 10);
    if (!qtyNum || qtyNum < 1) {
      Alert.alert('Invalid Quantity', 'Please enter a valid amount.');
      return;
    }
    if (qtyNum < 100) {
      Alert.alert('MOQ Not Met', 'Our Minimum Order Quantity (MOQ) for custom rebranding is 100 units. Please increase your quantity to proceed.');
      return;
    }

    if (user?.token) {
      setLoading(true);
      try {
        const url = inquiryId ? `${API_URL}/inquiries/${inquiryId}` : `${API_URL}/inquiries`;
        const method = inquiryId ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify({
            product_type: productType,
            brand_name: brandName,
            design_details: designDetails,
            quantity: qtyNum,
          })
        });

        if (response.ok) {
          const data = await response.json();
          
          if (inquiryId) {
            updateInquiry(inquiryId, {
              productType: data.product_type,
              brandName: data.brand_name,
              designDetails: data.design_details,
              quantity: data.quantity,
            });
          } else {
            addInquiry({
              id: String(data.id),
              productType: data.product_type,
              brandName: data.brand_name,
              designDetails: data.design_details,
              quantity: data.quantity,
            });
          }

          Alert.alert(
            'Success',
            inquiryId ? 'Your rebranding inquiry has been updated!' : 'Your rebranding inquiry has been saved securely to your account!',
            [{ text: 'OK', onPress: () => router.replace('/dashboard') }]
          );
        } else {
          Alert.alert('Error', 'Failed to save inquiry. Please try again later.');
        }
      } catch (err) {
         Alert.alert('Network Error', 'Could not reach the server.');
      } finally {
        setLoading(false);
      }
    } else {
      if (inquiryId) {
        updateInquiry(inquiryId, { productType, brandName, designDetails, quantity: qtyNum });
      } else {
        addInquiry({ productType, brandName, designDetails, quantity: qtyNum });
      }

      Alert.alert(
        'Success',
        inquiryId ? 'Your inquiry has been updated!' : 'Your rebranding inquiry has been submitted!',
        [{ text: 'OK', onPress: () => router.replace('/dashboard') }]
      );
    }
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            style={styles.headerBack}
            onPress={handleBack}
            hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
          >
            <ThemedView style={styles.backCircle}>
              <ThemedText style={styles.backChevron}>&lt;</ThemedText>
            </ThemedView>
          </Pressable>
        </View>

        <ThemedText type="title" style={styles.title}>Quantity & MOQ</ThemedText>
        <ThemedText style={styles.subtitle}>Step 2: Enter your desired quantity</ThemedText>

        <View style={styles.infoBox}>
          <ThemedText style={{ fontWeight: '600' }}>Notice:</ThemedText>
          <ThemedText style={styles.infoText}>The Minimum Order Quantity (MOQ) for our factory process is 100 units.</ThemedText>
        </View>

        <ThemedText style={styles.label}>Desired Quantity ({productType})</ThemedText>
        <TextInput 
          placeholder="e.g. 150" 
          style={styles.input} 
          keyboardType="numeric" 
          value={quantity} 
          onChangeText={setQuantity} 
        />

        <Pressable style={styles.button} onPress={handleSubmit}>
          <ThemedText style={styles.buttonText}>Submit Inquiry</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  safeArea: { width: '100%', padding: Spacing.four, alignItems: 'center', gap: Spacing.two },
  header: { width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'flex-start' },
  headerBack: { marginRight: 8, alignSelf: 'flex-start', padding: 4, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.04)' },
  backCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  backChevron: { color: '#111827', fontWeight: '700', fontSize: 18 },
  title: { alignSelf: 'flex-start' },
  subtitle: { alignSelf: 'flex-start', color: '#6b7280', marginBottom: Spacing.three },
  infoBox: { width: '100%', padding: Spacing.three, backgroundColor: '#fef3c7', borderRadius: 8, borderWidth: 1, borderColor: '#fde68a', marginBottom: Spacing.two },
  infoText: { color: '#92400e', marginTop: 4, fontSize: 13 },
  label: { alignSelf: 'flex-start', color: '#374151', fontSize: 13, marginTop: 6 },
  input: { width: '100%', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb' },
  button: { marginTop: Spacing.four, paddingVertical: 14, paddingHorizontal: Spacing.three, borderRadius: 28, alignItems: 'center', backgroundColor: '#208AEF', width: '100%' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
