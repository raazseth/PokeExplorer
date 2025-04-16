import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '@screens/Home';
import Search from '@screens/Search';
import Detail, { DetailRouteParams } from '@screens/Detail';
import { SearchStackParamList } from './SearchStack';

const Stack = createNativeStackNavigator();

export type HomeStackParamList = {
  Home: undefined;
  SearchStack: SearchStackParamList;
  Detail: DetailRouteParams;
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Detail" component={Detail} />
    </Stack.Navigator>
  );
};

export default HomeStack;

const styles = StyleSheet.create({});
