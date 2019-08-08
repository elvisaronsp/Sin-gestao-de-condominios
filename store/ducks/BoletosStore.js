import Types from "../../constants/Types";

export const boletoEnvioEmailStatusConstants = {
  NENHUM: 'nenhum',
  ENVIANDO: 'enviando',
  ENVIADO: 'enviado'
};

// Action Types

export const boletosTypes = {
  SET_DATA: 'SET_DATA',
  RESET_DATA: 'RESET_DATA'
};

// Reducer

const initialState = {
  ultimaUnidadeSelecionadaId: null,
  activeType: Types.boletos.ATIVO,
  refreshing: false,
  boletosAtivos: [],
  todosBoletos: [],
  modalDetalhesBoletoVisible: false,
  linhaDigitavelCopiada: false,
  envioEmailStatus: boletoEnvioEmailStatusConstants.NENHUM,
  detalhesBoletoSelecionado: null,
  boletoSelecionado: null
};

export default function boletosReducer(state = initialState, action) {
  switch (action.type) {
    case boletosTypes.SET_DATA:
      return { ...state, ...action.data };
    case boletosTypes.RESET_DATA:
      return initialState;
    default:
      return state;
  }
}

// Action Creators

export function setBoletosData(data) {
  return {
    type: boletosTypes.SET_DATA,
    data: data
  };
}

export function resetBoletosData() {
  return {
    type: boletosTypes.RESET_DATA,
    data: initialState
  }
}