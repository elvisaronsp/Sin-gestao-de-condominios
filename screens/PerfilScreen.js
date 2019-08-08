import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import SContent from '../components/Content';
import SText from '../components/Text';
import Layout from '../constants/Layout';
import SContainer from '../components/Container';
import SDefaultHeader from '../components/DefaultHeader';
import SCard, { SCardItem } from '../components/Card';
import SItem from '../components/Item';
import Types from '../constants/Types';
import { setPerfilData } from '../store/ducks/PerfilStore';
import SButton from '../components/Button';
import Colors from '../constants/Colors';
import SInput from '../components/Input';
import SView from '../components/View';
import Masks from '../util/Masks';
import Validators from '../util/Validators';
import SErrorText from '../components/ErrorText';
import SIcon from '../components/Icon';
import Configs from '../constants/Configs';
import DateTimePicker from 'react-native-modal-datetime-picker';
import SHttp from '../util/Http';
import Endpoints from '../constants/Endpoints';
import { setHomeData } from '../store/ducks/HomeStore';
import UtilFunctions from '../util/UtilFunctions';
import NavigationKeys from '../constants/NavigationKeys';
import Infos from '../util/Infos';
import SModal, { SModalDefaultProps } from '../components/Modal';
import SList, { SListItem } from '../components/List';
import SKeyboardAvoidingView from '../components/KeyboardAvoidingView';
import { Toast } from 'native-base';

const fields = {
  meusDados: [
    { title: 'Nome', storeName: 'nome', required: true },
    { title: 'E-mail', storeName: 'email', validationFuncName: 'email', required: true },
    { title: 'Telefone', storeName: 'telefone', maskFuncName: 'fone', keyboardType: 'numeric' },
    { title: 'Celular', storeName: 'celular', maskFuncName: 'fone', keyboardType: 'numeric' },
    { title: 'CPF ou CNPJ', storeName: 'cpfcnpj', maskFuncName: 'cpfCnpj', keyboardType: 'numeric', required: true },
    { title: 'RG', storeName: 'rg', maskFuncName: 'rg', keyboardType: 'numeric', ignoreValidation: true },
    { title: 'Data de nascimento', storeName: 'dataNascimento', keyboardType: 'numeric', componentType: 'DateTimePicker' },
    { title: 'Sexo', storeName: 'sexo', required: true, componentType: 'Picker', pickerOptions: [{ label: 'Masculino', value: 'M' }, { label: 'Feminino', value: 'F' }] }
  ],
  endereco: [
    { title: 'Estado', storeName: 'uf', required: true },
    { title: 'Cidade', storeName: 'cidade', required: true },
    { title: 'Bairro', storeName: 'bairro', required: true },
    { title: 'Logradouro', storeName: 'logradouro', required: true },
    { title: 'Número', storeName: 'numero', maskFuncName: 'number', keyboardType: 'numeric' },
    { title: 'CEP', storeName: 'cep', maskFuncName: 'cep', keyboardType: 'numeric' }
  ]
};

class PerfilScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.TypeButton = this.TypeButton.bind(this);
    this.MeusDados = this.MeusDados.bind(this);
    this.Endereco = this.Endereco.bind(this);
    this.SexoModal = this.SexoModal.bind(this);

    this.verifyAtualizarDados();
    this.setUpState();
  }

  render() {
    let allowNavigate = this.props.navigation.getParam('allowNavigate');
    allowNavigate = allowNavigate != false;

    return (
      <SContainer>
        <SDefaultHeader title="Perfil" navigateProp={this.props.navigation.navigate} allowNavigate={allowNavigate} />
        <SKeyboardAvoidingView>
          <SContent style={styles.mainContent}>
            <SCard rounded>
              <SCardItem style={{ ...Layout.midRounded, flexDirection: 'column', marginTop: 20 }}>
                <SItem style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                  <this.TypeButton type={Types.perfil.MEUS_DADOS} smallDeviceWidth="40%" text={Layout.isSmallDevice ? 'Dados' : 'Meus dados'} />
                  <this.TypeButton type={Types.perfil.ENDERECO} smallDeviceWidth="58%" text="Endereço" />
                </SItem>
                <SContent enableAutomaticScroll style={{ width: '100%', maxHeight: Layout.height - Configs.DEFAULT_HEADER.height - Layout.contentMarginBottomInsideBottomTab - 30 }}>
                  {this.isTypeActive(Types.perfil.MEUS_DADOS) ? <this.MeusDados /> : <this.Endereco />}
                </SContent>
              </SCardItem>
            </SCard>
          </SContent >
        </SKeyboardAvoidingView>
        {!this.props.home.meusDados.atualizarDados ? <SText style={{ display: 'none' }} /> :
          this.props.perfil.editing
            ?
            <SButton rounded style={{ ...styles.editButton, backgroundColor: Colors.greenHighlight }} onPress={() => this.savePerfil()}>
              <SIcon name="checkmark" style={Infos.isIOS() ? { fontSize: 40 } : {}} />
            </SButton>
            :
            <SButton rounded style={styles.editButton} onPress={() => this.props.setPerfilData({ editing: true })}>
              <SIcon name="create" />
            </SButton>
        }
        <this.SexoModal />
      </SContainer >
    );
  }

  TypeButton({ type, text, smallDeviceWidth }) {
    return (
      <SButton
        rounded
        block
        style={{
          width: Layout.isSmallDevice ? smallDeviceWidth : '45%',
          ...Layout.midShadow,
          backgroundColor: this.isTypeActive(type) ? Colors.systemBaseColor : Colors.white
        }}
        onPress={() => this.selectType(type)}
      >
        <SText style={{ textAlign: 'center', fontSize: Layout.typeButtonsFontSize, color: this.isTypeActive(type) ? Colors.white : Colors.systemBaseColor }}>{text}</SText>
      </SButton>
    );
  }

  MeusDados() {
    return this.FieldGenerator(fields.meusDados);
  }

  Endereco() {
    return this.FieldGenerator(fields.endereco);
  }

  FieldGenerator(fields) {
    return (
      <SView style={{ width: '100%', flexDirection: 'column' }}>
        {fields.map((field, index) => {
          return (
            <SItem key={index} style={styles.inputItem}>
              <SText style={styles.inputLabel}>{field.title}</SText>
              {!field.componentType &&
                <SInput
                  style={{ ...styles.input, opacity: this.props.perfil.editing ? 1 : 0.7 }}
                  disabled={!this.props.perfil.editing}
                  value={this.props.perfil.meusDados[field.storeName]}
                  onChangeText={value => this.handleTextChange(value, field)}
                  keyboardType={field.keyboardType}
                />
              }
              {(field.componentType === 'DateTimePicker' || field.componentType === 'Picker') &&
                <TouchableOpacity
                  style={styles.pickerTouchable}
                  disabled={!this.props.perfil.editing}
                  onPress={() => this.setVisibleField(field.storeName, true)}
                >
                  <SText style={{ ...styles.pickerTouchableText, opacity: this.props.perfil.editing ? 1 : 0.7 }}>{this.props.perfil.meusDados[field.storeName]}</SText>
                </TouchableOpacity>
              }
              {field.componentType === 'DateTimePicker' &&
                <DateTimePicker
                  mode="date"
                  datePickerModeAndroid="spinner"
                  date={this.props.perfil.meusDados[field.storeName] ? new Date(UtilFunctions.brDateToUSADate(this.props.perfil.meusDados[field.storeName])) : new Date()}
                  isVisible={this.props.perfil.visibleFields[field.storeName]}
                  onConfirm={newDate => { this.handleTextChange(UtilFunctions.dateObjToBRDate(newDate), field, { visibleFields: { ...this.props.perfil.visibleFields, [field.storeName]: false } }) }}
                  onCancel={() => this.setVisibleField(field.storeName, false)}
                />
              }
              <SErrorText text={this.props.perfil.errors[field.storeName]} visible={!!this.props.perfil.touchedFields[field.storeName]} />
            </SItem>
          );
        })}
      </SView>
    );
  }

  SexoModal() {
    const field = fields.meusDados.find(field => field.title === 'Sexo');

    return (
      <SModal
        open={this.props.perfil.visibleFields[field.storeName]}
        modalDidClose={() => this.setVisibleField(field.storeName, false)}
        modalStyle={{ ...SModalDefaultProps.modalStyle, height: 140 }}
      >
        <SContent>
          <SList>
            {field.pickerOptions.map((option, index) => {
              return (
                <SListItem
                  key={index}
                  label={option.label}
                  onPress={() => this.handleTextChange(option.value, field, { visibleFields: { ...this.props.perfil.visibleFields, [field.storeName]: false } })}
                >
                  <SText style={{ color: Colors.systemBaseColor, fontSize: 18, fontWeight: 'bold' }}>{option.label}</SText>
                </SListItem>
              );
            })}
          </SList>
        </SContent>
      </SModal>
    );
  }

  isTypeActive(type) {
    return this.props.perfil.activeType === type;
  }

  selectType(type) {
    this.props.setPerfilData({ activeType: type });
  }

  setVisibleField(fieldName, value) {
    this.props.setPerfilData({ visibleFields: { ...this.props.perfil.visibleFields, [fieldName]: value } });
  }

  handleTextChange(value, fieldConfig, extraDataToSet = {}) {
    const fieldMaskOrValidation = this.getFielMaskOrValidation(value, fieldConfig);

    this.props.setPerfilData({
      touchedFields: { ...this.props.perfil.touchedFields, [fieldConfig.storeName]: true },
      errors: { ...this.props.perfil.errors, [fieldConfig.storeName]: fieldConfig.ignoreValidation ? null : fieldMaskOrValidation.error },
      meusDados: { ...this.props.perfil.meusDados, [fieldConfig.storeName]: fieldMaskOrValidation.value },
      ...extraDataToSet
    })
  }

  savePerfil() {
    let touchedFields = {};
    fields.meusDados.forEach(field => {
      touchedFields[field.storeName] = true;
    });
    fields.endereco.forEach(field => {
      touchedFields[field.storeName] = true;
    });

    this.props.setPerfilData({ touchedFields });

    let invalidField;
    for (key in (this.props.perfil.errors || {})) {
      if (this.props.perfil.errors[key] != null) {
        invalidField = key;
        break;
      }
    }
    if (!!invalidField) {
      Toast.show({
        ...Configs.toastError,
        text: 'O campo ' + invalidField + ' está inválido'
      });
      return;
    }

    const payload = this.props.perfil.meusDados;
    SHttp.put(Endpoints.MEUS_DADOS, payload).then(() => {
      this.props.navigation.navigate(NavigationKeys.HOME, { fetchMeusDados: true });
    }, err => alert(UtilFunctions.getMessageFromError(err, 'Não foi possível atualizar os dados, tente novamente mais tarde!')));
  }

  verifyAtualizarDados() {
    if (this.props.home.meusDados.atualizarDados) {
      Toast.show({
        ...Configs.toastWarning,
        text: 'Você precisa atualizar seus dados!'
      });
    }
  }

  setUpState() {
    let meusDados = {};
    let errors = {};
    fields.meusDados.forEach(field => {
      const fieldMaskOrValidation = this.getFielMaskOrValidation(this.props.home.meusDados[field.storeName], field);
      meusDados[field.storeName] = fieldMaskOrValidation.value;
      errors[field.storeName] = fieldMaskOrValidation.error;
    });
    fields.endereco.forEach(field => {
      const fieldMaskOrValidation = this.getFielMaskOrValidation(this.props.home.meusDados[field.storeName], field);
      meusDados[field.storeName] = fieldMaskOrValidation.value;
      errors[field.storeName] = fieldMaskOrValidation.error;
    });

    this.props.setPerfilData({
      meusDados: meusDados,
      editing: !!this.props.home.meusDados.atualizarDados,
      touchedFields: {},
      errors: errors,
      visibleFields: {}
    });
  }

  getFielMaskOrValidation(value, fieldConfig) {
    let fieldMaskOrValidator = {};
    if (fieldConfig.ignoreValidation) {
      return { value: value, error: null };
    }
    if (fieldConfig.maskFuncName) {
      fieldMaskOrValidator = Masks[fieldConfig.maskFuncName](value, !!fieldConfig.required);
    } else if (fieldConfig.validationFuncName) {
      fieldMaskOrValidator = Validators[fieldConfig.validationFuncName](value, !!fieldConfig.required);
    } else if (fieldConfig.required) {
      fieldMaskOrValidator = Validators.required(value);
    } else {
      fieldMaskOrValidator = Validators.none(value);
    }
    return fieldMaskOrValidator;
  }
}

