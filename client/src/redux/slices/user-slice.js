import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const userLoginThunk=createAsyncThunk('userSave',async(userCred,thunkApi)=>{
    let res;
    res=await axios.post('http://localhost:4000/user-api/user',userCred);
    if(res.data.message=='User created'){
        return res.data;
    }else{
        return thunkApi.rejectWithValue(res.data.message)
    }
})

export const userSlice=createSlice({
    name:'user-slice',
    initialState:{isPending:false,currentUser:{},errStatus:false,errMessage:'',loginStatus:false}, //is pending property can help us to put a loading icon whenever there is a pending state
    reducers:{
        resetState:(state,payload)=>{
            state.isPending=false;
            state.currentUser={};
            state.errStatus=false;
            state.errMessage="";
            state.loginStatus=false;
        }
    },
    extraReducers:builder=>builder //EXTRA REDUCERS WILL DEAL WITH CHANGES OF EXTERNAL CHANGES LIKE STATE IS BEING CHANGED BASED ON EXTERNAL API WHICH IS NOT A PART OF REACT APPLICATION
    .addCase(userLoginThunk.pending,(state,action)=>{
        state.isPending=true;
    })
    .addCase(userLoginThunk.fulfilled,(state,action)=>{
        state.isPending=false;
        state.currentUser=action.payload.user; //we can understand the destructuring of the payload using the redux dev tools 
        state.errStatus=false;
        state.errMessage="";
        state.loginStatus=true;
    })
    .addCase(userLoginThunk.rejected,(state,action)=>{
        state.isPending=false;
        state.currentUser={};
        state.errStatus=true;
        state.errMessage=action.payload;
        state.loginStatus=false;
    })
})

//export root reducer 
export default userLoginSlice.reducer;
//export action creater functions
export const {resetState}=userLoginSlice.actions;