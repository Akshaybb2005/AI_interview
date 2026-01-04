import {configureStore} from '@reduxjs/toolkit';
import userReducer from './Slice';
import marksReducer from './markSlics';
const store=configureStore({
    reducer:{
        user:userReducer,
        marks:marksReducer,
    },
})
export default store;