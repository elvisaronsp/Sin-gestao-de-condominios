import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Configs from '../../constants/Configs';
import Colors from '../../constants/Colors';
import SContainer from '../../components/Container';
import SDefaultHeader from '../../components/DefaultHeader';
import SContent from '../../components/Content';
import SCard, { SCardItem } from '../../components/Card';
import SItem from '../../components/Item';
import Layout from '../../constants/Layout';
import Types from '../../constants/Types';
import Locais from './Locais';
import MinhasReservas from './MinhasReservas';
import SButton from '../../components/Button';
import SText from '../../components/Text';
import SHttp from '../../util/Http';
import Endpoints from '../../constants/Endpoints';
import { setReservasData, resetReservasData } from '../../store/ducks/ReservasStore';

class ReservasScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.TypeButton = this.TypeButton.bind(this);
    this.isTypeActive = this.isTypeActive.bind(this);
    this.fetchLocaisAndReservas = this.fetchLocaisAndReservas.bind(this);
    this.fetchLocais = this.fetchLocais.bind(this);
    this.fetchReservas = this.fetchReservas.bind(this);

    this.props.navigation.addListener('willFocus', data => {
      if (!this.props.reservas.locais || this.props.reservas.locais.length === 0) {
        this.fetchLocaisAndReservas();
      }
    });
  }

  static navigationOptions = Layout.navigationNullHeader;

  render() {
    return (
      <SContainer>
        <SDefaultHeader navigateProp={this.props.navigation.navigate} title="Reservas" />
        <SContent style={{ marginTop: Configs.DEFAULT_HEADER.height / 2 * -1 }}>
          <SCard preset="large" rounded>
            <SItem style={styles.typeButtonsItem}>
              <this.TypeButton type={Types.reservas.LOCAIS} text="Locais" />
              <this.TypeButton type={Types.reservas.MINHAS_RESERVAS} text={Layout.isSmallDevice ? 'Minhas' : 'Minhas reservas'} />
            </SItem>
            <SCardItem style={{ paddingLeft: 0, paddingRight: 0 }}>
              <SContent
                style={{ maxHeight: Layout.height - Configs.DEFAULT_HEADER.height - Layout.typeButtonsItemHeight - Layout.contentMarginBottomInsideBottomTab - 20 }}
              >
                {this.isTypeActive(Types.reservas.LOCAIS) ?
                  <Locais navigation={this.props.navigation} /> :
                  <MinhasReservas navigation={this.props.navigation} />
                }
              </SContent>
            </SCardItem>
          </SCard>
        </SContent>
      </SContainer>
    );
  }

  TypeButton({ type, text }) {
    return (
      <SButton
        rounded
        block
        style={{
          minWidth: '40%',
          ...(Layout.isSmallDevice ? { width: '49%' } : {}),
          ...Layout.midShadow,
          backgroundColor: this.isTypeActive(type) ? Colors.systemBaseColor : Colors.white
        }}
        onPress={() => this.selectType(type)}
      >
        <SText style={{
          fontSize: Layout.typeButtonsFontSize,
          color: this.isTypeActive(type) ? Colors.white : Colors.systemBaseColor
        }}>{text}</SText>
      </SButton>
    );
  }

  fetchLocaisAndReservas() {
    Promise.all([this.fetchLocais(), this.fetchReservas()]).then(([locais, reservas]) => {
      this.props.setReservasData({ locais: locais.data.objeto, reservas: reservas.data.objeto });
    }, () => null);
  }

  fetchLocais() {
    return SHttp.get(Endpoints.LOCAIS_PARA_RESERVA);
  }

  fetchReservas() {
    return SHttp.get(Endpoints.MINHAS_RESERVAS, { params: { unidade: this.props.home.unidadeSelecionada.id } });
  }

  isTypeActive(type) {
    return this.props.reservas.activeReservaOption === type;
  }

  selectType(type) {
    this.props.setReservasData({ activeReservaOption: type });
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

export default connect(mapStateToProps, mapDispatchToProps)(ReservasScreen);

const styles = StyleSheet.create({
  typeButtonsItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: Layout.typeButtonsItemHeight,
    borderBottomWidth: 1
  }
});
