import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import Body from '@template/Body';
import Img from '@components/Core/Img';
import Button from '@components/Core/Button';
import Typography from '@components/Core/Typography';
import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@utils/sizeNormalization';
import {Color, BorderRadius, FontSize, TextVariant, Variant} from '@typed/enum';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackParamList} from '@navigation/AuthStack';
import ash from '@assets/Images/6.svg';
import logo from '@assets/Images/16.svg';
import Bulbasor from '@assets/Images/161.svg';
import pikachu from '@assets/Images/10.svg';

const Onboarding = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  return (
    <Body style={styles.body} showHeader={false}>
      <View style={styles.containerImg}>
        <Img
          source={logo}
          type="svg"
          resizeMode="cover"
          svgProps={{width: widthPixel(400), height: heightPixel(300)}}
        />
        <Img
          source={ash}
          style={styles.ash}
          type="svg"
          resizeMode="cover"
          svgProps={{width: widthPixel(300), height: heightPixel(300)}}
        />
        <View style={styles.bottomPokemons}>
          <Img
            source={Bulbasor}
            style={styles.bulbasor}
            type="svg"
            resizeMode="cover"
            svgProps={{width: widthPixel(100), height: heightPixel(100)}}
          />
          <Img
            source={pikachu}
            style={styles.pikachu}
            type="svg"
            resizeMode="cover"
            svgProps={{width: widthPixel(100), height: heightPixel(100)}}
          />
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Typography variant={TextVariant.XlHeading} style={styles.heading}>
            Unlock the World of
            <View style={styles.pokemonText}>
              <Text
                style={[
                  styles.heading,
                  {fontWeight: 'bold', color: Color.TextPrimary},
                ]}>
                Pokémon
              </Text>
            </View>
          </Typography>
        </View>

        <Typography style={styles.infoText}>
          Explore a vast collection of Pokémon, track their stats, and build
          your dream team!
        </Typography>

        <View style={styles.buttonRow}>
          <Button
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
            labelStyle={{fontSize: FontSize['1.5xl']}}>
            Login
          </Button>
          <Button
            onPress={() => navigation.navigate('Register')}
            style={styles.button}
            variant={Variant.Transparent}
            labelStyle={{fontSize: FontSize['1.5xl'], color: Color.Dark}}>
            Register
          </Button>
        </View>
      </View>
    </Body>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Color.White,
    padding: heightPixel(10),
  },
  container: {
    marginTop: pixelSizeVertical(20),
    flex: 1,
  },
  containerImg: {
    backgroundColor: '#f4f8dd',
    width: '100%',
    borderRadius: BorderRadius.Large,
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.6,
    shadowColor: 'rgba(100, 100, 111, 0.2)',
    shadowOffset: {width: 0, height: 7},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  ash: {
    marginTop: -heightPixel(110),
    marginBottom: heightPixel(20),
    marginLeft: pixelSizeHorizontal(20),
  },
  heading: {
    fontSize: FontSize['6xl'],
  },
  infoText: {
    fontSize: FontSize['lg'],
    marginBottom: pixelSizeVertical(8),
    fontWeight: '600',
    width: '90%',
    color: Color.Dark,
    lineHeight: FontSize['1.5xl'],
    opacity: 0.7,
  },
  subText: {
    fontSize: FontSize.base,
    width: '90%',
    color: Color.Dark,
    opacity: 0.4,
    lineHeight: FontSize['1.5lg'],
    marginBottom: pixelSizeVertical(24),
  },
  bottomPokemons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    bottom: pixelSizeVertical(115),
    paddingHorizontal: widthPixel(20),
  },
  bulbasor: {
    position: 'absolute',
    left: pixelSizeHorizontal(-20),
  },
  pikachu: {
    position: 'absolute',
    right: pixelSizeHorizontal(-20),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 'auto',
    marginBottom: pixelSizeVertical(8),
  },
  button: {
    flex: 1,
    paddingVertical: pixelSizeVertical(12),
    borderRadius: BorderRadius.Circle,
    alignItems: 'center',
    marginHorizontal: pixelSizeHorizontal(8),
    width: '49%',
    height: heightPixel(60),
  },
  headingContainer: {
    marginBottom: pixelSizeVertical(20),
    textAlign: 'center',
  },

  pokemonText: {
    backgroundColor: '#f8d010',
    paddingHorizontal: pixelSizeHorizontal(10),
    paddingVertical: pixelSizeVertical(3),
    borderRadius: BorderRadius.Small,
  },
});
