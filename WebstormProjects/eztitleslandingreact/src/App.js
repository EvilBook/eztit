import React from 'react'
import logo from './logo.svg';
import './styles.css';
import {HeaderContainer} from "./container/HeaderContainer";
import {BodyContainer} from "./container/BodyContainer";
import {loadFeaturesAsync} from "./slice/ezSlice";
import { useDispatch } from 'react-redux';

function App() {
  const dispatch=useDispatch()
  dispatch(loadFeaturesAsync())
  return (
    <BodyContainer/>
  );
}

export default App;
