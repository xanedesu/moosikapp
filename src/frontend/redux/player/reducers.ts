import { PlayerState, PlayerActionTypes, AnyPlayerAction } from './types';

const initialState: PlayerState = {
  songList: [],
  current: {
    song: null,
    index: -1,
  },
  playing: false,
  repeat: 'off',
  shuffle: false,
};

const playerReducer = (state = initialState, action: AnyPlayerAction): PlayerState => {
  switch (action.type) {
    case PlayerActionTypes.SET_SONG_LIST:
      return { ...state, songList: [...action.payload] };
    case PlayerActionTypes.SET_FAV:
      return {
        ...state,
        songList: state.songList.map((song) =>
          song.uuid === action.payload.songId ? { ...song, favorite: action.payload.value } : song,
        ),
      };
    case PlayerActionTypes.SET_CURRENT_SONG: {
      return {
        ...state,
        current: {
          index: state.current.index,
          song: action.payload,
        },
      };
    }
    case PlayerActionTypes.SET_CURRENT_SONG_INDEX: {
      return {
        ...state,
        current: {
          index: action.payload,
          song: state.current.song,
        },
      };
    }
    case PlayerActionTypes.SET_PLAYING:
      return { ...state, playing: action.payload };
    case PlayerActionTypes.SET_REPEAT:
      return { ...state, repeat: action.payload };
    case PlayerActionTypes.SET_SHUFFLE:
      return { ...state, shuffle: action.payload };
    default:
      return state;
  }
};

export default playerReducer;
