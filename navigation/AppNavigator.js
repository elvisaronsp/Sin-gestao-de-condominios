import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import { fromRight } from 'react-navigation-transitions';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import NavigationKeys from '../constants/NavigationKeys';
import PrimeiroAcessoScreen1 from '../screens/primeiroAcesso/PrimeiroAcessoScreen1';
import PrimeiroAcessoScreen2 from '../screens/primeiroAcesso/PrimeiroAcessoScreen2';
import PrimeiroAcessoScreen3 from '../screens/primeiroAcesso/PrimeiroAcessoScreen3';

export default createAppContainer(createSwitchNavigator(
  {
    [NavigationKeys.AUTH_LOADING]: AuthLoadingScreen,
    [NavigationKeys.LOGIN]: { screen: LoginScreen },
    [NavigationKeys.MAIN]: MainTabNavigator,
    [NavigationKeys.PRIMEIRO_ACESSO]: createStackNavigator({
      [NavigationKeys.PRIMEIRO_ACESSO_SCREEN_1]: PrimeiroAcessoScreen1,
      [NavigationKeys.PRIMEIRO_ACESSO_SCREEN_2]: PrimeiroAcessoScreen2,
      [NavigationKeys.PRIMEIRO_ACESSO_SCREEN_3]: PrimeiroAcessoScreen3
    }, {
        transitionConfig: () => fromRight(700)
      }
    )
  },
  {
    initialRouteName: NavigationKeys.AUTH_LOADING
  }
));