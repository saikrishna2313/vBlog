import React from 'react'


const About = ({ bio }) => {
    return (
        <section className='w-[80%] flex-col gap-4  flex items-center justify-center h-auto'>

            <div className='flex justify-between gap-10'>
                {
                    bio ? <h1>{bio}</h1> : <h1>No Details yet.</h1>
                }

            </div>

        </section>
    )
}

export default About