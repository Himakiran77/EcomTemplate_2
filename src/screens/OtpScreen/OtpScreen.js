import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Animated,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import Images from '../../assets/Images';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const OtpScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const route = useRoute();
  const { email } = route.params;
  const navigation = useNavigation();

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next input
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
    
    // Auto submit if last digit is entered
    if (text && index === 5) {
      handleVerify();
    }
  };

  const handleBackspace = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    navigation.navigate('MainApp');
    if (otp.some(digit => digit === '')) {
      triggerShakeAnimation();
      return;
    }

    const enteredOtp = otp.join('');
    console.log('Verifying OTP:', enteredOtp);
    Keyboard.dismiss();
  };

  const triggerShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleResend = () => {
    console.log('Resending OTP...');
    setOtp(['', '', '', '', '', '']);
    inputs.current[0].focus();
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Image 
          source={Images.KalaiLogo} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to {email}
        </Text>
      </View>

      <Animated.View 
        style={[
          styles.otpContainer, 
          { transform: [{ translateX: shakeAnim }] }
        ]}
      >
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (inputs.current[index] = ref)}
            style={[
              styles.otpInput,
              otp[index] ? styles.otpInputFilled : null
            ]}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={event => handleBackspace(event, index)}
            value={digit}
            selectTextOnFocus
            autoFocus={index === 0}
          />
        ))}
      </Animated.View>

      <TouchableOpacity 
        style={[
          styles.verifyButton,
          otp.every(digit => digit !== '') ? styles.verifyButtonActive : null
        ]} 
        onPress={handleVerify}
      >
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.timerText}>Resend code in 00:30</Text>
        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendLink}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 20,
  },
  title: {
    fontSize: width < 400 ? 24 : 28,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: width < 400 ? 14 : 16,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: width * 0.05,
  },
  otpInput: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
    fontSize: width < 400 ? 22 : 26,
    fontWeight: '600',
    color: '#2c3e50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  otpInputFilled: {
    borderColor: '#3498db',
    backgroundColor: '#e8f4fc',
  },
  verifyButton: {
    backgroundColor: '#e0e0e0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: width * 0.1,
    marginBottom: 20,
  },
  verifyButtonActive: {
    backgroundColor: '#3498db',
    shadowColor: '#2980b9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  timerText: {
    color: '#7f8c8d',
    marginBottom: 10,
  },
  resendLink: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default OtpScreen;