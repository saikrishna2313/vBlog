'use client'

import { BlogContext } from "@/app/Context/Context"
import HomeNavbar from "@/app/components/HomeNavbar"
import { FaCommentDots } from "react-icons/fa";
import { useParams } from "next/navigation"
import { AiOutlineLike } from "react-icons/ai";
import { CiSaveDown1 } from "react-icons/ci";
import { useContext, useState, useEffect } from "react"
import Image from 'next/image'
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/app/backend/firebase";
import { toast } from 'react-toastify'
import Loader from "@/app/components/Loader";
import { AiFillLike } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { IoGameController } from "react-icons/io5";
import noimage from '../../assets/noimage.png'
import profileLogo from '../../assets/profileLogo.png'
import Comment from "@/app/components/Comment"
const page = () => {
    const router = useRouter()
    const [comment, setComment] = useState(false)
    const [save, setSave] = useState(false)
    const { users, pop, setPop, currentUser,blogUser, getCommentsPosts, commentsPosts, getlikesPosts, likedPosts, following, savedPosts, posts } = useContext(BlogContext)
    const [loader, setLoader] = useState(true)
    const [liked, setLiked] = useState(false)
    const FollowingUsers = following
    const [commentText, setCommentText] = useState('')
    const id = useParams()
    
    const [presentUser] = users?.filter((user) => user.userId === currentUser?.uid)
    const currentUserId = currentUser?.uid
    const post = posts.find((post) => (post.id === id.id))
    const user = users.find((user) => (user.userId === post?.userId))
    const created = new Date(post?.created?.seconds * 1000)
    let date = created
    let mm = date.getMonth();
    let dd = date.getDate();
    let yyyy = date.getFullYear();
    date = dd + '/' + mm + '/' + yyyy;

    const [isFollwed, setisFollowed] = useState(true)


    const [check, setCheck] = useState(true)

    const savePost = async () => {
        await setDoc(doc(db, "users", currentUser?.uid, "saved", post?.id), {
            userId: post?.id
        })

        toast.success("Post Saved Successfully")
    }
    const deletePost = async () => {
        await deleteDoc(doc(db, 'posts', post?.id))
    
        router.push('/')
    }
    const deleteSavedPost = async () => {
        await deleteDoc(doc(db, "users", currentUser?.uid, "saved", post?.id))

        toast.success("Post unsaved Successfully")
    }
    const like = async () => {
        await setDoc(doc(db, 'posts', post?.id, 'likes', currentUserId), {
            userId: currentUserId
        })

    }

    const unlike = async () => {
        await deleteDoc(doc(db, 'posts', post?.id, 'likes', currentUserId))

    }

    const followUser = async () => {
        await setDoc(doc(db, 'users', currentUser?.uid, 'following', post.userId), { userId: post.userId, userName: user?.userName, userImage: user?.userImage })
        await setDoc(doc(db, 'users', post.userId, 'followers', currentUser?.uid), { userId: currentUser.uid, userName: presentUser?.userName, userImage: presentUser?.userImage })

    }
    const unfollowUser = async () => {
        await deleteDoc(doc(db, 'users', currentUser?.uid, 'following', post?.userId))
        await deleteDoc(doc(db, 'users', post?.userId, 'followers', currentUser?.uid))
    }
    useEffect(() => {



        if (FollowingUsers.length > 0) {
            const Followed = FollowingUsers.filter((user) => user.userId === post?.userId)
            if (Followed.length > 0) {
                setisFollowed(false)
            }
            else {
                setisFollowed(true)
            }
        }
        setLoader(false)

        if (currentUserId) {
            view()
        }
    }, [FollowingUsers])
    useEffect(() => {

        const [likedPost] = likedPosts.filter((post) => post.userId === currentUserId)
        if (likedPost) {
            if (likedPost?.userId === currentUserId) {
                setLiked(true)
            }
        }
        if (currentUserId) {
            view()
        }
    }, [likedPosts])



    useEffect(() => {

        const [saved] = savedPosts.filter((item) => item.id === post?.id)
        if (saved) {
            if (saved?.userId === post?.id) {
                setSave(true)

            } else {
                setSave(false)
            }

        }
        if (currentUserId) {
            view()
        }
        getlikesPosts(post?.id)
        getCommentsPosts(post?.id)


    }, [savedPosts])
    const addComment = async () => {
        if (commentText.length > 0) {
            await setDoc(doc(db, 'posts', post?.id, 'comments', post?.id + currentUserId + commentText), {
                userId: currentUserId,
                comment: commentText,

            })
        }
    }
    const deleteComment = async (commenttxt) => {

        await deleteDoc(doc(db, 'posts', post?.id, 'comments', `${post?.id + currentUserId + commenttxt}`))
        getCommentsPosts(post?.id)
    }
    const view = async () => {
        try {
            await setDoc(doc(db, 'posts', post?.id, 'views', currentUserId), {
                userId: currentUserId
            })
        } catch (error) {
            toast.error("Check Network and reload again")
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setCheck(false)
        }, 3000)
    }, [])
    useEffect(() => {



        if (FollowingUsers.length > 0) {
            const Followed = FollowingUsers.filter((user) => user.userId === post?.userId)
            if (Followed.length > 0) {
                setisFollowed(false)
            }
            else {
                setisFollowed(true)
            }
        }
        setLoader(false)

        if (currentUser?.uid) {
            view()
        }
    }, [FollowingUsers])


    return (
        <>

            {
                currentUser ? <section className={`${check ? 'h-screen' : 'overflow-x-hidden h-full w-full'}`}>
                    {
                        check ? <Loader /> :
                            <section className="w-full  h-auto  px-10 max-sm:px-2 flex justify-center items-center flex-col">

                                {
                                    !check && <section className=" px-20 max-sm:px-2 py-10 justify-center items-center w-[800px] max-sm:w-[100%] gap-2  flex-col flex">

                                        <div className="w-full flex items-start justify-start">
                                            <h1 className="text-4xl my-2 max-sm:text-3xl text-start font-semibold">{post?.postTitle}</h1></div>
                                        <div className="flex w-full items-center justify-start gap-1 font-bold text-sm">{
                                            post?.tags.map((tag) => (<p>#{tag.tagName}</p>))
                                        }</div>
                                        <div className="flex justify-between w-full items-center gap-1 my-3">
                                            <div className="flex items-center justify-between w-full px-2 gap-1">
                                                <div className="flex items-center justify-center px-2 gap-1">
                                                    <button onClick={() => router.push(`/profile/${user?.userId}`)}> <Image src={user?.userImage ? user.userImage : profileLogo} width={40} height={40} className="w-[40px] object-cover mr-4 h-[40px] rounded-full" /></button>
                                                    <h1 className="text-slate-900 font-semibold">{user?.userName}</h1>
                                                </div>
                                                {
                                                    currentUser?.uid===post?.userId &&  <button onClick={() =>{
                                                        if(save){
                                                            deleteSavedPost()
                                                        }
                                                         deletePost()
                                                    }} ><AiFillDelete className="w-6 h-6" /></button>
                                                }
                                            </div>

                                            <div>
                                                {
                                                    currentUser?.uid !== post?.userId && <div>
                                                        {isFollwed ? <button onClick={() => {
                                                            followUser()
                                                            setisFollowed(false)
                                                        }} className='text-black bg-white font-medium max-sm:px-2 max-sm:text-[13px] uppercase text-sm px-4 py-1 border-2 rounded-3xl'>Follow</button> :
                                                            <button onClick={() => {
                                                                unfollowUser()
                                                                setisFollowed(true)
                                                            }} className='px-4 py-1 bg-black text-white rounded-full max-sm:px-2 max-sm:text-[13px] font-medium uppercase text-sm'>Unfollow</button>}

                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="w-full px-1  py-1">
                                            <p className="text-sm ml-1 font-semibold">{date && date}</p>
                                            {
                                                post?.postImage && <Image className='w-full h-[300px] max-sm:w-full  mt-5 max-sm:h-[300px] rounded-lg object-cover' src={post?.postImage} width={200} height={200} />
                                            }
                                            <p className="text-lg my-2 max-sm:text-sm font-medium">{post?.postDesc}</p>
                                        </div>
                                        <div className="flex relative  justify-between w-full items-center border-2 px-3 py-2">
                                            <div className="flex  justify-center items-center gap-4">
                                                <div className="flex  gap-1 items-center justify-center">
                                                    {
                                                        !liked ? <button onClick={() => {
                                                            like()
                                                            getlikesPosts(post?.id)
                                                            setLiked(!liked)
                                                        }} className=""><AiOutlineLike className="h-6 w-6" /></button>
                                                            : <button onClick={() => {
                                                                unlike()
                                                                getlikesPosts(post?.id)
                                                                setLiked(!liked)
                                                            }} className=""><AiFillLike className="h-6 w-6" /></button>
                                                    }
                                                    <p>{likedPosts.length}</p>
                                                </div>

                                                <button onClick={() => setComment(!comment)}><FaCommentDots className="h-6 w-6" /></button>
                                            </div>

                                            <div>

                                                {
                                                    !save ? <button onClick={() => {
                                                        savePost()
                                                        setSave(true)
                                                    }} className='text-sm flex text-black gap-1 items-center justify-start mt-2  font-semibold uppercase'><CiSaveDown1 className='w-6 h-6' /></button> : <button onClick={() => {
                                                        deleteSavedPost()
                                                        setSave(false)
                                                    }} className='text-sm flex text-green-400 gap-1 items-center justify-start mt-2  font-semibold uppercase'><CiSaveDown1 className='w-6 h-6' /></button>

                                                }

                                            </div>

                                        </div>
                                        {
                                            comment && <section className="w-full">
                                                <div className="w-full shadow-lg flex items-center justify-center">
                                                    <input value={commentText} onChange={(e) => setCommentText(e.target.value)} type="text" placeholder="Write Comment" className="w-[70%] px-2 py-3 text-lg max-sm:text-sm  text-slate-900 bg-slate-100 outline-none mb-2 " />
                                                    <button onClick={() => {
                                                        addComment()
                                                        setCommentText('')
                                                        getCommentsPosts(post?.id)
                                                    }} className="w-[30%] px-2 py-3 text-lg max-sm:text-sm  text-slate-100 bg-green-400 uppercase outline-none mb-2 ">post</button>
                                                </div>
                                                <div className="w-full flex flex-col items-start justify-center ">
                                                   {
                                                        commentsPosts.map((commentt) => {
                                                            return (
                                                                <Comment currentUserId={currentUserId} commentt={commentt} deleteComment={deleteComment} />
                                                            )
                                                        })
                                                    }
                                                </div>


                                            </section>
                                        }
                                        <div className="w-full flex mt-5 items-center justify-start">
                                            <a href="/" className="px-4 m-1 text-white py-1 bg-green-400 rounded-full text-sm uppercase font-semibold">Back</a>
                                        </div>
                                    </section>
                                }
                            </section>
                    }
                </section> :
                    <section className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 w-full">


                    </section>
            }
        </>
    )
}

export default page
