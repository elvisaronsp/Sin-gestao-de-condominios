import React from 'react';
import { Clipboard, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import SContainer from '../components/Container';
import Layout from '../constants/Layout';
import SText from '../components/Text';
import SItem from '../components/Item';
import SButton from '../components/Button';
import { setBoletosData, resetBoletosData, boletoEnvioEmailStatusConstants } from '../store/ducks/BoletosStore';
import Types from '../constants/Types';
import Colors from '../constants/Colors';
import SHttp from '../util/Http';
import Endpoints from '../constants/Endpoints';
import SContent from '../components/Content';
import SList, { SListItem } from '../components/List';
import SLeft from '../components/Left';
import { SSpinnerConstants } from '../components/Spinner';
import UtilFunctions from '../util/UtilFunctions';
import SRight from '../components/Right';
import SModal, { SModalTitle } from '../components/Modal';
import { Spinner } from 'native-base';
import SView from '../components/View';
import SIcon from '../components/Icon';
import ScreenCardLayout from '../components/ScreenCardLayout';

const typeButtonsItemHeight = Layout.typeButtonsItemHeight;

class BoletosScreen extends React.Component {
  constructor(props) {
    super(props);

    this.TypeButton = this.TypeButton.bind(this);
    this.BoletosList = this.BoletosList.bind(this);
    this.DetalhesBoleto = this.DetalhesBoleto.bind(this);

    this.props.navigation.addListener('willFocus', () => {
      if (this.props.home.unidadeSelecionada.id !== this.props.boletos.ultimaUnidadeSelecionadaId) {
        this.fetchBoletos();
      }
    });
  }

  static navigationOptions = Layout.navigationNullHeader;

  render() {
    return (
      <SContainer>
        <ScreenCardLayout
          navigateProp={this.props.navigation.navigate}
          headerTitle="Boletos"
          refreshControl={
            <RefreshControl
              refreshing={this.props.boletos.refreshing}
              onRefresh={() => {
                this.props.setBoletosData({ refreshing: true });
                this.fetchBoletos(SSpinnerConstants.HEADER_CONFIG);
              }}
            />
          }
          titleComponent={
            <SItem style={styles.typeButtonsItem}>
              <this.TypeButton type={Types.boletos.ATIVO} text={Layout.isSmallDevice ? 'Abertos' : 'Em aberto'} smallDeviceSize="50%" />
              <this.TypeButton type={Types.boletos.TODOS} text="Todos" smallDeviceSize="48%" />
            </SItem>
          }
        >
          <this.BoletosList />
        </ScreenCardLayout>
        <this.DetalhesBoleto />
      </SContainer >
    );
  }

  TypeButton({ type, text, smallDeviceSize }) {
    return (
      <SButton
        rounded
        block
        style={{
          width: Layout.isSmallDevice ? smallDeviceSize : '45%',
          ...Layout.centered,
          ...Layout.midShadow,
          backgroundColor: this.isTypeActive(type) ? Colors.systemBaseColor : Colors.white
        }}
        onPress={() => this.selectType(type)}
      >
        <SText style={{ textAlign: 'center', fontSize: Layout.typeButtonsFontSize, color: this.isTypeActive(type) ? Colors.white : Colors.systemBaseColor }}>{text}</SText>
      </SButton>
    );
  }

  BoletosList() {
    if (this.isEmptyBoletos()) return <this.EmptyBoletos />;

    const boletoPropName = this.getBoletoPropNameInState();
    return (
      <SList>
        {(this.props.boletos[boletoPropName] || []).map((boleto, index) => {
          return (
            <SListItem key={index} style={{ marginLeft: 0, paddingRight: 0, width: '100%' }} >
              <SLeft style={{
                ...Layout.getHightlightStyle(this.isPago(boleto) ? Colors.greenHighlight : Colors.redHighlight, 6),
                marginRight: 10
              }} />
              <SItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <SText style={{ color: Colors.darkGreyText, fontWeight: 'bold', fontSize: 18 }}>
                  {Layout.isSmallDevice ? 'Venc.' : 'Vencimento'}: {UtilFunctions.getDateWithShortYear(boleto.datavencimento)}
                </SText>
                <SText style={{ color: Colors.darkGreyText, fontWeight: 'bold', fontSize: 19 }}>
                  {UtilFunctions.getCurrencyFormat(boleto.valor)}
                </SText>
                <SText style={{ color: this.isPago(boleto) ? Colors.greenHighlight : Colors.redHighlight, fontSize: 15 }}>
                  {this.getStatusText(boleto)}
                </SText>
              </SItem>
              <SRight>
                <SButton
                  style={{ ...Layout.slightlyRounded, backgroundColor: Colors.systemBaseColor }}
                  onPress={() => this.openDetalhesBoleto(boleto)}
                >
                  {Layout.isSmallDevice
                    ?
                    <SIcon name="eye" />
                    :
                    <SText style={{ color: Colors.whiteText, fontSize: 15 }}>Detalhes</SText>
                  }
                </SButton>
              </SRight>
            </SListItem>
          );
        })}
      </SList>
    );
  }

  EmptyBoletos() {
    return (
      <SItem style={Layout.centered}>
        <SText style={{ color: Colors.darkGreyText, fontWeight: 'bold', fontSize: 18 }}>Nenhum boleto por aqui!</SText>
      </SItem>
    );
  }

  DetalhesBoleto() {
    const boleto = this.props.boletos.boletoSelecionado;
    const detalhesBoleto = this.props.boletos.detalhesBoletoSelecionado;

    if (!detalhesBoleto) return <SContent style={{ display: 'none' }} />

    return (
      <SModal
        open={this.props.boletos.modalDetalhesBoletoVisible}
        modalDidClose={() => this.closeDetalhesBoleto()}
      >
        <SView style={{ padding: 10 }}>
          <SModalTitle text={`Vencimento: ${UtilFunctions.getDateWithShortYear(boleto.datavencimento)}`} />
          <ScrollView style={Layout.scrollViewInsideModal}>
            <SItem style={styles.detalhesParentItem}>
              {detalhesBoleto.map((detalhe, i) => {
                return (
                  <SItem key={i} style={styles.detalhesItem}>
                    <SText style={styles.detalhesText}>{detalhe.descricao}</SText>
                    <SText style={styles.detalhesText}>R$ {detalhe.valor}</SText>
                  </SItem>
                );
              })}
              <SItem style={styles.detalhesItemTotal}>
                <SText style={styles.detalhesTotal}>Valor total</SText>
                <SText style={styles.detalhesTotal}>{UtilFunctions.getCurrencyFormat(boleto.valor)}</SText>
              </SItem>
            </SItem>
            <SItem style={styles.detalhesParentItem}>
              <SButton
                block
                style={{
                  ...styles.detalhesActionButtons,
                  backgroundColor: this.props.boletos.linhaDigitavelCopiada ? Colors.highlightDifferent : Colors.systemBaseColor
                }}
                onPress={() => this.copyLinhaDigitavelToClipboard(boleto)}
                disabled={this.props.boletos.linhaDigitavelCopiada}
              >
                <SText style={styles.detalhesActionButtonsText}>
                  {this.props.boletos.linhaDigitavelCopiada ? 'Copiada!' : 'Copiar linha digitável'}
                </SText>
              </SButton>
              <SButton
                block
                style={{
                  ...styles.detalhesActionButtons,
                  backgroundColor: this.isEmailStatus(boletoEnvioEmailStatusConstants.ENVIADO) ? Colors.highlightDifferent : Colors.systemBaseColor
                }}
                onPress={() => this.sendEmailBoleto(boleto)}
                disabled={!this.isEmailStatus(boletoEnvioEmailStatusConstants.NENHUM)}
              >
                {!this.isEmailStatus(boletoEnvioEmailStatusConstants.ENVIANDO) ?
                  <SText style={styles.detalhesActionButtonsText}>
                    {this.isEmailStatus(boletoEnvioEmailStatusConstants.ENVIADO) ? 'Enviado!' : 'Enviar por e-mail'}
                  </SText> :
                  <Spinner color={Colors.whiteText} />}
              </SButton>
            </SItem>
          </ScrollView>
        </SView>
      </SModal>
    );
  }

  openDetalhesBoleto(boleto) {
    SHttp.get(Endpoints.DETALHES_BOLETO, { params: { boleto: boleto.idboleto } }).then(response => {
      this.props.setBoletosData({
        modalDetalhesBoletoVisible: true,
        detalhesBoletoSelecionado: response.data.objeto,
        boletoSelecionado: boleto
      });
      this.setTabsVisibility(false);
    });
  }

  closeDetalhesBoleto() {
    this.props.setBoletosData({
      modalDetalhesBoletoVisible: false,
      linhaDigitavelCopiada: false,
      envioEmailStatus: boletoEnvioEmailStatusConstants.NENHUM,
      detalhesBoletoSelecionado: null,
      boletoSelecionado: null
    });
    this.setTabsVisibility(true);
  }

  selectType(type) {
    this.props.setBoletosData({ activeType: type });
    this.fetchBoletos({}, type);
  }

  setTabsVisibility(visible) {
    this.props.navigation.setParams({ bottomTabVisible: visible });
  }

  fetchBoletos(headers = {}, type = this.getActiveType()) {
    this.props.setBoletosData({ ultimaUnidadeSelecionadaId: this.props.home.unidadeSelecionada.id });
    this.fetchBoletosByType(type, headers).then(response => {
      if (this.isTypeActive(Types.boletos.ATIVO)) {
        this.props.setBoletosData({ boletosAtivos: response.data.objeto });
      } else {
        this.props.setBoletosData({ todosBoletos: response.data.objeto });
      }
    }, () => { }).finally(() => this.props.setBoletosData({ refreshing: false }));;
  }

  fetchBoletosByType(type, headers) {
    const params = {
      tipo: type,
      unidade: this.props.home.unidadeSelecionada.id
    };
    return SHttp.get(Endpoints.BOLETOS, { params: params, headers }).catch(err => alert(UtilFunctions.getMessageFromError(err, 'Não foi possível carregar os boletos!')));
  }

  isTypeActive(type) {
    return this.props.boletos.activeType === type;
  }

  getActiveType() {
    return this.props.boletos.activeType;
  }

  isPago(boleto) {
    return boleto.status === 'Pago';
  }

  isEmptyBoletos() {
    const boletos = this.props.boletos[this.getBoletoPropNameInState()];
    return !(boletos instanceof Array) || boletos.length === 0;
  }

  getStatusText(boleto) {
    return this.isPago(boleto) ? 'Pago' : (Layout.isSmallDevice ? 'Aguardando Pgto' : 'Aguardando pagamento');
  }

  getBoletoPropNameInState() {
    return this.props.boletos.activeType === Types.boletos.ATIVO ? 'boletosAtivos' : 'todosBoletos';
  }

  copyLinhaDigitavelToClipboard(boleto) {
    const a = Clipboard.setString(boleto.linhadigitavel);
    this.props.setBoletosData({ linhaDigitavelCopiada: true });
  }

  sendEmailBoleto(boleto) {
    this.setEnvioEmailStatus(boletoEnvioEmailStatusConstants.ENVIANDO);
    SHttp.post(Endpoints.BOLETOS_EMAIL, {}, { params: { boleto: boleto.idboleto }, headers: SSpinnerConstants.HEADER_CONFIG })
      .then(() => this.setEnvioEmailStatus(boletoEnvioEmailStatusConstants.ENVIADO),
        err => {
          this.setEnvioEmailStatus(boletoEnvioEmailStatusConstants.NENHUM);
          alert(UtilFunctions.getMessageFromError(err, 'Não foi possível enviar o e-mail, tente novamente mais tarde!'));
        });
  }

  setEnvioEmailStatus(status) {
    this.props.setBoletosData({ envioEmailStatus: status });
  }

  isEmailStatus(status) {
    return this.props.boletos.envioEmailStatus === status;
  }
}

const mapStateToProps = state => {
  return { home: state.home, boletos: state.boletos };
};

const mapDispatchToProps = dispatch => {
  return {
    setBoletosData: data => dispatch(setBoletosData(data)),
    resetBoletosData: () => dispatch(resetBoletosData())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BoletosScreen);

const styles = StyleSheet.create({
  typeButtonsItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: typeButtonsItemHeight
  },
  detalhesParentItem: {
    marginBottom: 20,
    flexDirection: 'column'
  },
  detalhesItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detalhesItemTotal: {
    width: '100%',
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1
  },
  detalhesText: {
    maxWidth: '60%',
    flexWrap: 'wrap',
    marginTop: 5,
    fontSize: 16,
    color: Colors.darkGreyText
  },
  detalhesTotal: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold'
  },
  detalhesActionButtons: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: Colors.systemBaseColor,
    ...Layout.slightlyRounded
  },
  detalhesActionButtonsText: {
    color: Colors.whiteText,
    fontSize: 21
  }
});