import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS, 
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../routes/AuthRouteNavigator';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width - 48;
const CIRCLE_SIZE = 64;
const SWIPE_RANGE = BUTTON_WIDTH - CIRCLE_SIZE - 12;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const translateX = useSharedValue(0);
  const context = useSharedValue(0);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  useEffect(() => {
    if (shouldNavigate) {
      setShouldNavigate(false);
      navigation.navigate('LoginScreen');
    }
  }, [shouldNavigate, navigation]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      context.value = translateX.value;
    })
    .onUpdate((event) => {
      'worklet';
      const nextValue = context.value + event.translationX;
      if (nextValue < 0) {
        translateX.value = 0;
      } else if (nextValue > SWIPE_RANGE) {
        translateX.value = SWIPE_RANGE;
      } else {
        translateX.value = nextValue;
      }
    })
    .onEnd(() => {
      'worklet';
      if (translateX.value > SWIPE_RANGE * 0.75) {
        translateX.value = withSpring(SWIPE_RANGE);
        runOnJS(setShouldNavigate)(true);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <LinearGradient colors={['#F3D5C2', '#F9B27A']} style={styles.container}>
      <View className="flex-1 items-center justify-between py-32">
        <View>
          <Text className="text-6xl font-bold tracking-tighter text-black">Layman</Text>
        </View>
        <View className="items-center px-8">
          <Text className="text-5xl font-bold text-black">Business,</Text>
          <Text className="text-5xl font-bold text-black">tech & startups</Text>
          <Text style={styles.accent}>made simple</Text>
        </View>

        <View
          className="border border-white/40 rounded-full justify-center p-1"
          style={[styles.swipeTrack, { width: BUTTON_WIDTH, height: 80 }]}
        >
          <Text className="absolute w-full text-center text-white/80 font-semibold uppercase tracking-widest text-xs">
            Swipe To Enter
          </Text>
          <GestureDetector gesture={panGesture}>
            <Animated.View
              className="rounded-full items-center justify-center"
              style={[styles.circle, { width: CIRCLE_SIZE, height: CIRCLE_SIZE }, animatedCircleStyle]}
            >
              <View className="w-3 h-3 border-r-4 border-t-4 border-black rotate-45" />
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  accent: { color: '#FF6B00', fontSize: 40, fontWeight: '900' },
  swipeTrack: { backgroundColor: '#FF6B00' },
  circle: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default WelcomeScreen;