import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing
} from "react-native";
import Images from "../../assets/Images";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const [animValue] = useState(new Animated.Value(0));
  
  const animateLogo = () => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 800,
      easing: Easing.elastic(1),
      useNativeDriver: true
    }).start();
  };

  React.useEffect(() => {
    animateLogo();
  }, []);

  const logoScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1]
  });

  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(text) ? "" : "Invalid email format");
  };

  const validatePassword = (text) => {
    setPassword(text);
    setPasswordError(text.length >= 6 ? "" : "Password must be at least 6 characters");
  };

  const handleFocus = (field) => {
    setIsFocused({...isFocused, [field]: true});
  };

  const handleBlur = (field) => {
    setIsFocused({...isFocused, [field]: false});
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    let valid = true;
    
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }
  
    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      valid = false;
    } else if (!/\d/.test(password)) {
      setPasswordError("Password must contain at least one number");
      valid = false;
    } else {
      setPasswordError("");
    }
  
    if (valid) {
      console.log("Login successful");
      navigation.navigate("Otp", {email: email});
    }
  };

  const handleForgetPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
          <Image source={Images.KalaiLogo} style={styles.logo} />
        </Animated.View>
        
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>E-Commerce platform</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={[
              styles.input, 
              emailError ? styles.errorInput : null,
              isFocused.email ? styles.focusedInput : null
            ]}
            placeholder="Enter your email"
            placeholderTextColor="#A0AEC0"
            value={email}
            onChangeText={validateEmail}
            onFocus={() => handleFocus('email')}
            onBlur={() => handleBlur('email')}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.passwordInput, 
                passwordError ? styles.errorInput : null,
                isFocused.password ? styles.focusedInput : null
              ]}
              placeholder="Enter your password"
              placeholderTextColor="#A0AEC0"
              value={password}
              onChangeText={validatePassword}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.visibilityToggle}
              onPress={togglePasswordVisibility}
            >
              <Text style={styles.visibilityText}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleForgetPassword}
          style={styles.forgotPasswordButton}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: width * 0.08,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: "contain",
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#2D3748",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: "#718096",
    textAlign: "center",
    marginBottom: height * 0.05,
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  inputLabel: {
    fontSize: width * 0.035,
    color: "#4A5568",
    marginBottom: 8,
    fontWeight: "500",
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  passwordInput: {
    flex: 1,
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
  visibilityToggle: {
    position: "absolute",
    right: 15,
    padding: 8,
  },
  visibilityText: {
    color: "#4299E1",
    fontSize: width * 0.035,
    fontWeight: "500",
  },
  focusedInput: {
    borderColor: "#4299E1",
    shadowColor: "#4299E1",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  errorInput: {
    borderColor: "#F56565",
  },
  errorText: {
    color: "#F56565",
    fontSize: width * 0.03,
    marginTop: 5,
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
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
  forgotPasswordButton: {
    alignSelf: "center",
    marginTop: height * 0.02,
  },
  forgotPasswordText: {
    color: "#4299E1",
    fontSize: width * 0.035,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: height * 0.05,
  },
  footerText: {
    color: "#718096",
    fontSize: width * 0.035,
  },
  footerLink: {
    color: "#4299E1",
    fontSize: width * 0.035,
    fontWeight: "600",
    marginLeft: 5,
  },
});

export default LoginScreen;