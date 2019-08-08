import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import { fromRight } from 'react-navigation-transitions';

import ReservasScreen from '../screens/reservas/ReservasScreen';
import BoletosScreen from '../screens/BoletosScreen';
import SIcon from '../components/Icon';
import Colors from '../constants/Colors';
import SBottomTabBar from '../components/bottomTabBar';
import HomeScreen from '../screens/HomeScreen';
import NavigationKeys from '../constants/NavigationKeys';
import AdicionarReservaScreen from '../screens/reservas/AdicionarReservaScreen';
import MinhaReservaScreen from '../screens/reservas/MinhaReservaScreen';

import PerfilScreen from '../screens/PerfilScreen';
import FotosScreen from '../screens/fotos/FotosScreen';
import AlbumScreen from '../screens/fotos/AlbumScreen';
import AvisosScreen from '../screens/avisos/AvisosScreen';
import ConfiguracaoAvisosScreen from '../screens/avisos/ConfiguracaoAvisosScreen';
import { ConfiguracoesScreen } from '../screens/configuracoes/ConfiguracoesScreen';
import AlterarSenhaScreen from '../screens/configuracoes/AlterarSenhaScreen';

const HomeStack = createStackNavigator({
  [NavigationKeys.HOME]: HomeScreen,
  [NavigationKeys.PERFIL]: { screen: PerfilScreen },
  [NavigationKeys.FOTOS]: createStackNavigator({
    [NavigationKeys.FOTOS]: FotosScreen,
    [NavigationKeys.ALBUM]: AlbumScreen
  }, {
      transitionConfig: () => fromRight(500)
    }
  ),
  [NavigationKeys.AVISOS]: createStackNavigator({
    [NavigationKeys.AVISOS]: AvisosScreen,
    [NavigationKeys.CONFIGURACAO_AVISOS]: ConfiguracaoAvisosScreen
  }, {
      transitionConfig: () => fromRight(700)
    }
  ),
  [NavigationKeys.CONFIGURACOES]: createStackNavigator({
    [NavigationKeys.CONFIGURACOES]: ConfiguracoesScreen,
    [NavigationKeys.ALTERAR_SENHA]: AlterarSenhaScreen
  }, {
      transitionConfig: () => fromRight(700)
    }
  )
}, {
    headerMode: 'none'
  }
);

HomeStack.navigationOptions = {
  tabBarLabel: () => { },
  tabBarIcon: ({ focused }) => (
    <SIcon
      active={focused}
      name="home"
      style={{ color: focused ? Colors.systemBaseColor : Colors.greyText, fontSize: 40 }}
    />
  )
};

const BoletosStack = createStackNavigator({
  [NavigationKeys.BOLETOS]: BoletosScreen
});

BoletosStack.navigationOptions = {
  tabBarLabel: () => { },
  tabBarIcon: ({ focused }) => (
    <SIcon
      active={focused}
      name="document"
      style={{ color: focused ? Colors.systemBaseColor : Colors.greyText, fontSize: 40 }}
    />
  )
};

const ReservasStack = createStackNavigator({
  [NavigationKeys.RESERVAS]: ReservasScreen,
  [NavigationKeys.ADICIONAR_RESERVA]: AdicionarReservaScreen,
  [NavigationKeys.MINHA_RESERVA]: MinhaReservaScreen
});

ReservasStack.navigationOptions = {
  tabBarLabel: () => { },
  tabBarIcon: ({ focused }) => (
    <SIcon
      active={focused}
      name="calendar"
      style={{ color: focused ? Colors.systemBaseColor : Colors.greyText, fontSize: 40 }}
    />
  )
};

const bottomTabNavigator = createBottomTabNavigator(
  {
    HomeStack,
    BoletosStack,
    ReservasStack
  },
  {
    tabBarComponent: SBottomTabBar
  }
);

export default bottomTabNavigator;
