'use client'

import React from 'react'
import { XEmbed, YouTubeEmbed } from 'react-social-media-embed'

function Testimonials() {
    return (
        <div className='flex flex-col items-center'>
            <h2>Demo</h2>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }} className='w-full rounded-md'>
                <YouTubeEmbed url="https://youtu.be/xYlD4HEFW_c" width={1000} height={500} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <XEmbed url="https://x.com/AdarshNJena/status/1855841219751874755" width={325} height={1000} />
            </div>
        </div>
    )
}

export default Testimonials