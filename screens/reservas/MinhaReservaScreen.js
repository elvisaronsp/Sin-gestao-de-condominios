import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView } from 'react-native';

import SContainer from '../../components/Container';
import { setMinhaReservaData } from '../../store/ducks/MinhaReservaStore';
import SContent from '../../components/Content';
import SCard, { SCardItem } from '../../components/Card';
import Layout from '../../constants/Layout';
import STitle from '../../components/Title';
import Colors from '../../constants/Colors';
import UtilFunctions from '../../util/UtilFunctions';
import SItem from '../../components/Item';
import SText from '../../components/Text';
import Configs from '../../constants/Configs';
import SButton from '../../components/Button';
import SIcon from '../../components/Icon';
import Infos from '../../util/Infos';
import SModal, { SModalTitle } from '../../components/Modal';
import SInput from '../../components/Input';
import SErrorText from '../../components/ErrorText';
import Masks from '../../util/Masks';
import SHttp from '../../util/Http';
import Endpoints from '../../constants/Endpoints';
import SView from '../../components/View';
import Validators from '../../util/Validators';
import SContentWithHeaderImage from '../../components/HeaderWithImage';
import NavigationKeys from '../../constants/NavigationKeys';
import SList, { SListItem } from '../../components/List';
import SBody from '../../components/Body';
import { Toast } from 'native-base';
import SRight from '../../components/Right';

const titleHeight = 40;

class MinhaReservaScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.props.setMinhaReservaData({
      reservaDetalhada: props.navigation.state.params.reserva,
      errors: {
        nome: Validators.required(this.props.minhaReserva.novoConvidado.nome).error,
        documento: Masks.cpf(this.props.minhaReserva.novoConvidado.documento).error,
        fone: Masks.fone(this.props.minhaReserva.novoConvidado.fone).error
      }
    });

    this.Convidados = this.Convidados.bind(this);
    this.ModalAdicionarConvidado = this.ModalAdicionarConvidado.bind(this);
  }

  static navigationOptions = Layout.navigationNullHeader;

  render() {
    if (!Object.keys(this.props.minhaReserva.reservaDetalhada).length) return <SContainer />;
    return (
      <SContainer>
        <SContentWithHeaderImage
          headerTitle={this.props.minhaReserva.reservaDetalhada.nome}
          navigation={this.props.navigation}
          backgroundImage={(this.props.minhaReserva.reservaDetalhada.fotos[0] || {}).url}
          token={this.props.home.loginInfo.token}
          backTo={NavigationKeys.RESERVAS}
        >
          <SView style={{ marginTop: -50 }}>
            <SCard preset="large" rounded>
              <SCardItem style={{ paddingLeft: 0, paddingRight: 0 }}>
                <SItem style={{ width: '100%', height: Layout.typeButtonsItemHeight }}>
                  <STitle style={{ fontSize: 28, fontWeight: 'bold', color: Colors.systemBaseColor, flexWrap: 'wrap' }}>
                    {Layout.isSmallDevice ? 'Data:' : 'Reserva para'} {UtilFunctions.getDateWithShortYear(this.props.minhaReserva.reservaDetalhada.data)}
                  </STitle>
                  <SItem style={styles.subtitle}>
                    <SText>Custo: R$ {this.props.minhaReserva.reservaDetalhada.valor}</SText>
                    <SText style={{ fontSize: 17, color: Colors.darkGreyText }}>
                      {Layout.isSmallDevice ? 'Convid.' : 'Convidados'}: {(this.props.minhaReserva.reservaDetalhada.convidados || []).length}
                    </SText>
                  </SItem>
                </SItem>
              </SCardItem>
              <SCardItem style={{ paddingLeft: 0, paddingRight: 0 }}>
                <SContent style={{ maxHeight: Layout.height - Configs.EXTRA_LARGE_HEADER.height - Layout.typeButtonsItemHeight - titleHeight - 20 - 50 }}>
                  <SItem style={{ paddingTop: 10, paddingBottom: 20, flexDirection: 'column', alignItems: 'flex-start' }}>
                    <SText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Convidados</SText>
                    <this.Convidados />
                  </SItem>
                </SContent>
              </SCardItem>
            </SCard>
            <SButton rounded style={{
              position: 'absolute',
              bottom: Infos.isIOS() ? -20 : 10,
              right: Infos.isIOS() ? 20 : 25,
              width: 50,
              height: 50,
              backgroundColor: Colors.systemBaseColor,
              ...Layout.midShadow,
              ...Layout.centered
            }}
              onPress={() => this.openModalAdicionarConvidado()}
            >
              <SIcon name="add" />
            </SButton>
          </SView>
        </SContentWithHeaderImage>
        <this.ModalAdicionarConvidado />
      </SContainer>
    );
  }

  Convidados() {
    const convidados = this.props.minhaReserva.reservaDetalhada.convidados;
    if (!convidados.length) {
      return (
        <SItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <SText style={styles.convidadosText}>
            Você ainda não adicionou convidados
            </SText>
        </SItem>
      );
    }

    return (
      <SList style={{ width: '100%' }}>
        {convidados.map((convidado, index) => {
          return (
            <SListItem
              key={convidado.idconvidado}
              style={{ paddingLeft: 0, paddingRight: 0, marginLeft: -10, marginRight: -20, height: 50 }}
            >
              <SBody>
                <SText style={styles.convidadosText}>
                  {index + 1} - {convidado.nomeconvidado}
                </SText>
              </SBody>
              <SRight>
                <SButton full transparent rounded onPress={() => this.deleteConvidado(convidado)}>
                  <SIcon style={{ color: Colors.redHighlight }} name="trash" />
                </SButton>
              </SRight>
            </SListItem>
          );
        })}
      </SList>
    );
  }

  ModalAdicionarConvidado() {
    return (
      <SModal
        open={this.props.minhaReserva.modalAdicionarConvidadoOpen}
        modalDidClose={() => this.closeModalAdicionarConvidado()}
      >
        <SView>
          <SModalTitle text="Adicionar convidado" />
          <ScrollView style={{ flexDirection: 'column' }}>
            <SItem style={styles.inputItem}>
              <SInput
                style={styles.modalInput}
                placeholder="Nome do convidado"
                onChangeText={value => this.setNome(value)}
                value={this.props.minhaReserva.novoConvidado.nome}
              />
              <SErrorText text={this.props.minhaReserva.errors.nome} visible={!!this.props.minhaReserva.touchedFields.nome} />
            </SItem>
            <SItem style={styles.inputItem}>
              <SInput
                style={styles.modalInput}
                placeholder="CPF"
                keyboardType="numeric"
                onChangeText={value => this.setCPF(value)}
                value={this.props.minhaReserva.novoConvidado.documento}
              />
              <SErrorText text={this.props.minhaReserva.errors.documento} visible={!!this.props.minhaReserva.touchedFields.documento} />
            </SItem>
            <SItem style={styles.inputItem}>
              <SInput
                style={styles.modalInput}
                placeholder="Telefone"
                keyboardType="phone-pad"
                onChangeText={value => this.setFone(value)}
                value={this.props.minhaReserva.novoConvidado.fone}
              />
              <SErrorText text={this.props.minhaReserva.errors.fone} visible={!!this.props.minhaReserva.touchedFields.fone} />
            </SItem>
            <SItem style={styles.inputItem}>
              <SButton
                block
                style={{ ...Layout.slightlyRounded, backgroundColor: Colors.systemBaseColor }}
                onPress={() => this.inserirConvidado()}
              >
                <SText>Inserir convidado</SText>
              </SButton>
            </SItem>
          </ScrollView>
        </SView>
      </SModal>
    );
  }

  openModalAdicionarConvidado() {
    this.props.navigation.setParams({ bottomTabVisible: false });
    this.props.setMinhaReservaData({ modalAdicionarConvidadoOpen: true });
  }

  closeModalAdicionarConvidado() {
    this.props.navigation.setParams({ bottomTabVisible: true });
    this.props.setMinhaReservaData({ modalAdicionarConvidadoOpen: false, novoConvidado: {}, touchedFields: {} });
  }

  setNome(value) {
    const nomeValidation = Validators.required(value);
    this.setNovoConvidadoData('nome', nomeValidation.error, nomeValidation.value);
  }

  setCPF(value) {
    const cpfMask = Masks.cpf(value, true);
    this.setNovoConvidadoData('documento', cpfMask.error, cpfMask.value);
  }

  setFone(value) {
    const foneMask = Masks.fone(value, true);
    this.setNovoConvidadoData('fone', foneMask.error, foneMask.value);
  }

  setNovoConvidadoData(inputName, error, value) {
    this.props.setMinhaReservaData({
      errors: {
        ...this.props.minhaReserva.errors,
        [inputName]: error
      },
      touchedFields: {
        ...this.props.minhaReserva.touchedFields,
        [inputName]: true
      },
      novoConvidado: {
        ...this.props.minhaReserva.novoConvidado,
        [inputName]: value
      }
    });
  }

  inserirConvidado() {
    if (Object.keys(this.props.minhaReserva.errors).find(key => this.props.minhaReserva.errors[key])) {
      alert('Preencha corretamente todos os campos!');
      this.props.setMinhaReservaData({ touchedFields: { nome: true, documento: true, fone: true } });
      return;
    }

    const novoConvidado = this.props.minhaReserva.novoConvidado;
    const payload = {
      idlocacao: this.props.minhaReserva.reservaDetalhada.idLocacao,
      nome: novoConvidado.nome.trim(),
      documento: Masks.getCpfWithJustNumbers(novoConvidado.documento),
      fone: Masks.getFoneWithJustNumbers(novoConvidado.fone)
    };

    SHttp.put(Endpoints.CONVIDADO, payload).then(
      () => {
        this.closeModalAdicionarConvidado();
        this.fetchReservaDetalhada();
      },
      err => alert(UtilFunctions.getMessageFromError(err, 'Não foi possível inserir o convidado, tente novamente mais tarde!'))
    );
  }

  deleteConvidado(convidado) {
    const params = { idconvidado: convidado.idconvidado };
    SHttp.delete(Endpoints.CONVIDADO, { params }).then(() => {
      Toast.show({
        ...Configs.toastSuccess,
        text: 'Convidado removido com sucesso!'
      });
      this.fetchReservaDetalhada();
    }, err => {
      Toast.show({
        ...Configs.toastError,
        text: UtilFunctions.getMessageFromError(err, 'Ocorreu um erro ao tentar remover o convidado')
      });
    });
  }

  fetchReservaDetalhada() {
    SHttp.get(Endpoints.RESERVA_DETALHADA, { params: { idlocacao: this.props.minhaReserva.reservaDetalhada.idLocacao } })
      .then(response => this.props.setMinhaReservaData({ reservaDetalhada: response.data.objeto }), () => null);
  }
}

const mapStateToProps = state => {
  return { minhaReserva: state.minhaReserva, home: state.home };
};

const mapDispatchToProps = dispatch => {
  return {
    setMinhaReservaData: data => dispatch(setMinhaReservaData(data))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MinhaReservaScreen);

const styles = StyleSheet.create({
  inputItem: {
    width: '100%',
    marginBottom: 10,
    flexDirection: 'column'
  },
  modalInput: {
    height: 50,
    width: '100%',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: Colors.lightGrey,
    ...Layout.hardRounded
  },
  convidadosText: {
    fontSize: 19,
    color: Colors.darkGreyText
  },
  subtitle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1
  }
});