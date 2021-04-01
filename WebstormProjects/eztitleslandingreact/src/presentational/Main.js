import React from 'react'
import {Feature} from "./Feature";
import {FeatureHalf} from "./FeatureHalf";
import {FeatureContainer} from "../container/FeatureContainer";
import {FeatureContainerHalf} from "../container/FeatureContainerHalf";
import {Button
} from '@material-ui/core'
import {
    features_export

} from '../slice/ezSlice';
import {useSelector} from "react-redux";
import ReactPlayer from 'react-player'
import Fade from 'react-reveal/Fade';



export const Main=()=> {
    const shit = useSelector(features_export)

    console.log(shit, 'first shit')

        return (
            <div className='main_wrapper'>
                <div className='main_inner'>
                    <div className='banner'>
                        <div className='banner_inner'>
                            <div className='banner_text'>
                                <h1>Take a look at the newest features in EZTitles</h1>

                            </div>
                            <div className='banner_image'>
                                <img className='birb' src='http://localhost:3000/application/svg/logo.svg'/>

                            </div>
                        </div>
                    </div>
                    {/*feature one hard code*/}
                    <Fade bottom>
                    <section className='feature_section'>
                        <div className='feature_wrapper'>
                            <div className='feature_inner gradient_one' >
                                <div className='left_side_feature'>
                                    <div className='feature_video_wrapper'>
                                        <ReactPlayer
                                            className='react-player'
                                            url='http://localhost:3000/vids/cmdins.mp4'
                                            width='100%'
                                            height='100%'
                                            loop={true}
                                            playing={true}
                                            playbackRate='0.9'
                                            controls={false}
                                        />
                                    </div>
                                </div>
                                <div className='right_side_feature'>
                                    <div className='feature_text_wrapper'>
                                        <div className='feature_text_wrapper_inner'>
                                            <div className='feature_title'><h2>Subtitling Assistant</h2></div>
                                            <div className='feature_description'><div className='align'><p>EZTitles uses the power of AI.
                                                Creating subtitles automatically.</p>
                                                <p>The Assistant recognizes speech and generates captions according to
                                                    your criteria.</p></div>
                                                <ul className='attributes'><li>Accurate</li><li>Secure</li><li>Effective</li></ul>
                                                <Button style={{'margin-top':'28px'}} v v variant="contained" color="primary" href="https://www.eztitles.com/index.php?page=subtitling-assistant#product-header-caption">
                                                    Learn More
                                                </Button></div>

                                        </div>

                                    </div>
                                    <img src='http://localhost:3000/application/i/superAI.png' className='feature_image_background'></img>


                                </div>
                            </div>

                        </div>
                    </section>
                    </Fade>
                    {/*feature one hard code v2*/}

                    {/*feature two hard code*/}
                    <section className='feature_section'>
                        <div className='feature_wrapper'>
                            <div className='feature_inner gradient_three' >
                                <div className='left_side_feature'>
                                    <div className='feature_image_wrapper'>
                                        <img src='http://localhost:3000/application/i/dragon.png' className='feature_image'></img>

                                    </div>
                                </div>
                                <div className='right_side_feature'>
                                    <div className='feature_text_wrapper'>
                                        <div className='feature_text_wrapper_inner'>
                                            <div className='feature_title'><h2>Dragon Integration</h2></div>
                                            <div className='feature_description'><div className='align'><p>Dragon Speech Recognition is now integrated with EZTitles.</p>
                                                <p>Rest your wrists and type captions with your voice.Fix mistakes and execute commands hands-free.</p></div>
                                                <Button style={{'margin-top':'28px'}} v v variant="contained" color="primary" href="https://www.eztitles.com/index.php?page=subtitling-assistant#product-header-caption">
                                                    Learn More
                                                </Button>
                                            </div>


                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>
                    </section>

                    {/*feature three and four hard code*/}
                    <section className='feature_section'>
                        <div className='feature_wrapper'>
                            <div className='feature_inner gradient_four' >
                                <div className='left_side_feature space_left gradient_four_left'>
                                    <div className='feature_text_wrapper'>
                                        <div className='feature_text_wrapper_inner'>
                                            <div className='feature_title'><h2>Macros</h2></div>
                                            <div className='feature_description'><div className='align'><p>Record frequently repeated operation or code-in little programs which will save you tons of time.</p><p>Execute them anytime with a quick shortcut.</p></div>
                                                <Button style={{'margin-top':'28px'}} v v variant="contained" color="primary" href="https://www.eztitles.com/index.php?page=subtitling-assistant#product-header-caption">
                                                    Learn More
                                                </Button>
                                            </div>

                                        </div>

                                    </div>
                                    <div className='feature_image_wrapper' style={{'overflow':'none'}}>
                                        <img src='http://localhost:3000/application/i/aicropped1.png' className='feature_image'></img>

                                    </div>
                                </div>
                                <div className='right_side_feature space_right gradient_four_right'>
                                    <div className='feature_text_wrapper'>
                                        <div className='feature_text_wrapper_inner'>
                                            <div className='feature_title'><h2>File Comparison</h2></div>
                                            <div className='feature_description'><div className='align'><p>Find differences between subtitles’ text, positioning, format and timing.</p><p>Compare projects easily.</p><p>Export differences fast.</p></div>
                                                <Button style={{'margin-top':'28px'}} v v variant="contained" color="primary" href="https://www.eztitles.com/index.php?page=subtitling-assistant#product-header-caption">
                                                    Learn More
                                                </Button>
                                            </div>

                                        </div>

                                    </div>
                                    <div className='feature_image_wrapper' style={{'overflow':'none'}}>
                                        <img src='http://localhost:3000/application/i/compare.png' className='feature_image'></img>

                                    </div>

                                </div>
                            </div>

                        </div>
                    </section>
                    {/*feature five hard code*/}
                    <section className='feature_section'>
                        <div className='feature_wrapper'>
                            <div className='feature_inner gradient_five' >
                                <div className='left_side_feature'>
                                    <div className='feature_image_wrapper'>
                                        <img src='http://localhost:3000/application/i/Lock.png' className='feature_image lock'></img>

                                    </div>
                                </div>
                                <div className='right_side_feature'>
                                    <div className='feature_text_wrapper'>
                                        <div className='feature_text_wrapper_inner'>
                                            <div className='feature_title'><h2>Backup & Recovery</h2></div>
                                            <div className='feature_description'><div className='align'><p>Never lose the work you’ve put into your project</p><p>No matter
                                                the circumstances.</p></div>
                                                <Button style={{'margin-top':'28px'}} v v variant="contained" color="primary" href="https://www.eztitles.com/index.php?page=subtitling-assistant#product-header-caption">
                                                    Learn More
                                                </Button>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>
                    </section>
                    {/*feature six hard code*/}
                    <section className='feature_section'>
                        <div className='feature_wrapper'>
                            <div className='feature_inner gradient_six' >
                                <div className='left_side_feature'>
                                    <div className='feature_image_wrapper'>
                                        <img src='http://localhost:3000/application/i/search.png' className='feature_image'></img>

                                    </div>
                                </div>
                                <div className='right_side_feature'>
                                    <div className='feature_text_wrapper'>
                                        <div className='feature_text_wrapper_inner'>
                                            <div className='feature_title'><h2>Commands Insight</h2></div>
                                            <div className='feature_description'><div className='align'><p>Fast access to all commands in EZTitles.</p><p>Search in names and descriptions, check shortcuts and execute
                                                with a single click.</p></div>
                                                <Button style={{'margin-top':'28px'}} v v variant="contained" color="primary" href="https://www.eztitles.com/index.php?page=subtitling-assistant#product-header-caption">
                                                    Learn More
                                                </Button>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>
                    </section>

                </div>
            </div>
        )

}
