import { useEffect, useState } from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';

type PermissionStatus = 'granted' | 'denied' | 'error' | null;

interface UseNotificationsReturn {
  fcmToken: string | null;
  permissionStatus: PermissionStatus;
  requestNotificationPermission: () => Promise<string | null>;
}

const useNotifications = (): UseNotificationsReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(null);

  const getDeviceToken = async (): Promise<string | null> => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();
      setToken(fcmToken);
      return fcmToken;
    } catch (error) {
      console.error('Failed to get device token:', error);
      setToken(null);
      return null;
    }
  };

  const requestNotificationPermission = async (): Promise<string | null> => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setPermissionStatus('denied');
            return null;
          }
        }

        setPermissionStatus('granted');
        return await getDeviceToken();
      }

      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          setPermissionStatus('denied');
          return null;
        }

        setPermissionStatus('granted');
        return await getDeviceToken();
      }

      return null;
    } catch (error) {
      console.error('Permission request failed:', error);
      setPermissionStatus('error');
      return null;
    }
  };

  useEffect(() => {
    requestNotificationPermission();

    const unsubscribeForeground = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('Foreground notification:', remoteMessage);
      }
    );

    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('Notification opened from background:', remoteMessage);
      }
    );

    messaging()
      .getInitialNotification()
      .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
        if (remoteMessage) {
          console.log('Notification opened from quit state:', remoteMessage);
        }
      });

    messaging().setBackgroundMessageHandler(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('Background notification:', remoteMessage);
      }
    );

    return () => {
      unsubscribeForeground();
      unsubscribeNotificationOpened();
    };
  }, []);

  return {
    fcmToken: token,
    permissionStatus,
    requestNotificationPermission,
  };
};

export default useNotifications;
