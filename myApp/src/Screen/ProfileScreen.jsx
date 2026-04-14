import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen({ onLogout }) {
  const handleLogout = () => {
    Alert.alert("Log out", "Do you want to go back to the login screen?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => {
          onLogout?.();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <Text style={styles.subtitle}>
        Your previous login session was taking the app straight to Home.
      </Text>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#475569",
    textAlign: "center",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
