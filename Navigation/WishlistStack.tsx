import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Detail, { DetailRouteParams } from '@screens/Detail';
import Wishlist from '@screens/Wishlist';

const Stack = createNativeStackNavigator();

export type WishlistStackParamList = {
  Wishlist: undefined;
  Detail: DetailRouteParams;
};

const WishlistStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Wishlist" component={Wishlist} />
      <Stack.Screen name="Detail" component={Detail} />
    </Stack.Navigator>
  )
}

export default WishlistStack

const styles = StyleSheet.create({})