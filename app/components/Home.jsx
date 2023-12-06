'use client'
import HomeNavbar from './HomeNavbar'
import Posts from './Posts'
import Loader from './Loader'
import HomeSlider1 from '../assets/HomeSlider1.jpg'
import HomeSlider2 from '../assets/HomeSlider2.jpg'
import HomeSlider3 from '../assets/HomeSlider3.jpg'
import HomeSlider4 from '../assets/HomeSlider4.jpg'
import logo from '../assets/logo.png'
import Slider from './Slider'
import { useContext, useEffect, useState } from 'react'
import { BlogContext } from '../Context/Context'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../backend/firebase'
import Image from 'next/image'
import Faq from './Faq'
import { useRouter } from 'next/navigation'

const Home = () => {
    console.log(process.env.API_KEY)

    const router = useRouter()
    const Slides = [HomeSlider1, HomeSlider2, HomeSlider3, HomeSlider4]
    const { posts } = useContext(BlogContext)
    const [currentUser, setCurrentUser] = useState([])
    const [loading, setLoading] = useState(true)
    const [tagFilter, setTagFilter] = useState('')
    useEffect(() => {

        onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)

        }


        )

        setLoading(false)
    }, [currentUser])

    const faqData = [

        {
            question: 'What is vBlog?',
            answer: 'vBlog is a knowledge-sharing platform where users can read, write, and share informative content across various topics.'
        },
        {
            question: 'How can I contribute to vBlog?',
            answer: 'You can contribute by signing up as a user and submitting your articles or engaging in discussions in the comments section.'
        },
        {
            question: 'Is vBlog free to use?',
            answer: 'Yes, vBlog is completely free for readers and contributors. We believe in free access to information.'
        },

        {
            question: 'How does vBlog handle user privacy?',
            answer: 'We take user privacy seriously. Your personal information is kept confidential and is not shared without your consent.'
        },
        {
            question: 'Are there any guidelines for writing articles on vBlog?',
            answer: 'Yes, we have a set of guidelines to ensure high-quality content. Articles should be informative, well-researched, and respectful of our community standards.'
        }
    ];
    return (
        <section className='overflow-x-hidden '>
            <div>
                <Slider Slides={Slides} />

            </div>
            <div className='w-full mb-5 max-sm:px-2 flex items-center justify-center px-4 py-4  bg-gradient-to-r from-gray-100 to-gray-300 shadow-xl h-auto'>
                <section className='h-full text-center max-sm:px-2 px-20 py-5 bg-white bg-opacity-20 backdrop-blur-lg w-full'>
                    <h1 className='text-4xl max-sm:text-xl font-semibold text-slate-900'>Welcome to vBlog</h1>
                    <p className='text-sm m-3 text-slate-800 max-sm:hidden'>Welcome to vBlog, your premier knowledge-sharing platform where curiosity meets insight. Our mission is to foster a community where passionate individuals can come together to share and gain knowledge on a wide array of topics. Whether you’re looking to dive deep into the latest tech trends, explore the mysteries of the cosmos, or uncover the secrets of history, vBlog is your gateway to understanding the world around us.</p>
                    <p className='text-sm m-3 text-slate-800'>Join us at vBlog, where every article is a journey, every discussion is an adventure, and every user is a valuable member of our knowledge-sharing oasis. Start exploring today and become part of a community that values wisdom, curiosity, and the power of shared learning. 🌐📚✨</p>
                    <p ><span className='text-xl font-semibold max-sm:text-sm'>Discover. Share. Grow.</span></p>
                    <p className='text-sm font-semibold text-red-400'>Please Visit <button onClick={() => router.push('/homeAbout')} className="px-3 text-sm mx-1 py-[1.5px] bg-green-400 text-white rounded-xl font-semibold">About</button></p>
                </section>


            </div>

            {
                loading ? <Loader /> : <Posts tagFilter={tagFilter} loading={loading} />
            }

            <section className='w-full  px-20 max-sm:px-3 h-auto'>
                <h1 className='text-2xl max-sm:text-xl font-semibold py-3 px-5 text-center uppercase'>FAQ</h1>
                {
                    faqData.map((q) => {
                        return (
                            <Faq q={q} />
                        )
                    })
                }

            </section>

        </section >

    )
}

export default Home
