import { Alert, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { IPokemon } from '@typed/index';
import Typography from './Core/Typography';
import Img from './Core/Img';
import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@utils/sizeNormalization';
import { BorderRadius, Color, FontSize, TextVariant, Variant } from '@typed/enum';
import Button from './Core/Button';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ProgressBar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AuthState, setWishlist } from '@redux/Auth/authSlice';
import { getWishlistFromLocal } from '@redux/Auth/helper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getBgColor, getTypeColor, statColors } from '@utils/Pokemon';
import { AppDispatch } from '@redux/store';

interface IPokemonCardProps {
  pokemon: IPokemon;
  onPress?: () => void;
  isLoading?: boolean;
  displayType?: 'single' | 'list';
  isFavorite?: boolean;
  isDetail?: boolean;
}

const PokemonCard = (props: IPokemonCardProps) => {
  const { pokemon, displayType, isFavorite = false, isDetail } = props;
  const auth = useSelector((state: any) => state.auth as AuthState);
  const [isList, setisList] = useState(displayType === 'list');
  const [isLoading, setisLoading] = useState(false);
  const backgroundColor = getBgColor(pokemon.types[0]?.type.name || 'normal');
  const [fav, setFav] = useState(isFavorite);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const route = useRoute();

  useEffect(() => {
    if (route.name === 'Home') {
      setisList(auth.displayType === 'list');
    } else {
      setisList(true);
    }

    setFav(auth.wishlist.includes(pokemon?.id));
  }, [auth.displayType, auth.wishlist]);

  const handleWishlist = async () => {
    try {
      setisLoading(true);
      let currentWishlist = await getWishlistFromLocal();
      currentWishlist = currentWishlist || [];

      let updatedWishlist;

      if (fav) {
        updatedWishlist = currentWishlist.filter(
          (iWish: any) => iWish !== pokemon.id,
        );
      } else {
        updatedWishlist = [...currentWishlist, pokemon.id];
      }

      dispatch(setWishlist(updatedWishlist));
    } catch (error) {
      setFav(false);
      Alert.alert('Something went wrong!');
    } finally {
      setisLoading(false);
    }
  };

  if (isList) {
    return (
      <TouchableOpacity
        style={[styles.listContainer, { shadowColor: backgroundColor }]}
        onPress={() => {
          navigation.navigate('Detail', { id: pokemon?.id });
        }}
        activeOpacity={0.5}>
        <View style={styles.imageWrapper}>
          <Img
            source={pokemon.sprites.other?.dream_world?.front_default}
            type="svg"
            containerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: backgroundColor,
              padding: heightPixel(10),
              borderRadius: BorderRadius.Medium,
              width: widthPixel(120),
              height: heightPixel(120),
            }}
            svgProps={{
              width: widthPixel(100),
              height: heightPixel(100),
            }}
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Typography
              variant={TextVariant.Subheading}
              style={{
                fontWeight: 'bold',
                fontSize: FontSize['2xl'],
              }}>
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </Typography>
            <Typography
              variant={TextVariant.Subheading}
              style={{
                color: Color.TextPrimary,
                fontWeight: 'bold',
                marginTop: 'auto',
                marginLeft: pixelSizeHorizontal(4),
              }}>
              #{pokemon.id}
            </Typography>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: pixelSizeVertical(4),
              gap: 6,
            }}>
            {pokemon.types.map((type, index) => (
              <View key={index} style={[styles.typeBadge, { shadowRadius: 2.5 }]}>
                <View
                  style={{
                    height: heightPixel(8),
                    width: widthPixel(8),
                    backgroundColor: getTypeColor(type.type?.name)
                      .backgroundColor,
                    borderRadius: BorderRadius.Circle,
                    marginRight: pixelSizeHorizontal(4),
                  }}
                />
                <Typography
                  variant={TextVariant.Body}
                  style={{
                    fontWeight: 'bold',
                    color: getTypeColor(type.type?.name).textColor,
                  }}>
                  {type.type?.name?.toUpperCase()}
                </Typography>
              </View>
            ))}
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: pixelSizeVertical(5),
              marginBottom: 'auto',
            }}>
            {[
              { label: 'HP', index: 0 },
              { label: 'ATK', index: 1 },
              { label: 'DEF', index: 2 },
            ].map(({ label, index }) => {
              const statValue = pokemon?.stats?.[index]?.base_stat ?? 0;
              return (
                <View
                  key={label}
                  style={{ flex: 1, marginHorizontal: pixelSizeHorizontal(6) }}>
                  <Typography
                    variant={TextVariant.Caption}
                    style={{ color: '#000' }}>
                    {label}
                  </Typography>
                  <ProgressBar
                    progress={statValue / 100}
                    color={statColors[index]}
                    style={{
                      height: heightPixel(8),
                      borderRadius: BorderRadius.XSmall,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      marginVertical: pixelSizeVertical(4),
                    }}
                  />
                  <Typography
                    variant={TextVariant.Caption}
                    style={{ color: '#000' }}>
                    {statValue}
                  </Typography>
                </View>
              );
            })}
          </View>
        </View>
        <Button
          variant={Variant.Transparent}
          borderRadius={BorderRadius.Circle}
          isLoading={isLoading}
          onPress={() => {
            if (!isLoading) {
              setFav(!fav);
              handleWishlist();
            }
          }}
          style={{
            position: 'absolute',
            top: pixelSizeVertical(10),
            right: pixelSizeHorizontal(10),
            width: widthPixel(30),
            height: heightPixel(30),
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            backgroundColor: fav ? 'orangered' : 'transparent',
            borderColor: fav ? 'orangered' : Color.Dark,
            opacity: fav ? 1 : 0.6,
          }}>
          <AntDesign
            name={fav ? 'heart' : 'hearto'}
            size={widthPixel(17)}
            style={{
              position: 'absolute',
            }}
            color={fav ? Color.White : Color.Dark}
          />
        </Button>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Detail', { id: pokemon?.id });
      }}
      activeOpacity={0.5}
      style={[styles.container, { shadowColor: backgroundColor, zIndex: 1 }]}>
      <View
        pointerEvents="box-none"
        style={[
          styles.contentContainer,
          {
            backgroundColor: backgroundColor,
          },
        ]}>
        <Img
          source={pokemon.sprites.other?.dream_world?.front_default}
          resizeMode="cover"
          type="svg"
          containerStyle={{
            marginLeft: 'auto',
            display: 'flex',
            marginRight: 'auto',
            marginTop: 'auto',
            width: widthPixel(300),
            height: heightPixel(300),
            zIndex: -1,
          }}
          onPress={() => {
            navigation.navigate('Detail', { id: pokemon?.id });
          }}
          svgProps={{
            width: widthPixel(300),
            height: heightPixel(300),
          }}
        />
        <Button
          variant={Variant.Transparent}
          borderRadius={BorderRadius.Circle}
          isLoading={isLoading}
          onPress={() => {
            if (!isLoading) {
              setFav(!fav);
              handleWishlist();
            }
          }}
          style={{
            width: widthPixel(45),
            height: heightPixel(47),
            position: 'absolute',
            right: pixelSizeHorizontal(10),
            top: pixelSizeVertical(10),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: fav ? 'orangered' : Color.Dark,
            opacity: fav ? 1 : 0.5,
            backgroundColor: fav ? 'orangered' : 'transparent',
          }}>
          <AntDesign
            name={fav ? 'heart' : 'hearto'}
            size={17}
            color={fav ? Color.White : Color.Dark}
          />
        </Button>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: pixelSizeVertical(4),
          }}>
          <Typography
            variant={TextVariant.XlHeading}
            color={Color.White}
            onPress={() => {
              navigation.navigate('Detail', { id: pokemon?.id });
            }}
            style={styles.name}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Typography>
          <Typography variant={TextVariant.Subheading} style={styles.id}>
            #{pokemon.id}
          </Typography>
        </View>

        <View style={styles.typesContainer}>
          {pokemon?.types.map((type, index) => (
            <View key={index} style={styles.typeBadge}>
              <View
                style={{
                  height: 8,
                  width: 8,
                  backgroundColor: getTypeColor(type.type?.name)
                    .backgroundColor,
                  borderRadius: BorderRadius.Circle,
                  marginRight: pixelSizeHorizontal(4),
                }}
              />
              <Typography
                variant={TextVariant.Body}
                style={{
                  fontWeight: 'bold',
                  color: getTypeColor(type.type?.name).textColor,
                }}>
                {type.type?.name?.toUpperCase()}
              </Typography>
            </View>
          ))}
        </View>

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradientOverlay}
        />

        <View style={styles.statsContainer}>
          {['HP', 'ATK', 'DEF'].map((label, index) => (
            <View
              key={label}
              style={{ flex: 1, marginHorizontal: pixelSizeHorizontal(6) }}>
              <Typography variant={TextVariant.Caption} style={{ color: '#fff' }}>
                {label}
              </Typography>
              <ProgressBar
                progress={pokemon?.stats[index]?.base_stat / 100}
                color={statColors[index]}
                style={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  marginVertical: 4,
                }}
              />
              <Typography variant={TextVariant.Caption} style={{ color: '#fff' }}>
                {pokemon?.stats[index]?.base_stat}
              </Typography>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PokemonCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    borderRadius: BorderRadius.Medium,
    height: heightPixel(550),
    marginTop: Platform.OS === 'ios' ? pixelSizeVertical(8) : 0,
    width: '100%',
  },
  contentContainer: {
    padding: heightPixel(10),
    borderRadius: BorderRadius.Medium,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: heightPixel(550),
    marginBottom: heightPixel(72),
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: heightPixel(180),
    borderBottomLeftRadius: BorderRadius.Medium,
    borderBottomRightRadius: BorderRadius.Medium,
    zIndex: -1,
  },
  listContainer: {
    flexDirection: 'row',
    padding: pixelSizeHorizontal(10),
    marginVertical: pixelSizeVertical(8),
    backgroundColor: '#fff',
    borderRadius: BorderRadius.Medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    alignItems: 'center',
    position: 'relative',
    height: heightPixel(140),
    width: '90%',
  },
  imageWrapper: {
    marginRight: pixelSizeHorizontal(10),
  },
  name: {
    marginTop: pixelSizeVertical(18),
    fontWeight: 'bold',
    fontSize: FontSize['6xl'],
  },
  id: {
    color: Color.TextPrimary,
    fontWeight: 'bold',
    marginTop: 'auto',
    marginBottom: pixelSizeVertical(4),
    marginLeft: pixelSizeHorizontal(4),
  },
  typesContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: pixelSizeVertical(8),
    marginTop: pixelSizeVertical(4),
  },
  typeBadge: {
    borderRadius: BorderRadius.ExtraLarge,
    paddingHorizontal: pixelSizeHorizontal(12),
    paddingVertical: pixelSizeVertical(4),
    backgroundColor: Color.White,
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeText: {
    color: 'azure',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: pixelSizeHorizontal(10),
    marginTop: pixelSizeVertical(5),
    marginBottom: 'auto',
  },
});
