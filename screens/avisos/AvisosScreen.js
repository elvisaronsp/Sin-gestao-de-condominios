import React from 'react';

import SContainer from '../../components/Container';
import ScreenCardLayout from '../../components/ScreenCardLayout';
import SItem from '../../components/Item';
import SText from '../../components/Text';
import SView from '../../components/View';
import Layout from '../../constants/Layout';
import SIcon from '../../components/Icon';
import Colors from '../../constants/Colors';
import SButton from '../../components/Button';
import NavigationKeys from '../../constants/NavigationKeys';

export default class AvisosScreen extends React.Component {
  static navigationOptions = Layout.navigationNullHeader;

  render() {
    return (
      <SContainer>
        <ScreenCardLayout
          navigateProp={this.props.navigation.navigate}
          headerTitle="Avisos"
          noBottomTab
          titleComponent={
            <SItem style={{ width: '100%', ...Layout.centered }}>
              <SText style={Layout.ScreenCardLayoutTitle}>
                Seus avisos estão aqui
              </SText>
            </SItem>
          }
          headerRightComponent={
            <SButton
              transparent
              rounded
              style={Layout.headerButtonRight}
              onPress={() => this.props.navigation.navigate(NavigationKeys.CONFIGURACAO_AVISOS)}
            >
              <SIcon name="cog" style={{ color: Colors.white }} />
            </SButton>
          }
        >
          <SView>
            <SText style={{ textAlign: 'center', fontSize: 16 }}>Você não possui nenhum aviso no momento!</SText>
          </SView>
        </ScreenCardLayout>
      </SContainer>
    );
  }
}