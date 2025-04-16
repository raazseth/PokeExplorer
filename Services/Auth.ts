import auth from '@react-native-firebase/auth';
import {ILoginPayload, User} from '@redux/Auth/authSlice';
import {LoginFormValues} from '@screens/Auth/Login';
import {RegisterFormValues} from '@screens/Auth/Register';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';

export const registerUser = async (
  payload: RegisterFormValues,
): Promise<ILoginPayload | null> => {
  try {
    const {email, password, firstName, lastName, fcmToken} = payload;

    await auth().createUserWithEmailAndPassword(email.trim(), password.trim());
    const user = auth().currentUser;

    if (user) {
      await user.updateProfile({
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });
      await user.reload();

      const updatedUser = auth().currentUser;

      if (updatedUser) {
        const token = await updatedUser?.getIdToken();

        if (typeof fcmToken === 'string') {
          await saveFCMToken(fcmToken, updatedUser?.uid);
        }

        return {
          user: extractUserData(updatedUser),
          token: token,
        };
      }
    }

    return null;
  } catch (error: any) {
    const message = getFirebaseErrorMessage(error);
    throw new Error(message);
  }
};

export const loginUser = async (
  payload: LoginFormValues,
): Promise<ILoginPayload | null> => {
  try {
    const {email, password, fcmToken} = payload;

    await auth().signInWithEmailAndPassword(email.trim(), password.trim());
    const user = auth().currentUser;

    if (user) {
      const token = await user?.getIdToken();

      if (typeof fcmToken === 'string') {
        await saveFCMToken(fcmToken, user.uid);
      }

      return {
        user: extractUserData(user),
        token: token,
      };
    }

    return null;
  } catch (error: any) {
    const message = getFirebaseErrorMessage(error);
    throw new Error(message);
  }
};

export const extractUserData = (user: any): User => {
  try {
    if (!user || typeof user !== 'object') {
      throw new Error('Invalid user object.');
    }

    const {
      displayName,
      email,
      emailVerified,
      isAnonymous,
      metadata,
      multiFactor,
      phoneNumber,
      photoURL,
      providerData,
      providerId,
      tenantId,
      uid,
    } = user;

    if (!uid || !email) {
      throw new Error('Missing essential user fields: uid or email.');
    }

    return {
      displayName: displayName ?? '',
      email: email ?? '',
      emailVerified: !!emailVerified,
      isAnonymous: !!isAnonymous,
      metadata: {
        creationTime: metadata?.creationTime ?? '',
        lastSignInTime: metadata?.lastSignInTime ?? '',
      },
      multiFactor: multiFactor ?? {},
      phoneNumber: phoneNumber ?? '',
      photoURL: photoURL ?? '',
      providerData: providerData ?? [],
      providerId: providerId ?? '',
      tenantId: tenantId ?? '',
      uid: uid,
    };
  } catch (error) {
    console.error('Error extracting user data:', error);
    throw new Error('Failed to extract user data.');
  }
};

const getFirebaseErrorMessage = (error: any): string => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email address is already in use.';
    case 'auth/invalid-email':
      return 'The email address is invalid.';
    case 'auth/user-not-found':
      return 'No user found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

export const sendPasswordReset = async (email: string): Promise<string> => {
  try {
    await auth().sendPasswordResetEmail(email.trim());
    return 'Password reset email sent successfully. Please check your inbox.';
  } catch (error: any) {
    const message = getFirebaseErrorMessage(error);
    throw new Error(message);
  }
};

export const signInWithGoogle = async (
  fcmToken: string,
): Promise<ILoginPayload | null> => {
  try {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const userInfo: any = await GoogleSignin.signIn();

    const idToken = userInfo.data?.idToken;

    if (!idToken) {
      throw new Error('Google ID Token not returned');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    const {user} = userCredential;

    if (fcmToken) {
      await saveFCMToken(fcmToken, user.uid);
    }

    return {
      user: {
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        uid: user.uid,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        providerId: user.providerId,
      } as any,
      token: await user.getIdToken(),
    };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export const saveFCMToken = (fcmToken: string, uid: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!fcmToken || !uid) {
        return reject(new Error('FCM token or UID is missing'));
      }

      await firestore().collection('users').doc(uid).set(
        {
          fcmToken,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        {merge: true},
      );

      resolve();
    } catch (error) {
      console.error('Error saving FCM token:', error);
      reject(error);
    }
  });
};
