import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const PHRASES = [
  "أوقف التدخين",
  "أترك الفيب",
  "أتحكم بنفسي",
  "أبدأ من جديد",
  "أقدر أكمل",
  "أكسر العادة",
];

interface Props {
  color?: string;
  fontSize?: number;
}

export function AnimatedPhrases({ color = "#7A94B0", fontSize = 20 }: Props) {
  const [index, setIndex] = useState(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const animIn = () => {
    opacity.value = withTiming(1, { duration: 500 });
    translateY.value = withTiming(0, { duration: 500 });
  };

  const animOut = () => {
    opacity.value = withTiming(0, { duration: 400 });
    translateY.value = withTiming(-12, { duration: 400 });
  };

  useEffect(() => {
    animIn();

    intervalRef.current = setInterval(() => {
      animOut();
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % PHRASES.length);
        translateY.value = 12;
        animIn();
      }, 450);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.phrase,
          animStyle,
          { color, fontSize },
        ]}
      >
        {PHRASES[index]}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  phrase: {
    textAlign: "center",
    fontWeight: "500",
  },
});
