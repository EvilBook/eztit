import { createSlice } from '@reduxjs/toolkit';



export const ezSlice = createSlice({
    name: 'ezApp',
    initialState: {
        features:{
            ezTitles:[{}]
            //other services features
        }

    },
    reducers: {
        setFeatures: (state, action) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.features.ezTitles=action.payload.features.ezTitles
        }
    },
});



export const {setFeatures } = ezSlice.actions;


export const loadFeaturesAsync = params => dispatch => {
    console.log(params)


    fetch('http://localhost:3000/application/db/features.json')
        .then(res => res.json())
        .then((result) => {
            console.log(result, 'da fuck')
            dispatch(setFeatures(result))
            console.log(result, 'move it bitch')


        }, (error) => {
            console.log('error fetching items',error)
        })

};





export const features_export = state => state.ezApp.features.ezTitles



export default ezSlice.reducer;
