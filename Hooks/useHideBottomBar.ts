import {useLayoutEffect} from 'react';
import {useNavigation, useNavigationState} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {AuthState} from '@redux/Auth/authSlice';
import {tabBarStyle} from '@navigation/TabNavigation';
import {BottomSheetViewTypes} from '@typed/enum';

export default function useHideBottomBar() {
  const navigation = useNavigation();
  const parentNav = navigation.getParent();
  const {bottomSheet} = useSelector((state: any) => state.auth as AuthState);

  const routes = useNavigationState(state => state.routes);
  const currentRoute = routes[routes.length - 1];

  const isBottomSheet = bottomSheet !== BottomSheetViewTypes.Close;

  useLayoutEffect(() => {
    const shouldHide =
      isBottomSheet || (routes.length > 1 && currentRoute?.name !== routes[0].name);

    if (shouldHide) {
      parentNav?.setOptions({
        tabBarStyle: {display: 'none', height: 0},
        tabBarVisible: false,
      });
    } else {
      parentNav?.setOptions({
        tabBarStyle,
        tabBarVisible: true,
      });
    }

    return () => {
      parentNav?.setOptions({
        tabBarStyle,
        tabBarVisible: true,
      });
    };
  }, [routes.length, currentRoute?.name, isBottomSheet]);
}
