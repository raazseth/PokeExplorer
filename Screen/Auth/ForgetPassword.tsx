import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Typography from '@components/Core/Typography';
import { BorderRadius, Color, FontSize, TextVariant } from '@typed/enum';
import Body from '@template/Body';
import Button from '@components/Core/Button';
import Input from '@components/Core/Input';
import Img from '@components/Core/Img';
import Curve from '@assets/Images/curve.svg';
import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@utils/sizeNormalization';
import { AuthStackParamList } from '@navigation/AuthStack';
import { sendPasswordReset } from '@services/Auth';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
});

const ForgetPassword = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (values: { email: string }) => {
    setIsLoading(true);
    try {
      const res = await sendPasswordReset(values.email);

      if (!res) {
        Alert.alert('Error while changing password');
        // console.log(res,"handleReset:res")
        return;
      }

      Alert.alert('Success', res, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);

    } catch (error: any) {
      // console.log(error, "handleReset:catch")
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Body style={styles.body} showHeader={false}>
      <Img
        source={require('@assets/Icons/pikachu.png')}
        style={{ width: widthPixel(80), height: heightPixel(84) }}
        containerStyle={{ marginTop: 'auto', marginBottom: heightPixel(12) }}
        resizeMode="contain"
      />
      <Img
        source={Curve}
        containerStyle={styles.curve}
        type="svg"
        svgProps={{ width: widthPixel(300), height: heightPixel(150) }}
      />
      <Typography
        variant={TextVariant.XlHeading}
        style={{ fontSize: FontSize['6xl'] }}>
        Forgot Password?
      </Typography>
      <Typography style={styles.subText}>
        Enter your registered email and we'll send you a link to reset your password.
      </Typography>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleReset}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <Input
              label="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder="Enter Your Email"
              keyboardType="email-address"
              value={values.email}
              error={touched.email ? Boolean(errors.email) : undefined}
              errorMessage={touched.email ? errors.email : undefined}
            />

            <Button
              fontSize={FontSize['1.5lg']}
              borderRadius={BorderRadius.Circle}
              style={styles.fullWidthButton}
              isLoading={isLoading}
              onPress={() => handleSubmit()}>
              Send Reset Link
            </Button>
          </>
        )}
      </Formik>

      <View style={styles.backContainer}>
        <Typography>Remember your password?</Typography>
        <Typography
          color={Color.Secondary}
          onPress={() => navigation.goBack()}
          style={styles.backText}>
          Go back to login
        </Typography>
      </View>
    </Body>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  body: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    padding: 24,
    position: 'relative',
  },
  curve: {
    position: 'absolute',
    top: pixelSizeVertical(-10),
    right: pixelSizeHorizontal(-24),
    width: '100%',
    height: heightPixel(200),
  },
  subText: {
    fontSize: FontSize.base,
    width: '90%',
    color: Color.Dark,
    opacity: 0.6,
    lineHeight: FontSize['1.5lg'],
    marginBottom: pixelSizeVertical(24),
    marginTop: pixelSizeVertical(6),
  },
  fullWidthButton: {
    width: '100%',
    marginTop: pixelSizeVertical(24),
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    justifyContent: 'center',
  },
  backText: {
    marginLeft: 4,
  },
});
