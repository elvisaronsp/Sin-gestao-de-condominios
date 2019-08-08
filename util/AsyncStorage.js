import { AsyncStorage } from 'react-native';
import AsyncStorageKeys from '../constants/AsyncStorageKeys';

export default class SAsyncStorage {
  static async saveLogin(login) {
    const fisrtUnity = login.objeto.condominio && login.objeto.condominio.unidades ? login.objeto.condominio.unidades[0] || {} : {};
    return await AsyncStorage.multiSet([
      [AsyncStorageKeys.LOGIN_INFO, JSON.stringify(login.objeto)],
      [AsyncStorageKeys.UNIDADE_SELECIONADA, JSON.stringify(fisrtUnity)]
    ]);
  }

  static async getLoginToken() {
    const loginInfo = await this.getLoginInfo();
    return loginInfo ? loginInfo.token : undefined;
  }

  static async getLoginInfo() {
    const loginInfo = await AsyncStorage.getItem(AsyncStorageKeys.LOGIN_INFO);
    return JSON.parse(loginInfo);
  }

  static async getUnidadeSelecionada() {
    const unidadeSelecionada = await AsyncStorage.getItem(AsyncStorageKeys.UNIDADE_SELECIONADA);
    return JSON.parse(unidadeSelecionada);
  }

  static async setUnidadeSelecionada(unidade) {
    return await AsyncStorage.setItem(AsyncStorageKeys.UNIDADE_SELECIONADA, JSON.stringify(unidade));
  }

  static async setPrimeiroLogin() {
    return await AsyncStorage.setItem(AsyncStorageKeys.PRIMEIRO_LOGIN, 'true');
  }

  static async isFirstLogin() {
    const isPrimeiroLogin = await AsyncStorage.getItem(AsyncStorageKeys.PRIMEIRO_LOGIN);
    return isPrimeiroLogin == null;
  }

  static async getUnidades() {
    const loginInfo = await AsyncStorage.getItem(AsyncStorageKeys.LOGIN_INFO);
    return JSON.parse(loginInfo).condominio.unidades;
  }

  static async removeStorage() {
    return await AsyncStorage.multiRemove([AsyncStorageKeys.LOGIN_INFO, AsyncStorageKeys.TOKEN, AsyncStorageKeys.UNIDADE_SELECIONADA]);
  }
}