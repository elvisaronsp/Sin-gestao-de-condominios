// Action Types

export const alterarSenhaTypes = {
  SET_DATA: 'SET_DATA'
};

// Reducer

const initialState = {
  errors: {},
  touchedFields: {},
  confirmarNovaSenha: '',
  form: {
    senhaAntiga: '',
    senhaNova: '',
    usuario: ''
  }
};

export default function alterarSenhaReducer(state = initialState, action) {
  switch (action.type) {
    case alterarSenhaTypes.SET_DATA:
      return { ...state, ...action.data };
    default:
      return state;
  }
}

// Action Creators

export function setAlterarSenhaData(data) {
  return {
    type: alterarSenhaTypes.SET_DATA,
    data: data
  };
}