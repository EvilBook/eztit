import React from 'react'
import {HeaderContainer} from "../container/HeaderContainer";
import {MainContainer} from "../container/MainContainer";
import {Footer} from "./Footer";

export const Body=()=>{
    return(
        <div id='bdy'>
            <div id='wrapper'>
                <div id='wrapper-body'>
                    <HeaderContainer/>
                    <MainContainer/>
                    <Footer/>

                </div>
            </div>
        </div>
    )
}

