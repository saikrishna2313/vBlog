'use client'

import { useContext,useEffect,useState } from "react"
import { BlogContext } from "../Context/Context"
import Image from 'next/image'
import { useRouter } from "next/navigation"
import noimage from '../assets/noimage.png'

import { collection, doc, getDocs } from "firebase/firestore"
const MyPosts = () => {
    const {currentUser,posts} = useContext(BlogContext)
   
    const router = useRouter()
    const FilteredPosts = posts.filter((post) => (post.userId === currentUser?.uid))
   
  
    return (
        <section className="w-full max-sm:w-[80%]  h-auto">
            {
                FilteredPosts.length === 0 ? <section className="w-full items-center justify-center py-5"><h1 className="text-lg text-center font-semibold uppercase">No Posts Yet</h1></section> : <section>
                    {
                        FilteredPosts.map((post) => {
                            return (
                                <section onClick={() => router.push(`/postDetails/${post.id}`)} className='flex px-5 py-4 w-[100%] shadow-md rounded-sm gap-2 justify-start cursor-pointer items-center'>
                                    {
                                        <Image className='rounded-xl max-sm:w-[60px] max-sm:h-[60px] h-[100px] w-[100px] object-cover' src={post?.postImage ? post.postImage : noimage} width={100} height={100} />
                                    }
                                    <div className='flex flex-col  gap-1'>
                                        <h1 className='text-xl font-semibold '>{post.postTitle}</h1>
                                        <h1 className='text-sm font-medium'>{post.postDesc.slice(0, 50)}....</h1>
                                    </div>
                                </section>
                            )
                        })
                    }
                </section>

            }


        </section>
    )
}
export default MyPosts
