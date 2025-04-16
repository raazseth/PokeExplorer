import React, { useEffect, useRef } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { BottomSheetViewTypes, Color } from '@typed/enum';
import Header, { IHeader } from './Header';
import BottomSheetBox from '@components/BottomSheetBox';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useSelector } from 'react-redux';
import { AuthState } from '@redux/Auth/authSlice';
import { pixelSizeVertical } from '@utils/sizeNormalization';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

interface BodyProps {
  variant?: 'Auth' | 'Page';
  children?: React.ReactNode;
  style?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
  showRefreshControl?: boolean;
  loading?: boolean;
  scrollEnabled?: boolean;
  backgroundColor?: string;
  keyboardAvoiding?: boolean;
  showHeader?: boolean;
  headerProps?: IHeader;
}

const Body: React.FC<BodyProps> = ({
  children,
  style,
  refreshing = false,
  onRefresh,
  showRefreshControl = false,
  loading = false,
  scrollEnabled = true,
  backgroundColor = Color.White,
  keyboardAvoiding = true,
  showHeader = true,
  headerProps,
}) => {
  const sheetRef = useRef<BottomSheetMethods | null>(null);
  const auth = useSelector((state: any) => state.auth as AuthState);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const isBottomSheet = auth.bottomSheet !== BottomSheetViewTypes.Close;

    const timeout = setTimeout(() => {
      if (sheetRef.current) {
        if (isBottomSheet) {
          sheetRef.current.expand();
        } else {
          sheetRef.current.close();
        }
      }
    }, 50);

    return () => clearTimeout(timeout);
  }, [auth.bottomSheet]);

  const Wrapper = keyboardAvoiding ? KeyboardAvoidingView : View;

  return (
    <Wrapper
      {...(keyboardAvoiding && {
        behavior: Platform.OS === 'ios' ? 'padding' : undefined,
        style: { flex: 1, paddingTop: insets.top },
      })}>
      <View style={[styles.container, { backgroundColor }]}>
        <ScrollView
          scrollEnabled={scrollEnabled && !loading}
          refreshControl={
            showRefreshControl ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ) : undefined
          }
          contentContainerStyle={[styles.contentContainer, { backgroundColor }]}
          showsVerticalScrollIndicator={false}>
          <View style={[styles.content, { backgroundColor }, style]}>
            {showHeader && <Header {...(headerProps ?? headerProps)} />}
            {children}
            {auth.bottomSheet !== BottomSheetViewTypes.Close && (
              <SafeAreaView
                style={{
                  flex: 1,
                  zIndex: 100,
                  marginBottom: pixelSizeVertical(-24),
                }}>
                <BottomSheetBox ref={sheetRef} />
              </SafeAreaView>
            )}
          </View>
        </ScrollView>
      </View>
    </Wrapper>
  );
};

export default Body;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  content: {
    paddingBottom: 20,
  },
});
