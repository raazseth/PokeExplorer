import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useMultiplePokemons } from '@hooks/usePokemon';
import { IPokemon } from '@typed/index';
import { Color } from '@typed/enum';
import { heightPixel } from '@utils/sizeNormalization';
import PokemonCard from '@components/PokemonCard';
import { useSelector } from 'react-redux';
import { AuthState } from '@redux/Auth/authSlice';
import Body from '@template/Body';
import useHideBottomBar from '@hooks/useHideBottomBar';

const Wishlist = () => {
  const auth = useSelector((state: any) => state.auth as AuthState);
  const wishlistIds = auth?.wishlist ?? [];
  const { data, isLoading } = useMultiplePokemons(wishlistIds);
  const pokemonData: IPokemon[] = data || [];
  useHideBottomBar();

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={Color.Dark}
        style={styles.loader}
      />
    );
  }

  return (
    <Body style={styles.container}>

      {pokemonData.map((item, index) => (
        <View key={item.id?.toString() || index.toString()} style={styles.cardWrapper}>
          <PokemonCard pokemon={item} displayType='list' />
        </View>
      ))}

      {isLoading && (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={Color.Primary} />
        </View>
      )}
    </Body>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    alignSelf: 'center',
  },
  footerLoader: {
    padding: heightPixel(16),
    alignItems: 'center',
  },
});
