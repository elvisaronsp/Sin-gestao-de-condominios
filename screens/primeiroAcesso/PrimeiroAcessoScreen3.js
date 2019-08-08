import React from 'react';

import Layout from '../../constants/Layout';
import NavigationKeys from '../../constants/NavigationKeys';
import { PrimeiroAcessoLayout } from './PrimeiroAcessoLayout';

const backgroundImage = require('../../assets/images/first-access-screen-3.png');

export default class PrimeiroAcessoScreen3 extends React.Component {
  static navigationOptions = Layout.navigationNullHeader;

  render() {
    return (
      <PrimeiroAcessoLayout
        backgroundImage={backgroundImage}
        title="Segurança"
        subtitle="Comunicação com segurança e facilidade. Tudo em um aplicativo."
        navigateProp={this.props.navigation.navigate}
        navigateTo={NavigationKeys.LOGIN}
        buttonText="Entrar"
        screenIndex={2}
      />
    );
  }
}