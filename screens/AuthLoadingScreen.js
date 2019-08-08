import React from 'react';

import SText from '../components/Text';
import NavigationKeys from '../constants/NavigationKeys';
import SAsyncStorage from '../util/AsyncStorage';

export default class AuthLoadingScreen extends React.PureComponent {
  async componentWillMount() {
    const isFirstLogin = await SAsyncStorage.isFirstLogin();
    if (isFirstLogin) {
      this.props.navigation.navigate(NavigationKeys.PRIMEIRO_ACESSO);
    } else {
      if (await this.isLoggedIn()) {
        this.props.navigation.navigate(NavigationKeys.MAIN);
      } else {
        this.props.navigation.navigate(NavigationKeys.LOGIN);
      }
    }
  }

  render() {
    return <SText></SText>;
  }

  async isLoggedIn() {
    return await SAsyncStorage.getLoginToken();
  }
}