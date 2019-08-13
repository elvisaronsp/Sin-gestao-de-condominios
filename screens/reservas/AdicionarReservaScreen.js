import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView, TouchableOpacity, Picker } from 'react-native';

import { Calendar } from 'react-native-calendars';
import DateTimePicker from 'react-native-modal-datetime-picker';

import SContainer from '../../components/Container';
import Layout from '../../constants/Layout';
import { setAdicionarReservaData, resetAdicionarReservaData } from '../../store/ducks/AdicionarReservaStore';
import SContent from '../../components/Content';
import SCard from '../../components/Card';
import Configs from '../../constants/Configs';
import SHttp from '../../util/Http';
import Endpoints from '../../constants/Endpoints';
import UtilFunctions from '../../util/UtilFunctions';
import Colors from '../../constants/Colors';
import { Spinner } from 'native-base';
import SModal, { SModalTitle, SModalDefaultProps } from '../../components/Modal';
import SItem from '../../components/Item';
import SText from '../../components/Text';
import SButton from '../../components/Button';
import SIcon from '../../components/Icon';
import SList, { SListItem } from '../../components/List';
import SCheckBox from '../../components/Checkbox';
import STextarea from '../../components/TextArea';
import { SSpinnerConstants } from '../../components/Spinner';
import SView from '../../components/View';
import SContentWithHeaderImage from '../../components/HeaderWithImage';
import NavigationKeys from '../../constants/NavigationKeys';
import SBody from '../../components/Body';
import SRight from '../../components/Right';
import Infos from '../../util/Infos';

class AdicionarReservaScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    this.local = props.navigation.state.params.local;

    this.ModalAdicionarReserva = this.ModalAdicionarReserva.bind(this);
    this.ModalSelecionarItensAdicionais = this.ModalSelecionarItensAdicionais.bind(this);
    this.ModalReservadoComSucesso = this.ModalReservadoComSucesso.bind(this);
    this.HorarioInicioPicker = this.HorarioInicioPicker.bind(this);
    this.QtdHorasPicker = this.QtdHorasPicker.bind(this);
    this.openModalAdicionarReserva = this.openModalAdicionarReserva.bind(this);
    this.closeModalAdicionarReserva = this.closeModalAdicionarReserva.bind(this);
    this.QtdHorasPickerView = this.QtdHorasPickerView.bind(this);
    this.QtdHorasPicker = this.QtdHorasPicker.bind(this);

    this.fetchReservas();
  }

  static navigationOptions = Layout.navigationNullHeader;

  render() {
    return (
      <SContainer>
        <SContentWithHeaderImage
          headerTitle={this.local.descricao}
          navigation={this.props.navigation}
          backgroundImage={(this.local.fotos[0] || {}).url}
          token={this.props.home.loginInfo.token}
          backTo={NavigationKeys.RESERVAS}
        >
          <SContent style={{ marginTop: -50 }}>
            <SCard preset="large" rounded>
              <Calendar
                theme={Configs.CALENDAR_THEME}
                markedDates={this.getMarkedDates()}
                minDate={new Date()}
                onMonthChange={calendarDate => this.fetchReservas(calendarDate.dateString)}
                onDayPress={obj => this.openModalAdicionarReserva(obj)}
              />
            </SCard>
          </SContent>
        </SContentWithHeaderImage>
        <this.ModalAdicionarReserva />
        <this.ModalSelecionarItensAdicionais />
        <this.ModalReservadoComSucesso />
        <this.HorarioInicioPicker />
      </SContainer>
    );
  }

  ModalAdicionarReserva() {
    if (!this.props.adicionarReserva.modalAdicionarReservaOpen) return <SContent style={{ display: 'none' }} />
    return (
      <SModal
        open={this.props.adicionarReserva.modalAdicionarReservaOpen}
        modalDidClose={() => this.closeModalAdicionarReserva()}
        modalStyle={{ ...SModalDefaultProps.modalStyle, height: '80%' }}
      >
        <SView style={{ padding: 10 }}>
          <SModalTitle text={`Reserva para ${UtilFunctions.usaDateToBRDateShortYear(this.props.adicionarReserva.dataSelecionadaUSAString)}`} />
          <ScrollView style={Layout.scrollViewInsideModal}>
            {this.isTipoAreaLocacaoDiario()
              ?
              <SItem style={{ marginBottom: 20 }}>
                <SText style={{ width: '100%', textAlign: 'center', fontSize: 19 }}>Reserva diária!</SText>
              </SItem>
              :
              <SItem style={styles.rowItem}>
                <SItem style={styles.pickerItem}>
                  <SText style={styles.label}>{Layout.isSmallDevice ? 'Início' : 'Horário de início'}</SText>
                  <TouchableOpacity style={styles.pickerTouchable} onPress={() => this.openHorarioInicioPicker()}>
                    <SText style={styles.pickerTouchableText}>{this.props.adicionarReserva.horaInicio}</SText>
                  </TouchableOpacity>
                </SItem>
                <SItem style={styles.pickerItem}>
                  <SText style={styles.label}>Tempo</SText>
                  <this.QtdHorasPickerView />
                </SItem>
              </SItem>
            }
            {!!this.props.adicionarReserva.localDetalhado.itensadicionais && this.props.adicionarReserva.localDetalhado.itensadicionais.length > 0 &&
              <SItem style={{ ...styles.rowItem, borderBottomWidth: 0 }}>
                <SText style={styles.label}>Itens adicionais</SText>
                <SButton
                  rounded
                  style={{ backgroundColor: Colors.systemBaseColor }}
                  onPress={() => this.openModalAdicionarItensAdicionais()}
                >
                  <SIcon name="add" />
                </SButton>
              </SItem>
            }
            {!!this.props.adicionarReserva.localDetalhado.itensadicionais && this.props.adicionarReserva.localDetalhado.itensadicionais.length > 0 &&
              <SItem style={{ flexDirection: 'column', borderBottomWidth: 1 }}>
                {this.props.adicionarReserva.novaReserva.locvaloresadicionais.map((valorAdicional, index) => {
                  return (
                    <SItem key={index} style={{ ...styles.rowItem, width: '100%', borderBottomWidth: 0 }}>
                      <SBody style={{ alignItems: 'flex-start' }}>
                        <SText style={styles.itemAdicionalText}>{valorAdicional.item}</SText>
                      </SBody>
                      <SRight style={{ marginRight: 5 }}>
                        <SText style={styles.itemAdicionalText}>{UtilFunctions.getCurrencyFormat(valorAdicional.valor)}</SText>
                      </SRight>
                    </SItem>
                  );
                })}
                {this.props.adicionarReserva.novaReserva.locvaloresadicionais.length === 0 &&
                  <SItem style={{ ...styles.rowItem, ...Layout.centered, borderBottomWidth: 0 }}>
                    <SText style={{ ...styles.itemAdicionalText, textAlign: 'center' }}>Nenhum item adicional selecionado!</SText>
                  </SItem>
                }
              </SItem>
            }
            <SItem style={{ ...styles.rowItem, flexDirection: 'column', justifyContent: 'flex-start', borderBottomWidth: 0 }}>
              <SText style={styles.label}>Observações</SText>
              <STextarea
                rowSpan={3}
                bordered
                style={{ ...Layout.midRounded, width: '100%', padding: 10 }}
                value={this.props.adicionarReserva.novaReserva.locobservacao}
                onChangeText={value => this.props.setAdicionarReservaData({ novaReserva: { ...this.props.adicionarReserva.novaReserva, locobservacao: value } })}
              />
            </SItem>
            {!!this.props.adicionarReserva.localDetalhado.arquivotermoutilizacao &&
              <SItem style={{ ...styles.rowItem, ...Layout.centered, borderBottomWidth: 0 }}>
                <SCheckBox
                  color={Colors.greenHighlight}
                  checked={this.props.adicionarReserva.aceitoOsTermos}
                  onPress={() => this.toggleAceitoOsTermos()}
                />
                <SText style={{ ...styles.label, marginLeft: 20 }}>Aceito os </SText>
                <SText style={{ ...styles.label, color: Colors.blackText }}>termos de uso</SText>
              </SItem>
            }
            <SItem style={{ ...styles.rowItem, ...Layout.centered, borderBottomWidth: 0 }}>
              <SButton
                block
                style={{ width: '100%', backgroundColor: Colors.systemBaseColor, ...Layout.slightlyRounded }}
                onPress={() => this.reservar()}
                disabled={this.props.adicionarReserva.reservando}
              >
                {this.props.adicionarReserva.reservando ?
                  <Spinner color={Colors.whiteText} /> :
                  <SText>Reservar</SText>
                }
              </SButton>
            </SItem>
          </ScrollView>
        </SView>
        {Infos.isIOS()
          ?
          <this.QtdHorasPicker />
          :
          <SView style={{ display: 'none' }} />
        }
      </SModal>
    );
  }

  ModalSelecionarItensAdicionais() {
    if (!this.props.adicionarReserva.localDetalhado) return <SContent style={{ display: 'none' }} />
    return (
      <SModal
        open={this.props.adicionarReserva.modalAdicionarItensAdicionaisOpen}
        modalDidClose={() => this.closeModalAdicionarItensAdicionais()}
      >
        <SView style={{ padding: 10 }}>
          <SModalTitle text="Selecione os itens" />
          <ScrollView style={Layout.scrollViewInsideModal}>
            <SList>
              {this.props.adicionarReserva.localDetalhado.itensadicionais.map((item, index) => {
                return (
                  <SListItem key={index} style={{ justifyContent: 'space-between' }} onPress={() => this.toggleItemAdicional(item)}>
                    <SBody style={{ marginLeft: -20 }}>
                      <SText style={{ fontSize: 16, fontWeight: 'bold' }}>{item.comdescricaocomplemento}</SText>
                      <SText style={{ marginRight: 10, fontSize: 14 }}>{UtilFunctions.getCurrencyFormat(item.comvalor)}</SText>
                    </SBody>
                    <SRight>
                      <SCheckBox
                        color={Colors.systemBaseColor}
                        checked={this.props.adicionarReserva.itensAdicionaisSelecionados[item.comdescricaocomplemento]}
                        onPress={() => this.toggleItemAdicional(item)}
                      />
                    </SRight>
                  </SListItem>
                );
              })}
              {this.props.adicionarReserva.localDetalhado.itensadicionais.length === 0 &&
                <SItem style={{ ...Layout.centered }}>
                  <SText style={styles.itemAdicionalText}>Nenhum item adicional cadastrado!</SText>
                </SItem>
              }
            </SList>
          </ScrollView>
        </SView>
      </SModal>
    );
  }

  ModalReservadoComSucesso() {
    const msgSucesso = this.props.adicionarReserva.localDetalhado && this.props.adicionarReserva.localDetalhado.textoreserva ? this.props.adicionarReserva.localDetalhado.textoreserva : 'Reservado com sucesso!';

    return (
      <SModal
        open={this.props.adicionarReserva.modalReservadoComSucessoOpen}
        modalDidClose={() => this.closeModalReservadoComSucesso()}
        modalStyle={{ ...SModalDefaultProps.modalStyle, height: 220 }}
      >
        <SModalTitle
          style={{ marginTop: 20, marginBottom: 20, borderBottomWidth: 0 }}
          textStyle={{
            width: '100%',
            textAlign: 'center',
            fontSize: 26,
            fontWeight: 'bold',
            paddingTop: 20,
            paddingBottom: 20,
            color: Colors.systemBaseColor
          }}
          text={msgSucesso}
        />
        <SButton
          block
          style={{ width: '100%', ...Layout.slightlyRounded, backgroundColor: Colors.systemBaseColor }}
          onPress={() => this.closeModalReservadoComSucesso()}
        >
          <SText>OK</SText>
        </SButton>
      </SModal>
    );
  }

  HorarioInicioPicker() {
    return (
      <DateTimePicker
        isVisible={this.props.adicionarReserva.horarioInicioPickerOpen}
        onConfirm={date => this.selectHorarioInicio(date)}
        onCancel={() => this.closeHorarioInicioPicker()}
        mode="time"
        datePickerModeAndroid="spinner"
        confirmTextIOS="Confirmar"
        cancelTextIOS="Cancelar"
        titleIOS="Selecione um horário"
        titleStyle={{ fontSize: 14 }}
        minuteInterval={60}
      />
    );
  }

  QtdHorasPickerView() {
    if (Infos.isIOS()) {
      return (
        <TouchableOpacity style={styles.pickerTouchable} onPress={() => this.openQtdHorasPicker()}>
          <SText style={styles.pickerTouchableText}>{this.getTempoText(this.props.adicionarReserva.novaReserva.locqtdadehoras)}</SText>
        </TouchableOpacity>
      );
    }
    return (
      <SView style={styles.pickerTouchable}>
        <this.QtdHorasPicker />
      </SView>
    );
  }

  QtdHorasPicker() {
    const qtdHoraMinima = parseInt(this.props.adicionarReserva.localDetalhado.reservaminima || 1) || 1;
    let horas = [];
    for (let i = qtdHoraMinima; i < 13; i++) {
      horas.push(i);
    }
    if (!this.props.adicionarReserva.novaReserva.locqtdadehoras) {
      this.selectQtdHoras(horas[0]);
    }

    if (Infos.isIOS() && !this.props.adicionarReserva.qtdHorasPickerOpen) {
      return <SView style={{ display: 'none' }} />
    }

    return (
      <Picker
        style={Infos.isIOS() ? styles.pickerIOS : styles.pickerAndroid}
        onValueChange={value => this.selectQtdHoras(value)}
        selectedValue={this.props.adicionarReserva.novaReserva.locqtdadehoras}
      >
        {horas.map(hora => {
          return <Picker.Item key={hora} label={this.getTempoText(hora)} value={hora} />
        })}
      </Picker>
    );
  }

  openQtdHorasPicker() {
    this.props.setAdicionarReservaData({ qtdHorasPickerOpen: true });
  }

  openHorarioInicioPicker() {
    this.props.setAdicionarReservaData({ horarioInicioPickerOpen: true });
  }

  closeHorarioInicioPicker(extraDataToSet = {}) {
    this.props.setAdicionarReservaData({ horarioInicioPickerOpen: false, ...extraDataToSet });
  }

  selectHorarioInicio(date) {
    const horaMinuto = UtilFunctions.getHoraMinutoFromPickerDate(date);
    this.closeHorarioInicioPicker({ horaInicio: horaMinuto });
    this.fetchLocalDetalhado(horaMinuto, null);
  }

  selectQtdHoras(hora) {
    this.props.setAdicionarReservaData({
      novaReserva: { ...this.props.adicionarReserva.novaReserva, locqtdadehoras: hora },
      ...(Infos.isIOS() ? { qtdHorasPickerOpen: false } : {})
    });
  }

  openModalAdicionarReserva(dateObj) {
    this.fetchLocalDetalhado(null, dateObj.dateString).then(() => {
      this.props.navigation.setParams({ bottomTabVisible: false });
      this.props.setAdicionarReservaData({ modalAdicionarReservaOpen: true, dataSelecionadaUSAString: dateObj.dateString });
    }, err => {
      alert(UtilFunctions.getMessageFromError(err, 'Não foi possível recuperar os detalhes da área de locação, tente novamente mais tarde!'));
    });
  }

  closeModalAdicionarReserva(extraData, bottomTabVisible = true) {
    this.props.navigation.setParams({ bottomTabVisible: bottomTabVisible });
    this.props.setAdicionarReservaData({
      ...extraData,
      modalAdicionarReservaOpen: false,
      aceitoOsTermos: false,
      horaInicio: '08:00',
      itensAdicionaisSelecionados: {},
      novaReserva: {
        locqtdadehoras: 1,
        locvaloresadicionais: [],
        locobservacao: '',
        convidadosLocacao: []
      }
    });
  }

  openModalAdicionarItensAdicionais() {
    this.props.setAdicionarReservaData({ modalAdicionarItensAdicionaisOpen: true });
  }

  closeModalAdicionarItensAdicionais() {
    this.props.setAdicionarReservaData({ modalAdicionarItensAdicionaisOpen: false });
  }

  openModalReservadoComSucesso() {
    this.closeModalAdicionarReserva({ modalReservadoComSucessoOpen: true }, false);
  }

  closeModalReservadoComSucesso() {
    this.props.navigation.setParams({ bottomTabVisible: true });
    this.props.setAdicionarReservaData({ modalReservadoComSucessoOpen: false });
    this.fetchReservas(this.props.adicionarReserva.dataSelecionadaUSAString);
  }

  toggleItemAdicional(item) {
    const locvaloresadicionais = this.props.adicionarReserva.novaReserva.locvaloresadicionais;
    const itemIndex = locvaloresadicionais.findIndex(valorAdicional => valorAdicional.item === item.comdescricaocomplemento);
    if (itemIndex !== -1) {
      locvaloresadicionais.splice(itemIndex, 1);
    } else {
      locvaloresadicionais.push({ item: item.comdescricaocomplemento, valor: item.comvalor });
    }
    this.props.setAdicionarReservaData({
      itensAdicionaisSelecionados: {
        ...this.props.adicionarReserva.itensAdicionaisSelecionados,
        [item.comdescricaocomplemento]: !this.props.adicionarReserva.itensAdicionaisSelecionados[item.comdescricaocomplemento]
      },
      novaReserva: { ...this.props.adicionarReserva.novaReserva, locvaloresadicionais }
    });
  }

  toggleAceitoOsTermos() {
    this.props.setAdicionarReservaData({ aceitoOsTermos: !this.props.adicionarReserva.aceitoOsTermos });
  }

  reservar() {
    if (!!this.props.adicionarReserva.localDetalhado.arquivotermoutilizacao && !this.props.adicionarReserva.aceitoOsTermos) {
      alert('Você precisa aceitar os termos de uso para efetuar a reserva!');
    } else {
      const payload = {
        ...this.props.adicionarReserva.novaReserva,
        locdatauso: UtilFunctions.usaDateToBRDateShortYear(this.props.adicionarReserva.dataSelecionadaUSAString) + ' ' + this.props.adicionarReserva.horaInicio,
        idunidade: this.props.home.unidadeSelecionada.id,
        idarealocacao: this.local.id
      };
      this.props.setAdicionarReservaData({ reservando: true });
      SHttp.post(Endpoints.RESERVAS, payload, { headers: SSpinnerConstants.HEADER_CONFIG }).then(() => {
        this.openModalReservadoComSucesso();
      }, err => {
        alert(UtilFunctions.getMessageFromError(err, 'Não foi possível realizar a reserva, tente novamente mais tarde!'));
      }).finally(() => this.props.setAdicionarReservaData({ reservando: false }));
    }
  }

  fetchReservas(dateString) {
    const date = dateString ? new Date(dateString) : new Date();
    let month = ('0' + (date.getMonth() + 1));
    month = month.substring(month.length - 2);
    const params = {
      unidade: this.props.home.unidadeSelecionada.id,
      arealocacao: this.local.id,
      anomes: `${date.getFullYear()}${month}`
    };

    SHttp.get(Endpoints.RESERVAS, { params }).then(response => {
      this.setReservasToStore(response.data.objeto);
    }, () => null);
  }

  fetchLocalDetalhado(horaInicio, dataSelecionadaUSAString) {
    const params = {
      unidade: this.props.home.unidadeSelecionada.id,
      dia: UtilFunctions.usaDateToBRDate(dataSelecionadaUSAString || this.props.adicionarReserva.dataSelecionadaUSAString),
      arealocacao: this.local.id,
      horaminuto: horaInicio || this.props.adicionarReserva.horaInicio
    };
    return SHttp.get(Endpoints.LOCAL_DETALHADO, { params }).then(response => {
      this.props.setAdicionarReservaData({ localDetalhado: response.data.objeto[0] });
    }, () => null);
  }

  setReservasToStore(reservas) {
    const reservasKeys = Object.keys(reservas);
    let reservasDoMes = [];
    reservasKeys.forEach(key => {
      const data = UtilFunctions.getDateWithFullYear(key);
      reservas[key].forEach(reserva => {
        let newReserva = reserva;
        newReserva.data = UtilFunctions.brDateToUSADate(data);
        newReserva.year = UtilFunctions.getYearFromBRDate(data);
        newReserva.month = UtilFunctions.getMonthFromBRDate(data);
        newReserva.day = UtilFunctions.getDayFromBRDate(data);
        newReserva.horaInicial = UtilFunctions.getTime(data);

        reservasDoMes.push(newReserva);
      });
    });
    this.props.setAdicionarReservaData({ reservasDoMes });
  }

  getMarkedDates() {
    const markedDates = {};
    const reservasDoMes = this.props.adicionarReserva.reservasDoMes || [];
    reservasDoMes.forEach(reserva => {
      markedDates[reserva.data] = {
        disabled: true,
        disableTouchEvent: true,
        selected: true,
        selectedColor: reserva.proprio === 'Sim' || reserva.proprio === 'sim' ? Colors.greenHighlight : Colors.redHighlight
      };
    });
    return markedDates;
  }

  getTempoText(tempo) {
    return tempo + (tempo > 1 ? ' horas' : ' hora');
  }

  isTipoAreaLocacaoDiario() {
    return this.local.tipoarealocacao === 'Diario';
  }
}

