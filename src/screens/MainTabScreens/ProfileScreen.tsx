import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { supabase } from '../../lib/supabase';
import { handleLogout } from '../../api/Authentication';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation , CommonActions } from '@react-navigation/native';
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
      const rootNavigation = navigation.getParent();
      if (rootNavigation) {
      rootNavigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'AuthStack', 
              params: { screen: 'LoginScreen' }, 
            },
          ],
        })
      );
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    }
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
    <LinearGradient colors={['#FFF5F0', '#FFFFFF']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <LinearGradient
              colors={['#FFDAB9', '#FF8C00']}
              style={styles.avatarBorder}
            >
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarIcon}>👤</Text>
              </View>
            </LinearGradient>

            <View style={styles.emailContainer}>
              <Text style={styles.emailLabel}>ACCOUNT EMAIL</Text>
              {loading ? (
                <ActivityIndicator color="#FF8C00" />
              ) : (
                <Text style={styles.emailText}>
                  {user?.email || 'Not available'}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.comingSoonSection}>
            <Text style={styles.sectionLabel}>COMING SOON</Text>
            <View style={styles.comingSoonCard}>
              <View style={styles.rocketIconWrapper}>
                <Text style={styles.rocketIcon}>🚀</Text>
              </View>
              <Text style={styles.comingSoonText}>
                We're building new ways for you to personalize your news experience. Stay tuned!
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleSignOut}
              activeOpacity={0.7}
              disabled={loggingOut}
              style={styles.signOutButton}
            >
              <View style={styles.signOutInner}>
                {loggingOut ? (
                  <ActivityIndicator color="#FF8C00" />
                ) : (
                  <Text style={styles.signOutText}>Sign Out</Text>
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.versionText}>Layman v1.0.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1, 
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 40,
  },
  avatarBorder: {
    borderRadius: 999,
    padding: 3,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    backgroundColor: 'white',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 40,
  },
  emailContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  emailLabel: {
    color: '#a1a1aa', // zinc-400
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  comingSoonSection: {
    marginTop: 16,
  },
  sectionLabel: {
    color: '#a1a1aa',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 12,
    marginLeft: 4,
  },
  comingSoonCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: '#f4f4f5',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  rocketIconWrapper: {
    backgroundColor: 'rgba(255,140,0,0.1)',
    padding: 12,
    borderRadius: 999,
    marginBottom: 16,
  },
  rocketIcon: {
    fontSize: 24,
  },
  comingSoonText: {
    color: '#71717a',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
    fontSize: 15,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  signOutButton: {
    overflow: 'hidden',
    borderRadius: 24,
  },
  signOutInner: {
    backgroundColor: '#f4f4f5',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  signOutText: {
    color: '#dc2626',
    fontWeight: 'bold',
    fontSize: 18,
  },
  versionText: {
    textAlign: 'center',
    color: '#d4d4d8',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginTop: 24,
  },
});

export default ProfileScreen;