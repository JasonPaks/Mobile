import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import { useGlobalSearchParams } from 'expo-router';

export default function Quotation() {
  const { id } = useGlobalSearchParams();
  const { inquiries } = useAppState();
  const inquiry = inquiries.find((q) => q.id === id);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title">Quotation</ThemedText>
        {inquiry ? (
          <>
            <ThemedText>Product: {inquiry.productType}</ThemedText>
            <ThemedText>Brand: {inquiry.brandName}</ThemedText>
            <ThemedText>Quantity: {inquiry.quantity}</ThemedText>
            <Link href="/order-status" asChild>
              <Pressable style={styles.button}>
                <ThemedText type="link">Track Order</ThemedText>
              </Pressable>
            </Link>
          </>
        ) : (
          <ThemedText>Quotation details will appear here after a supplier responds.</ThemedText>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  safeArea: { width: '100%', padding: Spacing.four, alignItems: 'center', gap: Spacing.three },
  button: { padding: Spacing.three, borderRadius: 8 },
});
