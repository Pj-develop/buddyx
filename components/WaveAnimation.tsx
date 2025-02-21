import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

interface WaveProps {
  isRecording: boolean;
}

export default function WaveAnimation({ isRecording }: WaveProps) {
  const bars = Array.from({ length: 5 }, (_, index) => {
    const animatedStyle = useAnimatedStyle(() => {
      if (!isRecording) return { height: 20 };
      
      return {
        height: withRepeat(
          withDelay(
            index * 100,
            withSequence(
              withTiming(60, { duration: 500 }),
              withTiming(20, { duration: 500 })
            )
          ),
          -1,
          true
        ),
      };
    });

    return (
      <Animated.View
        key={index}
        style={[styles.bar, animatedStyle]}
      />
    );
  });

  return (
    <View style={styles.container}>
      {bars}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 4,
  },
  bar: {
    width: 4,
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
});