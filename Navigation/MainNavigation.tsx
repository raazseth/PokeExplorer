import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import TabNavigation from './TabNavigation';
import {useSelector} from 'react-redux';
import {AuthState} from '@redux/Auth/authSlice';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  const {isAuthenticated} = useSelector(
    (state: any) => state.auth as AuthState,
  );
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {!isAuthenticated && <Stack.Screen name="Auth" component={AuthStack} />}
      <Stack.Screen name="TabNavigation" component={TabNavigation} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
