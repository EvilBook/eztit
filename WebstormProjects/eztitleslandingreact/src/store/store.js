import { configureStore } from '@reduxjs/toolkit';
import ezReducer from '../slice/ezSlice';

export default configureStore({
    reducer: {
        ezApp: ezReducer,
    },
});