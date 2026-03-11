import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  TextInput,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { registerUser, loginUser } from '../../services/authService';
import { saveToken } from '../../services/storage';
import { router } from 'expo-router';

const login = () => {
  const [clicked, setclicked] = useState(false);
  const sliderAnim = useState(new Animated.Value(0))[0];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isFormValid = clicked
    ? Boolean(email.trim() && password.trim())
    : Boolean(
        email.trim() &&
          password.trim() &&
          confirmPassword.trim() &&
          password === confirmPassword
      );

  const moveToSignUp = () => {
    setclicked(false);
    Animated.timing(sliderAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const moveToSignIn = () => {
    setclicked(true);
    Animated.timing(sliderAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSubmit = async () => {
    try {
      if (!isFormValid) {
        Alert.alert('Invalid input');
        return;
      }

      if (clicked) {
        // 🔥 SIGN IN
        const token = await loginUser(email, password);

        // 🔥 THIS WAS MISSING
        await saveToken(token);

        console.log('✅ JWT SAVED:', token);

        router.replace('/(main)');
      } else {
        // SIGN UP
        await registerUser(email, password);
        Alert.alert('Registered successfully');
        setclicked(true);
        moveToSignIn();
      }
    } catch (error) {
      console.log('❌ LOGIN ERROR:', error);
      Alert.alert('Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imagee}>
        <Image
          source={require('../../assets/images/logop.jpeg')}
          style={styles.logo}
        />
        <Text style={styles.texti}>Resume IQ</Text>
      </View>

      <View style={styles.btn}>
        <Animated.View
          style={[
            styles.slider,
            {
              transform: [
                {
                  translateX: sliderAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 150],
                  }),
                },
              ],
            },
          ]}
        />
        <TouchableOpacity style={styles.tab} onPress={moveToSignUp}>
          <Text style={styles.tabText}>SIGN UP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={moveToSignIn}>
          <Text style={styles.tabText}>SIGN IN</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>
          {clicked ? 'Welcome Back' : 'Create Account'}
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {!clicked && (
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        )}

        {!clicked &&
          confirmPassword.length > 0 &&
          password !== confirmPassword && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}

        <TouchableOpacity
          style={[styles.submitBtn, !isFormValid && styles.disabledBtn]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.submitText}>
            {clicked ? 'SIGN IN' : 'SIGN UP'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/* styles unchanged */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F2B',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  imagee: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  texti: {
    color: 'white',
    marginLeft: 8,
    fontSize: 30,
    fontWeight: '600',
  },
  btn: {
    flexDirection: 'row',
    position: 'relative',
    marginTop: 40,
    width: 300,
    height: 40,
    backgroundColor: '#151A3D',
    borderRadius: 20,
  },
  slider: {
    position: 'absolute',
    width: 150,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 20,
  },
  tab: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tabText: {
    color: 'white',
    fontWeight: '500',
  },
  form: {
    width: 300,
    backgroundColor: 'white',
    marginTop: 40,
    borderRadius: 12,
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: '#33E1ED',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#0B0F2B',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledBtn: {
    opacity: 0.6,
    backgroundColor: '#9CA3AF',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 6,
  },
});

export default login;
