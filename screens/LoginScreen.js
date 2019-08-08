import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, TextInput, Alert } from 'react-native';

import { setLoginData, resetLoginData } from '../store/ducks/LoginStore';
import SContent from '../components/Content';
import SInput from '../components/Input';
import SItem from '../components/Item';
import SLabel from '../components/Label';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import SButton from '../components/Button';
import SText from '../components/Text';
import Endpoints from '../constants/Endpoints';
import NavigationKeys from '../constants/NavigationKeys';
import SImageBackground from '../components/ImageBackground';
import SModal, { SModalTitle } from '../components/Modal';
import SIcon from '../components/Icon';
import SAsyncStorage from '../util/AsyncStorage';
import SHttp from '../util/Http';
import SPicker from '../components/Picker';
import Infos from '../util/Infos';
import SView from '../components/View';
import SImage from '../components/Image';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import Validators from '../util/Validators';
import SKeyboardAvoidingView from '../components/KeyboardAvoidingView';
import SContainer from '../components/Container';
import UtilFunctions from '../util/UtilFunctions';
import { resetHomeData } from '../store/ducks/HomeStore';

const backgroundImage = require('../assets/images/system-background.png');
const logoImage = require('../assets/images/logo.png');

class LoginScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ModalForgotPass = this.ModalForgotPass.bind(this);
    this.setUpForm = this.setUpForm.bind(this);

    this.setUpForm();
  }

  render() {
    return (
      <SContainer style={{ height: '100%' }} contentContainerStyle={styles.mainContent}>
        <SKeyboardAvoidingView>
          <SImageBackground source={backgroundImage}>
            <SContent contentContainerStyle={styles.contentCenter}>
              <SImage source={logoImage} style={styles.logoImage} />
              <SView style={{ position: 'absolute', bottom: 0, width: '100%', ...Layout.centered }}>
                <SLabel style={styles.loginLabel}>Login</SLabel>
                <SItem rounded style={styles.inputItem} >
                  <SIcon active name='person' style={styles.inputIcon} />
                  <SInput
                    getRef={ref => this.usuarioInputRef = ref}
                    autoCapitalize="none"
                    placeholder="Usuário"
                    placeholderTextColor={Colors.blackText}
                    value={this.props.login.form.usuario}
                    onChangeText={value => {
                      this.setForm('usuario', value, true, { condominios: null }, { condominio: null });
                    }}
                  />
                </SItem>
                <SItem rounded style={styles.inputItem} >
                  <SIcon active name='lock' style={styles.inputIcon} />
                  <SInput
                    getRef={ref => this.senhaInputRef = ref}
                    autoCapitalize="none"
                    secureTextEntry
                    placeholder="Senha"
                    placeholderTextColor={Colors.blackText}
                    value={this.props.login.form.senha}
                    onChangeText={value => this.setForm('senha', value, true)}
                  />
                </SItem>
                {this.props.login.condominios && <SItem style={{
                  ...Layout.hardRounded,
                  width: Layout.width - 42,
                  backgroundColor: Colors.whiteText,
                  marginTop: 10,
                  height: 50
                }}>
                  <SIcon name="home" style={{ ...styles.inputIcon, marginLeft: 10 }} />
                  <SPicker
                    placeholder="Selecione o condomínio"
                    mode="dropdown"
                    headerBackButtonText="Cancelar"
                    selectedValue={this.props.login.form.condominio}
                    onValueChange={value => this.setForm('condominio', value, true)}
                    style={{ marginLeft: Infos.isIOS() ? -10 : -5, width: Layout.width - 80 }}
                  >
                    {(this.props.login.condominios || []).map(condominio => {
                      return <SPicker.Item key={condominio.idcondominio} label={condominio.condominioNome} value={condominio.idcondominio} />
                    })}
                  </SPicker>
                </SItem>}
                <SItem style={styles.loginOptionsItem}>
                  <SText
                    style={styles.loginOptions}
                    onPress={() => this.openForgotPassModalVisible()}
                  >
                    Esqueceu a senha?
                </SText>
                </SItem>
                <SItem style={styles.loginButtonContainer}>
                  <SButton
                    rounded
                    block
                    style={styles.loginButton}
                    onPress={() => this.doLogin()}
                  >
                    <SText style={styles.loginButtonText}>Entrar</SText>
                  </SButton>
                </SItem>
              </SView>
            </SContent>
          </SImageBackground >
          <this.ModalForgotPass />
        </SKeyboardAvoidingView>
      </SContainer>
    );
  }

  ModalForgotPass() {
    return (
      <SModal
        open={this.props.login.modalForgotPassVisible}
        modalDidClose={() => this.closeForgotPassModalVisible()}
      >
        <SView style={{ padding: 10 }}>
          <SModalTitle text="Esqueceu sua senha?" />
          <TextInput
            ref={ref => this.emailInputRef = ref}
            placeholder="Digite o seu e-mail"
            style={styles.modalInput}
            onChangeText={value => this.setEsqueciASenha({ email: value })}
            value={this.props.login.esqueciASenha.email}
          />
          <SButton
            block
            style={{
              ...Layout.slightlyRounded,
              backgroundColor: Colors.systemBaseColor,
              color: Colors.systemBaseColorOpposite,
              marginTop: 20,
              marginBottom: 20
            }}
            onPress={() => this.sendEmail(this.props.login.esqueciASenha.email)}
          >
            <SText>Enviar</SText>
          </SButton>
        </SView>
      </SModal>
    );
  }

  sendEmail(email) {
    if (!this.props.login.esqueciASenha.email) {
      const alertData = this.getLoginRequiredFieldMessageAndInputRef('email');
      Alert.alert(
        '',
        alertData.text,
        [{ text: 'OK', onPress: () => alertData.ref.focus() }]
      );
      return;
    }

    SHttp.get(Endpoints.RECUPERAR_SENHA, { params: { email } }).then(() => {
      Alert.alert(
        'Email enviado',
        'Siga as instruções enviadas para o seu e-mail.',
        [{
          text: 'OK', onPress: () => this.closeForgotPassModalVisible()
        }]
      );
    }, err => {
      alert(UtilFunctions.getMessageFromError(err, 'Email não cadastrado!'));
    });
  }

  openForgotPassModalVisible() {
    this.props.setLoginData({ modalForgotPassVisible: true });
  }

  closeForgotPassModalVisible() {
    this.props.setLoginData({ modalForgotPassVisible: false, esqueciASenha: { email: '' } });
  }

  setForm(fieldName, value, required, loginData = {}, extraFormData = {}) {
    let fieldValidation = { error: null, value };
    if (required) {
      fieldValidation = Validators.required(value);
    }
    this.props.setLoginData({
      ...loginData,
      errors: { ...this.props.login.errors, [fieldName]: fieldValidation.error },
      form: {
        ...this.props.login.form,
        ...extraFormData,
        [fieldName]: fieldValidation.value
      }
    });
  }

  setEsqueciASenha(esqueciASenha) {
    this.props.setLoginData({ esqueciASenha });
  }

  setUpForm() {
    const errors = {
      usuario: Validators.required(this.props.login.form.usuario).error,
      senha: Validators.required(this.props.login.form.senha).error
    }

    this.props.setLoginData({ errors });
  }

  async doLogin() {
    this.props.resetHomeData();
    const invalidField = Object.keys(this.props.login.errors || {}).find(key => this.props.login.errors[key] != null);
    if (!!invalidField) {
      const alertData = this.getLoginRequiredFieldMessageAndInputRef(invalidField);
      Alert.alert(
        '',
        alertData.text,
        [{ text: 'OK', onPress: () => alertData.ref.focus() }]
      );
      return;
    }

    SHttp.get(Endpoints.LOGIN, { params: this.props.login.form }).then(async response => {
      if (response.data.status === 202) {
        alert('Selecione o condomínio');
        const condominioList = response.data.objeto || [];
        this.setForm('condominio', (condominioList[0] || {}).idcondominio, false, { condominios: condominioList });
      } else {
        await SAsyncStorage.saveLogin(response.data);
        this.props.navigation.navigate(NavigationKeys.MAIN);
        this.props.resetLoginData();
      }
    }).catch(err => {
      alert(UtilFunctions.getMessageFromError(err, 'Não foi possível realizar o login. Tente novamente mais tarde!'));
    });
  }

  getLoginRequiredFieldMessageAndInputRef(field) {
    switch (field) {
      case 'usuario':
        return { ref: this.usuarioInputRef._root, text: 'Preencha o campo Usuário!' };
      case 'senha':
        return { ref: this.senhaInputRef._root, text: 'Preencha o campo Senha!' };
      case 'email':
        return { ref: this.emailInputRef, text: 'Preencha o campo E-mail!' };
      default:
        return {};
    }
  }
}

