import React, { useState } from 'react';
import {  
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../routes/AuthRouteNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { handleLogin } from '../../api/Authentication';

interface LoginErrors {
  email?: string;
  password?: string;
}

const LoginScreen = () => {
 const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>()

  const validateForm = () => {
    let _errors: LoginErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!email) _errors.email = "Email is required";
    else if (!emailRegex.test(email)) _errors.email = "Enter a valid email";

    if (!password) _errors.password = "Password is required";
    else if (password.length < 6) _errors.password = "Min 6 characters";

    setErrors(_errors);
    return Object.keys(_errors).length === 0;
  };

  const LoginPressed = async () => {
    if (validateForm()) {
      try {
        await handleLogin(email,password)
      } catch (error) {
        Alert.alert('Login Failed');
      }
    }
  };
  return (
    <LinearGradient
      colors={['#FFDAB9', '#FF8C00']} 
      style = {styles.gradient}
    >
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-center px-8"
        >

          <View className="mb-10 items-center">
            <Text className="text-4xl font-bold text-black">Welcome</Text>
            <Text className="text-black opacity-60">Sign in to your account</Text>
          </View>

          <View className="bg-white/20 p-6 rounded-3xl">
            
            <View className="mb-4">
              <Text className="text-black font-semibold mb-2 ml-1">Email</Text>
              <TextInput
                className={`bg-white h-14 rounded-xl px-4 text-black text-base ${errors.email ? 'border border-red-600' : ''}`}
                placeholder="email@example.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
              {errors.email && <Text className="text-red-700 text-xs mt-1 font-medium">{errors.email}</Text>}
            </View>

            <View className="mb-6">
              <Text className="text-black font-semibold mb-2 ml-1">Password</Text>
              <TextInput
                className={`bg-white h-14 rounded-xl px-4 text-black text-base ${errors.password ? 'border border-red-600' : ''}`}
                placeholder="••••••••"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {errors.password && <Text className="text-red-700 text-xs mt-1 font-medium">{errors.password}</Text>}
            </View>

            <TouchableOpacity 
              onPress={LoginPressed}
              className="bg-black h-14 rounded-xl justify-center items-center shadow-lg"
            >
              <Text className="text-white font-bold text-lg">LOGIN</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-black">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
                <Text className="text-black font-bold underline">Sign Up</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
export default LoginScreen