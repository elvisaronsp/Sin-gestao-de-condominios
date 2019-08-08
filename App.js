import React from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Colors from './constants/Colors';
import reducers from './store/Reducers';
import AppNavigator from './navigation/AppNavigator';
import SSpinner from './components/Spinner';

import { LocaleConfig } from 'react-native-calendars';
import SView from './components/View';
import { Root } from 'native-base';

LocaleConfig.locales['br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  dayNamesShort: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
};

LocaleConfig.defaultLocale = 'br';

const store = createStore(reducers);

export default class App extends React.PureComponent {
  state = {
    isLoadingComplete: false
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Root>
          <Provider id="root" store={store}>
            <SView style={styles.container}>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <AppNavigator />
            </SView>
            <SSpinner />
          </Provider>
        </Root>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'Roboto': require("native-base/Fonts/Roboto.ttf"),
        'Roboto_medium': require("native-base/Fonts/Roboto_medium.ttf")
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
});
