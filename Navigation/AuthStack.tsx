import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '@screens/Auth/Login';
import Register from '@screens/Auth/Register';
import Onboarding from '@screens/Auth/Onboarding';
import ForgetPassword from '@screens/Auth/ForgetPassword';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Stack = createNativeStackNavigator();

export type AuthStackParamList = {
  TabNavigation: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgetPassword: undefined;
};

const AuthStack = () => {
  useEffect(() => {
    const INIT_GOOGLE = async () => {
      GoogleSignin.configure({
        webClientId:
          '42493050260-vb9s07hf515klauvnfui0o9i0d6atobc.apps.googleusercontent.com',
        offlineAccess: true,
        iosClientId: '42493050260-m1728k0kjv2h4b955nf1u30qg78qpijd.apps.googleusercontent.com',
      });
    };

    INIT_GOOGLE();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
    </Stack.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
