// app/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; // Wait for auth state to be determined
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    console.log('🔐 Navigation Check:', {
      isAuthenticated,
      currentSegment: segments[0],
      inAuthGroup,
      inTabsGroup,
      allSegments: segments,
    });

    // If not authenticated and not in auth group, go to auth
    if (!isAuthenticated && !inAuthGroup) {
      console.log('🚫 Not authenticated, redirecting to auth');
      router.replace('/(auth)');
    }
    // If authenticated and in auth group, go to tabs
    else if (isAuthenticated && inAuthGroup) {
      console.log('✅ Authenticated in auth group, redirecting to tabs');
      router.replace('/(tabs)');
    }
    // If authenticated and not in any group (initial load), go to tabs
    else if (isAuthenticated && !inAuthGroup && !inTabsGroup) {
      console.log('✅ Authenticated but no segment, redirecting to tabs');
      router.replace('/(tabs)');
    }

    // Hide splash screen after navigation decision
    SplashScreen.hideAsync();
  }, [isAuthenticated, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
    </GestureHandlerRootView>

  );
}
