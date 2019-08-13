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
import SHttp from '../../util/Http';
import Endpoints from '../../constants/Endpoints';
import { setReservasData, resetReservasData } from '../../store/ducks/ReservasStore';
import NavigationKeys from '../../constants/NavigationKeys';

class Locais extends React.PureComponent {
  constructor(props) {
    super(props);

    this.fetchReservasDetalhadas = this.fetchReservasDetalhadas.bind(this);
    this.getFetchFunc = this.getFetchFunc.bind(this);

    this.fetchReservasDetalhadas();
    this.navigationListener = props.navigation.addListener('didFocus', e => {
      this.fetchReservasDetalhadas();
    });
  }

  componentWillUnmount() {
    this.navigationListener.remove();
  }

  render() {
    return (
      <SList>
        {(this.props.reservas.minhasReservas || []).map(reserva => {
          const imageURL = (reserva.fotos[0] || {}).url;
          return (
            <SListItem key={reserva.idLocacao} style={{ marginLeft: 0, paddingRight: 0, width: '100%' }}>
              <SItem style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                <SItem style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <SItem>
                    <SImage source={{
                      uri: UtilFunctions.getImageUrl(imageURL),
                      method: 'GET',
                      headers: {
                        Token: this.props.home.loginInfo.token
                      }
                    }}
                      style={{ ...Layout.slightlyRounded, ...(Layout.isSmallDevice ? { width: 55, height: 35 } : { width: 110, height: 70 }) }}
                    />
                  </SItem>
                  <SItem
                    style={{ paddingLeft: 10, paddingRight: 10, borderBottomWidth: 0, flexDirection: 'column', alignItems: 'flex-start' }}
                    onPress={() => this.goToMinhaReserva(reserva)}
                  >
                    <SText style={{ fontSize: 18, fontWeight: 'bold', color: Colors.darkGreyText }}>{reserva.nome}</SText>
                    <SText style={styles.itemText}>Data: {UtilFunctions.getDateWithShortYear(reserva.data)}</SText>
                    <SText style={styles.itemText}>Custo: R$ {reserva.valor}</SText>
                    <SText style={styles.itemText}>Convidados: {reserva.convidados.length}</SText>
                  </SItem>
                </SItem>
                <SItem
                  style={{ position: 'absolute', right: 0, borderBottomWidth: 0, width: 50, flexDirection: 'row', justifyContent: 'flex-end' }}
                  onPress={() => this.goToMinhaReserva(reserva)}
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

  goToMinhaReserva(reserva) {
    this.props.navigation.navigate(NavigationKeys.MINHA_RESERVA, { reserva });
  }

  fetchReservasDetalhadas() {
    SHttp.get(Endpoints.MINHAS_RESERVAS, { params: { unidade: this.props.home.unidadeSelecionada.id } }).then(response => {
      const reservas = response.data.objeto;
      let reservasToFetch = [];
      Object.keys(reservas).forEach(key => {
        reservas[key].map(reserva => {
          reservasToFetch.push(this.getFetchFunc(reserva.idLocacao));
        });
      });
      Promise.all(reservasToFetch.map(reservaFetch => reservaFetch())).then(response => {
        this.props.setReservasData({ minhasReservas: response.map(r => r.data.objeto) });
      }, () => null);
    });
  }

  getFetchFunc(idLocacao) {
    const id = idLocacao;
    return function () {
      return SHttp.get(Endpoints.RESERVA_DETALHADA, { params: { idlocacao: id } });
    }
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