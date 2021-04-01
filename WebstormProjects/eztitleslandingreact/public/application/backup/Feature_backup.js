import React from 'react'
import { useSelector } from 'react-redux';
import {
    Subtitling_Assistant

} from '../slice/ezSlice';


export const Feature=(props)=>{
    const selector=useSelector(Subtitling_Assistant);

    const pic_placement=props.pic_placement
    const feature = props.features


    return(
        <section className='feature_section'>
        <div className='feature_wrapper'>
            <div className='feature_inner'>
                <div className='left_side_feature'>
                    <div className='feature_image_wrapper'>
                    <img src="http://localhost:3000/application/i/ui2.png" className='feature_image'></img>

                    </div>
                </div>
                <div className='right_side_feature'>
                    <div className='feature_text_wrapper'>
                    <div className='feature_text'>
                            <h2 className="typography-headline tile-headline">Subtitling Assistant
                                <br className="medium-hide"/></h2>
                            <p> Subtitles automatically.\nThe Assistant recognizes speech and generates captions.\nAccurate.\nSecure.\nEffective.<span
                                className="footnote footnote-supglyph"><a href="#footnote-1"
                                                                          aria-label="Footnote * symbol">*</a></span></p>
                            <div className="cta-container">
                                <a href="https://wallet.apple.com/apple-card/setup/feature/ccs?referrer=cid%3Dapy-200-100014"
                                   data-analytics-title="apply now for apple card" aria-label="apply now for apple card"
                                   data-rid-relay="{&quot;287&quot;: &quot;referrer&quot;}" data-analytics-exit-link=""
                                   className="typography-tile-copy tile-cta icon-wrapper"><span className="icon-copy">Apply now</span><span
                                    className="icon icon-after more"></span></a>
                                <a href="/apple-card/#march-promo"
                                   data-analytics-title="learn more about saving with a new apple card"
                                   aria-label="learn more about saving with a new apple card"
                                   className="typography-tile-copy tile-cta icon-wrapper"><span className="icon-copy">Learn more</span><span
                                    className="icon icon-after more"></span></a>
                        </div>
                    </div>

                    </div>
                </div>
            </div>

        </div>
        </section>
    )
}
