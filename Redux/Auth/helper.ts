import {SECRET_KEY} from '@config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'react-native-crypto-js';

const handleAsyncStorage = async (
  asyncOperation: Promise<string | null>,
  description: string,
): Promise<string | null> => {
  try {
    return await asyncOperation;
  } catch (error) {
    console.error(`Error during ${description}:`, error);
    return null;
  }
};

const encryptData = (data: any): string => {
  const stringifiedData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringifiedData, SECRET_KEY).toString();
};

const decryptData = (encryptedData: string): any | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData ? JSON.parse(decryptedData) : null;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};
const saveToLocal = async (key: string, value: any): Promise<void> => {
  try {
    const encryptedValue = encryptData(value);
    await AsyncStorage.setItem(key, encryptedValue);
  } catch (error) {
    console.error(`Error saving data to key "${key}":`, error);
  }
};

const getFromLocal = async (key: string): Promise<any | null> => {
  try {
    const encryptedData = await handleAsyncStorage(
      AsyncStorage.getItem(key),
      `retrieve data for key "${key}"`,
    );

    if (!encryptedData) {
      console.warn(`No data found for key "${key}"`);
      return null;
    }

    const decryptedData = decryptData(encryptedData);
    if (!decryptedData) {
      console.warn(`Failed to decrypt data for key "${key}"`);
      return null;
    }

    return decryptedData;
  } catch (error) {
    console.error(`Error retrieving data from key "${key}":`, error);
    return null;
  }
};

const removeFromLocal = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key "${key}":`, error);
  }
};

export const saveUserToLocal = (user: any) => saveToLocal('AUTH', user);
export const getUserFromLocal = () => getFromLocal('AUTH');
export const removeUserFromLocal = () => removeFromLocal('AUTH');

export const saveWishlistToLocal = (wishlist: any) =>
  saveToLocal('WISHLIST', wishlist);
export const getWishlistFromLocal = () => getFromLocal('WISHLIST');
export const removeWishlistFromLocal = () => removeFromLocal('WISHLIST');

export const saveTabToLocal = (tab: any) => saveToLocal('TAB', tab);
export const getTabFromLocal = () => getFromLocal('TAB');
export const removeTabFromLocal = () => removeFromLocal('TAB');
