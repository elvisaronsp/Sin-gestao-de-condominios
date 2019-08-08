// Action Types

export const albumTypes = {
  SET_DATA: 'SET_DATA'
};

// Reducer

const initialState = {
  albuns: [],
  selectedImage: null
};

export default function albumReducer(state = initialState, action) {
  switch (action.type) {
    case albumTypes.SET_DATA:
      return { ...state, ...action.data };
    default:
      return state;
  }
}

// Action Creators

export function setAlbumData(data) {
  return {
    type: albumTypes.SET_DATA,
    data: data
  };
}