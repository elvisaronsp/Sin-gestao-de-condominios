import React from 'react';

import Layout from '../../constants/Layout';
import NavigationKeys from '../../constants/NavigationKeys';
import { PrimeiroAcessoLayout } from './PrimeiroAcessoLayout';

const backgroundImage = require('../../assets/images/first-access-screen-1.png');

export default class PrimeiroAcessoScreen1 extends React.Component {
  static navigationOptions = Layout.navigationNullHeader;

  render() {
    return (
      <PrimeiroAcessoLayout
        backgroundImage={backgroundImage}
        title="Bem vindo ao SIN"
        subtitle="O seu condomínio na palma da sua mão"
        navigateProp={this.props.navigation.navigate}
        navigateTo={NavigationKeys.PRIMEIRO_ACESSO_SCREEN_2}
        screenIndex={0}
      />
    );
  }
}