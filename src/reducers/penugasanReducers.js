import { createSlice } from "@reduxjs/toolkit";

export const penugasanReducers = createSlice({
	name: "tugas",
	initialState: {
		getTugasResult: false,
		getTugasLoading: false,
		getTugasError: false,
		addTugasResult: false,
		addTugasLoading: false,
		deleteTugasResult: false,
	},
	reducers: {
		penugasanReducer: (state, action) => {
			const { type, payload } = action.payload;
			switch (type) {
				case "GET_TUGAS":
					return {
						...state,
						getTugasResult: payload.data,
						getTugasLoading: payload.loading,
						getTugasError: payload.errorMessage,
					};
				case "ADD_TUGAS":
					return {
						...state,
						addTugasResult: payload.data,
						addTugasLoading: payload.loading,
					};
				case "DELETE_TUGAS":
					return {
						...state,
						deleteTugasResult: payload.data,
					};
				default:
					return state;
			}
		},
	},
});

export const { penugasanReducer } = penugasanReducers.actions;

export default penugasanReducers.reducer;
