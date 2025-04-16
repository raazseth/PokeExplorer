import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Keyboard, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Typography from '@components/Core/Typography';
import {
  BorderRadius,
  BottomSheetViewTypes,
  Color,
  TextVariant,
} from '@typed/enum';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Img from '@components/Core/Img';
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@utils/sizeNormalization';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getPokemonDetails } from '@services/Pokemon';
import { debounce } from 'lodash';
import { AuthState, handleSheetView, setDisplayType, setSearch } from '@redux/Auth/authSlice';
import getUserName from '@utils/getUserName';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';
import { getNYCGreeting } from '@utils/misc';
import { tabBarStyle } from '@navigation/TabNavigation';
import { AppDispatch } from '@redux/store';

export interface IHeader {
  searchEnabled?: boolean;
}

const Header = ({ searchEnabled = false }: IHeader) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const auth = useSelector((state: any) => state.auth as AuthState);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isList, setisList] = useState<boolean>(auth.displayType === 'list');
  const [isLoadingDisplay, setisLoadingDisplay] = useState<boolean>(false)
  const [greeting, setGreeting] = useState<string>(getNYCGreeting());
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getNYCGreeting());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        try {
          const result = await getPokemonDetails(query);
          dispatch(setSearch([result]));
        } catch (err) {
          dispatch(setSearch([]));
        }
      }, 500),
    [],
  );

  useEffect(() => {
    if (searchValue) {
      debouncedSearch(searchValue);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchValue, debouncedSearch]);

  useEffect(() => {
    const showKey = Keyboard.addListener('keyboardDidShow', () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none', height: 0 },
        tabBarVisible: false,
      });
    });

    const hideKey = Keyboard.addListener('keyboardDidHide', () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: tabBarStyle,
        tabBarVisible: true,
      });
    });

    return () => {
      showKey.remove();
      hideKey.remove();
    };
  }, []);

  const firstName = auth.user?.displayName?.split(' ')[0] || getUserName();

  const changeBottomSheet = (value: BottomSheetViewTypes) => {
    if (auth.bottomSheet !== value) {
      dispatch(handleSheetView(value));
    }
  };

  const handleToggleDisplay = () => {
    setisLoadingDisplay(true);

    if (auth.displayType === 'list') {
      dispatch(setDisplayType('single'));
    } else {
      dispatch(setDisplayType('list'));
    }

    setTimeout(() => {
      setisLoadingDisplay(false);
      setisList((prev) => !prev);
    }, 1000);
  };

  return (
    <View>
      <View style={styles.profileContainer}>
        <View>
          <Typography variant={TextVariant.Heading} style={styles.greeting}>
            Hello, {firstName} 👋
          </Typography>
          <Typography variant={TextVariant.Caption} style={styles.welcome}>
            {greeting}
          </Typography>
        </View>
        <Img
          source={
            auth.user?.photoURL
              ? auth.user.photoURL
              : require('@assets/Icons/pikachu.png')
          }
          onPress={() => {
            changeBottomSheet(BottomSheetViewTypes.Profile);
          }}
          style={styles.image}
          variant={auth.user?.photoURL ? "circle" : "none"}
          resizeMode="contain"
        />
      </View>

      <View style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        marginHorizontal: "auto",
        alignItems: "center"
      }}>
        <Pressable
          style={[styles.searchContainer]}
          onPress={() => navigation.navigate('SearchStack')}>
          <Ionicons name="search" size={widthPixel(20)} color={Color.Secondary} />
          <TextInput
            style={styles.input}
            placeholder="Search Pokémon..."
            placeholderTextColor="#aaa"
            editable={searchEnabled}
            onChangeText={text => setSearchValue(text)}
            value={searchValue}
          />
        </Pressable>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={handleToggleDisplay}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isList ? Color.White : Color.DarkBlack,
            borderRadius: BorderRadius.Circle,
            height: heightPixel(48),
            width: widthPixel(48),
            padding: heightPixel(8),
            marginTop: pixelSizeVertical(8)
          }}
        >
          {
            isLoadingDisplay ?
              <ActivityIndicator size={widthPixel(20)} color={Color.Primary} />
              : <MaterialCommunityIcons
                name={isList ? 'view-grid' : 'view-list'}
                size={widthPixel(28)}
                color={isList ? Color.DarkBlack : Color.White}
              />
          }
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pixelSizeHorizontal(16),
    paddingVertical: pixelSizeVertical(10),
    backgroundColor: '#f4f6f8',
  },
  greeting: {
    fontSize: fontPixel(20),
    fontWeight: 'bold',
    color: '#333',
    marginTop: pixelSizeVertical(6),
  },
  welcome: {
    fontSize: fontPixel(16),
    color: '#666',
    opacity: 0.8,
    marginTop: heightPixel(2),
  },
  image: {
    width: widthPixel(48),
    height: heightPixel(50),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.White,
    borderRadius: BorderRadius.Circle,
    paddingHorizontal: pixelSizeHorizontal(12),
    paddingVertical: pixelSizeVertical(6),
    width: '84%',
    alignSelf: 'center',
    height: heightPixel(Platform.OS === 'ios' ? 48 : 52),
    marginTop: pixelSizeVertical(10),
  },
  input: {
    flex: 1,
    fontSize: fontPixel(16),
    color: '#333',
    marginLeft: pixelSizeHorizontal(10),
  },
});
