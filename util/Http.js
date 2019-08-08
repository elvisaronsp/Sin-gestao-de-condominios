import Axios from "axios";
import SAsyncStorage from "./AsyncStorage";
import NavigationKeys from '../constants/NavigationKeys';

let homeNavigator = () => null;

export function setHomeNavigator(navigator) {
  homeNavigator = navigator;
}

const SHttp = Axios.create({
  baseURL: 'http://www.icondev.com.br/IconAPI/app',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  }
});

SHttp.interceptors.request.use(async options => {
  options.headers['Token'] = options.headers['Token'] || await SAsyncStorage.getLoginToken();
  return options;
}, error => Promise.reject(error));

SHttp.interceptors.response.use(async data => {
  return data;
}, error => {
  if (error.response && error.response.data && (error.response.data.mensagem === 'Token invÃ¡lido' || error.response.data.mensagem === 'Token inválido' || error.response.data.mensagem === 'Token invalido')) {
    SAsyncStorage.removeStorage();
    homeNavigator(NavigationKeys.LOGIN);
    alert('Sessão expirada, faça login novamente!');
  }
  return Promise.reject(error);
});

export default SHttp;