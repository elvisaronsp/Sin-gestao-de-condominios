// Action Types

export const loginTypes = {
  SET_LOGIN_DATA: 'SET_LOGIN_DATA',
  RESET_LOGIN_DATA: 'RESET_LOGIN_DATA'
};

// Reducer

const initialState = {
  condominios: null,
  errors: {},
  modalForgotPassVisible: false,
  form: {
    usuario: '',
    senha: '',
    condominio: null
  },
  esqueciASenha: {
    email: ''
  }
};

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case loginTypes.SET_LOGIN_DATA:
      return { ...state, ...action.data };
    case loginTypes.RESET_LOGIN_DATA:
      return initialState;
    default:
      return state;
  }
}

// Action Creators

export function setLoginData(data) {
  return {
    type: loginTypes.SET_LOGIN_DATA,
    data: data
  };
}

export function resetLoginData() {
  return {
    type: loginTypes.RESET_LOGIN_DATA,
    data: initialState
  };
}