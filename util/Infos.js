import AppConstants from 'expo-constants';
import { Platform } from "expo-core";

const isIOS = function () {
  return Platform.OS === 'ios';
}

const isAndroid = function () {
  return Platform.OS === 'android';
}

export default {
  isIOS,
  isAndroid,
  appVersion: AppConstants.manifest.version,
}