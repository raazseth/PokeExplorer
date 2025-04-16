import { Alert, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Typography from '@components/Core/Typography';
import { BorderRadius, Color, FontSize, TextVariant } from '@typed/enum';
import Body from '@template/Body';
import {
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@utils/sizeNormalization';
import Button from '@components/Core/Button';
import Input from '@components/Core/Input';
import Img from '@components/Core/Img';
import getUserName from '@utils/getUserName';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '@navigation/AuthStack';
import Curve from '@assets/Images/curve.svg';
import { useDispatch } from 'react-redux';
import { loginUser, signInWithGoogle } from '@services/Auth';
import { ILoginPayload, login } from '@redux/Auth/authSlice';
import useNotifications from '@hooks/useNotification';
import { AppDispatch } from '@redux/store';

export interface LoginFormValues {
  email: string;
  password: string;
  fcmToken?: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const { fcmToken } = useNotifications();
  const [userName, setUserName] = useState(getUserName());
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    setisLoading(true);
    try {
      const payload: LoginFormValues = {
        ...values,
      };

      if (typeof fcmToken === 'string') {
        payload.fcmToken = fcmToken;
      }

      const res: ILoginPayload | null = await loginUser(payload);

      if (!res) {
        Alert.alert('Error while logging');
        // console.log(res,"handleLogin:res")
        return;
      }

      dispatch(login({ ...res, fcmToken: fcmToken ?? '' } as ILoginPayload));
    } catch (error: any) {
      // console.log(error, "handleLogin:catch")
      Alert.alert('Error', error.message);
    } finally {
      setisLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setisLoading(true);

      const payload: any = {};

      if (typeof fcmToken === 'string') {
        payload.fcmToken = fcmToken;
      }

      const res: ILoginPayload | null = await signInWithGoogle(payload);

      if (!res) {
        Alert.alert('Error while login');
        return;
      }

      dispatch(login({ ...res, fcmToken: fcmToken ?? '' } as ILoginPayload));
    } catch (err: any) {
      Alert.alert('Error while login');
    } finally {
      setisLoading(false);
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
        containerStyle={{
          position: 'absolute',
          top: pixelSizeVertical(-10),
          right: pixelSizeHorizontal(-24),
          width: '100%',
          height: heightPixel(200),
        }}
        type="svg"
        svgProps={{ width: widthPixel(300), height: heightPixel(150) }}
      />
      <Typography
        variant={TextVariant.XlHeading}
        onPress={() => setUserName(getUserName())}
        style={{ fontSize: FontSize['6xl'] }}>
        Hello, {userName} 👋
      </Typography>
      <Typography
        style={{
          fontSize: FontSize['1.5lg'],
          marginVertical: pixelSizeVertical(6),
        }}>
        Sign In to PokeExplorer
      </Typography>
      <Typography style={styles.subText}>
        Access your personalized Pokémon data and save your favorites.
      </Typography>

      <Formik
        initialValues={
          {
            email: '',
            password: '',
          } as LoginFormValues
        }
        validationSchema={validationSchema}
        onSubmit={handleLogin}>
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
            <Input
              label="Password"
              type="password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              placeholder="Enter Your Password"
              value={values.password}
              error={touched.password ? Boolean(errors.password) : undefined}
              errorMessage={touched.password ? errors.password : undefined}
            />

            <Typography
              onPress={() => {
                navigation.navigate('ForgetPassword');
              }}
              style={styles.forgotPassword}>
              Forgot Password?
            </Typography>

            <Button
              fontSize={FontSize['1.5lg']}
              borderRadius={BorderRadius.Circle}
              style={styles.fullWidthButton}
              isLoading={isLoading}
              onPress={() => handleSubmit()}>
              Login
            </Button>
          </>
        )}
      </Formik>

      <View style={styles.separatorContainer}>
        <View style={styles.hl} />
        <Typography>Or Sign In With</Typography>
        <View style={styles.hl} />
      </View>

      <Button
        onPress={handleGoogleLogin}
        borderRadius={BorderRadius.Circle}
        style={styles.googleButton}
        isLoading={isLoading}>
        <Img
          source={require('@assets/Icons/google.png')}
          style={styles.googleIcon}
        />
        <Typography style={styles.googleText}>Google</Typography>
      </Button>

      <View style={styles.registerContainer}>
        <Typography>Don't have an account?</Typography>
        <Typography
          color={Color.Secondary}
          onPress={() => navigation.navigate('Register')}
          style={styles.registerText}>
          Register
        </Typography>
      </View>
    </Body>
  );
};

export default Login;

const styles = StyleSheet.create({
  body: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    padding: 24,
    position: 'relative',
  },
  subText: {
    fontSize: FontSize.base,
    width: '90%',
    color: Color.Dark,
    opacity: 0.6,
    lineHeight: FontSize['1.5lg'],
    marginBottom: pixelSizeVertical(24),
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: pixelSizeVertical(8),
    color: Color.Secondary,
  },
  fullWidthButton: {
    width: '100%',
    marginTop: pixelSizeVertical(24),
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: pixelSizeVertical(24),
  },
  hl: {
    height: heightPixel(1),
    width: '35%',
    backgroundColor: 'lightgray',
    marginHorizontal: pixelSizeHorizontal(8),
  },
  googleButton: {
    backgroundColor: '#f8f7fc',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightPixel(12),
  },
  googleIcon: {
    width: widthPixel(20),
    height: heightPixel(22),
    marginRight: pixelSizeHorizontal(8),
  },
  googleText: {
    fontSize: FontSize['1.5lg'],
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    justifyContent: 'center',
  },
  registerText: {
    marginLeft: 4,
  },
});
