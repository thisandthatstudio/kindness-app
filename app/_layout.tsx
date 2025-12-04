import { Stack } from 'expo-router';
import { useEffect } from 'react';
import i18n from '../lib/i18n';

export default function RootLayout() {
  useEffect(() => {
    i18n.loadLocale();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}