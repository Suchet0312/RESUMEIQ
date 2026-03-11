import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { removeToken } from '../../services/storage';
import { router } from 'expo-router';

export default function ProfileScreen() {

  const handleLogout = async () => {
    await removeToken();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>👤 Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>test@test.com</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F2B',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#1E234E',
    borderRadius: 14,
    padding: 16,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#B0B3C7',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginTop: 6,
  },
  logoutBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
