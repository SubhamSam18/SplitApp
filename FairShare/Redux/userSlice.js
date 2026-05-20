import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userData: null,
    isAuthenticated: true,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userData = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        updateUser: (state, action) => {
            if (state.userData) {
                state.userData = { ...state.userData, ...action.payload };
            }
        },
        clearUser: (state) => {
            state.userData = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
