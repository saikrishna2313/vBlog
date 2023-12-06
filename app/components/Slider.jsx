'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react';
import { IoChevronForwardSharp } from "react-icons/io5";

const Slider = ({ Slides }) => {


    const [index, setIndex] = useState(0)
    const forward = () => {
        if (index === Slides.length - 1) {
            setIndex(0)
        } else {
            setIndex(prev => prev + 1)
        }
    }
    const backward = () => {
        if (index === 0) {
            setIndex(Slides.length - 1)
        } else {
            setIndex(prev => prev - 1)

        }

    }

    return (
        <section className='overflow-hidden  relative'>

            <section style={{ translate: `${-100 * index}%` }} className={`sm:w-full flex  sm:h-[500px] w-[full] h-[250px]  duration-500 transition-all `}>
                {
                    Slides.map((image) => {
                        return (
                            <div key={Math.random() * 5} className='h-full flex-grow-0 flex-shrink-0 w-full'><Image src={image} className=' object-cover w-full h-full' /></div>
                        )
                    })
                }


            </section>

            <div onClick={() => forward()} className=' cursor-pointer group hover:bg-white hover:bg-opacity-20 hover:backdrop-blur-sm h-full w-[10%] sm:w-[5%] absolute top-0 right-0 flex items-center justify-center'>
                <button><IoChevronForwardSharp className='h-10 hidden w-10 group-hover:flex  text-slate-300 ' /></button>
            </div>
            <div onClick={() => backward()} className=' cursor-pointer h-full group hover:bg-white hover:bg-opacity-20 hover:backdrop-blur-sm w-[10%] sm:w-[5%] absolute top-0 left-0 flex items-center justify-center'>
                <button><IoChevronForwardSharp className='h-10 hidden w-10 rotate-180 text-slate-300 group-hover:flex' /></button>
            </div>
            <div className='flex items-center justify-center left-[50%] translate-x-[-50%] absolute bottom-2 gap-3'>
                <button onClick={() => setIndex(0)} className='w-4 h-4 rounded-full hover:scale-[120%] bg-white bg-opacity-30 backdrop-blur-sm border-2 border-white'>

                    <div className={`h-[100%] rounded-full w-[100%] ${index === 0 && 'bg-black flex items-center justify-center bg-opacity-80'}`}>
                    </div>
                </button>

                <button onClick={() => setIndex(1)} className='w-4 h-4 rounded-full flex items-center justify-center bg-white bg-opacity-30 backdrop-blur-sm border-2 border-white'>
                    <div className={`h-[100%] rounded-full w-[100%] ${index === 1 && 'bg-black bg-opacity-80'}`}></div>
                </button>
                <button onClick={() => setIndex(2)} className='w-4 h-4 rounded-full flex items-center justify-center bg-white bg-opacity-30 backdrop-blur-sm border-2 border-white'>
                    <div className={`h-[100%] rounded-full w-[100%] ${index === 2 && 'bg-black bg-opacity-80'}`}></div></button>

                <button onClick={() => setIndex(3)} className='w-4 h-4 flex items-center justify-center rounded-full bg-white bg-opacity-30 backdrop-blur-sm border-2 border-white'>
                    <div className={`h-[100%] w-[100%] rounded-full ${index === 3 && 'bg-black bg-opacity-80'}`}></div></button>
            </div>
        </section>
    )
}

export default Slider