import React from 'react';
import { View, ViewStyle, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeStack from './HomeStack';
import SearchStack from './SearchStack';
import WishlistStack from './WishlistStack';
import {
  heightPixel,
  widthPixel,
  pixelSizeVertical,
} from '@utils/sizeNormalization';
import { BorderRadius, Color } from '@typed/enum';
import pokeBall from '@assets/Icons/9.svg';
import Img from '@components/Core/Img';
import { HomeStackParamList } from '@navigation/HomeStack';
import { SearchStackParamList } from '@navigation/SearchStack';
import { WishlistStackParamList } from '@navigation/WishlistStack';

const Tab = createBottomTabNavigator();

export type TabStackParamList = {
  HomeStack: HomeStackParamList;
  WishlistStack: WishlistStackParamList;
  SearchStack: SearchStackParamList;
  DisplayTypeToggle: undefined
}

export const tabBarStyle: ViewStyle = {
  height: heightPixel(72),
  marginBottom: pixelSizeVertical(20),
  width: '90%',
  alignSelf: 'center',
  backgroundColor: Color.DarkBlack,
  borderRadius: BorderRadius.Circle,
  shadowColor: '#111',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.8,
  shadowRadius: 8,
  elevation: 8,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  position: 'absolute',
  marginLeft: '5%',
  marginRight: '5%',
};

const TabIcon = ({
  name,
  focused,
  bgColor,
}: {
  name: string;
  focused: boolean;
  bgColor?: string;
}) => {
  const isMessage: boolean = name.includes('message');
  return (
    <View
      style={[
        {
          opacity: focused ? 1 : 0.5,
          backgroundColor: focused ? bgColor || Color.White : 'transparent',
          borderRadius: BorderRadius.Circle,
          height: heightPixel(isMessage ? 60 : 50),
          width: widthPixel(isMessage ? 56 : 48),
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          marginTop: Platform.OS === 'android' ? pixelSizeVertical(-32) : 0
        },
        isMessage && {
          shadowColor: 'yellow',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.8,
          shadowRadius: 8,
          elevation: 8,
        },
      ]}>
      {isMessage ? (
        <Img
          source={pokeBall}
          style={{
            width: widthPixel(48),
            height: heightPixel(50),
          }}
          resizeMode="contain"
          type="svg"
          svgProps={{
            width: widthPixel(48),
            height: heightPixel(50),
            color: focused ? Color.Primary : Color.White,
          }}
        />
      ) : (
        <MaterialCommunityIcons
          name={name}
          size={widthPixel(28)}
          color={focused ? Color.DarkBlack : Color.White}
        />
      )}
    </View>
  );
};

const TabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'home' : 'home-outline'}
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SearchStack"
        component={SearchStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="magnify" focused={focused} />
          ),
        }}
      />
    
      <Tab.Screen
        name="WishlistStack"
        component={WishlistStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'heart' : 'heart-outline'}
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
