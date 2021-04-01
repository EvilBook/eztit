import React from 'react'


export const Header=()=>{
    return(
        <div id="header">
            <div id="header-top">
                <div className="width-reducer clearfix" unselectable="on" style={{"user-select": "none"}}>
                    <a href="index.php" unselectable="on" style={{"user-select": "none"}}><img
                        src="http://localhost:3000/application/i/eztitles.png" unselectable="on" style={{"user-select": "none"}} border="0"/></a>
                    <div className="top-menu" unselectable="on" style={{"user-select": "none"}}>
                        <a href="index.php?page=products" unselectable="on" style={{"user-select": "none"}}>Products</a>
                        <a href="index.php?page=downloads" unselectable="on" style={{"user-select": "none"}}>Downloads</a>
                        <a href="index.php?page=purchase" unselectable="on" style={{"user-select": "none"}}>Purchase</a>
                        <a href="index.php?page=rent" unselectable="on" style={{"user-select": "none"}}>Rent</a>
                        <a href="index.php?page=installment-plans" unselectable="on"
                           style={{"user-select": "none"}}>Installments</a>
                        <a href="index.php?page=support" unselectable="on" style={{"user-select": "none"}}>Support</a>
                    </div>

                    <div className="menu-300" unselectable="on" style={{"user-select": "none"}}></div>
                </div>
            </div>
            <div id="header-bottom">
                <div className="width-reducer clearfix" unselectable="on" style={{"user-select": "none"}}>
                    <div className="bottom-menu" unselectable="on" style={{"user-select": "none"}}>
                        <a href="index.php?page=home" unselectable="on" style={{"user-select": "none"}}>Home</a>
                        <a href="index.php?page=clients" unselectable="on" style={{"user-select": "none"}}>Our Clients</a>
                        <a href="index.php?page=services-portal" unselectable="on" style={{"user-select": "none"}}>Services
                            Portal</a>
                        <a href="index.php?page=contact-us" unselectable="on" style={{"user-select": "none"}}>Contact Us</a>
                        <a href="index.php?page=search" unselectable="on" style={{"user-select": "none"}}><i
                            className="fa fa-search" unselectable="on" style={{"user-select": "none"}}></i> Search</a>
                    </div>

                </div>
            </div>
        </div>
    )
}
