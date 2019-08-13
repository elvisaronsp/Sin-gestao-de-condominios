import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';

import SList, { SListItem } from '../../components/List';
import SImage from '../../components/Image';
import Layout from '../../constants/Layout';
import SItem from '../../components/Item';
import SText from '../../components/Text';
import UtilFunctions from '../../util/UtilFunctions';
import Colors from '../../constants/Colors';
import SIcon from '../../components/Icon';
import NavigationKeys from '../../constants/NavigationKeys';

class Locais extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SList>
        {(this.props.reservas.locais || []).map(local => {
          const imageUrl = ((local.fotos || [])[0] || {}).url;
          return (
            <SListItem key={local.id} style={{ marginLeft: 0, paddingRight: 0, width: '100%' }}>
              <SItem style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                <SItem style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <SItem>
                    <SImage source={{
                      uri: UtilFunctions.getImageUrl(imageUrl),
                      method: 'GET',
                      headers: {
                        Token: this.props.home.loginInfo.token
                      }
                    }}
                      style={{ ...Layout.slightlyRounded, ...(Layout.isSmallDevice ? { width: 55, height: 35 } : { width: 110, height: 70 }) }}
                    />
                  </SItem>
                  <SItem
                    button
                    onPress={() => this.goToAdicionarReserva(local)}
                    style={{ paddingLeft: 10, paddingRight: 10, borderBottomWidth: 0, flexDirection: 'column', alignItems: 'flex-start' }}
                  >
                    <SText style={{ fontSize: 18, fontWeight: 'bold', color: Colors.darkGreyText }}>{local.descricao}</SText>
                    <SText style={styles.itemText}>Capacidade: {local.capacidade}</SText>
                    <SText style={styles.itemText}>Custo: {UtilFunctions.getCurrencyFormat(local.valor)}</SText>
                  </SItem>
                </SItem>
                <SItem
                  style={{ position: 'absolute', right: 0, borderBottomWidth: 0, width: 50, flexDirection: 'row', justifyContent: 'flex-end' }}
                  onPress={() => this.goToAdicionarReserva(local)}
                >
                  <SIcon style={{ color: Colors.systemBaseColor }} name="arrow-forward" />
                </SItem>
              </SItem>
            </SListItem>
          );
        })}
      </SList>
    );
  }

  goToAdicionarReserva(local) {
    this.props.navigation.navigate(NavigationKeys.ADICIONAR_RESERVA, { local });
  }
}

const mapStateToProps = state => {
  return { home: state.home, reservas: state.reservas };
};

const mapDispatchToProps = dispatch => {
  return {
    setReservasData: data => dispatch(setReservasData(data)),
    resetReservasData: () => dispatch(resetReservasData())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Locais);

const styles = StyleSheet.create({
  itemText: {
    fontSize: 15,
    color: Colors.darkGreyText
  }
});