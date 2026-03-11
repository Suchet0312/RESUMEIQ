import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { getToken } from '../services/storage';
import { Redirect } from 'expo-router';

export default function RootLayout() {
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setIsLoggedIn(!!token);
      setChecking(false);
    };
    checkAuth();
  }, []);

  if (checking) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="(main)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}
