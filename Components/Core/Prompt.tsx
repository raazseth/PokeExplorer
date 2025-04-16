import React from 'react';
import {View, ViewStyle} from 'react-native';
import {Snackbar} from 'react-native-paper';

export interface IPrompt {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onToggleSnackBar?: () => void;
  onActionPress?: () => void;
  actionLabel?: string;
  style?: ViewStyle;
}

const Prompt = (props: IPrompt) => {
  const {
    open,
    message,
    type,
    duration,
    style,
    actionLabel = 'Close',
    onToggleSnackBar,
    onActionPress,
  } = props;

  const getTheme = () => {
    switch (type) {
      case 'success':
        return {
          colors: {
            surface: 'green',
            onSurface: 'white',
          },
        };
      case 'error':
        return {
          colors: {
            surface: '#ED2224',
            onSurface: 'white',
          },
        };
      case 'warning':
        return {
          colors: {
            surface: 'yellow',
            onSurface: 'black',
          },
        };
      case 'info':
        return {
          colors: {
            surface: 'blue',
            onSurface: 'white',
          },
        };
      default:
        return {
          colors: {
            surface: 'blue',
            onSurface: 'white',
          },
        };
    }
  };

  return (
    <View>
      <Snackbar
        style={style || {zIndex: 1000}}
        visible={open}
        duration={duration || 1000}
        theme={{
          colors: {
            inverseSurface: getTheme().colors.surface,
            inverseOnSurface: getTheme().colors.onSurface,
          },
        }}
        onDismiss={onToggleSnackBar || (() => {})}
        action={{
          label: actionLabel || '',
          onPress: onActionPress,
          labelStyle: {
            color: getTheme().colors.onSurface,
          },
        }}>
        {message}
      </Snackbar>
    </View>
  );
};

export default Prompt;
