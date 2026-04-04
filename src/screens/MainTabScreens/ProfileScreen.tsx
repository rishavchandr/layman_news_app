import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { supabase } from '../../lib/supabase';
import { handleLogout } from '../../api/Authentication';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../routes/AuthRouteNavigator';


const ProfileScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  

const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(currentUser);
    } catch (error) {
      console.error('Profile Load Error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const onConfirmLogout = async () => {
    try {
      setLoggingOut(true);
      await handleLogout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while logging out.');
    } finally {
      setLoggingOut(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: onConfirmLogout },
    ]);
  };

  return (
    <LinearGradient colors={['#FFF5F0', '#FFFFFF']} className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-6">
          <View className="items-center mt-12 mb-10">
            <LinearGradient
              colors={['#FFDAB9', '#FF8C00']}
              className="rounded-full shadow-lg p-[3px]"
            >
              <View className="w-24 h-24 bg-white rounded-full items-center justify-center">
                <Text className="text-4xl">👤</Text>
              </View>
            </LinearGradient>

            <View className="items-center mt-6">
              <Text className="text-zinc-400 font-bold uppercase text-[10px] tracking-[2px] mb-1">
                Account Email
              </Text>
              {loading ? (
                <ActivityIndicator color="#FF8C00" className="mt-2" />
              ) : (
                <Text className="text-xl font-bold text-black tracking-tight text-center">
                  {user?.email || 'Not available'}
                </Text>
              )}
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-zinc-400 font-bold uppercase text-[10px] tracking-[2px] mb-3 ml-1">
              Coming Soon
            </Text>
            <View className="bg-white/60 rounded-[32px] p-8 border border-zinc-100 items-center border-dashed">
              <View className="bg-orange-100/50 p-3 rounded-full mb-4">
                <Text className="text-xl">🚀</Text>
              </View>
              <Text className="text-zinc-500 text-center font-medium leading-6 text-[15px]">
                We're building new ways for you to personalize your news experience. Stay tuned!
              </Text>
            </View>
          </View>

          <View className="flex-1 justify-end mb-10">
            <TouchableOpacity
              onPress={handleSignOut}
              activeOpacity={0.7}
              disabled={loggingOut}
              className="overflow-hidden rounded-3xl"
            >
              <View className="bg-zinc-100 h-16 items-center justify-center border border-zinc-200">
                {loggingOut ? (
                  <ActivityIndicator color="#FF8C00" />
                ) : (
                  <Text className="text-red-600 font-bold text-lg">Sign Out</Text>
                )}
              </View>
            </TouchableOpacity>
            <Text className="text-center text-zinc-300 text-[10px] font-bold uppercase tracking-[3px] mt-6">
              Layman v1.0.0
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ProfileScreen;