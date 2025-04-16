import React, { forwardRef, useEffect } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { AuthState, handleSheetView } from '@redux/Auth/authSlice';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import ProfileSheet from './ProfileSheet';
import { BottomSheetViewTypes } from '@typed/enum';
import DetailsSheet from './DetailsSheet';
import { pixelSizeVertical } from '@utils/sizeNormalization';
import { AppDispatch } from '@redux/store';

type Props = {
  meta?: any;
};

const BottomSheetBox = forwardRef<BottomSheetMethods, Props>(({ meta }, ref) => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: any) => state.auth as AuthState);

  useEffect(() => {
    if (!ref || typeof ref !== 'object' || !ref.current) return;

    if (auth.bottomSheet === BottomSheetViewTypes.Profile || auth.bottomSheet === BottomSheetViewTypes.Details) {
      ref.current?.expand();
    } else if (auth.bottomSheet === BottomSheetViewTypes.Close) {
      ref.current?.close();
      dispatch(handleSheetView(BottomSheetViewTypes.Close));
    }
  }, [auth.bottomSheet]);

  const getBottomSheetConfig = () => {
    switch (auth.bottomSheet) {
      case 1:
        return {
          component: <ProfileSheet />,
          snapPoints: ['10%', '64%'],
        };
      case 2:
        return {
          component: <DetailsSheet meta={meta as any} />,
          snapPoints: ['10%', '88%'],
        };
      default:
        return {
          component: null,
          snapPoints: ['1%'],
        };
    }
  };

  return (
    <BottomSheet
      ref={ref}
      index={1}
      style={auth.bottomSheet === BottomSheetViewTypes.Close && { display: "none" }}
      snapPoints={getBottomSheetConfig().snapPoints}
      enablePanDownToClose
      onChange={(idx) => {
        if (idx === -1) {
          dispatch(handleSheetView(BottomSheetViewTypes.Close))
        } else {
          if (!ref || typeof ref !== 'object' || !ref.current) return;
          ref?.current?.expand()
        }
      }}
      backgroundStyle={{ backgroundColor: '#fff', marginBottom: pixelSizeVertical(-20) }}>
      <BottomSheetView style={{ flex: 1 }}>
        {getBottomSheetConfig().component}
      </BottomSheetView>
    </BottomSheet>
  );
});

export default BottomSheetBox;
