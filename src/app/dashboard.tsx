import { Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Image, ImageBackground, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAppState } from '@/context/AppState';
import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri;
const localHostIP = debuggerHost ? debuggerHost.split(':')[0] : '10.0.2.2';
const API_URL = `http://${localHostIP}:8000/api`;

const PRODUCTS = [
  { 
    id: '1', 
    name: 'Custom Mugs', 
    description: 'Rebrand our high-quality ceramic mugs.',
    image: require('@/assets/images/mug.png')
  },
  { 
    id: '2', 
    name: 'T-Shirts', 
    description: 'Premium cotton with your logo.',
    image: require('@/assets/images/Tshirt.jpg')
  },
  { 
    id: '3', 
    name: 'Notebooks', 
    description: 'Custom covers and high-quality paper.',
    image: require('@/assets/images/Notebook.avif')
  },
];

export default function Dashboard() {
  const { inquiries, user, logout, setInquiries } = useAppState();
  const router = useRouter();

  useEffect(() => {
    if (user?.token) {
      fetch(`${API_URL}/inquiries`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map((d: any) => ({
            id: String(d.id),
            productType: d.product_type,
            brandName: d.brand_name,
            designDetails: d.design_details,
            quantity: d.quantity,
            createdAt: new Date(d.created_at).getTime()
          }));
          setInquiries(mapped);
        }
      })
      .catch(err => console.log('Error fetching inquiries:', err));
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Inquiry', 'Are you sure you want to delete this customization inquiry?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          if (user?.token) {
            try {
              const res = await fetch(`${API_URL}/inquiries/${id}`, {
                method: 'DELETE',
                headers: {
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                }
              });
              if (res.ok) {
                setInquiries(inquiries.filter(iq => iq.id !== id));
              }
            } catch (error) {
              Alert.alert('Network Error', 'Could not reach the server.');
            }
          } else {
            setInquiries(inquiries.filter(iq => iq.id !== id));
          }
        }
      }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#F9FAFB' }}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Top Header */}
        <View style={styles.topHeader}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </Pressable>
          <ThemedText style={styles.pageTitle}>dashboard</ThemedText>
          <Pressable style={styles.iconBtn}>
            <Feather name="settings" size={24} color="#111827" />
          </Pressable>
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeLeft}>
            <Image source={{ uri: 'https://avatar.iran.liara.run/public/boy' }} style={styles.avatar} />
            <View>
              <ThemedText style={styles.headerGreeting}>Welcome back,</ThemedText>
              <ThemedText style={styles.headerName}>{user?.name || user?.email || 'patok'}</ThemedText>
            </View>
          </View>
          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <ThemedText style={styles.logoutText}>Log Out</ThemedText>
          </Pressable>
        </View>

        {/* New Customization */}
        <View style={styles.productsContainer}>
          <ThemedText style={styles.sectionTitle}>Start New Customization</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {PRODUCTS.map(product => (
              <Link 
                key={product.id} 
                href={{ pathname: '/customization', params: { productId: product.id, productName: product.name } }} 
                asChild
              >
                <Pressable style={styles.productCardTouch}>
                  <ImageBackground 
                    source={product.image} 
                    style={styles.productCardBg}
                    imageStyle={{ borderRadius: 16 }}
                  >
                    <View style={styles.productCardOverlay}>
                      <ThemedText style={styles.productCardTitle}>{product.name}</ThemedText>
                      <ThemedText style={styles.productCardDesc}>{product.description}</ThemedText>
                    </View>
                  </ImageBackground>
                </Pressable>
              </Link>
            ))}
          </ScrollView>
        </View>

        {/* Active Inquiries */}
        <View style={styles.inquiriesContainer}>
          <ThemedText style={styles.sectionTitle}>Your Active Inquiries</ThemedText>

          {inquiries.length > 0 ? (
            <View style={styles.inquiriesList}>
              {inquiries.map((iq) => (
                <View key={iq.id} style={styles.inquiryCard}>
                  {/* Info Part */}
                  <View style={styles.inquiryLeft}>
                    <View style={styles.inquiryTextContainer}>
                      <ThemedText style={styles.inquiryProduct}>{iq.productType ?? 'Product'}</ThemedText>
                      <ThemedText style={styles.inquiryDetail}>Quantity: {iq.quantity ?? '-'}</ThemedText>
                      {iq.brandName && <ThemedText style={styles.inquiryDetail}>Brand: {iq.brandName}</ThemedText>}
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <Link 
                      href={{ 
                        pathname: '/customization', 
                        params: { 
                          inquiryId: iq.id,
                          productName: iq.productType,
                          brandName: iq.brandName,
                          designDetails: iq.designDetails,
                          quantity: iq.quantity
                        } 
                      }} 
                      asChild
                    >
                      <Pressable style={styles.editBtn}>
                        <Feather name="edit-2" size={14} color="#2563EB" style={{ marginRight: 6 }} />
                        <ThemedText style={styles.editBtnText}>Edit</ThemedText>
                      </Pressable>
                    </Link>
                    <Pressable onPress={() => handleDelete(iq.id)} style={styles.deleteBtn}>
                      <Feather name="trash-2" size={14} color="#DC2626" style={{ marginRight: 6 }} />
                      <ThemedText style={styles.deleteBtnText}>Delete</ThemedText>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>You don't have any active inquiries.</ThemedText>
              <ThemedText style={styles.emptyStateSubtext}>Select a product above to start your first customization order.</ThemedText>
            </View>
          )}
        </View>

        {/* Big Bottom Button */}
        <Link href="/order-status" asChild>
          <Pressable style={styles.secondaryActionBtn}>
            <ThemedText style={styles.secondaryActionText}>Check Order Status</ThemedText>
          </Pressable>
        </Link>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, width: '100%', paddingHorizontal: Spacing.four, paddingTop: Spacing.three, paddingBottom: 40 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  iconBtn: { padding: 4 },
  pageTitle: { fontSize: 20, color: '#111827' },
  
  welcomeCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 30 },
  welcomeLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 16, backgroundColor: '#E5E7EB' },
  headerGreeting: { color: '#6B7280', fontSize: 14 },
  headerName: { color: '#111827', fontSize: 20, fontWeight: '700' },
  logoutBtn: { paddingVertical: 10, paddingHorizontal: 18, backgroundColor: '#EF4444', borderRadius: 20 },
  logoutText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },

  productsContainer: { width: '100%', marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 16 },
  horizontalScroll: { gap: 16, paddingRight: Spacing.four },
  productCardTouch: { marginRight: 16 },
  productCardBg: { width: 220, height: 260, borderRadius: 16, justifyContent: 'flex-start' },
  productCardOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 16, padding: 20 },
  productCardTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  productCardDesc: { fontSize: 14, color: '#E5E7EB', lineHeight: 20 },

  inquiriesContainer: { width: '100%', flex: 1, marginBottom: 20 },
  inquiriesList: { gap: 16 },
  inquiryCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderRadius: 20, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  inquiryLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  inquiryTextContainer: { flex: 1 },
  inquiryProduct: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 6 },
  inquiryDetail: { fontSize: 14, color: '#4B5563', marginBottom: 2 },
  
  actionButtons: { gap: 10, marginLeft: 16 },
  editBtn: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#EFF6FF', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  editBtnText: { color: '#2563EB', fontSize: 13, fontWeight: '600' },
  deleteBtn: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#FEF2F2', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  deleteBtnText: { color: '#DC2626', fontSize: 13, fontWeight: '600' },

  emptyState: { padding: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  emptyStateText: { fontSize: 16, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
  emptyStateSubtext: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },

  secondaryActionBtn: { marginTop: 10, paddingVertical: 18, borderRadius: 12, alignItems: 'center', backgroundColor: '#111827' },
  secondaryActionText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' }
});