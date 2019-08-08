import React from 'react';
import ScreenCardLayout from '../../components/ScreenCardLayout';
import SList, { SListItem } from '../../components/List';
import NavigationKeys from '../../constants/NavigationKeys';
import { Body } from 'native-base';
import SRight from '../../components/Right';
import SIcon from '../../components/Icon';
import SText from '../../components/Text';
import Layout from '../../constants/Layout';

const configuracoesItems = [
  { title: 'Alterar senha', goTo: NavigationKeys.ALTERAR_SENHA }
];

export class ConfiguracoesScreen extends React.Component {
  static navigationOptions = Layout.navigationNullHeader;

  render() {
    return (
      <ScreenCardLayout
        navigateProp={this.props.navigation.navigate}
        headerTitle="Configurações"
      >
        <SList>
          {configuracoesItems.map((item, index) => {
            return (
              <SListItem key={index} onPress={() => this.props.navigation.navigate(item.goTo)}>
                <Body style={Layout.noLeftBody}>
                  <SText style={Layout.listItemDescriptionTextStyle}>{item.title}</SText>
                </Body>
                <SRight>
                  <SIcon name="arrow-forward" />
                </SRight>
              </SListItem>
            );
          })}
        </SList>
      </ScreenCardLayout>
    );
  }
}