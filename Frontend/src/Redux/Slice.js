import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: 'user',
    initialState: {
        name: null,
        email: null,
        isAuthenticated: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.isAuthenticated = true;
        },
        clearUser: (state) => {
            state.name = null;
            state.email = null;
            state.isAuthenticated = false;
        }
    }
})
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;