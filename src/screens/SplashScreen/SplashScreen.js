import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Images from "../../assets/Images";

const { width } = Dimensions.get("window");

const SplashScreen = () => {
  const navigation = useNavigation();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      navigation.replace("Login");
    });
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={Images.KalaiLogo}
        style={[
          styles.image,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          },
        ]}
      />
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progress,
            {
              width: progressWidth,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC", 
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 160,
    height: 160,
    resizeMode: "contain",
    marginBottom: 30,
  },
  progressBar: {
    width: width * 0.7,
    height: 12,
    backgroundColor: "#E5E7EB", 
    borderRadius: 6,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: 6,
    backgroundColor: "linear-gradient(90deg, #00c6ff, #0072ff)",
    backgroundColor: "#00C6FF",
  },
});

export default SplashScreen;
