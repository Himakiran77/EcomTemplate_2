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
  Easing,
  Alert
} from "react-native";
import Images from "../../assets/Images";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const SignUpScreen = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    employeeId: "",
    department: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    employeeId: "",
    department: "",
    password: "",
    confirmPassword: ""
  });
  
  const [isFocused, setIsFocused] = useState({
    firstName: false,
    lastName: false,
    email: false,
    employeeId: false,
    department: false,
    password: false,
    confirmPassword: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleFocus = (field) => {
    setIsFocused({...isFocused, [field]: true});
  };

  const handleBlur = (field) => {
    setIsFocused({...isFocused, [field]: false});
  };

  const validateField = (name, value) => {
    let error = "";
    
    switch(name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) error = "This field is required";
        else if (value.length < 2) error = "Minimum 2 characters";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format";
        break;
      case "password":
        if (!value.trim()) error = "Password is required";
        else if (value.length < 6) error = "Minimum 6 characters";
        else if (!/[A-Z]/.test(value)) error = "Need one uppercase letter";
        else if (!/\d/.test(value)) error = "Need one number";
        break;
      case "confirmPassword":
        if (!value.trim()) error = "Please confirm password";
        else if (value !== formData.password) error = "Passwords don't match";
        break;
    }
    
    setErrors({
      ...errors,
      [name]: error
    });
    
    return !error;
  };

  const handleSubmit = () => {
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      const valid = validateField(key, formData[key]);
      if (!valid) isValid = false;
    });
    
    if (isValid) {
      console.log("Form submitted:", formData);
      Alert.alert("Account created Successfully");
      navigation.navigate("Login", { email: formData.email });
    }
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
        
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Our E-Commerce</Text>

        <View style={styles.formContainer}>
          {/* First Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={[
                styles.input, 
                errors.firstName ? styles.errorInput : null,
                isFocused.firstName ? styles.focusedInput : null
              ]}
              placeholder="Enter your first name"
              placeholderTextColor="#A0AEC0"
              value={formData.firstName}
              onChangeText={(text) => handleChange("firstName", text)}
              onFocus={() => handleFocus("firstName")}
              onBlur={() => {
                handleBlur("firstName");
                validateField("firstName", formData.firstName);
              }}
            />
            {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
          </View>

          {/* Last Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={[
                styles.input, 
                errors.lastName ? styles.errorInput : null,
                isFocused.lastName ? styles.focusedInput : null
              ]}
              placeholder="Enter your last name"
              placeholderTextColor="#A0AEC0"
              value={formData.lastName}
              onChangeText={(text) => handleChange("lastName", text)}
              onFocus={() => handleFocus("lastName")}
              onBlur={() => {
                handleBlur("lastName");
                validateField("lastName", formData.lastName);
              }}
            />
            {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}> Email</Text>
            <TextInput
              style={[
                styles.input, 
                errors.email ? styles.errorInput : null,
                isFocused.email ? styles.focusedInput : null
              ]}
              placeholder="Enter your email"
              placeholderTextColor="#A0AEC0"
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
              onFocus={() => handleFocus("email")}
              onBlur={() => {
                handleBlur("email");
                validateField("email", formData.email);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput, 
                  errors.password ? styles.errorInput : null,
                  isFocused.password ? styles.focusedInput : null
                ]}
                placeholder="Create a password"
                placeholderTextColor="#A0AEC0"
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                onFocus={() => handleFocus("password")}
                onBlur={() => {
                  handleBlur("password");
                  validateField("password", formData.password);
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.visibilityToggle}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.visibilityText}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.passwordInput, 
                  errors.confirmPassword ? styles.errorInput : null,
                  isFocused.confirmPassword ? styles.focusedInput : null
                ]}
                placeholder="Confirm your password"
                placeholderTextColor="#A0AEC0"
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange("confirmPassword", text)}
                onFocus={() => handleFocus("confirmPassword")}
                onBlur={() => {
                  handleBlur("confirmPassword");
                  validateField("confirmPassword", formData.confirmPassword);
                }}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.visibilityToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.visibilityText}>
                  {showConfirmPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Sign In</Text>
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
  formContainer: {
    marginBottom: height * 0.02,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: height * 0.04,
  },
  loginText: {
    color: "#718096",
    fontSize: width * 0.035,
  },
  loginLink: {
    color: "#4299E1",
    fontSize: width * 0.035,
    fontWeight: "600",
    marginLeft: 5,
  },
});

export default SignUpScreen;