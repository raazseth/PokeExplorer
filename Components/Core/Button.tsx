import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  TextStyle,
  ViewStyle,
  ActivityIndicator,
  Text,
} from 'react-native';
import {heightPixel} from '@utils/sizeNormalization';
import {Color, FontSize, Variant, BorderRadius} from '@typed/enum';

interface IButtonProps extends TouchableOpacityProps {
  labelStyle?: TextStyle;
  children?: React.ReactNode;
  style?: ViewStyle;
  variant?: Variant;
  isLoading?: boolean;
  fontSize?: FontSize;
  borderRadius?: BorderRadius;
}

const Button: React.FC<IButtonProps> = ({
  children,
  style,
  labelStyle,
  isLoading = false,
  disabled = false,
  variant = Variant.Primary,
  fontSize = FontSize['lg'],
  borderRadius = BorderRadius.Small,
  activeOpacity = 0.8,
  ...props
}) => {
  const variantStyles: Record<Variant, ViewStyle> = {
    [Variant.Primary]: {backgroundColor: Color.Primary},
    [Variant.Secondary]: {backgroundColor: Color.Secondary},
    [Variant.Link]: {backgroundColor: 'transparent'},
    [Variant.Transparent]: {backgroundColor: 'transparent'},
  };

  const textColor: Record<Variant, string> = {
    [Variant.Primary]: Color.TextPrimary,
    [Variant.Secondary]: Color.White,
    [Variant.Link]: Color.Primary,
    [Variant.Transparent]: Color.Primary,
  };

  return (
    <TouchableOpacity
      disabled={disabled || isLoading}
      activeOpacity={activeOpacity}
      style={[
        styles.container,
        variantStyles[variant],
        {
          opacity: disabled ? 0.6 : 1,
          borderRadius: heightPixel(borderRadius),
          borderWidth: variant === Variant.Transparent ? 1 : 0,
          borderColor:
            variant === Variant.Transparent ? Color.Dark : 'transparent',
        },

        style,
      ]}
      {...props}>
      {isLoading ? (
        <ActivityIndicator size="small" color={textColor[variant]} />
      ) : typeof children === 'string' ? (
        <Text
          style={[
            styles.label,
            {fontSize, color: textColor[variant]},
            labelStyle,
          ]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    height: heightPixel(52),
  },
  label: {
    textAlign: 'center',
  },
});

export default Button;
