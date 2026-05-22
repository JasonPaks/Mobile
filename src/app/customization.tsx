import { useGlobalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function CustomizationForm() {
  const router = useRouter();
  const searchParams = useGlobalSearchParams();
  
  const inquiryId = typeof searchParams.inquiryId === 'string' ? searchParams.inquiryId : undefined;
  const initialProductType = typeof searchParams.productName === 'string' ? searchParams.productName : '';
  const initialBrandName = typeof searchParams.brandName === 'string' ? searchParams.brandName : '';
  const initialDesignDetails = typeof searchParams.designDetails === 'string' ? searchParams.designDetails : '';
  const passedQuantity = typeof searchParams.quantity === 'string' ? searchParams.quantity : undefined;

  const [productType, setProductType] = useState(initialProductType);
  const [brandName, setBrandName] = useState(initialBrandName);
  const [designDetails, setDesignDetails] = useState(initialDesignDetails);

  function handleNext() {
    // Navigate to moq screen with the gathered details
    router.push({
      pathname: '/moq',
      params: { 
        inquiryId,
        productType, 
        brandName, 
        designDetails,
        quantity: passedQuantity
      }
    });
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
          <ThemedText type="title" style={styles.title}>Rebranding Details</ThemedText>
          <ThemedText style={styles.subtitle}>Step 1: Enter your brand and design specifications</ThemedText>

          <ThemedText style={styles.label}>Product Type</ThemedText>
          <TextInput placeholder="e.g. Notebooks" style={styles.input} value={productType} onChangeText={setProductType} />
          
          <ThemedText style={styles.label}>Brand Name</ThemedText>
          <TextInput placeholder="Your Brand Name" style={styles.input} value={brandName} onChangeText={setBrandName} />
          
          <ThemedText style={styles.label}>Design Details / Colors</ThemedText>
          <TextInput 
            placeholder="Describe your logo placement, primary colors, etc." 
            style={[styles.input, styles.textArea]} 
            multiline 
            numberOfLines={4}
            value={designDetails} 
            onChangeText={setDesignDetails} 
          />

          <Pressable style={styles.button} onPress={handleNext}>
            <ThemedText style={styles.buttonText}>Next: Choose Quantity</ThemedText>
          </Pressable>
        </SafeAreaView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  safeArea: { flex: 1, width: '100%', padding: Spacing.four, alignItems: 'center', gap: Spacing.two },
  header: { width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'flex-start' },
  headerBack: { marginRight: 8, alignSelf: 'flex-start', padding: 4, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.04)' },
  backCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  backChevron: { color: '#111827', fontWeight: '700', fontSize: 18 },
  title: { alignSelf: 'flex-start' },
  subtitle: { alignSelf: 'flex-start', color: '#6b7280', marginBottom: Spacing.three },
  label: { alignSelf: 'flex-start', color: '#374151', fontSize: 13, marginTop: 6 },
  input: { width: '100%', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb' },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { marginTop: Spacing.four, paddingVertical: 14, paddingHorizontal: Spacing.three, borderRadius: 28, alignItems: 'center', backgroundColor: '#208AEF', width: '100%' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
