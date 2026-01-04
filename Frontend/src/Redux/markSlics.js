import { createSlice } from "@reduxjs/toolkit";

const marksSlice = createSlice({
  name: "marks",
  initialState: {
    strengths: [],
    weaknesses: [],
    score: 0,
  },
  reducers: {
    setResults: (state, action) => {
      state.score = action.payload.score;
      state.strengths = action.payload.strengths;
      state.weaknesses = action.payload.weaknesses;
    },
    resetResults: (state) => {
      state.score = 0;
      state.strengths = [];
      state.weaknesses = [];
    }
  }
});

export const { setResults, resetResults } = marksSlice.actions;
export default marksSlice.reducer;
