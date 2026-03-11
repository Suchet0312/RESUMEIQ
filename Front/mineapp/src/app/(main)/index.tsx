import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';

import { uploadResume } from '../../services/resumeService';
import { getLatestResume } from '../../services/authService';

const HomeScreen = () => {
  const userName = 'Suchi';

  const [resumeScore, setResumeScore] = useState(0);
  const [atsFriendly, setAtsFriendly] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔁 FETCH LATEST RESUME
  const fetchResumeStatus = async () => {
    try {
      const data = await getLatestResume();
      setResumeScore(data.score);
      setAtsFriendly(data.atsFriendly);
    } catch (err) {
      console.log('❌ Failed to load resume status', err);
    }
  };

  // ⏱ Initial load
  useEffect(() => {
    fetchResumeStatus();
  }, []);

  // 📄 Upload Resume
  const pickResume = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
    });

    if (result.canceled) return;

    try {
      setLoading(true);

      const file = result.assets[0];
      const response = await uploadResume(file);

      console.log('✅ Uploaded:', response);

      Alert.alert('Success', 'Resume uploaded & analyzed');

      // 🔥 REFRESH SCORE AFTER UPLOAD
      await fetchResumeStatus();

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Upload failed');
    } finally {
      setLoading(false);
    }
  };
    const onPressResume = ()=>{
    router.push("/(main)/resume");
  }
  const onProfilePress = () =>{
    router.push("/(main)/profile")
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Greeting */}
        <View style={styles.header}>
          <Text style={styles.greeting}>👋 Hi, {userName}</Text>
          <Text style={styles.subText}>Let’s improve your resume today</Text>
        </View>

        {/* Upload Resume */}
        <TouchableOpacity
          style={styles.uploadCard}
          onPress={pickResume}
          disabled={loading}
        >
          <Text style={styles.uploadIcon}>📄</Text>
          <Text style={styles.uploadTitle}>
            {loading ? 'Analyzing...' : 'Upload Resume'}
          </Text>
          <Text style={styles.uploadSub}>
            PDF or DOCX • Get instant analysis
          </Text>
        </TouchableOpacity>

        {/* Resume Status */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Resume Status</Text>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Resume Score</Text>
            <Text style={styles.statusValue}>{resumeScore} / 100</Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>ATS Friendly</Text>
            <Text
              style={[
                styles.statusValue,
                { color: atsFriendly ? '#16A34A' : '#DC2626' },
              ]}
            >
              {atsFriendly ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>
            {/* 4️⃣ Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickTitle}>Quick Actions</Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionCard} onPress={onPressResume}>
              <Text style={styles.actionIcon}>🔍</Text>
              <Text style={styles.actionText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={onProfilePress}>
              <Text style={styles.actionIcon}>🥸</Text>
              <Text style={styles.actionText}>Profile</Text>
            </TouchableOpacity>

            <View style={styles.actionCard}>
              <Text style={styles.actionIcon}>💼</Text>
              <Text style={styles.actionText}>Job Match</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F2B',
  },
  content: {
    padding: 20,
  },

  /* Header */
  header: {
    marginBottom: 25,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
  },
  subText: {
    fontSize: 16,
    color: '#B0B3C7',
    marginTop: 6,
  },

  /* Upload Card */
  uploadCard: {
    backgroundColor: '#1E234E',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  uploadSub: {
    fontSize: 14,
    color: '#B0B3C7',
    marginTop: 6,
  },

  /* Status Card */
  statusCard: {
    backgroundColor: '#151A3D',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 15,
    color: '#B0B3C7',
  },
  statusValue: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },

  /* Quick Actions */
  quickActions: {
    marginBottom: 20,
  },
  quickTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#1E234E',
    width: '30%',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  actionText: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
  },
});