const mapStateToProps = state => {
  return { home: state.home, perfil: state.perfil };
};

const mapDispatchToProps = dispatch => {
  return {
    setPerfilData: data => dispatch(setPerfilData(data)),
    setHomeData: data => dispatch(setHomeData(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PerfilScreen);

const styles = StyleSheet.create({
  editButton: {
    position: 'absolute',
    top: Configs.DEFAULT_HEADER.height - 70,
    right: 15,
    width: 50,
    height: 50,
    ...Layout.centered,
    backgroundColor: Colors.highlightDifferent
  },
  mainContent: {
    marginTop: -50,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    ...Layout.midRounded,
    backgroundColor: 'transparent'
  },
  inputItem: {
    marginTop: 10,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  inputLabel: {
    marginBottom: 5,
    fontSize: 18,
    color: Colors.systemBaseColor
  },
  input: {
    width: '100%',
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.systemBaseColor,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    ...Layout.hardRounded
  },
  pickerTouchable: {
    width: '100%',
    height: 50,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    ...Layout.hardRounded,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGrey
  },
  pickerTouchableText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.systemBaseColor
  },
  picker: {
    width: Layout.width - 80,
    backgroundColor: Colors.white,
    ...Layout.hardRounded,
    borderWidth: 1,
    borderColor: Colors.lightGrey
  },
  pickerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.systemBaseColor
  }
});