import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Loginscreen = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const Loginhandel = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      Alert.alert("Missing details", "Please fill all the fields.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch("http://10.0.2.2:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        Alert.alert("Login failed", data.message || "Unable to login.");
        return;
      }

      if (!data.token) {
        Alert.alert("Login failed", "Login token was not returned.");
        return;
      }

      await AsyncStorage.setItem("token", data.token);

      if (data.user) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
      }

      Alert.alert("Success", "Login successful.");
      onLogin?.();
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Server error", "Could not connect to the login service.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.badge}>Map Access</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Log in to continue to your routes, saved places, and app tools.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#7b8794"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#7b8794"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            style={styles.input}
          />

          <Pressable style={styles.loginButton} onPress={Loginhandel}>
            <Text style={styles.loginButtonText}>
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </Pressable>

          <Text style={styles.footerText}>
            Use your account credentials to open the app home page after login.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Loginscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cf9f45",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 24,
  },
  heroCard: {
    backgroundColor: "#12392e",
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#f0c76f",
    color: "#173124",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 16,
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    color: "#d2e0d9",
    fontSize: 15,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: "#b7c5da",
    borderRadius: 24,
    padding: 20,
  },
  label: {
    color: "#24323f",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    height: 52,
    backgroundColor: "#fbfcfd",
    borderWidth: 1,
    borderColor: "#205fa8",
    borderRadius: 14,
    paddingHorizontal: 16,
    color: "#1f2933",
    fontSize: 15,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "#d96f43",
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  footerText: {
    marginTop: 16,
    color: "#687582",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
});
