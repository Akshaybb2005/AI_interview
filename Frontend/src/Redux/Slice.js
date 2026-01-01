import { createSlice } from "@reduxjs/toolkit"; 
const userSlice=createSlice({
    name:'user',
    initialState:{
        username:null,
        email:null,
        isAuthenticated:false,
    },
    reducers:{
        setUser:(state,action)=>{
            state.username=action.payload.username;
            state.email=action.payload.email;
            state.isAuthenticated=true;
        },
        clearUser:(state)=>{
            state.username=null;
            state.email=null;
            state.isAuthenticated=false;
        }
    }
})
export const {setUser,clearUser}=userSlice.actions;
export default userSlice.reducer;