const mapStateToProps = state => {
  return { login: state.login, home: state.home };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoginData: login => dispatch(setLoginData(login)),
    resetLoginData: () => dispatch(resetLoginData()),
    resetHomeData: () => dispatch(resetHomeData())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
  mainContent: {
    ...Layout.window,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentCenter: {
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  logoImage: {
    marginTop: getStatusBarHeight(),
    backgroundColor: 'transparent'
  },
  loginLabel: {
    marginTop: 5,
    marginBottom: 5,
    color: Colors.systemBaseColorOpposite,
    fontSize: 26
  },
  inputItem: {
    backgroundColor: Colors.systemBaseColorOpposite,
    marginTop: 5,
    marginBottom: 5
  },
  inputIcon: {
    color: Colors.greyText
  },
  loginButtonContainer: {
    height: 60,
    marginTop: 20,
    marginBottom: 20
  },
  loginButton: {
    width: '100%',
    backgroundColor: Colors.systemBaseColorOpposite
  },
  loginButtonText: {
    fontSize: 20,
    color: Colors.systemBaseColor
  },
  loginOptions: {
    color: Colors.systemBaseColorOpposite
  },
  loginOptionsItem: {
    marginTop: 10
  },
  loginOptionsLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  loginOptionsCheckBox: {
    borderWidth: 1,
    borderColor: Colors.whiteText
  },
  modalInput: {
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.greyText
  }
});