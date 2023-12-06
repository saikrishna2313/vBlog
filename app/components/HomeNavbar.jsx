'use client'
import logo from '../assets/logo.png'
import profileLogo from '../assets/profileLogo.png'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import Search from './Search'
import { HiMiniPencilSquare } from "react-icons/hi2";
import { FaAngleDoubleDown } from "react-icons/fa";
import { useContext, useEffect, useState } from 'react'
import { CgProfile } from "react-icons/cg";
import { BlogContext } from '../Context/Context'
import { signOut } from 'firebase/auth'
import { auth } from '../backend/firebase'
import { FaSearchengin } from "react-icons/fa6";
import { useRouter } from 'next/navigation'
import CreatePost from './CreatePost'
import AuthModel from './AuthModel'
const HomeNavbar = () => {
    const { currentUser, pop, users, setPop } = useContext(BlogContext)
    const [postModel, setPostModel] = useState(false)
    const [userModel, setuserModel] = useState(false)
    const [searchModel, setSearchModel] = useState(false)
    const router = useRouter()
    const [user] = users?.filter((user) => user.userId === currentUser?.uid)


    return (
        <nav className='relative flex min-w-full justify-between items-center  h-auto  max-sm:px-3 px-20  py-3 shadow-xl'>

            <div className='py-5'>
                <a href="/"> <Image src={logo} className='w-[150px] h-[150px] max-sm:left-0 top-[50%] translate-y-[-50%] left-4 absolute' /></a>
            </div>
            {
                currentUser?.uid && <div className={`sm:flex  ${searchModel ? 'max-sm:absolute max-sm:z-[1000]]  max-sm:top-16 max-sm:left-0 max-sm:mt-[2px]  max-sm:w-full  max-sm:h-screen inset-0 max-sm:bg-white max-sm:bg-opacity-20  max-sm:backdrop-blur-sm' : 'hidden'} `}>
                    <Search searchModel={searchModel} setSearchModel={setSearchModel} />
                </div>
            }






            {
                <section>

                    {
                        !currentUser?.uid && <div className='flex gap-4 max-sm:gap-2 px-1 items-center justify-end'>




                            <div onClick={() => {
                                currentUser?.uid ? setPostModel(!postModel) :
                                    setPop(!pop)
                            }} className='flex max-sm:hidden cursor-pointer justify-center items-center gap-1'>
                                <HiMiniPencilSquare className='h-8 w-8' />
                                <button className='font-semibold uppercase text-sm' >Share</button>
                            </div>
                            <button onClick={() => {
                                setuserModel(!userModel)
                                router.push('/homeAbout')
                            }} className='px-4 text-sm py-1 max-sm:text-[13px]  bg-slate-900 text-white rounded-full uppercase font-semibold ' >About</button>
                            <button onClick={() => setPop(!pop)} className='px-4 text-sm py-1 max-sm:text-[13px] bg-slate-200 text-black rounded-full  uppercase font-semibold'>Sign In</button>
                            {
                                pop &&
                                <AuthModel pop={pop} setPop={setPop} />
                            }
                        </div>
                    }
                    {

                        currentUser?.uid && <section>

                            <section className='flex items-center justify-center gap-4'>
                                <FaSearchengin onClick={() => setSearchModel(!searchModel)} className='h-6 sm:hidden  cursor-pointer  text-slate-600 w-8' />


                                <div onClick={() => {
                                    currentUser?.uid ? setPostModel(!postModel) :
                                        setPop(!pop)
                                }} className='flex max-sm:hidden cursor-pointer justify-center items-center gap-1'>
                                    <HiMiniPencilSquare className='h-8 w-8' />
                                    <button className='font-semibold uppercase text-sm' >Share</button>
                                </div>
                                {
                                    postModel && <CreatePost setPostModel={setPostModel} />
                                }
                                <div onClick={() => setuserModel(!userModel)}>
                                    <div className='flex cursor-pointer justify-end items-center gap-1'>
                                        <Image alt='djsds' src={user?.userImage ? user.userImage : profileLogo} width={40} height={40} className='h-8 border-2 border-slate-600 w-8 rounded-full' />
                                        <FaAngleDoubleDown className={`h-4  w-4 ${userModel ? "rotate-180" : "rotate-0"}`} />
                                    </div>
                                </div>
                            </section>
                            {
                                userModel && < div className='w-[200px] max-sm:w-[170px] gap-4 z-[1000] flex flex-col justify-center items-center absolute top-16 mt-1 right-5 h-auto px-3 py-5 bg-slate-100 shadow-xl  rounded-md'>

                                    <Link onClick={() => setuserModel(!userModel)} href={`/profile/${currentUser?.uid}`} className='flex gap-2 w-full h-auto px-1 py-2 bg-slate-300 rounded-lg text-sm max-sm:text-sm font-semibold uppercase items-center justify-center flex-row-reverse'>
                                        <h1>Profile</h1>
                                        <CgProfile className='h-6 w-6 max-sm:w-4 max-sm:h-4' />
                                    </Link>
                                    <div onClick={() => {
                                        setuserModel(!userModel)
                                        setPostModel(!postModel)

                                    }} className='flex gap-2 w-full h-auto px-1 sm:hidden py-1 bg-slate-300 rounded-lg  text-sm max-sm:text-sm font-semibold uppercase items-center justify-center flex-row-reverse'>
                                        <HiMiniPencilSquare className='h-8 w-8' />
                                        <button className='font-semibold uppercase text-sm' >Share</button>
                                    </div>

                                    <button onClick={() => {
                                        setuserModel(!userModel)
                                        router.push('/homeAbout')
                                    }} className='flex gap-2 w-full h-auto px-1 py-2 bg-slate-300 rounded-lg  text-sm max-sm:text-sm font-semibold uppercase items-center justify-center flex-row-reverse' >About</button>
                                    <button onClick={() => {
                                        signOut(auth)
                                        router.push('/')
                                        toast.success("Logged Out, See You Again 👋")

                                    }} className='flex gap-2 w-full h-auto px-1 py-2 bg-green-400 rounded-lg  text-sm max-sm:text-sm font-semibold uppercase items-center justify-center flex-row-reverse'>Log Out</button>

                                </div>
                            }
                        </section>
                    }
                </section>

            }


        </nav >
    )
}

export default HomeNavbar