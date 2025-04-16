import notifee, {
  AndroidImportance,
  AndroidVisibility,
  TimestampTrigger,
  TriggerType,
  AndroidAction,
} from '@notifee/react-native';
import {Platform} from 'react-native';

interface TimerNotificationOptions {
  durationInSeconds: number;
  title?: string;
  description?: string;
  data?: {
    stack: string;
    screen: string;
    params?: Record<string, any>;
  };
  finish?: boolean;
}

export async function setTimerNotification({
  durationInSeconds,
  title,
  description,
  data,
  finish = false,
}: TimerNotificationOptions) {
  const endTime = Date.now() + durationInSeconds * 1000;

  const cancelAction: AndroidAction = {
    title: 'Cancel',
    pressAction: {
      id: 'cancel-timer',
    },
  };

  const androidChannelId = await notifee.createChannel({
    id: 'timer',
    name: 'Timer Notifications',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: 'default',
  });

  const baseNotificationData = {
    title: title || '⏳ Timer Running',
    body: description || 'Counting down...',
    data: data
      ? {
          stack: data.stack,
          screen: data.screen,
          ...(data.params && {params: JSON.stringify(data.params)}),
        }
      : undefined,
  };

  if (Platform.OS === 'android') {
    await notifee.displayNotification({
      id: 'timer-notification',
      ...baseNotificationData,
      android: {
        channelId: androidChannelId,
        showChronometer: true,
        chronometerDirection: 'down',
        timestamp: endTime,
        ongoing: true,
        onlyAlertOnce: true,
        smallIcon: 'ic_launcher',
        sound: 'default', 
        actions: [cancelAction],
        pressAction: {
          id: 'default',
        },
      },
    });

    setTimeout(async () => {
      await notifee.cancelNotification('timer-notification');

      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = durationInSeconds % 60;

      await notifee.displayNotification({
        title: finish ? 'Quiz Ended!' : 'Time’s up!',
        body: finish
          ? `You completed the quiz in ${minutes}m ${seconds}s.`
          : 'Your timer has ended.',
        android: {
          channelId: androidChannelId,
          smallIcon: 'ic_launcher',
          sound: 'default', 
        },
      });
    }, durationInSeconds * 1000);
  } else {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: endTime,
    };

    await notifee.createTriggerNotification(
      {
        title: finish ? 'Quiz Ended!' : 'Time’s up!',
        body: finish
          ? `You completed the quiz in ${Math.floor(durationInSeconds / 60)}m ${
              durationInSeconds % 60
            }s.`
          : `Your ${durationInSeconds}s timer has ended.`,
        data: baseNotificationData.data,
        ios: {
          sound: 'default', 
        },
      },
      trigger,
    );
  }
}
