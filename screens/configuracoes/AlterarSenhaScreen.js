import React from 'react';
import { connect } from 'react-redux';
import { Toast } from 'native-base';

import ScreenCardLayout from '../../components/ScreenCardLayout';
import Layout from '../../constants/Layout';
import NavigationKeys from '../../constants/NavigationKeys';
import SItem from '../../components/Item';
import SInput from '../../components/Input';
import SText from '../../components/Text';
import { setAlterarSenhaData } from '../../store/ducks/AlterarSenhaStore';
import SButton from '../../components/Button';
import SKeyboardAvoidingView from '../../components/KeyboardAvoidingView';
import Validators from '../../util/Validators';
import SErrorText from '../../components/ErrorText';
import SHttp from '../../util/Http';
import Endpoints from '../../constants/Endpoints';
import Configs from '../../constants/Configs';
import UtilFunctions from '../../util/UtilFunctions';

class AlterarSenhaScreen extends React.Component {
  constructor(props) {
    super(props);

    this.setUp = this.setUp.bind(this);

    this.setUp();
  }

  static navigationOptions = Layout.navigationNullHeader;

  render() {
    return (
      <SKeyboardAvoidingView>
        <ScreenCardLayout
          navigateProp={this.props.navigation.navigate}
          headerTitle="Alterar senha"
          headerGoTo={NavigationKeys.CONFIGURACOES}
          noBottomTab
          contentEnableAutomaticScroll
        >
          <SItem style={Layout.inputItem}>
            <SText style={Layout.inputLabel}>Senha antiga</SText>
            <SInput secureTextEntry autoCapitalize="none" rounded style={Layout.input} onChangeText={value => this.setValue('senhaAntiga', value)} />
            <SErrorText text={this.props.alterarSenha.errors.senhaAntiga} visible={!!this.props.alterarSenha.touchedFields.senhaAntiga} />
          </SItem>
          <SItem style={Layout.inputItem}>
            <SText style={Layout.inputLabel}>Nova senha</SText>
            <SInput secureTextEntry autoCapitalize="none" rounded style={Layout.input} onChangeText={value => this.setValue('senhaNova', value)} />
            <SErrorText text={this.props.alterarSenha.errors.senhaNova} visible={!!this.props.alterarSenha.touchedFields.senhaNova} />
          </SItem>
          <SItem style={Layout.inputItem}>
            <SText style={Layout.inputLabel}>Confirmar nova senha</SText>
            <SInput
              autoCapitalize="none"
              secureTextEntry
              rounded
              style={Layout.input}
              onChangeText={value => this.setConfirmarNovaSenha(value)}
            />
            <SErrorText text={this.props.alterarSenha.errors.confirmarNovaSenha} visible={!!this.props.alterarSenha.touchedFields.confirmarNovaSenha} />
          </SItem>
          <SButton block style={Layout.slightlyRounded} primaryColor onPress={() => this.save()}>
            <SText>Salvar</SText>
          </SButton>
        </ScreenCardLayout>
      </SKeyboardAvoidingView>
    );
  }

  setValue(fieldName, value) {
    const fieldValidation = Validators.required(value);
    let confirmarNovaSenhaValidation;

    if (fieldName === 'senhaNova') {
      confirmarNovaSenhaValidation = Validators.senhasIguais(this.props.alterarSenha.confirmarNovaSenha, value, true);
    }

    this.props.setAlterarSenhaData({
      touchedFields: { ...this.props.alterarSenha.touchedFields, [fieldName]: true },
      errors: {
        ...this.props.alterarSenha.errors,
        [fieldName]: fieldValidation.error,
        ...(confirmarNovaSenhaValidation ? { confirmarNovaSenha: confirmarNovaSenhaValidation.error } : {})
      },
      form: { ...this.props.alterarSenha.form, [fieldName]: value }
    });
  }

  setConfirmarNovaSenha(value) {
    const fieldValidation = Validators.senhasIguais(value, this.props.alterarSenha.form.senhaNova, true);

    this.props.setAlterarSenhaData({
      touchedFields: { ...this.props.alterarSenha.touchedFields, confirmarNovaSenha: true },
      errors: { ...this.props.alterarSenha.errors, confirmarNovaSenha: fieldValidation.error },
      confirmarNovaSenha: value
    });
  }

  save() {
    this.props.setAlterarSenhaData({
      touchedFields: { senhaAntiga: true, senhaNova: true, confirmarNovaSenha: true }
    });

    const hasError = !!Object.keys(this.props.alterarSenha.errors || {}).find(key => !!this.props.alterarSenha.errors[key]);
    if (hasError) {
      alert('Preencha os campos corretamente!');
      return;
    }

    SHttp.put(Endpoints.ALTERAR_SENHA, this.props.alterarSenha.form).then(() => {
      Toast.show({
        ...Configs.toastSuccess,
        text: 'Senha alterada com sucesso!'
      });
      this.props.navigation.navigate(NavigationKeys.CONFIGURACOES);
      this.resetAlterarSenhaData();
    }, err => alert(UtilFunctions.getMessageFromError(err, 'Não foi possível alterar a senha, tente novamente mais tarde!')));
  }

  setUp() {
    this.props.setAlterarSenhaData({
      errors: {
        senhaAntiga: Validators.required(null).error,
        senhaNova: Validators.required(null).error,
        confirmarNovaSenha: Validators.required(null).error
      },
      form: { ...this.props.alterarSenha.form, usuario: this.props.meusDados.usuario }
    });
  }

  resetAlterarSenhaData() {
    this.props.setAlterarSenhaData({
      errors: {},
      touchedFields: {},
      confirmarNovaSenha: '',
      form: {
        senhaAntiga: '',
        senhaNova: '',
        usuario: ''
      }
    });
  }
}

const mapStateToProps = state => {
  return { meusDados: state.home.meusDados, alterarSenha: state.alterarSenha };
};

const mapDispatchToProps = dispatch => {
  return {
    setAlterarSenhaData: data => dispatch(setAlterarSenhaData(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlterarSenhaScreen);