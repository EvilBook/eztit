import React from 'react'


export const Footer=()=>{
   return(
       <div className="width-reducer clearfix">
        <div className="block clearfix">
            <div className="footer-menu double">
                <a href="index.php.html"><img src="application/i/parrot.png" border="0"/></a><br />
                <a href="index.php-page=home.html">Home</a><br /><a href="index.php-page=products.html">Products</a><br /><a
                href="index.php-page=terms-and-conditions.html">Terms & Conditions</a><br /><a
                href="index.php-page=privacy-policy.html">Privacy Policy (15.07.2020)</a><br /><a
                href="index.php-page=sitemap.html">Sitemap</a>
            </div>
            <div className="footer-menu single">
                <h3>Products</h3>

                <a href="index.php-page=eztitles.html"><img src="appdata/pics/p_i/64-EZT.png" border="0" width="32"
                                                            height="32"/><b style={{"color": "#2d77bd"}}>EZTitles</b></a><br />
                <a href="index.php-page=ezconvert.html"><img src="appdata/pics/p_i/64-EZC.png" border="0" width="32"
                                                             height="32"/><b style={{"color": "#b31f24"}}>EZConvert</b></a><br />
                <a href="index.php-page=3dtitles.html"><img src="appdata/pics/p_i/64-3D.png" border="0" width="32"
                                                            height="32"/><b style={{"color": "#62863c"}}>3DTitles</b></a><br />
                <a href="index.php-page=eztitles-plug-ins.html"><img src="appdata/pics/p_i/64-Plug-ins.png" border="0"
                                                                     width="32" height="32"/><b style={{"color": "#2d77bd"}}>EZTitles
                    Plug-ins</b></a><br />

            </div>
            <div className="footer-menu single">
                <h3>Downloads</h3>
                <a href="index.php-page=download-demos.html">Demos</a><br />
                <a href="index.php-page=download-free-trials.html">Free Trials</a><br />
                <a href="index.php-page=download-user-guides.html">User Guides</a><br />
            </div>
            <div className="footer-menu single">
                <h3>Sales</h3>
                <a href="index.php-page=purchase-online.html">Buy Online</a><br />
                <a href="index.php-page=installment-plans.html">Installment Plans</a><br />
                <a href="index.php-page=rent.html">Rent Options</a><br />
                <a href="index.php-page=contact-us.html">Contact Us</a><br />
                <a href="index.php-page=license-agreement.html">License Agreement (28.08.2020)</a><br />
            </div>
            <div className="footer-menu single">
                <h3>Support</h3>
                <a href="index.php-page=support-request.html">Support Request</a><br />
                <a href="index.php-page=faq.html">FAQ</a><br />
                <a href="index.php-page=services-portal.html">Services Portal</a><br />
                <a href="index.php-page=support-agreement.html">Support Agreement (13.12.2019)</a><br />
            </div>
        </div>

        <div className="footer-social">
            <a href="https://www.facebook.com/pages/EZTitles-Development-Studio/213557865368609" target="_blank"
               onFocus="blur()" title="Facebook"><i className="fa fa-facebook fa-2x"></i></a><a
            href="https://www.twitter.com/EZTitles" target="_blank" onFocus="blur()" title="Twitter"><i
            className="fa fa-twitter fa-2x"></i></a><a href="https://www.youtube.com/channel/UC4tApQNydy-9XaCbZy_9Www"
                                                       target="_blank" onFocus="blur()" title="YouTube"><i
            className="fa fa-youtube fa-2x"></i></a>
        </div>

        <div className="footer-credits">
            &copy; 2002-2021<br />
            EZTitles Development Studio<br />
            Designed by <b><a href="http://www.hihype.com" target="_blank"
                              style={{"color": "#CCCCCC !important"}}>HYPE</a></b><br />
        </div>

    </div>
)
}
