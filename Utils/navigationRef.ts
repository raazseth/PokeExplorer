import {AuthStackParamList} from '@navigation/AuthStack';
import {TabStackParamList} from '@navigation/TabNavigation';

import {createNavigationContainerRef} from '@react-navigation/native';

export type RootStackParamList = {
  Auth: AuthStackParamList;
  TabNavigation: TabStackParamList;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate<RouteName extends keyof RootStackParamList>(
  ...args: undefined extends RootStackParamList[RouteName]
    ?
        | [screen: RouteName]
        | [screen: RouteName, params: RootStackParamList[RouteName]]
    : [screen: RouteName, params: RootStackParamList[RouteName]]
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(...(args as any));
  }
}
