import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import SContainer from '../components/Container';
import SContent from '../components/Content';
import SButton from '../components/Button';
import SText from '../components/Text';
import Colors from '../constants/Colors';
import SAsyncStorage from '../util/AsyncStorage';
import Endpoints from '../constants/Endpoints';
import NavigationKeys from '../constants/NavigationKeys';
import SHeader from '../components/Header';
import SLeft from '../components/Left';
import SBody from '../components/Body';
import SHttp, { setHomeNavigator } from '../util/Http';
import Infos from '../util/Infos';
import UtilFunctions from '../util/UtilFunctions';
import Configs from '../constants/Configs';
import SCard, { SCardItem } from '../components/Card';
import SItem from '../components/Item';
import SImage from '../components/Image';
import Types from '../constants/Types';
import SIcon from '../components/Icon';
import Layout from '../constants/Layout';
import SRight from '../components/Right';
import SModal, { SModalTitle } from '../components/Modal';
import { setHomeData } from '../store/ducks/HomeStore';
import SList, { SListItem } from '../components/List';
import SDrawer from '../components/Drawer';
import SView from '../components/View';

const defaultLogoImage = require('../assets/images/default-user-logo.png');

class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { drawerMenuOpen: false, modalApartmentSelectionVisible: false };

    setHomeNavigator(this.props.navigation.navigate);

    this.SummaryCard = this.SummaryCard.bind(this);
    this.InfoCardTopItem = this.InfoCardTopItem.bind(this);
    this.InfoCardBottomItem = this.InfoCardBottomItem.bind(this);
    this.shortcutItems = this.shortcutItems.bind(this);
    this.BoletosCard = this.BoletosCard.bind(this);
    this.ReservasCard = this.ReservasCard.bind(this);
    this.FotosCard = this.FotosCard.bind(this);
    this.AvisosCard = this.AvisosCard.bind(this);
    this.ApartmentListOptions = this.ApartmentListOptions.bind(this);
    this.Drawer = this.Drawer.bind(this);
    this.setTabsVisibility = this.setTabsVisibility.bind(this);
    this.navigate = this.navigate.bind(this);

    this.props.navigation.addListener('willFocus', async navigation => {
      if (navigation.state.params && navigation.state.params.fetchMeusDados) {
        const loginInfo = await SAsyncStorage.getLoginInfo();
        const unidadeSelecionada = await SAsyncStorage.getUnidadeSelecionada();
        this.fetchMeusDados(loginInfo, unidadeSelecionada, this.props.home.boletoAtivoMaisAntigo);
        this.props.navigation.setParams({ fetchMeusDados: false });
      }
    });
  }

  static navigationOptions = Layout.navigationNullHeader;

  async componentDidMount() {
    this._isMounted = true;
    try {
      if (!this.props.home.loginInfo.token) {
        this.fetchData();
      }
    } catch { }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const loginInfo = this.props.home.loginInfo;
    const condominio = loginInfo ? loginInfo.condominio : null;
    const headerText = condominio ? condominio.nome : '';

    return (
      <SContainer style={{ backgroundColor: Colors.background }}>
        <SHeader style={styles.header}>
          <SLeft style={{ maxWidth: 40 }}>
            <SButton
              transparent
              style={{
                position: 'absolute',
                width: 50,
                height: 50,
                top: Configs.LARGE_HEADER.height / 2 * -1 + (Infos.isAndroid() ? 15 : 10),
                left: Infos.isIOS() ? 5 : 0
              }}
              onPress={() => this.openDrawerMenu()}
            >
              <SIcon
                name="menu"
                style={{ color: Colors.whiteText, fontSize: 30 }}
              />
            </SButton>
          </SLeft>
          <SBody style={Layout.headerBodyStyle}>
            <SText style={Layout.headerTitleStyle}>{headerText}</SText>
          </SBody>
          <SRight style={{ maxWidth: 40 }} />
        </SHeader>
        <SContent style={styles.mainContent}>
          <this.SummaryCard />
          <this.shortcutItems />
        </SContent>
        <this.ApartmentListOptions />
        <this.Drawer />
      </SContainer>
    )
  }

  SummaryCard() {
    const loginInfo = this.props.home.loginInfo;
    const userName = this.props.home.meusDados ? this.props.home.meusDados.nome : null;
    const apartment = this.props.home.unidadeSelecionada;
    const logoURL = loginInfo && loginInfo.logo ? loginInfo.logo : null;

    return (
      <SCard style={styles.infoCard}>
        <SCardItem style={styles.infoCardItem}>
          <SBody>
            <this.InfoCardTopItem
              loginInfo={loginInfo}
              apartment={apartment}
              logoURL={logoURL}
              userName={userName}
            />
            <this.InfoCardBottomItem />
          </SBody>
        </SCardItem>
        <SButton
          style={{ position: 'absolute', top: -20, right: 20, backgroundColor: Colors.highlightDifferent, borderRadius: 50 }}
          onPress={() => this.openApartmentSelectionModal()}
        >
          <SIcon name="swap" />
        </SButton>
      </SCard>
    );
  }

  InfoCardTopItem({ loginInfo, apartment, logoURL, userName }) {
    loginInfo = loginInfo || {};
    apartment = apartment || {};

    return (
      <SItem style={styles.infoCardTopItem}>
        <SContainer style={styles.infoCardLogoContainer}>
          {<SImage source={logoURL ? {
            uri: logoURL,
            method: 'GET',
            headers: {
              Token: loginInfo.token
            }
          } : defaultLogoImage}
            style={styles.infoCardLogo}
          />}
        </SContainer>
        <SText style={styles.infoCardUserName}>{userName}</SText>
        <SText style={styles.infoCardApartment}>
          Unidade {apartment.nome} {!!apartment.bloco ? '-' : ''} {apartment.bloco}
        </SText>
      </SItem>
    );
  }

  shortcutItems() {
    return (
      <SItem style={styles.shortcutItems}>
        <SItem style={styles.shortcutItem}>
          <this.BoletosCard />
          <this.ReservasCard />
        </SItem>
        <SItem style={styles.shortcutItem}>
          <this.FotosCard />
          <this.AvisosCard />
        </SItem>
      </SItem>
    );
  }

  BoletosCard() {
    return (
      <SCard style={styles.shortcutCard}>
        <SCardItem
          button
          style={styles.shortcutCardItem}
          onPress={() => this.navigate(NavigationKeys.BOLETOS)}
        >
          <SIcon style={styles.shortcutCardIcon} name="document" />
          <SText style={styles.shortcutCardText}>Boletos</SText>
        </SCardItem>
      </SCard>
    );
  }

  ReservasCard() {
    return (
      <SCard style={styles.shortcutCard}>
        <SCardItem
          button
          style={styles.shortcutCardItem}
          onPress={() => this.navigate(NavigationKeys.RESERVAS)}
        >
          <SIcon style={styles.shortcutCardIcon} name="calendar" />
          <SText style={styles.shortcutCardText}>Reservas</SText>
        </SCardItem>
      </SCard>
    );
  }

  FotosCard() {
    return (
      <SCard style={styles.shortcutCard}>
        <SCardItem
          button
          style={styles.shortcutCardItem}
          onPress={() => this.navigate(NavigationKeys.FOTOS, false)}
        >
          <SIcon style={styles.shortcutCardIcon} name="image" />
          <SText style={styles.shortcutCardText}>Fotos</SText>
        </SCardItem>
      </SCard>
    );
  }

  AvisosCard() {
    return (
      <SCard style={styles.shortcutCard}>
        <SCardItem
          button
          style={styles.shortcutCardItem}
          onPress={() => this.navigate(NavigationKeys.AVISOS, false)}
        >
          <SIcon style={styles.shortcutCardIcon} name="notifications-outline" />
          <SText style={styles.shortcutCardText}>Avisos</SText>
        </SCardItem>
      </SCard>
    );
  }

  InfoCardBottomItem() {
    const boletoAtivoMaisAntigo = this.props.home.boletoAtivoMaisAntigo;
    if (!boletoAtivoMaisAntigo || Object.keys(boletoAtivoMaisAntigo).length === 0) {
      return (
        <SItem style={{ ...Layout.centered, width: '100%' }}>
          <SText style={{ ...styles.infoCardBottomItemVencimento, width: '100%' }}>Tudo certo, não existem boletos vencidos!</SText>
        </SItem >
      );
    }

    return (
      <SItem style={{ flexDirection: 'row', paddingTop: 10, paddingBottom: 10 }}>
        <SLeft style={Layout.getHightlightStyle(Colors.redHighlight)} />
        <SItem style={styles.infoCardBottomInfoData}>
          <SItem>
            <SText style={styles.infoCardBottomItemVencimento}>Vencimento: {UtilFunctions.getDateWithShortYear(boletoAtivoMaisAntigo.datavencimento)}</SText>
          </SItem>
          <SItem>
            <SText style={styles.infoCardBottomItemStatus}>Aguardando pagamento</SText>
          </SItem>
        </SItem>
        <SRight>
          <SButton
            style={{ ...Layout.slightlyRounded, backgroundColor: Colors.systemBaseColor }}
            onPress={() => this.navigate(NavigationKeys.BOLETOS)}
          >
            {Layout.isSmallDevice
              ?
              <SIcon name="eye" />
              :
              <SText style={{ color: Colors.whiteText, fontSize: 15 }}>Ver mais</SText>
            }
          </SButton>
        </SRight>
      </SItem>
    );
  }

  ApartmentListOptions() {
    return (
      <SModal
        open={this.state.modalApartmentSelectionVisible}
        modalDidClose={() => this.closeApartmentSelectionModal()}
      >
        <SView style={{ padding: 10 }}>
          <SModalTitle text="Unidades" />
          <ScrollView style={Layout.scrollViewInsideModal}>
            <SList>
              {(this.props.home.unidades || []).map(unidade => {
                const isSelected = this.props.home.unidadeSelecionada.id === unidade.id;
                const textStyle = { color: isSelected ? Colors.systemBaseColor : Colors.blackText };
                return (
                  <SListItem key={unidade.id} onPress={async () => this.selectUnidade(unidade)}>
                    <SLeft>
                      <SText style={textStyle}>{unidade.nome}</SText>
                      <SText style={textStyle}>{!!unidade.bloco ? ' - ' : ''}</SText>
                      <SText style={textStyle}>{unidade.bloco}</SText>
                    </SLeft>
                    <SRight>
                      <SIcon name="arrow-forward" />
                    </SRight>
                  </SListItem>
                );
              })}
            </SList>
          </ScrollView>
        </SView>
      </SModal>
    );
  }

  Drawer() {
    const items = [
      { key: NavigationKeys.HOME, params: { iconName: 'home' } },
      { key: NavigationKeys.PERFIL, params: { iconName: 'person' }, bottomTabVisible: false },
      { key: NavigationKeys.BOLETOS, params: { iconName: 'document' } },
      { key: NavigationKeys.RESERVAS, params: { iconName: 'calendar' } },
      { key: NavigationKeys.FOTOS, params: { iconName: 'image' }, bottomTabVisible: false },
      { key: NavigationKeys.AVISOS, params: { iconName: 'notifications-outline' }, bottomTabVisible: false },
      { key: NavigationKeys.CONFIGURACOES, params: { iconName: 'cog' }, bottomTabVisible: false },
      { key: 'Sair', action: () => this.logout(), params: { iconName: 'power' } }
    ];

    return (
      <SDrawer
        open={this.state.drawerMenuOpen}
        title="MENU"
        items={items}
        onItemPress={item => item.action ? item.action(item.key) : this.navigate(item.key, item.bottomTabVisible)}
        onClose={() => this.closeDrawerMenu()}
      />
    );
  }

  closeApartmentSelectionModal() {
    this.setTabsVisibility(true);
    this.setState({ modalApartmentSelectionVisible: false });
  }

  openApartmentSelectionModal() {
    this.setTabsVisibility(false);
    this.setState({ modalApartmentSelectionVisible: true });
  }

  async fetchData() {
    const loginInfo = await SAsyncStorage.getLoginInfo();
    const unidadeSelecionada = await SAsyncStorage.getUnidadeSelecionada();
    this.props.setHomeData({
      unidades: await SAsyncStorage.getUnidades(),
      unidadeSelecionada
    });

    this.fetchBoletos(unidadeSelecionada).then(response => {
      this.fetchMeusDados(loginInfo, unidadeSelecionada, this.getBoletoAtivoMaisAntigo(loginInfo, response)).then(async response => {
        if (response.data.objeto.atualizarDados) {
          this.props.navigation.navigate(NavigationKeys.PERFIL, { allowNavigate: false });
        }
        if (await SAsyncStorage.isFirstLogin()) {
          SAsyncStorage.setPrimeiroLogin();
        }
      }, () => { });
    }, () => { });
  }

  fetchBoletos(unidadeSelecionada) {
    const params = { unidade: unidadeSelecionada.id, tipo: Types.boletos.ATIVO };
    return SHttp.get(Endpoints.BOLETOS, { params });
  }

  fetchMeusDados(loginInfo, unidadeSelecionada, boletoAtivoMaisAntigo) {
    return SHttp.get(Endpoints.MEUS_DADOS).then(response => {
      this.props.setHomeData({ loginInfo, meusDados: response.data.objeto, unidadeSelecionada, boletoAtivoMaisAntigo });
      return response;
    }, err => {
      this.props.setHomeData({ loginInfo, meusDados: {}, unidadeSelecionada, boletoAtivoMaisAntigo });
      if (!(err.response && err.response.data && err.response.data.httpCod === 401)) {
        alert(UtilFunctions.getMessageFromError(err, 'Não foi possível recuperar os dados!'));
      }
    });
  }

  getBoletoAtivoMaisAntigo(loginInfo, response) {
    const sortedBoletos = (response.data.objeto || []).sort((a, b) => {
      return new Date(UtilFunctions.brDateToUSADate(a.datavencimento)) - new Date(UtilFunctions.brDateToUSADate(b.datavencimento));
    });
    let boletoAtivoMaisAntigo = (sortedBoletos || [])[0];
    if (!!boletoAtivoMaisAntigo) {
      let notificacaoDias = Object.keys(loginInfo.notificacao).find(key => loginInfo.notificacao[key]);
      switch (notificacaoDias) {
        case 'NAONOTIFICAR':
          notificacaoDias = null;
          break;
        case 'UMDIA':
          notificacaoDias = 1;
          break;
        case 'TRESDIAS':
          notificacaoDias = 3;
          break;
        case 'CINCODIAS':
          notificacaoDias = 5;
          break;
        default:
          notificacaoDias = null;
      }

      const timeDiff = new Date(UtilFunctions.brDateToUSADate(boletoAtivoMaisAntigo.datavencimento)).getTime() - new Date().getTime();
      const isBoletoMaisAntigoDentroPrazoNotificacao = notificacaoDias != null ? (timeDiff / 1000 / 3600 / 24) <= notificacaoDias : timeDiff <= 0;

      return isBoletoMaisAntigoDentroPrazoNotificacao ? boletoAtivoMaisAntigo : null;

    }
  }

  async selectUnidade(unidade) {
    this.closeApartmentSelectionModal();
    this.props.setHomeData({ unidadeSelecionada: unidade });
    await SAsyncStorage.setUnidadeSelecionada(unidade);
    this.fetchData();
  }

  openDrawerMenu() {
    this.setState({ drawerMenuOpen: true });
    this.setTabsVisibility(false);
  }

  closeDrawerMenu() {
    this.setTabsVisibility(true);
    if (this._isMounted) {
      this.setState({ drawerMenuOpen: false });
    }
  }

  setTabsVisibility(visible) {
    this.props.navigation.setParams({ bottomTabVisible: visible });
  }

  navigate(to, bottomTabVisible = true) {
    this.props.navigation.navigate(to, !bottomTabVisible ? { bottomTabVisible: false } : undefined);
  }

  async logout() {
    try {
      await SAsyncStorage.removeStorage();
      this.navigate(NavigationKeys.LOGIN);
    } catch {
      alert('Não foi possível sair. Tente novamente mais tarde!');
    }
  }
}

