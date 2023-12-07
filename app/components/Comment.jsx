'use client'

import { useContext } from "react"
import { BlogContext } from "../Context/Context"
import { useRouter } from "next/navigation"
import { AiFillDelete } from "react-icons/ai";
import Image from 'next/image'
const Comment = ({ commentt, deleteComment,currentUserId }) => {
    const { users } = useContext(BlogContext)
    const [commentUser] = users.filter((user) => user?.userId === commentt?.userId)
    const router = useRouter()
    return (

        <section className="w-full flex-col flex gap-1 bg-white">
            <div className="flex justify-start gap-2 items-center">
                <button onClick={() => router.push(`/profile/${commentt?.userId}`)}> <Image src={commentUser?.userImage ? commentUser.userImage : profileLogo} width={30} height={30} className="h-8 w-8" /></button>
                <p className="text-slate-800 font-semibold capitalize">{commentUser?.userName}</p>
            </div>
            <p className=" flex border justify-between items-center px-4 shadow-lg w-full py-2 bg-slate-100 text-lg  max-sm:text-sm "><span>{commentt.comment}</span>
                {
                    currentUserId === commentt.userId && <button onClick={() => {
                        deleteComment(commentt.comment)


                    }}><AiFillDelete className="w-6 h-6" /></button>
                }
            </p>
        </section>

    )
}

export default Comment
