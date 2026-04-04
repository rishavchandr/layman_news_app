import React, { useState } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthStackParamList } from '../../routes/AuthRouteNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { handleSignUp } from '../../api/Authentication';

interface SignUpErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<SignUpErrors>({});
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>()

  const validateForm = () => {
    let _errors: SignUpErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!email) _errors.email = "Email is required";
    else if (!emailRegex.test(email)) _errors.email = "Invalid email format";

    if (!password) _errors.password = "Password is required";
    else if (password.length < 6) _errors.password = "Password must be at least 6 characters";

    if (confirmPassword !== password) {
      _errors.confirmPassword = "Passwords do not match";
    }

    setErrors(_errors);
    return Object.keys(_errors).length === 0;
  };

  const SignUpPressed = async () => {
    if (validateForm()) {
      try {
         await handleSignUp(email,password)
      } catch (error) {
        Alert.alert('Failed to create Account')
      }
    }
  };

  return (
    <LinearGradient colors={['#FFDAB9', '#FF8C00']} style = {styles.gradient}>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-center px-8"
        >
          <View className="mb-8 items-center">
            <Text className="text-4xl font-bold text-black">Create Account</Text>
            <Text className="text-black opacity-60">Join us today!</Text>
          </View>

          <View className="bg-white/20 p-6 rounded-3xl">
            
            <View className="mb-4">
              <Text className="text-black font-semibold mb-2 ml-1">Email</Text>
              <TextInput
                className={`bg-white h-14 rounded-xl px-4 text-black text-base ${errors.email ? 'border border-red-600' : ''}`}
                placeholder="example@mail.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({...errors, email: undefined});
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {errors.email && <Text className="text-red-700 text-xs mt-1 font-bold">{errors.email}</Text>}
            </View>

            <View className="mb-4">
              <Text className="text-black font-semibold mb-2 ml-1">Password</Text>
              <TextInput
                className={`bg-white h-14 rounded-xl px-4 text-black text-base ${errors.password ? 'border border-red-600' : ''}`}
                placeholder="Minimum 6 characters"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({...errors, password: undefined});
                }}
                secureTextEntry
              />
              {errors.password && <Text className="text-red-700 text-xs mt-1 font-bold">{errors.password}</Text>}
            </View>

            <View className="mb-6">
              <Text className="text-black font-semibold mb-2 ml-1">Confirm Password</Text>
              <TextInput
                className={`bg-white h-14 rounded-xl px-4 text-black text-base ${errors.confirmPassword ? 'border border-red-600' : ''}`}
                placeholder="Repeat password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) setErrors({...errors, confirmPassword: undefined});
                }}
                secureTextEntry
              />
              {errors.confirmPassword && <Text className="text-red-700 text-xs mt-1 font-bold">{errors.confirmPassword}</Text>}
            </View>

            <TouchableOpacity 
              onPress={SignUpPressed}
              className="bg-black h-14 rounded-xl justify-center items-center shadow-md active:opacity-80"
            >
              <Text className="text-white font-bold text-lg">REGISTER</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-black">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text className="text-black font-bold underline">Login</Text>
              </TouchableOpacity>
            </View>
            
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default SignUpScreen;