
// Action Types

export const minhaReservaTypes = {
  SET_MINHA_RESERVA_DATA: 'SET_MINHA_RESERVA_DATA'
};

// Reducer

const initialState = {
  touchedFields: {},
  reservaDetalhada: {},
  modalAdicionarConvidadoOpen: false,
  novoConvidado: {}
};

export default function minhaReservaReducer(state = initialState, action) {
  switch (action.type) {
    case minhaReservaTypes.SET_MINHA_RESERVA_DATA:
      return { ...state, ...action.data };
    default:
      return state;
  }
}

// Action Creators

export function setMinhaReservaData(data) {
  return {
    type: minhaReservaTypes.SET_MINHA_RESERVA_DATA,
    data: data
  };
}