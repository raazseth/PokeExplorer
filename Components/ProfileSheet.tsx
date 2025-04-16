import { AuthState, handleSheetView, logout } from '@redux/Auth/authSlice';
import React, { FC } from 'react';
import { View, StyleSheet, Linking, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Img from './Core/Img';
import {
  fontPixel,
  heightPixel,
  pixelSizeVertical,
  widthPixel,
} from '@utils/sizeNormalization';
import getUserName from '@utils/getUserName';
import { BorderRadius, BottomSheetViewTypes, Color, TextVariant } from '@typed/enum';
import Typography from './Core/Typography';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { AppDispatch } from '@redux/store';

const ProfileSheet: FC = () => {
  const auth = useSelector((state: any) => state.auth as AuthState);
  const { displayName, email, photoURL, metadata } = auth?.user || {};
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logout())
          setTimeout(() => {
            navigation.navigate("Auth")
            dispatch(handleSheetView(BottomSheetViewTypes.Close))
          }, 1000);
        },
      },
    ]);
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open link', err),
    );
  };

  return (
    <View style={styles.contentContainer}>
      <Img
        source={photoURL ? photoURL : require('@assets/Icons/pikachu.png')}
        style={{ width: widthPixel(82), height: heightPixel(84) }}
        resizeMode="contain"
        variant={photoURL ? 'circle' : 'none'}
      />
      <Typography variant={TextVariant.Heading} style={styles.greeting}>
        {displayName || getUserName()}
      </Typography>
      <Typography style={styles.email}>{email}</Typography>
      <View style={styles.divider} />

      <View style={styles.linkRow}>
        <Icon name="heart" size={widthPixel(19)} color={Color.Dark} />
        <Typography
          variant={TextVariant.Link}
          style={styles.link}
          onPress={() => navigation.navigate('WishlistStack')}>
          Your Wishlist
        </Typography>
      </View>

      <View style={styles.linkRow}>
        <Icon name="file-text" size={widthPixel(19)} color={Color.Dark} />
        <Typography
          variant={TextVariant.Link}
          style={styles.link}
          onPress={() => openLink('https://rajseth.in')}>
          Terms of Service
        </Typography>
      </View>

      <View style={styles.linkRow}>
        <Icon name="shield" size={widthPixel(19)} color={Color.Dark} />
        <Typography
          variant={TextVariant.Link}
          style={styles.link}
          onPress={() => openLink('https://rajseth.in')}>
          Privacy Policy
        </Typography>
      </View>

      <Typography onPress={handleLogout} style={styles.logoutText}>
        Logout
      </Typography>
      <View style={styles.metaBox}>
        {metadata?.creationTime && (
          <Typography
            variant={TextVariant.Caption}
            color={Color.Dark}
            style={{ opacity: 0.5 }}>
            Account created on,{' '}
            {new Date(metadata.creationTime ?? '').toLocaleString()}
          </Typography>
        )}
        {metadata?.lastSignInTime && (
          <Typography
            variant={TextVariant.Caption}
            color={Color.Dark}
            style={{ opacity: 0.5, marginTop: 2 }}>
            Last Login,{' '}
            {new Date(metadata.lastSignInTime ?? '').toLocaleString()}
          </Typography>
        )}
      </View>
    </View>
  );
};

export default ProfileSheet;

const styles = StyleSheet.create({
  contentContainer: {
    padding: widthPixel(20),
    backgroundColor: '#fff',
    flex: 1,
  },
  greeting: {
    fontSize: fontPixel(32),
    fontWeight: 'bold',
    color: '#333',
    marginTop: pixelSizeVertical(6),
  },
  email: {
    color: '#666',
    fontSize: fontPixel(15),
    marginBottom: pixelSizeVertical(4),
    marginTop: pixelSizeVertical(4),
  },
  metaBox: {
    marginVertical: pixelSizeVertical(10),
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: pixelSizeVertical(12),
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pixelSizeVertical(10),
    backgroundColor: 'rgba(134, 132, 123, 0.1)',
    paddingHorizontal: widthPixel(12),
    paddingVertical: heightPixel(16),
    borderRadius: BorderRadius.Small,
  },
  link: {
    fontSize: fontPixel(17),
    textDecorationLine: 'none',
    marginLeft: widthPixel(6),
    color: Color.Dark,
  },
  logoutText: {
    color: 'orangered',
    fontSize: fontPixel(18),
  },
});
