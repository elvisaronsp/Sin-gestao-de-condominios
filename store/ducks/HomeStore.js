// Action Types

export const homeTypes = {
  SET_DATA: 'SET_DATA',
  RESET_DATA: 'RESET_DATA'
};

// Reducer

const initialState = {
  loginInfo: {},
  meusDados: {},
  boletoAtivoMaisAntigo: {},
  modalApartmentSelectionVisible: false,
  unidades: [],
  unidadeSelecionada: {},
  refreshing: false
};

export default function homeReducer(state = initialState, action) {
  switch (action.type) {
    case homeTypes.SET_DATA:
      return { ...state, ...action.data };
    case homeTypes.RESET_DATA:
      return initialState;
    default:
      return state;
  }
}

// Action Creators

export function setHomeData(data) {
  return {
    type: homeTypes.SET_DATA,
    data: data
  };
}

export function resetHomeData() {
  return {
    type: homeTypes.RESET_DATA,
    data: initialState
  }
}