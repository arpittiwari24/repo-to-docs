'use client'

import React from 'react'
import { LinkedInEmbed, XEmbed, YouTubeEmbed } from 'react-social-media-embed'
import { Tweet } from 'react-tweet'

function Testimonials() {
    return (
        <div className='max-sm:px-2'>
            <h2 className='text-3xl font-bold text-white text-center max-sm:pt-10 '>Some Comments</h2>
            <div className='flex flex-row max-sm:flex-col items-center justify-center gap-2'>
                <div data-theme="dark">
                    <Tweet id="1855841219751874755" />
                </div>
                <div data-theme="dark">
                    <Tweet id="1855682039057699235" />
                </div>
                <div data-theme="dark">
                    <Tweet id="1855699123904684039" />
                </div>
                <div data-theme="dark">
                    <Tweet id="1855650990491590678" />
                </div>
                {/* <div data-theme="dark">
                <Tweet id="1856002811609362634" />
            </div> */}
            </div>
            {/* <YouTubeEmbed url='https://www.youtube.com/watch?v=xYlD4HEFW_c' /> */}
        </div>
    )
}

export default Testimonials