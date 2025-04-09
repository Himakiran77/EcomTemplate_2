import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from "react-native";
import Images from "../../assets/Images";

const { width, height } = Dimensions.get("window");

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(text) ? "" : "Invalid email format");
  };

  const handleResetPassword = () => {
    if (!email || emailError) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }
    Alert.alert("Success", "Password reset link sent to your email");
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
      <Image source={Images.KalaiLogo} style={styles.logo} />
      <Text style={styles.title}>Forgot Password</Text>

      <TextInput
        style={[styles.input, emailError ? styles.errorInput : null]}
        placeholder="Enter your email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={validateEmail}
        keyboardType="email-address"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backToLogin}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 20,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: height * 0.06,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: width * 0.04,
    color: "#1A202C",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  button: {
    backgroundColor: "#4299E1",
    paddingVertical: height * 0.02,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.02,
    shadowColor: "#4299E1",
    shadowOffset: {
      width: 0,
      height: 4,
    }
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backToLogin: {
    color: "#4299E1",
    fontSize: width * 0.035,
    fontWeight: "500",
    marginTop: 10,
  },
});

export default ForgotPassword;
