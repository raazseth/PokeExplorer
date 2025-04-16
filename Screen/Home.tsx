import React, { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import Body from '@template/Body';
import { usePokemon } from '@hooks/usePokemon';
import { IPokemon } from '@typed/index';
import { BottomSheetViewTypes, Color } from '@typed/enum';
import { heightPixel, pixelSizeVertical } from '@utils/sizeNormalization';
import Swiper from 'react-native-deck-swiper';
import PokemonCard from '@components/PokemonCard';
import Typography from '@components/Core/Typography';
import { useSelector } from 'react-redux';
import { AuthState } from '@redux/Auth/authSlice';
import Header from '@template/Header';
import useHideBottomBar from '@hooks/useHideBottomBar';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';
import BottomSheetBox from '@components/BottomSheetBox';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';


const Home = () => {
  const { data, isLoading, fetchNextPage, hasNextPage } = usePokemon();
  const pokemonData: IPokemon[] =
    data?.pages?.flatMap(page => page.results) || [];
  const [index, setIndex] = useState<number>(0);
  const [swiperKey, setSwiperKey] = useState(Date.now());
  const auth = useSelector((state: any) => state.auth as AuthState);
  const navigation = useNavigation<any>();
  const sheetRef = useRef<BottomSheetMethods | null>(null);
  useHideBottomBar();

  if (isLoading)
    return (
      <ActivityIndicator
        size="large"
        color={Color.Dark}
        style={styles.loader}
      />
    );

  const onSwipe = (cardIndex: number) => {
    if (cardIndex < pokemonData.length - 1) {
      setIndex(cardIndex + 1);
    }
    setSwiperKey(Date.now());

    if (cardIndex === pokemonData.length - 1 && hasNextPage) {
      fetchNextPage();
    }
  };

  if (auth.displayType === 'list' && pokemonData.length > 0) {
    return (
      <View>
        <FlatList
          data={pokemonData}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => <Header />}
          ListFooterComponent={
            isLoading ? (
              <View style={{ padding: heightPixel(16), alignItems: 'center' }}>
                <ActivityIndicator size="small" color={Color.Primary} />
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={{ alignSelf: 'center' }}>
              <PokemonCard pokemon={item} displayType={auth.displayType} />
            </View>
          )}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingBottom: pixelSizeVertical(140) }}
        />

        <BottomSheetBox ref={sheetRef} />
      </View>
    );
  }

  return (
    <Body style={styles.container}>
      {pokemonData.length > 0 ? (
        <View
          style={{
            marginTop: pixelSizeVertical(-50),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Swiper
            cards={pokemonData}
            key={swiperKey}
            renderCard={(pokemon: IPokemon) =>
              pokemon ? (
                <PokemonCard pokemon={pokemon} displayType={auth.displayType} />
              ) : (
                <View>
                  <Typography>No Data</Typography>
                </View>
              )
            }
            onSwipedLeft={onSwipe}
            disableTopSwipe={true}
            disableBottomSwipe={true}
            showSecondCard
            onSwipedRight={onSwipe}
            cardIndex={index}
            backgroundColor="white"
            onTapCard={index => {
              const selected = pokemonData[index];
              navigation.navigate('Detail', { id: selected?.id });
            }}
            stackSize={2}
            stackSeparation={10}
            infinite
          />
        </View>
      ) : (
        <Typography>No Pokémon Found</Typography>
      )}
    </Body>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f6f8',
    flex: 1,
    padding: 0,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
