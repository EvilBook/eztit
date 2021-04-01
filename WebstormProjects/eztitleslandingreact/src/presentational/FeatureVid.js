import React from 'react'
import { useSelector } from 'react-redux';
import {
    Subtitling_Assistant,
    Dragon_Interaction,
    Macros,
    File_Comparison,
    Backup_Recovery,
    Commands_Insight

} from '../slice/ezSlice';


export const Feature=(props)=>{

    const pic_placement=props.pic_placement
    const feature=props.feature
    console.log(feature, 'fuck off already')


    return(
        <section className='feature_section'>
        <div className='feature_wrapper'>
            <div className='feature_inner gradient_one' >
                <div className='left_side_feature'>
                    <div className='feature_image_wrapper'>
                        {{/*<img src={feature.feature_image} className='feature_image'></img>*/}}
                        <video loop src={feature.feature_image}></video>

                    </div>
                </div>
                <div className='right_side_feature'>
                    <div className='feature_text_wrapper'>
                        <div className='feature_text_wrapper_inner'>
                            <div className='feature_title'><h2>{feature.title}</h2></div>
                            <div className='feature_description'><p>{feature.description}</p></div>
                            <div className='feature_description'><p>{feature.description1}</p></div>
                            <div className='feature_description'><p>{feature.description2}</p></div>
                            <div className='feature_description'><p>{feature.description3}</p></div>
                            <div className='feature_feature_link'>{feature.link}</div>
                        </div>

                    </div>

                </div>
            </div>

        </div>
        </section>


    )
}
