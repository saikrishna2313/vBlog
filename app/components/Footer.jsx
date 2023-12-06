import React from 'react'

const Footer = () => {
    return (
        <div className="text-center h-[5vh] m-3 text-sm mt-4">
            <p>&copy; {new Date().getFullYear()} vBlog. <span className='text-green-300'>All rights reserved.</span></p>
        </div>
    )
}

export default Footer