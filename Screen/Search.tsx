import { StyleSheet, View } from 'react-native';
import React from 'react';
import Body from '@template/Body';
import { useSelector } from 'react-redux';
import { AuthState } from '@redux/Auth/authSlice';
import PokemonCard from '@components/PokemonCard';
import useHideBottomBar from '@hooks/useHideBottomBar';

const Search = () => {
  const auth = useSelector((state: any) => state.auth as AuthState);
  useHideBottomBar();

  return (
    <Body style={styles.container} headerProps={{ searchEnabled: true }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
        }}>
        {auth?.search?.length > 0 && <PokemonCard pokemon={auth?.search[0]} />}
      </View>
    </Body>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f6f8',
    flex: 1,
  },
});
