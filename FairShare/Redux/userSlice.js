import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userData: null,
    isAuthenticated: true,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Sets the entire user object upon login/initialization
        setUser: (state, action) => {
            state.userData = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        // Updates specific fields in the user object
        updateUser: (state, action) => {
            if (state.userData) {
                state.userData = { ...state.userData, ...action.payload };
            }
        },
        // Clears the user object upon logout
        clearUser: (state) => {
            state.userData = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
