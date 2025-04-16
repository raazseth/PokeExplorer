import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { PokemonAbility, PokemonMove, PokemonStats } from '@typed/index';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Typography from '@core/Typography';
import Button from '@core/Button';
import Img from '@core/Img';
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@utils/sizeNormalization';
import {
  BorderRadius,
  BottomSheetViewTypes,
  Color,
  FontSize,
  TextVariant,
  Variant,
} from '@typed/enum';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ProgressBar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AuthState, handleSheetView, setWishlist } from '@redux/Auth/authSlice';
import { getWishlistFromLocal } from '@redux/Auth/helper';
import { getBgColor, getTypeColor, statsColors } from '@utils/Pokemon';
import { usePokemonDetails, usePokemonProfile } from '@hooks/usePokemon';
import ScreenLoader from '@components/ScreenLoader';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheetBox from '@components/BottomSheetBox';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import Curve from '@assets/Images/curve.svg';
import useHideBottomBar from '@hooks/useHideBottomBar';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AppDispatch } from '@redux/store';

export interface DetailRouteParams {
  id: string | number;
  isQuiz?: boolean
}

const Detail = () => {
  const route = useRoute<RouteProp<Record<string, DetailRouteParams>, string>>();
  const IDENTIFIER = route?.params?.id ?? '';
  const [identifier, setIdentifier] = useState<string | number>(IDENTIFIER);
  const { data: pokemon, isLoading } = usePokemonDetails(identifier);
  const { data: aiProfile, isLoading: isAiLoading } =
    usePokemonProfile(identifier);
  const [isQuiz, setisQuiz] = useState(route.params.isQuiz || false)
  const auth = useSelector((state: any) => state.auth as AuthState);
  const [fav, setFav] = useState<boolean>(false);
  const [bgColor, setbgColor] = useState<string>('normal');
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const sheetRef = useRef<BottomSheetMethods | null>(null);
  const insets = useSafeAreaInsets();

  useHideBottomBar()

  useEffect(() => {
    if (auth.wishlist.length > 0) {
      setFav(auth.wishlist.includes(pokemon?.id));
    }

    if (!pokemon || !pokemon.types) return;
    setbgColor(getBgColor(pokemon.types[0]?.type.name || 'normal'));
  }, [pokemon]);

  if (isLoading) return <ScreenLoader open={true} />;

  if (!identifier) {
    return navigation.goBack()
  }

  const statIcons: Record<string, string> = {
    hp: require('@assets/Icons/heart.png'),
    attack: require('@assets/Icons/sword.png'),
    defense: require('@assets/Icons/defence.png'),
    'special-attack': require('@assets/Icons/explosion.png'),
    'special-defense': require('@assets/Icons/award.png'),
    speed: require('@assets/Icons/lightning.png'),
  };

  const handleWishlist = async () => {
    try {
      let currentWishlist = await getWishlistFromLocal();
      currentWishlist = currentWishlist || [];

      let updatedWishlist;

      if (fav) {
        updatedWishlist = currentWishlist.filter(
          (iWish: any) => iWish !== pokemon?.id,
        );
      } else {
        updatedWishlist = [...currentWishlist, pokemon?.id];
      }

      dispatch(setWishlist(updatedWishlist));
    } catch (error) {
      setFav(false);
      Alert.alert('Something went wrong!');
    }
  };

  const handleJoinQuiz = () => {
    if (auth.bottomSheet === BottomSheetViewTypes.Close) {
      dispatch(handleSheetView(BottomSheetViewTypes.Details));
      // console.log("handleJoinQuiz:Details")
    } else {
      // console.log("handleJoinQuiz:Close")
      dispatch(handleSheetView(BottomSheetViewTypes.Close));
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: '#fff' }}>
      <View style={{ position: "relative", paddingTop: insets.top }}>
        <View
          style={{
            backgroundColor: bgColor,
            borderBottomLeftRadius: heightPixel(200),
            borderBottomRightRadius: heightPixel(200),
            height: heightPixel(390),
            overflow: 'hidden',
          }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack()
                dispatch(handleSheetView(BottomSheetViewTypes.Close));
              }}
              style={{
                marginLeft: pixelSizeHorizontal(4),
                marginTop: pixelSizeVertical(-10),
              }}>
              <FontAwesome
                name="angle-left"
                size={widthPixel(32)}
                color={Color.Dark}
              />
            </TouchableOpacity>

            <Button
              variant={Variant.Transparent}
              borderRadius={BorderRadius.Circle}
              onPress={() => {
                setFav(!fav);
                handleWishlist();
              }}
              style={{
                width: widthPixel(45),
                height: heightPixel(47),
                borderColor: fav ? 'orangered' : Color.Dark,
                opacity: fav ? 1 : 0.5,
                backgroundColor: fav ? 'orangered' : 'transparent',
              }}>
              <AntDesign
                name={fav ? 'heart' : 'hearto'}
                size={widthPixel(20)}
                color={fav ? Color.White : Color.Dark}
                style={{ position: 'absolute' }}
              />
            </Button>
          </View>
          <Img
            source={pokemon.sprites?.other?.dream_world?.front_default}
            resizeMode="cover"
            type="svg"
            containerStyle={{
              marginLeft: 'auto',
              display: 'flex',
              marginRight: 'auto',
              width: widthPixel(270),
              height: heightPixel(270),
            }}
            svgProps={{
              width: widthPixel(270),
              height: heightPixel(270),
            }}
            onPress={handleJoinQuiz}
          />
        </View>

        <Button
          variant={Variant.Primary}
          borderRadius={BorderRadius.Circle}
          onPress={() => {
            if (identifier !== 1) {
              setIdentifier((prev: any) => prev - 1);
              setisQuiz(false)
            }
          }}
          style={{
            width: widthPixel(45),
            height: heightPixel(47),
            position: 'absolute',
            left: pixelSizeHorizontal(12),
            top: '70%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Color.White,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <FontAwesome
            name={'angle-left'}
            size={widthPixel(28)}
            color={Color.TextPrimary}
            style={{ position: 'absolute', marginLeft: pixelSizeHorizontal(-4) }}
          />
        </Button>
        <Button
          variant={Variant.Primary}
          borderRadius={BorderRadius.Circle}
          onPress={() => {
            setIdentifier((prev: any) => prev + 1);
            setisQuiz(false)
          }}
          style={{
            width: widthPixel(45),
            height: heightPixel(47),
            position: 'absolute',
            right: pixelSizeHorizontal(12),
            top: '70%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Color.White,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <FontAwesome
            name={'angle-right'}
            size={widthPixel(28)}
            color={Color.TextPrimary}
            style={{ position: 'absolute', marginRight: pixelSizeHorizontal(-4) }}
          />
        </Button>

      </View>
      <View style={styles.content}>
        <View
          style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 }}>
          <Typography variant={TextVariant.XlHeading} style={styles.name}>
            {pokemon?.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Typography>
          <Typography variant={TextVariant.Subheading} style={styles.id}>
            #{pokemon.id}
          </Typography>
          {!isAiLoading && (
            <TouchableOpacity
              onPress={handleJoinQuiz}
              style={[
                styles.typeBadge,
                { marginLeft: 'auto', backgroundColor: Color.Dark },
              ]}>
              <Typography style={{ fontSize: fontPixel(16), color: Color.White }}>
                Join Quiz
              </Typography>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.typesContainer}>
          {pokemon?.types.map((type: any, index: number) => (
            <View key={index} style={styles.typeBadge}>
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

        {pokemon?.description.length > 0 && (
          <Typography
            color={Color.Secondary}
            style={{
              width: '92%',
              lineHeight: FontSize['1.5xl'],
              opacity: 0.8,
              borderBottomWidth: heightPixel(0.5),
              borderBottomColor: 'lightgray',
              paddingBottom: pixelSizeVertical(18),
              marginBottom: pixelSizeVertical(18),
            }}>
            {pokemon?.description[0]?.replace(/\n/g, ' ')}
          </Typography>
        )}

        <View style={{ marginBottom: pixelSizeVertical(16) }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={styles.performance}>
              <MaterialIcons
                name="human-male-height"
                size={widthPixel(28)}
                color={Color.Dark}
                style={{ opacity: 0.9 }}
              />
              <View
                style={{
                  alignItems: 'center',
                  marginLeft: pixelSizeHorizontal(6),
                }}>
                <Typography
                  variant={TextVariant.Body}
                  style={{ color: Color.Dark, opacity: 0.5 }}>
                  Height
                </Typography>
                <Typography
                  style={{
                    fontSize: fontPixel(18),
                    color: Color.TextPrimary,
                    textAlign: 'center',
                  }}>
                  {pokemon.height} m
                </Typography>
              </View>
            </View>

            <View style={styles.performance}>
              <MaterialIcons
                name="weight-lifter"
                size={widthPixel(28)}
                color={Color.Dark}
                style={{ opacity: 0.9 }}
              />
              <View
                style={{
                  alignItems: 'center',
                  marginLeft: pixelSizeHorizontal(6),
                }}>
                <Typography
                  variant={TextVariant.Body}
                  style={{ color: Color.Dark, opacity: 0.5 }}>
                  Weight
                </Typography>
                <Typography
                  style={{
                    fontSize: fontPixel(18),
                    color: Color.TextPrimary,
                    textAlign: 'center',
                  }}>
                  {pokemon.weight} kg
                </Typography>
              </View>
            </View>

            <View style={styles.performance}>
              <FontAwesome
                name="trophy"
                size={widthPixel(28)}
                color={Color.Dark}
                style={{ opacity: 0.9 }}
              />
              <View
                style={{
                  alignItems: 'center',
                  marginLeft: pixelSizeHorizontal(6),
                }}>
                <Typography
                  variant={TextVariant.Body}
                  style={{ color: Color.Dark, opacity: 0.5 }}>
                  Experince
                </Typography>
                <Typography
                  style={{
                    fontSize: fontPixel(18),
                    color: Color.TextPrimary,
                    textAlign: 'center',
                  }}>
                  {pokemon.base_experience}
                </Typography>
              </View>
            </View>
          </View>
        </View>

        <View>
          <Typography
            color={Color.TextPrimary}
            style={{ fontSize: fontPixel(20), fontWeight: 'bold' }}>
            Moves
          </Typography>
          <ScrollView
            horizontal
            style={{ marginVertical: pixelSizeVertical(10) }}>
            {pokemon?.moves.map((move: PokemonMove, index: number) => (
              <View
                key={index}
                style={{
                  paddingVertical: pixelSizeVertical(6),
                  paddingHorizontal: pixelSizeHorizontal(14),
                  backgroundColor: bgColor,
                  borderRadius: BorderRadius.Small,
                  borderWidth: 0.5,
                  borderColor: Color.TextPrimary,
                  marginRight: pixelSizeHorizontal(10),
                }}>
                <Typography
                  style={{ fontWeight: 'bold' }}
                  color={Color.TextPrimary}>
                  {move.move?.name?.charAt(0).toUpperCase() +
                    move?.move?.name?.slice(1)}
                </Typography>
              </View>
            ))}
          </ScrollView>
        </View>
        <Typography
          color={Color.TextPrimary}
          style={{ fontSize: fontPixel(20), fontWeight: 'bold' }}>
          Abilities
        </Typography>
        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
          {pokemon.abilities?.map((item: PokemonAbility, index: number) => (
            <View
              key={index}
              style={{
                paddingVertical: pixelSizeVertical(5),
                paddingHorizontal: pixelSizeHorizontal(14),
                backgroundColor: bgColor,
                borderRadius: BorderRadius.Small,
                borderWidth: 0.5,
                borderColor: Color.TextPrimary,
                marginRight: pixelSizeHorizontal(10),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Typography
                style={{ fontWeight: 'bold' }}
                color={Color.TextPrimary}>
                {item.ability.name.charAt(0).toUpperCase() +
                  item.ability.name.slice(1)}
              </Typography>
              {item.is_hidden && (
                <Typography
                  style={{
                    fontSize: fontPixel(13),
                    color: '#fff',
                    backgroundColor: '#805ad5',
                    alignSelf: 'flex-start',
                    paddingHorizontal: pixelSizeHorizontal(8),
                    paddingVertical: pixelSizeVertical(2),
                    borderRadius: BorderRadius.Circle,
                    marginLeft: pixelSizeHorizontal(4),
                  }}>
                  Hidden
                </Typography>
              )}
            </View>
          ))}
        </View>
        {aiProfile?.battle_tips?.synergy && (
          <Typography
            color={Color.TextPrimary}
            style={{ fontSize: fontPixel(20), fontWeight: 'bold' }}>
            Best Synergy
          </Typography>
        )}
        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 10 }}>
          {aiProfile?.battle_tips?.synergy?.map((item: any, index: number) => (
            <View
              key={index}
              style={{
                paddingVertical: pixelSizeVertical(5),
                paddingHorizontal: pixelSizeHorizontal(14),
                backgroundColor: Color.LightPrimary,
                borderRadius: BorderRadius.Small,
                borderWidth: heightPixel(1),
                borderColor: Color.Secondary,
                marginRight: pixelSizeHorizontal(10),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: pixelSizeVertical(4),
              }}>
              <AntDesign
                name="sync"
                size={widthPixel(16)}
                color={Color.TextPrimary}
              />
              <Typography
                style={{
                  fontWeight: 'bold',
                  lineHeight: fontPixel(20),
                  marginLeft: pixelSizeHorizontal(8),
                }}
                color={Color.TextPrimary}>
                {item}
              </Typography>
            </View>
          ))}
        </View>
        <Typography
          color={Color.TextPrimary}
          style={{ fontSize: fontPixel(20), fontWeight: 'bold' }}>
          Stats
        </Typography>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.statsContainer}>
            {pokemon?.stats.map((stat: PokemonStats) => {
              const statName = stat.stat.name;
              const statValue = stat.base_stat;
              const icon = statIcons[statName];
              const colors = statsColors[statName];

              return (
                <View
                  key={statName}
                  style={{
                    marginHorizontal: pixelSizeHorizontal(6),
                    marginVertical: pixelSizeVertical(8),
                    backgroundColor: colors.bgColor,
                    width: Dimensions.get('screen').width / 2.4,
                    padding: heightPixel(12),
                    borderRadius: BorderRadius.Medium,
                  }}>
                  <Img
                    source={icon}
                    style={{
                      width: widthPixel(80),
                      height: heightPixel(88),
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      marginBottom: pixelSizeVertical(8),
                    }}
                  />
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Typography
                        variant={TextVariant.Body}
                        style={{
                          color: Color.DarkBlack,
                          marginLeft: pixelSizeHorizontal(5),
                        }}>
                        {statName === 'hp'
                          ? 'HP'
                          : statName === 'attack'
                            ? 'Attack'
                            : statName === 'defense'
                              ? 'Defense'
                              : statName === 'special-attack'
                                ? 'Special Attack'
                                : statName === 'special-defense'
                                  ? 'Special Defense'
                                  : statName === 'speed'
                                    ? 'Speed'
                                    : statName.toUpperCase()}
                      </Typography>
                    </View>
                    <Typography
                      variant={TextVariant.Body}
                      style={{ color: Color.Dark }}>
                      {statValue}
                    </Typography>
                  </View>

                  <ProgressBar
                    progress={statValue / 100}
                    color={colors.bar}
                    style={{
                      height: heightPixel(10),
                      borderRadius: BorderRadius.XSmall,
                      backgroundColor: 'rgba(29, 26, 26, 0.07)',
                      marginVertical: pixelSizeVertical(4),
                    }}
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>
        {isAiLoading && (
          <View>
            <ActivityIndicator
              size={widthPixel(40)}
              color={Color.TextPrimary}
            />
            <Typography
              style={{ textAlign: 'center', marginTop: pixelSizeVertical(8) }}>
              Retrieving AI-generated stories and contextual attributes to
              personalize your experience...{' '}
            </Typography>
          </View>
        )}
        {aiProfile?.story?.length > 0 && (
          <>
            <Typography
              color={Color.TextPrimary}
              style={{ fontSize: fontPixel(20), fontWeight: 'bold' }}>
              Story
            </Typography>
            <Typography
              color={Color.DarkBlack}
              style={{
                width: '92%',
                lineHeight: FontSize['1.5xl'],
                opacity: 0.6,
                fontStyle: 'italic',
                marginVertical: pixelSizeVertical(4),
              }}>
              Find out how{' '}
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}{' '}
              fits into its environment and what makes it different.
            </Typography>
          </>
        )}
        {aiProfile?.story?.length > 0 &&
          aiProfile?.story?.map((story: any, idx: any) => (
            <View key={idx}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <MaterialIcons
                  name="leaf-maple"
                  size={widthPixel(20)}
                  color={'green'}
                />
                <Typography style={{ marginLeft: 4 }}>{story?.region}</Typography>
              </View>
              <Typography
                color={Color.Secondary}
                style={{
                  fontSize: fontPixel(16),
                  marginBottom: pixelSizeVertical(8),
                }}>
                {story?.title}
              </Typography>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {story?.pages?.length > 0 &&
                  story?.pages?.map((page: string) => (
                    <View
                      key={page}
                      style={{
                        backgroundColor: Color.Dark,
                        height: 'auto',
                        width: Dimensions.get('screen').width / 1.2,
                        marginRight: pixelSizeHorizontal(8),
                        padding: heightPixel(10),
                        borderRadius: BorderRadius.Small,
                      }}>
                      <Typography
                        variant={TextVariant.Body}
                        color={Color.White}
                        style={{ lineHeight: fontPixel(22), width: '88%' }}>
                        {page}
                      </Typography>
                      <Img
                        source={Curve}
                        containerStyle={{
                          position: 'absolute',
                          top: pixelSizeVertical(-10),
                          right: pixelSizeHorizontal(-24),
                          width: '80%',
                          height: heightPixel(160),
                          opacity: 0.5,
                        }}
                        type="svg"
                        svgProps={{
                          width: widthPixel(300),
                          height: heightPixel(150),
                        }}
                      />
                    </View>
                  ))}
              </ScrollView>
              <Typography
                color={Color.DarkBlack}
                style={{
                  width: '92%',
                  lineHeight: FontSize['1.5xl'],
                  opacity: 0.6,
                  fontStyle: 'italic',
                  marginVertical: pixelSizeVertical(4),
                }}>
                Supporting Pokemons
              </Typography>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {story?.supporting_pokemon?.length > 0 &&
                  story?.supporting_pokemon?.map(
                    (supPoke: string, index: number) => (
                      <View
                        key={index}
                        style={[
                          styles.typeBadge,
                          {
                            marginRight: pixelSizeVertical(8),
                            marginBottom: pixelSizeVertical(4)
                          }]}>
                        <Typography
                          variant={TextVariant.Body}
                          style={{
                            fontWeight: 'bold',
                          }}>
                          {supPoke}
                        </Typography>
                      </View>
                    ),
                  )}
              </View>
            </View>
          ))}

        <Typography
          color={Color.TextPrimary}
          style={{
            fontSize: fontPixel(20),
            fontWeight: 'bold',
            marginTop: pixelSizeVertical(12),
          }}>
          {aiProfile?.lore?.title}
        </Typography>

        <Typography
          color={Color.DarkBlack}
          style={{
            width: '92%',
            lineHeight: FontSize['1.5xl'],
            opacity: 0.6,
            fontStyle: 'italic',
            marginVertical: pixelSizeVertical(4),
          }}>
          {aiProfile?.lore?.content}
        </Typography>

        <Typography
          color={Color.TextPrimary}
          style={{
            fontSize: fontPixel(20),
            fontWeight: 'bold',
            marginTop: pixelSizeVertical(12),
          }}>
          {aiProfile?.pokedex_entry?.title}
        </Typography>

        <Typography
          color={Color.DarkBlack}
          style={{
            width: '92%',
            lineHeight: FontSize['1.5xl'],
            opacity: 0.6,
            fontStyle: 'italic',
            marginVertical: pixelSizeVertical(4),
          }}>
          {aiProfile?.pokedex_entry?.content}
        </Typography>

        <Typography
          color={Color.TextPrimary}
          style={{
            fontSize: fontPixel(20),
            fontWeight: 'bold',
            marginTop: pixelSizeVertical(12),
          }}>
          {aiProfile?.personality_facts?.title}
        </Typography>

        <Typography
          color={Color.DarkBlack}
          style={{
            width: '92%',
            lineHeight: FontSize['1.5xl'],
            opacity: 0.6,
            fontStyle: 'italic',
            marginVertical: pixelSizeVertical(4),
            marginBottom: pixelSizeVertical(180),
          }}>
          {aiProfile?.personality_facts?.content}
        </Typography>
      </View>

      <BottomSheetBox ref={sheetRef} meta={{ ...pokemon, ...aiProfile, isQuiz: isQuiz || false } as any} />
    </ScrollView>
  );
};

export default Detail;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: pixelSizeHorizontal(16),
    paddingVertical: pixelSizeVertical(12),
    alignItems: 'center',
  },
  content: {
    padding: heightPixel(16),
    paddingTop: 0,
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    color: Color.DarkBlack,
    fontSize: FontSize['6xl'],
  },
  id: {
    color: Color.TextPrimary,
    fontWeight: 'bold',
    marginTop: 'auto',
    marginBottom: pixelSizeVertical(4),
    marginLeft: pixelSizeHorizontal(4),
  },
  title: {
    fontSize: fontPixel(28),
    fontWeight: 'bold',
    marginBottom: pixelSizeVertical(8),
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: pixelSizeVertical(4),
  },
  performance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Color.White,
    shadowColor: 'lightgray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    display: 'flex',
    borderRadius: BorderRadius.Medium,
    paddingHorizontal: pixelSizeHorizontal(12),
    paddingVertical: pixelSizeVertical(4),
  },
});
