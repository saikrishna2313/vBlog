'use client'
import React, { useContext, useEffect, useState } from 'react'
import { BlogContext } from '../Context/Context'
import Post from './Post'
import Loader from './Loader'
import { CiFilter } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
const Posts = ({ loading, tagFilter }) => {
    const { posts, users, currentUser, } = useContext(BlogContext)

    const [pop, setPop] = useState(false)
    const [filter, setFilter] = useState('all')
    const [all, setAll] = useState(true)
    const tags = []
    const tagsd = posts.map((post) => post.tags).map((tag) => (tag[0]?.tagName))
    const [load, setLoad] = useState(5)
    tagsd.map((tag) => {
        if (tag) {
            tags.push(tag)
        }
    })
    const check = posts.map((post) => post.tags).map((tag) => tag).map((item) => item).map(((item) => item[1]?.tagName))
    check.map((tag) => {
        if (tag) {
            tags.push(tag)
        }
    })

    const finalTags = tags.filter((value, index, self) => {
        return self.indexOf(value) === index;
    })

useEffect(()=>{
  
},[])
    return (
        <section className='relative w-full'>
            <div onClick={() => setPop(!pop)} className='w-full mt-5 flex items-center gap-2 px-3 py-1 text-white bg-black h-auto sm:hidden justify-center m-1'><button className='uppercase text-sm'>Availble Tags</button><CiFilter className='h-6 w-6' /></div>
            <section className={`flex justify-center max-sm:shadow-2xl h-auto max-sm:h-auto max-sm:flex-col   max-sm:justify-start  max-sm:bg-white  px-10 max-sm:w-[200px] max-sm:left-0 max-sm:absolute  max-sm:top-2   transition-all duration-500  ${pop ? 'max-sm:translate-x-0' : 'max-sm:translate-x-[-400px]'}   items-center py-4 gap-4 flex-wrap `}>
                <div className='w-full justify-end sm:hidden flex items-center mb-3'> <MdCancel onClick={() => setPop(!pop)} className='h-6 w-6 ' /></div>
                <button onClick={() => {
                    setAll(true)
                    setFilter('all')
                    setPop(!pop)
                }} className={`text-sm m-1 font-semibold  ${filter === 'all' ? 'bg-black text-white' : 'bg-white text-black border-black border-2 '}  px-3 py-1 rounded-xl`}>All</button>
                {
                    finalTags.map((tag) => {
                        return (
                            <button onClick={() => {
                                setFilter(tag)
                                setAll(false)
                                setPop(!pop)
                            }} className={`text-sm m-1 font-semibold  ${filter === tag ? 'bg-black text-white' : 'bg-white text-black border-black border-2 '}  px-3 py-1 rounded-xl`}>{tag}</button>
                        )
                    })
                }
            </section>
            {
                loading ? <div>Welcome to Vblog</div> : <div className='flex gap-2 w-full flex-wrap items-center justify-center max-sm:px-3 max-sm:py-4 py-10 px-10 h-auto'>
                    {
                        loading ? <Loader /> : <section>
                            {
                                !all ? <section className='flex gap-2 w-full flex-wrap items-center justify-center max-sm:px-3 max-sm:py-4 py-10 px-10 h-auto'>
                                    {
                                        posts.filter((post) => (post.tags[0]?.tagName === filter || post.tags[1]?.tagName === filter || post.tags[2]?.tagName === filter)).map((post) => {
                                            return (

                                                <Post post={post} />

                                            )
                                        })
                                    }

                                </section> :
                                    <section className='flex gap-2 w-full flex-wrap items-center justify-center max-sm:px-3 max-sm:py-4 py-10 px-10 h-auto'>
                                        {
                                            posts.slice(0, load).map((post) => {
                                                return (

                                                    <Post post={post} />

                                                )
                                            })
                                        }

                                    </section>
                            }
                            <div className='flex items-center ml-2 justify-between px-2 gap-2 text-sm font-semibold'>
                                {
                                    posts.length > load && <button onClick={() => setLoad(load + 5)} className='px-3 py-1 bg-green-400 rounded-full text-white uppercase'>More</button>
                                }
                                {
                                    load > 5 && <button onClick={() => {
                                        if (load == 5) {
                                            setLoad(5)
                                        }
                                        else {
                                            setLoad(load - 5)
                                        }

                                    }} className='px-3 py-1 bg-black rounded-full text-white uppercase'>Less</button>
                                }
                            </div>
                        </section>

                    }
                </div>
            }
        </section>



    )
}

export default Posts
