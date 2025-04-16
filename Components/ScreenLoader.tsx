import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
import {Color, FontSize, BorderRadius} from '@typed/enum';

interface ScreenLoaderProps {
  open?: boolean;
  networkInfo?: any;
  testID?:any
}

const ScreenLoader: React.FC<ScreenLoaderProps> = ({
  open = false,
  networkInfo,
}) => {
  const isOffline = networkInfo && !networkInfo.isConnected;

  return (
    <Modal transparent animationType="fade" visible={open || isOffline}>
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          {isOffline ? (
            <Text style={styles.offlineText}>No Internet Connection</Text>
          ) : (
            <ActivityIndicator size="large" color={Color.Primary} />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ScreenLoader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    backgroundColor: Color.White,
    padding: 20,
    borderRadius: BorderRadius.Medium,
    alignItems: 'center',
  },
  offlineText: {
    fontSize: FontSize.lg,
    color: Color.Dark,
    fontWeight: 'bold',
  },
});
