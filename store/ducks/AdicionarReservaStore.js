import Types from "../../constants/Types";

// Action Types

export const adicionarReservaTypes = {
  SET_DATA: 'SET_DATA',
  RESET_DATA: 'RESET_DATA'
};

// Reducer

const initialState = {
  modalAdicionarReservaOpen: false,
  modalAdicionarItensAdicionaisOpen: false,
  modalReservadoComSucessoOpen: false,
  localDetalhado: null,
  dataSelecionadaUSAString: null,
  reservasDoMes: null,
  horarioInicioPickerOpen: false,
  qtdHorasPickerOpen: false,
  horaInicio: '08:00',
  itensAdicionaisSelecionados: {},
  aceitoOsTermos: false,
  reservando: false,
  novaReserva: {
    locqtdadehoras: 1,
    locvaloresadicionais: [],
    locobservacao: '',
    convidadosLocacao: []
  }
};

export default function adicionarReservaReducer(state = initialState, action) {
  switch (action.type) {
    case adicionarReservaTypes.SET_DATA:
      return { ...state, ...action.data };
    case adicionarReservaTypes.RESET_DATA:
      return initialState;
    default:
      return state;
  }
}

// Action Creators

export function setAdicionarReservaData(data) {
  return {
    type: adicionarReservaTypes.SET_DATA,
    data: data
  };
}

export function resetAdicionarReservaData() {
  return {
    type: adicionarReservaTypes.RESET_DATA,
    data: initialState
  }
}