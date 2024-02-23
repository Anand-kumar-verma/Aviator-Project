import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "aviator",
  initialState: {
    value: 0,
    // by user enabling and dissabling music and sound
    isEnableMusic:false,
    isEnableSound:false,
    // by timing enabling and dissabling music and sound
    byTimeEnablingMusic:false,
    byTimeEnablingSound:false
  },
  reducers: {
    // main music and sound enabling and dessabling
    isEnableMusicFun: (state) => {
      state.isEnableMusic =!state.isEnableMusic;
    },
    isEnableSoundFun: (state) => {
      state.isEnableSound =!state.isEnableSound;
    },
    // by time enabling and dessabling music and sound
    byTimeIsEnableMusic: (state) => {
      state.byTimeEnablingMusic =!state.byTimeEnablingMusic;
    },
    byTimeIsEnableSound: (state) => {
      state.byTimeEnablingSound =!state.byTimeEnablingSound;
    },
  },
});


export const {isEnableMusicFun,isEnableSoundFun,byTimeIsEnableMusic,byTimeIsEnableSound } = slice.actions;

// export const incrementAsync = amount => dispatch => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

export const selectCount = (state) => state.aviator.value;

export default slice.reducer;