const mapStateToProps = state => {
  return { home: state.home };
};

const mapDispatchToProps = dispatch => {
  return {
    setHomeData: data => dispatch(setHomeData(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  header: {
    ...Configs.LARGE_HEADER
  },
  mainContent: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    marginTop: -50,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: Layout.contentMarginBottomInsideBottomTab
  },
  infoCard: {
    marginTop: 30,
    borderRadius: 20
  },
  infoCardItem: {
    borderRadius: 20
  },
  infoCardTopItem: {
    width: '100%',
    marginTop: -40,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.systemBaseColor
  },

  infoCardLogoContainer: {
    ...Layout.littleShadow,
    width: 70,
    height: 70,
    borderRadius: 20
  },

  infoCardLogo: {
    width: 70,
    height: 70,
    borderRadius: 15
  },
  infoCardUserName: {
    marginTop: 10,
    color: Colors.systemBaseColor,
    fontSize: 24,
    fontWeight: 'bold'
  },
  infoCardApartment: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
    color: Colors.lightTintColor
  },
  infoCardBottomItemVencimento: {
    marginTop: 10,
    color: Colors.darkGreyText,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  infoCardBottomItemStatus: {
    color: Colors.darkGreyText,
    fontSize: 15,
    opacity: 0.5
  },
  infoCardBottomInfoData: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10,
    marginRight: 10
  },
  shortcutCard: {
    width: 175,
    maxWidth: '48%',
    height: 125,
    ...Layout.slightlyRounded,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shortcutCardItem: {
    ...Layout.centered,
    ...Layout.slightlyRounded,
    flexDirection: 'column',
    width: '100%',
    height: '100%'
  },
  shortcutCardIcon: {
    marginBottom: 5,
    fontSize: 44,
    color: Colors.systemBaseColor
  },
  shortcutCardText: {
    marginTop: 5,
    fontSize: 16,
    color: Colors.systemBaseColor
  },
  shortcutItems: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 5
  },
  shortcutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  }
});
