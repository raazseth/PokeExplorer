import {StyleSheet} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Search from '@screens/Search';
import Detail, { DetailRouteParams } from '@screens/Detail';

const Stack = createNativeStackNavigator();

export type SearchStackParamList = {
  Search: undefined;
  Detail: DetailRouteParams;
};

const SearchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Detail" component={Detail} />
    </Stack.Navigator>
  );
};

export default SearchStack;

const styles = StyleSheet.create({});
