import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  const openMapScreen = () => {
    if (navigation.getParent()) {
      navigation.getParent().navigate("map");
      return;
    }

    navigation.navigate("map");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            This is a simple home page with a clean and easy design.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Simple Design</Text>
          <Text style={styles.cardText}>
            The layout is minimal, readable, and easy to update later.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Clean Layout</Text>
          <Text style={styles.cardText}>
            You can add more sections here anytime based on your project needs.
          </Text>
        </View>

        <Pressable style={styles.button} onPress={openMapScreen}>
          <Text style={styles.buttonText}>Open Screen</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  content: {
    padding: 20,
  },
  headerCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 24,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748b",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748b",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#2563eb",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
