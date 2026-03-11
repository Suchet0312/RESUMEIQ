import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getResumeHistory, analyzeResume } from "../../services/resumeService";
import { TouchableOpacity } from "react-native";

const ResumeScreen = () => {
  type Resume = {
    id: string;
    fileUrl: string;
    score: number;
    atsFriendly: boolean;
  };

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [analysisMap, setAnalysisMap] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getResumeHistory();
        setResumes(data);
      } catch (err) {
        console.log("❌ Failed to load resume history", err);
      }
    };

    loadHistory();
  }, []);

  const handleAnalyze = async (resumeId: string) => {
    try {
      setLoading(true);

      const data = await analyzeResume();

      setAnalysisMap((prev) => ({
        ...prev,
        [resumeId]: data.analysis,
      }));
    } catch (err) {
      console.log("❌ Failed to analyze resume", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>📄 Resume History</Text>

        {resumes.length === 0 && (
          <Text style={styles.empty}>No resumes uploaded yet</Text>
        )}

        {resumes.map((resume) => (
          <View key={resume.id} style={styles.card}>
            <Text style={styles.label}>Score</Text>
            <Text style={styles.value}>{resume.score} / 100</Text>

            <Text style={styles.label}>ATS Friendly</Text>
            <Text
              style={[
                styles.value,
                { color: resume.atsFriendly ? "#16A34A" : "#DC2626" },
              ]}
            >
              {resume.atsFriendly ? "Yes" : "No"}
            </Text>

            <Text
              style={styles.link}
              onPress={() => Linking.openURL(resume.fileUrl)}
            >
              🔗 View Resume
            </Text>
            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={() => handleAnalyze(resume.id)}
            >
              <Text style={styles.analyzeText}>
                {loading ? "Analyzing..." : "🤖 Analyze Resume"}
              </Text>
            </TouchableOpacity>
            {analysisMap[resume.id] && (
              <View style={styles.analysisBox}>
                <Text style={styles.analysisTitle}>AI Feedback</Text>
                <Text style={styles.analysisText}>
                  {analysisMap[resume.id]}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResumeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F2B",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
  },
  empty: {
    color: "#B0B3C7",
    textAlign: "center",
    marginTop: 50,
  },
  card: {
    backgroundColor: "#151A3D",
    borderRadius: 14,
    padding: 18,
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    color: "#B0B3C7",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  link: {
    color: "#33E1ED",
    marginTop: 6,
  },
  analyzeButton: {
    marginTop: 12,
    backgroundColor: "#33E1ED",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  analyzeText: {
    color: "#0B0F2B",
    fontWeight: "700",
  },

  analysisBox: {
    marginTop: 12,
    backgroundColor: "#0F1335",
    padding: 12,
    borderRadius: 8,
  },

  analysisTitle: {
    color: "#33E1ED",
    fontWeight: "700",
    marginBottom: 6,
  },

  analysisText: {
    color: "#E5E7EB",
    lineHeight: 20,
  },
});
