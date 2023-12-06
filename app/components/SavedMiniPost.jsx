'use client'
import React, { useContext } from 'react'
import { BlogContext } from '../Context/Context'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import noimage from '../assets/noimage.png'
const SavedMiniPost = ({ post }) => {
    const router = useRouter()
    const { posts ,getAllPosts} = useContext(BlogContext)
    const [SavedPost] = posts.filter((p) => (p.id === post?.userId))
  useEffect(()=>{
        getAllPosts()
    },[])
    return (
        <section onClick={() => router.push(`/postDetails/${SavedPost?.id}`)} className='flex px-5 py-4 w-full shadow-md rounded-sm gap-3 justify-start  cursor-pointer items-center'>
            {
                <Image className='rounded-xl max-sm:w-[60px] max-sm:h-[60px] h-[100px] w-[100px] object-cover' src={SavedPost?.postImage ? SavedPost.postImage : noimage} width={100} height={100} />
            }
            <div className='flex flex-col  gap-1'>
                <h1 className='text-xl font-semibold '>{SavedPost?.postTitle}</h1>
                <h1 className='text-sm font-medium'>{SavedPost?.postDesc.slice(0, 50)}....</h1>
            </div>
        </section>
    )
}

export default SavedMiniPost
