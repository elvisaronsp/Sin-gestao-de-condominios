import React from 'react';

import Layout from '../../constants/Layout';
import NavigationKeys from '../../constants/NavigationKeys';
import { PrimeiroAcessoLayout } from './PrimeiroAcessoLayout';

const backgroundImage = require('../../assets/images/first-access-screen-2.png');

export default class PrimeiroAcessoScreen2 extends React.Component {
  static navigationOptions = Layout.navigationNullHeader;

  render() {
    return (
      <PrimeiroAcessoLayout
        backgroundImage={backgroundImage}
        title="Acesso fácil"
        subtitle="Acesse de onde estiver, quando quiser. Reserve o salão de festa em apenas 3 toques"
        navigateProp={this.props.navigation.navigate}
        navigateTo={NavigationKeys.PRIMEIRO_ACESSO_SCREEN_3}
        screenIndex={1}
      />
    );
  }
}