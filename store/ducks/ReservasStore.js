import Types from "../../constants/Types";

// Action Types

export const reservasTypes = {
  SET_DATA: 'SET_DATA',
  RESET_DATA: 'RESET_DATA'
};

// Reducer

const initialState = {
  activeReservaOption: Types.reservas.LOCAIS,
  locais: [],
  minhasReservas: [],
  refreshing: false,
};

export default function reservasReducer(state = initialState, action) {
  switch (action.type) {
    case reservasTypes.SET_DATA:
      return { ...state, ...action.data };
    case reservasTypes.RESET_DATA:
      return initialState;
    default:
      return state;
  }
}

// Action Creators

export function setReservasData(data) {
  return {
    type: reservasTypes.SET_DATA,
    data: data
  };
}

export function resetReservasData() {
  return {
    type: reservasTypes.RESET_DATA,
    data: initialState
  }
}