const mapStateToProps = state => {
  return { home: state.home, adicionarReserva: state.adicionarReserva };
};

const mapDispatchToProps = dispatch => {
  return {
    setAdicionarReservaData: data => dispatch(setAdicionarReservaData(data)),
    resetAdicionarReservaData: () => dispatch(resetAdicionarReservaData())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdicionarReservaScreen);

const styles = StyleSheet.create({
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1
  },
  pickerItem: {
    width: '45%',
    flexDirection: 'column',
    ...Layout.centered
  },
  label: {
    color: Colors.midGrey,
    fontSize: 16,
    marginBottom: 5
  },
  pickerIOS: {
    position: 'absolute',
    width: '100%',
    height: 150,
    bottom: Layout.bottomTabNavigatorHeight,
    backgroundColor: Colors.cardBackground
  },
  pickerAndroid: {
    width: '70%',
    backgroundColor: 'transparent'
  },
  pickerTouchable: {
    width: '100%',
    height: 50,
    ...Layout.hardRounded,
    ...Layout.centered,
    backgroundColor: Colors.lightGrey
  },
  pickerTouchableText: {
    fontSize: 19,
    color: Colors.blackText
  },
  itemAdicionalText: {
    color: Colors.darkGreyText,
    fontSize: 16
  }
});