import React from 'react'

const Loader = () => {
    return (
        <section className='h-[100%] w-full flex items-center justify-center'>
            <div className='w-[100px] animate-spin h-[100px] rounded-full border-r-4 border-green-400'></div>

        </section>
    )
}

export default Loader