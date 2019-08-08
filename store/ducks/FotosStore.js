// Action Types

export const fotosTypes = {
  SET_DATA: 'SET_DATA'
};

// Reducer

const initialState = {
  albuns: []
};

export default function fotosReducer(state = initialState, action) {
  switch (action.type) {
    case fotosTypes.SET_DATA:
      return { ...state, ...action.data };
    default:
      return state;
  }
}

// Action Creators

export function setFotosData(data) {
  return {
    type: fotosTypes.SET_DATA,
    data: data
  };
}