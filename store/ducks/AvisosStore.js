// Action Types

export const avisosTypes = {
  SET_DATA: 'SET_DATA'
};

// Reducer

const initialState = {
  notificacao: {
    naoavisar: true,
    umdia: false,
    tresdias: false,
    cincodias: false
  }
};

export default function avisosReducer(state = initialState, action) {
  switch (action.type) {
    case avisosTypes.SET_DATA:
      return { ...state, ...action.data };
    default:
      return state;
  }
}

// Action Creators

export function setAvisosData(data) {
  return {
    type: avisosTypes.SET_DATA,
    data: data
  };
}