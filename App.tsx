import React, { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { AppDispatch, store } from '@redux/store';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@config/queryClient';
import { InitialState, NavigationContainer } from '@react-navigation/native';
import MainNavigation from '@navigation/MainNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  getTabFromLocal,
  getUserFromLocal,
  getWishlistFromLocal,
} from '@redux/Auth/helper';
import {
  handleSheetView,
  login,
  setAcitveQuizes,
  setIsAuthenticated,
  setTab,
  setWishlist,
} from '@redux/Auth/authSlice';
import ScreenLoader from '@components/ScreenLoader';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { navigate, navigationRef, RootStackParamList } from '@utils/navigationRef';
import notifee, { EventType } from '@notifee/react-native';
import { BottomSheetViewTypes } from '@typed/enum';
import messaging from '@react-native-firebase/messaging';

const AppInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<InitialState | undefined>();

  useEffect(() => {
    const run = async () => {
      try {
        console.log('Initializing app...');

        const localUserData = await getUserFromLocal().catch(error => {
          return null;
        });

        const localWishlist = await getWishlistFromLocal().catch(error => {
          return null;
        });

        const localTabs = await getTabFromLocal().catch(error => {
          return null;
        });

        if (localUserData?.user) {
          dispatch(login(localUserData));
          dispatch(setIsAuthenticated(true));
        }

        if (localWishlist) {
          dispatch(setWishlist(localWishlist));
        }

        if (localTabs) {
          dispatch(setTab(localTabs));
          setActiveTab(localTabs);
        }

      } catch (error) {
        console.error('Unexpected error during app initialization:', error);
      } finally {
        console.log('App initialization complete.');
      }
    };

    run();

    const splashTimer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => clearTimeout(splashTimer);
  }, []);


  useEffect(() => {
    if (!isReady) return;

    // foreground fcm
    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      try {
        if (!remoteMessage) return;
        const { notification, data } = remoteMessage;

        if (!notification?.title && !notification?.body) return;

        await notifee.displayNotification({
          title: notification?.title || 'New Notification',
          body: notification?.body || '',
          android: {
            channelId: 'default',
            pressAction: { id: 'default' },
          },
          data,
        });
      } catch (err) {
        console.error('Error displaying notification:', err);
      }
    });

    // foreground 
    const unsubscribeForegroundEvent = notifee.onForegroundEvent(async ({ type, detail }) => {
      try {
        if (type === EventType.PRESS) {
          const data: any = detail?.notification?.data;
          if (!data?.screen || !data?.stack) return;

          const parsedParams = typeof data.params === 'string'
            ? JSON.parse(data.params)
            : data.params || {};

          if (data?.screen && data?.stack) {
            navigate(data.screen as keyof RootStackParamList, parsedParams);
          }

          if (parsedParams?.isQuiz) {
            dispatch(handleSheetView(BottomSheetViewTypes.Details));
            dispatch(setAcitveQuizes({
              id: parsedParams?.id,
              quiz: [...(parsedParams?.quiz || [])],
            }));
          }
        }

        if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'cancel-timer') {
          await notifee.cancelNotification(detail.notification?.id || 'timer-notification');
        }
      } catch (err) {
        console.error('Error handling foreground event:', err);
      }
    });

    // background or quit-state 
    const handleAppOpened = async (remoteMessage: any) => {
      try {
        // console.log(remoteMessage,"handleAppOpened:remoteMessage")
        if (!remoteMessage) return;
        const data = remoteMessage?.data;
        if (!data?.screen || !data?.stack) return;

        const parsedParams = typeof data.params === 'string'
          ? JSON.parse(data.params)
          : data.params || {};

        if (data?.screen && data?.stack) {
          navigate(data.screen as keyof RootStackParamList, parsedParams);
        }

        if (parsedParams?.isQuiz) {
          dispatch(handleSheetView(BottomSheetViewTypes.Details));
          dispatch(setAcitveQuizes({
            id: parsedParams?.id,
            quiz: [...(parsedParams?.quiz || [])],
          }));
        }
      } catch (err) {
        console.error('Error handling opened notification:', err);
      }
    };

    const unsubscribeOpened = messaging().onNotificationOpenedApp(message => {
      if (message?.data?.screen && message?.data?.stack) {
        handleAppOpened(message);
      } else {
        console.log('No navigation data:Background', message?.data);
      }
    });

    messaging().getInitialNotification().then(message => {
      if (message?.data?.screen && message?.data?.stack) {
        handleAppOpened(message);
      } else {
        console.log('No navigation data:getInitialNotification', message?.data);
      }
    });

    return () => {
      unsubscribeOnMessage();
      unsubscribeForegroundEvent();
      unsubscribeOpened();
    };
  }, [isReady]);

  if (isReady) {
    return (
      <NavigationContainer
        ref={navigationRef}
        initialState={activeTab}
        onStateChange={state => dispatch(setTab(state))}
      >
        <MainNavigation />
      </NavigationContainer>
    );
  } else {
    return <ScreenLoader open={true} testID="screen-loader" />;
  }
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BottomSheetModalProvider>
            <AppInitializer />
          </BottomSheetModalProvider>
        </QueryClientProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
