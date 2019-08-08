import Types from "../../constants/Types";

// Action Types

export const perfilTypes = {
  SET_PERFIL_DATA: 'SET_PERFIL_DATA'
};

// Reducer

const initialState = {
  activeType: Types.perfil.MEUS_DADOS,
  editing: false,
  visibleFields: {},
  touchedFields: {},
  errors: {},
  meusDados: {}
};

export default function perfilReducer(state = initialState, action) {
  switch (action.type) {
    case perfilTypes.SET_PERFIL_DATA:
      return { ...state, ...action.data };
    case perfilTypes.RESET_PERFIL_DATA:
      return initialState;
    default:
      return state;
  }
}

// Action Creators

export function setPerfilData(data) {
  return {
    type: perfilTypes.SET_PERFIL_DATA,
    data: data
  };
}