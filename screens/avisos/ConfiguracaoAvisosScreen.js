import React from 'react';
import { connect } from 'react-redux';

import SContainer from '../../components/Container';
import { setAvisosData } from '../../store/ducks/AvisosStore';
import SList, { SListItem } from '../../components/List';
import SLeft from '../../components/Left';
import SBody from '../../components/Body';
import SText from '../../components/Text';
import Layout from '../../constants/Layout';
import Configs from '../../constants/Configs';
import Colors from '../../constants/Colors';
import SCheckBox from '../../components/Checkbox';
import Infos from '../../util/Infos';
import SRadio from '../../components/Radio';
import SItem from '../../components/Item';
import SHttp from '../../util/Http';
import Endpoints from '../../constants/Endpoints';
import UtilFunctions from '../../util/UtilFunctions';
import { setHomeData } from '../../store/ducks/HomeStore';
import ScreenCardLayout from '../../components/ScreenCardLayout';
import { Toast } from 'native-base';
import NavigationKeys from '../../constants/NavigationKeys';
import SAsyncStorage from '../../util/AsyncStorage';

const notificacaoOptions = [
  { label: 'Não receber', propName: 'naoavisar' },
  { label: '1 dia antes do vencimento', propName: 'umdia' },
  { label: '3 dias antes do vencimento', propName: 'tresdias' },
  { label: '5 dias antes do vencimento', propName: 'cincodias' }
];

class ConfiguracaoAvisosScreen extends React.Component {
  constructor(props) {
    super(props);

    this.setUpAvisosOptions = this.setUpAvisosOptions.bind(this);

    this.setUpAvisosOptions();
  }

  static navigationOptions = Layout.navigationNullHeader;

  render() {
    return (
      <SContainer>
        <ScreenCardLayout
          navigateProp={this.props.navigation.navigate}
          headerTitle="Avisos"
          headerGoTo={NavigationKeys.AVISOS}
          noBottomTab
          titleComponent={
            <SItem style={{ width: '100%', ...Layout.centered }}>
              <SText style={{ fontSize: 22, fontWeight: 'bold', color: Colors.systemBaseColor, textAlign: 'center' }}>
                Receber notificações de boleto
              </SText>
            </SItem>
          }
        >
          <SList>
            {notificacaoOptions.map((aviso, key) => {
              return (
                <SListItem key={key} onPress={() => this.setAvisoOption(aviso.propName)} style={Infos.isIOS() ? { marginLeft: 0 } : {}}>
                  <SLeft style={{ maxWidth: 50 }}>
                    {Infos.isIOS()
                      ?
                      <SCheckBox
                        checked={this.isAvisoOptionSelected(aviso.propName)}
                        color={Colors.greenHighlight}
                        onPress={() => this.setAvisoOption(aviso.propName)}
                      />
                      :
                      <SRadio
                        selected={this.isAvisoOptionSelected(aviso.propName)}
                        selectedColor={Colors.greenHighlight}
                        color={Colors.midGrey}
                        onPress={() => this.setAvisoOption(aviso.propName)}
                      />
                    }
                  </SLeft>
                  <SBody>
                    <SText style={{ fontSize: 18, color: Colors.darkGreyText }}>{aviso.label}</SText>
                  </SBody>
                </SListItem>
              );
            })}
          </SList>
        </ScreenCardLayout>
      </SContainer>
    );
  }

  setUpAvisosOptions() {
    const notificacaoConfig = this.props.home.loginInfo.notificacao;
    this.props.setAvisosData({
      notificacao: {
        naoavisar: notificacaoConfig.NAONOTIFICAR,
        umdia: notificacaoConfig.UMDIA,
        tresdias: notificacaoConfig.TRESDIAS,
        cincodias: notificacaoConfig.CINCODIAS
      }
    });
  }

  isAvisoOptionSelected(propName) {
    return this.props.avisos.notificacao[propName];
  }

  setAvisoOption(propName) {
    const newAvisosData = {
      notificacao: {
        ...{
          naoavisar: false,
          umdia: false,
          tresdias: false,
          cincodias: false
        },
        [propName]: true
      }
    };
    SHttp.post(Endpoints.NOTIFICACAO, newAvisosData.notificacao).then(async () => {
      this.props.setHomeData({ loginInfo: { ...this.props.home.loginInfo, notificacao: this.getNotificacaoInLoginFormat(newAvisosData.notificacao) } })
      this.props.setAvisosData(newAvisosData);
      try {
        const loginInfo = await SAsyncStorage.getLoginInfo();
        await SAsyncStorage.saveLogin({ objeto: { ...loginInfo, notificacao: this.getNotificacaoInLoginFormat(newAvisosData.notificacao) } })
      } catch { }
      Toast.show({
        ...Configs.toastSuccess,
        text: 'Configuração salva com sucesso!'
      });
    }, err => alert(UtilFunctions.getMessageFromError(err, 'Não foi possível realizar a alteração, tente novamente mais tarde!')));
  }

  getNotificacaoInLoginFormat(notificacao) {
    return {
      NAONOTIFICAR: notificacao.naoavisar,
      UMDIA: notificacao.umdia,
      TRESDIAS: notificacao.tresdias,
      CINCODIAS: notificacao.cincodias
    };
  }
}

const mapStateToProps = state => {
  return { home: state.home, avisos: state.avisos };
};

const mapDispatchToProps = dispatch => {
  return {
    setAvisosData: data => dispatch(setAvisosData(data)),
    setHomeData: data => dispatch(setHomeData(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfiguracaoAvisosScreen);