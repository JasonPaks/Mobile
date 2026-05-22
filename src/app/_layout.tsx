import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

import { AppStateProvider } from '@/context/AppState';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppStateProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
          <Stack.Screen name="registration" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
        </Stack>
      </AppStateProvider>
    </ThemeProvider>
  );
}
