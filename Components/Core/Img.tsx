import React from 'react';
import {
  Image,
  ImageProps,
  ImageStyle,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SvgProps, SvgUri} from 'react-native-svg';
import {BorderRadius} from '@typed/enum';

interface IImgProps extends ImageProps {
  source: any;
  onPress?: () => void;
  activeOpacity?: number;
  variant?: 'rounded' | 'circle' | 'thumbnail' | 'none';
  type?: 'svg' | 'image';
  disabled?: boolean;
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  svgProps?: SvgProps;
  contain?: boolean;
}

const Img: React.FC<IImgProps> = ({
  source,
  onPress,
  activeOpacity,
  variant = 'none',
  type = 'image',
  disabled,
  style,
  containerStyle,
  contain,
  svgProps,
}: IImgProps) => {
  const linkRegex =
    /\b(?:https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[A-Z0-9+&@#\/%=~_|]/i;

  const isValidLink = (url: any) => linkRegex.test(url);

  const getBorderRadius = () => {
    const borderRadiusMap = {
      rounded: BorderRadius.Medium,
      circle: BorderRadius.Circle,
      thumbnail: BorderRadius.Small,
      none: 0,
    };
    return borderRadiusMap[variant] || 0;
  };

  const finalSource =
    type === 'image' && isValidLink(source) ? {uri: source} : source;

  const renderImage = () => {
    if (type === 'svg') {
      if (typeof source === 'function') {
        const SvgComponent = source;
        return (
          <View style={[style, {borderRadius: getBorderRadius()}]}>
            <SvgComponent
              width={style?.width || 24}
              height={style?.height || 24}
              {...svgProps}
            />
          </View>
        );
      }
      if (isValidLink(source)) {
        return <SvgUri uri={source} width={48} height={48} {...svgProps} />;
      }
    }

    if (isValidLink(source) && type === 'image') {
      return (
        <FastImage
          source={finalSource}
          style={StyleSheet.flatten([
            style,
            {borderRadius: getBorderRadius()} as any,
          ])}
          resizeMode={FastImage.resizeMode[contain ? 'contain' : 'cover']}
        />
      );
    }

    return (
      <Image
        source={finalSource}
        style={[style, {borderRadius: getBorderRadius()}]}
      />
    );
  };

  return onPress ? (
    <TouchableOpacity
      activeOpacity={activeOpacity ?? 0.8}
      onPress={onPress}
      style={containerStyle}
      disabled={disabled}>
      {renderImage()}
    </TouchableOpacity>
  ) : (
    <View style={containerStyle}>{renderImage()}</View>
  );
};

export default Img;
