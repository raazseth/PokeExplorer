import React from 'react';
import {
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { TextVariant, FontSize, Color } from '@typed/enum';

interface ITypographyProps extends TextProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: TextStyle;
  containerStyle?: TouchableOpacityProps['style'] | ViewStyle;
  disabled?: boolean;
  variant?: TextVariant;
  color?: Color;
  activeOpacity?: number;
}

const Typography: React.FC<ITypographyProps> = ({
  children,
  onPress,
  style,
  activeOpacity = 0.5,
  containerStyle,
  variant = TextVariant.Body,
  disabled = false,
  color = Color.Dark,
  ...textProps
}) => {
  const variantStyles: Record<TextVariant, TextStyle> = {
    [TextVariant.XlHeading]: {
      fontSize: FontSize['3xl'],
      fontWeight: 'bold',
      color: Color.Dark,
    },
    [TextVariant.Heading]: {
      fontSize: FontSize['2xl'],
      fontWeight: 'bold',
      color: Color.Dark,
    },
    [TextVariant.Subheading]: {
      fontSize: FontSize['1.5xl'],
      color: Color.Dark,
    },
    [TextVariant.Body]: {
      fontSize: FontSize.lg,
      color: Color.Dark,
    },
    [TextVariant.Caption]: {
      fontSize: FontSize.sm,
      color: Color.Dark,
    },
    [TextVariant.Link]: {
      fontSize: FontSize.lg,
      color: Color.Primary,
      textDecorationLine: 'underline',
    },
  };

  const textStyle: TextStyle = {
    ...variantStyles[variant],
    color: color ?? style?.color ?? Color.Dark,
    opacity: disabled ? 0.5 : 1,
  };

  return onPress ? (
    <TouchableOpacity
      style={containerStyle}
      activeOpacity={activeOpacity}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.baseText, textStyle, style]} {...textProps}>
        {children}
      </Text>
    </TouchableOpacity>
  ) : (
    <Text style={[styles.baseText, textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typography;

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Poppins',
  },
});
