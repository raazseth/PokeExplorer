import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, { EventType } from '@notifee/react-native';

notifee.onBackgroundEvent(async ({type, detail}) => {
  console.log('Background notification event:', type, detail);

  if (type === EventType.ACTION_PRESS || type === EventType.PRESS) {
  }
});

AppRegistry.registerComponent(appName, () => App);
