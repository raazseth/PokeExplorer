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
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { AuthStackParamList } from '@navigation/AuthStack';
import Curve from '@assets/Images/curve.svg';
import { registerUser, signInWithGoogle } from '@services/Auth';
import { useDispatch } from 'react-redux';
import { ILoginPayload, login } from '@redux/Auth/authSlice';
import useNotifications from '@hooks/useNotification';
import { AppDispatch } from '@redux/store';

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  fcmToken?: string;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Register = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const { fcmToken } = useNotifications();
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleRegister = async (values: RegisterFormValues): Promise<void> => {
    setisLoading(true);
    try {
      const payload: RegisterFormValues = {
        ...values,
      };

      if (typeof fcmToken === 'string') {
        payload.fcmToken = fcmToken;
      }

      const res: ILoginPayload | null = await registerUser(payload);

      if (!res) {
        Alert.alert('Soemthing Went Wrong');
        // console.log(res,"handleRegister:res")
        return;
      }

      dispatch(login({ ...res, fcmToken: fcmToken ?? '' } as ILoginPayload));
    } catch (error: any) {
      // console.log(error, "handleRegister:catch")
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
        Alert.alert('Error while register');
        return;
      }

      dispatch(login({ ...res, fcmToken: fcmToken ?? '' } as ILoginPayload));
    } catch (err: any) {
      Alert.alert('Error while register');
    } finally {
      setisLoading(false);
    }
  };

  return (
    <Body style={styles.body} showHeader={false}>
      <Img
        source={require('@assets/Icons/pikachu.png')}
        style={{ width: widthPixel(80), height: heightPixel(84) }}
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
        style={{ marginVertical: pixelSizeVertical(6) }}>
        Create Account
      </Typography>
      <Typography style={styles.subText}>
        Join PokeExplorer to save your favorite Pokémon and track your activity.
      </Typography>
      <Formik
        initialValues={
          {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
          } as RegisterFormValues
        }
        validationSchema={validationSchema}
        onSubmit={handleRegister}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <View style={styles.nameContainer}>
              <View style={styles.halfWidth}>
                <Input
                  label="First Name"
                  placeholder="Enter First Name"
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  value={values.firstName}
                  error={
                    touched.firstName ? Boolean(errors.firstName) : undefined
                  }
                  errorMessage={
                    touched.firstName ? errors.firstName : undefined
                  }
                />
              </View>
              <View style={styles.halfWidth}>
                <Input
                  label="Last Name"
                  placeholder="Enter Last Name"
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  value={values.lastName}
                  error={
                    touched.lastName ? Boolean(errors.lastName) : undefined
                  }
                  errorMessage={touched.lastName ? errors.lastName : undefined}
                />
              </View>
            </View>

            <Input
              label="Email"
              keyboardType="email-address"
              placeholder="Enter Your Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              error={touched.email ? Boolean(errors.email) : undefined}
              errorMessage={touched.email ? errors.email : undefined}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter Your Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              error={touched.password ? Boolean(errors.password) : undefined}
              errorMessage={touched.password ? errors.password : undefined}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm Your Password"
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              error={
                touched.confirmPassword
                  ? Boolean(errors.confirmPassword)
                  : undefined
              }
              errorMessage={
                touched.confirmPassword ? errors.confirmPassword : undefined
              }
            />
            <Button
              fontSize={FontSize['1.5lg']}
              borderRadius={BorderRadius.Circle}
              style={styles.fullWidthButton}
              isLoading={isLoading}
              onPress={() => handleSubmit()}>
              Register
            </Button>
          </>
        )}
      </Formik>
      <View style={styles.separatorContainer}>
        <View style={styles.hl} />
        <Typography>Or Register With</Typography>
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

      <View style={styles.loginContainer}>
        <Typography>Already have an account?</Typography>
        <Typography
          color={Color.Secondary}
          onPress={() => navigation.navigate('Login')}
          style={styles.loginText}>
          Login
        </Typography>
      </View>
    </Body>
  );
};

export default Register;

const styles = StyleSheet.create({
  body: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    padding: 24,
  },
  subText: {
    fontSize: FontSize.base,
    width: '90%',
    color: Color.Dark,
    opacity: 0.6,
    lineHeight: FontSize['1.5lg'],
    marginBottom: pixelSizeVertical(24),
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  fullWidthButton: {
    width: '100%',
    marginTop: pixelSizeVertical(24),
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: pixelSizeVertical(16),
  },
  loginText: {
    marginLeft: 4,
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
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: pixelSizeVertical(24),
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
