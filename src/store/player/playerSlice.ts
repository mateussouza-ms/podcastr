import { createSlice } from "@reduxjs/toolkit";

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
}

interface InitialStateData {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
}

const initialState: InitialStateData = {
  episodeList: [],
  currentEpisodeIndex: 0,
  isPlaying: false,
  isLooping: false,
  isShuffling: false,
  hasPrevious: false,
  hasNext: false,
};

interface PlayAction {
  payload: {
    episodeList: Episode[];
    index: number;
    isPlaying: boolean;
  };
}

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    playList: (state: InitialStateData, action: PlayAction) => {
      state.episodeList = action.payload.episodeList;
      state.currentEpisodeIndex = action.payload.index;
      state.isPlaying = action.payload.isPlaying;
      state.hasPrevious = state.currentEpisodeIndex > 0;
      state.hasNext =
        state.episodeList.length > 1 &&
        (state.isShuffling ||
          state.currentEpisodeIndex < state.episodeList.length - 1);
    },

    playPrevious: (state: InitialStateData, action: PlayAction) => {
      if (state.hasPrevious) {
        state.currentEpisodeIndex = state.currentEpisodeIndex - 1;
        state.hasPrevious = state.currentEpisodeIndex > 0;
        state.hasNext =
          state.isShuffling ||
          state.currentEpisodeIndex < state.episodeList.length - 1;
      }
    },

    playNext: {
      reducer(state: InitialStateData, action: { payload: { index: number } }) {
        if (state.isShuffling) {
          state.currentEpisodeIndex = action.payload.index;
          state.hasPrevious = state.currentEpisodeIndex > 0;
          state.hasNext =
            state.isShuffling ||
            state.currentEpisodeIndex < state.episodeList.length - 1;
        } else if (state.hasNext) {
          state.currentEpisodeIndex += 1;
          state.hasPrevious = state.currentEpisodeIndex > 0;
          state.hasNext =
            state.isShuffling ||
            state.currentEpisodeIndex < state.episodeList.length - 1;
        } else {
          state = initialState;
        }
      },

      prepare(episodeListLength) {
        const nextRandomEpisodeIndex = Math.floor(
          Math.random() * episodeListLength
        );

        return {
          payload: {
            index: nextRandomEpisodeIndex,
          },
        };
      },
    },

    togglePlay: (state: InitialStateData, action: PlayAction) => {
      state.isPlaying = !state.isPlaying;
    },

    toggleLoop: (state: InitialStateData, action: PlayAction) => {
      state.isLooping = !state.isLooping;
    },

    toggleShuffle: (state: InitialStateData, action: PlayAction) => {
      state.isShuffling = !state.isShuffling;
    },

    play: (state: InitialStateData, action: PlayAction) => {
      state.isPlaying = true;
    },

    pause: (state: InitialStateData, action: PlayAction) => {
      state.isPlaying = false;
    },
  },
});

export const playerActions = playerSlice.actions;
export default playerSlice.reducer;
