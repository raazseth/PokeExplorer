import React, { JSX, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  heightPixel,
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from '@utils/sizeNormalization';
import { BorderRadius, Color, FontSize } from '@typed/enum';

interface IInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  label?: string;
  labelStyle?: TextStyle;
  value?: string;
  error?: boolean;
  errorMessage?: string;
  type?: 'text' | 'password' | 'select';
  options?: { label: string; value: any }[];
  icon?: JSX.Element;
  iconSide?: 'left' | 'right';
  onChangeText: (text: string) => void;
}

const Input: React.FC<IInputProps> = ({
  containerStyle,
  label,
  labelStyle,
  style,
  value,
  onChangeText,
  type = 'text',
  iconSide = 'right',
  icon,
  error = false,
  errorMessage = '',
  options = [],
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const renderInput = () => {
    if (type === 'select') {
      // return (
      //   <RNPickerSelect
      //     value={value}
      //     onValueChange={onChangeText}
      //     placeholder={{ label: inputProps?.placeholder, value: null }}
      //     style={{
      //       inputAndroid: styles.input,
      //       inputIOS: styles.input,
      //       iconContainer: styles.iconContainer,
      //     }}
      //     useNativeAndroidPickerStyle={false}
      //     Icon={() => <FontAwesome name="angle-down" size={widthPixel(20)} />}
      //     items={options}
      //   />
      // );
    }

    return (
      <TextInput
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={type === 'password' && !isPasswordVisible}
        placeholderTextColor="#A0A0A0"
        style={[styles.input, error && styles.errorInput, style]}
        {...inputProps}
      />
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[containerStyle]}>
        {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
        <View style={[styles.inputContainer, error && styles.errorBorder, isFocused && styles.focusedBorder]}>
          {icon && iconSide === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          {renderInput()}
          {type === 'password' ? (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.iconRight}>
              <FontAwesome
                name={isPasswordVisible ? 'eye' : 'eye-slash'}
                size={20}
                color="#A0A0A0"
              />
            </TouchableOpacity>
          ) : (
            icon &&
            iconSide === 'right' && <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
        {error && errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Input;

const styles = StyleSheet.create({
  label: {
    fontSize: FontSize.lg,
    color: '#333',
    opacity: 0.9,
    marginBottom: pixelSizeVertical(2),
  },
  inputContainer: {
    width: '100%',
    backgroundColor: Color.White,
    borderRadius: BorderRadius.Large,
    height: heightPixel(54),
    paddingHorizontal: pixelSizeHorizontal(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    marginTop: 8,
    marginBottom: 6,
  },
  focusedBorder: {
    borderColor: Color.Secondary,
  },
  input: {
    flex: 1,
    fontSize: fontPixel(16),
    color: '#636363',
  },
  errorInput: {
    color: 'red',
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: fontPixel(14),
    marginBottom: pixelSizeVertical(4),
  },
  iconLeft: {
    marginRight: pixelSizeHorizontal(10),
  },
  iconRight: {
    marginLeft: pixelSizeHorizontal(10),
  },
  iconContainer: {
    position: 'absolute',
    right: pixelSizeHorizontal(5),
    top: '50%',
  },
});