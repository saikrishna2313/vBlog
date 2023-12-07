'use client'
import React, { useContext, useEffect, useState } from 'react'
import { CiSaveDown1 } from "react-icons/ci";
import Image from 'next/image'
import { BlogContext } from '../Context/Context'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../backend/firebase';
import { useRouter } from 'next/navigation';
import noimage from '../assets/noimage.png'
import profileLogo from '../assets/profileLogo.png'

const Post = ({ post }) => {
    const [views, setViews] = useState([])
    const { users, savedPosts, pop, setPop, tag, currentUser } = useContext(BlogContext)
    const [presentUser] = users?.filter((user) => user.userId === currentUser?.uid)
    const [commentsPosts, setCommentsPosts] = useState([])
    const user = users.find((user) => (user.userId === post.userId))
    const [likedPosts, setLikedPosts] = useState([])
    const [save, setSave] = useState(false)

    const created = new Date(post?.created?.seconds * 1000)
    let date = created
    let mm = date.getMonth();
    let dd = date.getDate();
    let yyyy = date.getFullYear();
    date = dd + '/' + mm + '/' + yyyy;
    const [isFollwed, setisFollowed] = useState(true)
    const router = useRouter()
    const getFollowersDetails = async () => {
        const follow = doc(db, 'users', post?.userId)

        const detailsFollowers = await getDocs(collection(follow, 'followers'))

        const filteredFollowers = detailsFollowers.docs.map((item) => ({ ...item.data() }))
        const followed = filteredFollowers.find((user) => user.userId === currentUser?.uid)

        if (followed) {
            setisFollowed(false)
        }
    }

    useEffect(() => {
        getFollowersDetails()

        const [saved] = savedPosts.filter((item) => item.id === post?.id)
        if (saved) {
            if (saved?.userId === post?.id) {
                setSave(true)

            } else {
                setSave(false)
            }

        }

        getlikesPosts(post?.id)
        getCommentsPosts(post?.id)
        getViews(post?.id)
    }, [savedPosts])


    const getlikesPosts = async () => {
        const likesDoc = doc(db, 'posts', `${post?.id}`)
        const likes = collection(likesDoc, 'likes')
        const likesFetch = await getDocs(likes)
        const likesData = likesFetch.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setLikedPosts(likesData)




    }
    const getCommentsPosts = async (id) => {
        const commentsDoc = doc(db, 'posts', `${id}`)
        const comments = collection(commentsDoc, 'comments')
        const commentsFetch = await getDocs(comments)
        const commentsData = commentsFetch.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setCommentsPosts(commentsData)



    }
    const getViews = async (id) => {
        const viewDoc = doc(db, 'posts', `${id}`)
        const view = collection(viewDoc, 'views')
        const viewFetch = await getDocs(view)
        const viewData = viewFetch.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setViews(viewData)



    }

    const followUser = async () => {
        await setDoc(doc(db, 'users', currentUser?.uid, 'following', post.userId), { userId: post.userId, userName: user?.userName, userImage: user?.userImage })
        await setDoc(doc(db, 'users', post.userId, 'followers', currentUser?.uid), { userId: currentUser.uid, userName: presentUser?.userName, userImage: presentUser?.userImage })

    }
    const unfollowUser = async () => {
        await deleteDoc(doc(db, 'users', currentUser?.uid, 'following', post.userId))
        await deleteDoc(doc(db, 'users', post.userId, 'followers', currentUser?.uid))
    }


    const savePost = async () => {
        await setDoc(doc(db, "users", currentUser?.uid, "saved", post?.id), {
            userId: post?.id
        })

        toast.success("Post Saved Successfully")
    }
    const deleteSavedPost = async () => {
        await deleteDoc(doc(db, "users", currentUser?.uid, "saved", post?.id))
        toast.success("Post unsaved Successfully")
    }
    const view = async () => {
        await setDoc(doc(db, 'posts', post?.id, 'views', currentUser?.uid), {
            userId: currentUser?.uid
        })
    }

    return (
        <section className='flex gap-2 shadow-lg mt-2 px-3 py-4 max-sm:w-[100%] m-1 w-[500px]] flex-col '>
            <div className='flex gap-1 justify-between  font-semibold items-center'>
                <div onClick={() => router.push(`/profile/${post?.userId}`)} className='flex gap-1 font-semibold items-center'> <Image src={user?.userImage ? user.userImage : profileLogo} width={100} height={100} className='w-8 h-8 object-cover rounded-full' />
                    <p>{user?.userName}</p></div>
                <div>

                    {
                        !currentUser?.uid ? <div>
                            <button onClick={() => {
                                setPop(!pop)


                            }} className='text-black bg-white font-medium uppercase text-sm px-4 py-1 border-2 rounded-3xl'>Follow</button>
                        </div> : <div>
                            {
                                currentUser?.uid !== post.userId && <div>
                                    {isFollwed ? <button onClick={() => {
                                        if (currentUser?.uid) {
                                            followUser()
                                            setisFollowed(false)

                                        }

                                    }} className='text-black bg-white font-medium uppercase text-sm px-4 py-1 border-2 rounded-3xl'>Follow</button> :
                                        <button onClick={() => {

                                            unfollowUser()
                                            setisFollowed(true)

                                        }} className='px-4 py-1 bg-black text-white rounded-full font-medium uppercase max-sm:text-[13px] max-sm:px-2  text-sm'>Unfollow</button>}

                                </div>
                            }
                        </div>
                    }


                </div>
            </div>
            <section className='flex  flex-col-reverse mt-2 gap-4'>
                <div className='flex w-[80%] gap-1 mt-2 flex-col items-start'>
                    <h1 className='text-xl font-semibold'>{post.postTitle}</h1>
                    <h1>{post.postDesc.slice(0, 40)}...<button onClick={() => {
                        if (currentUser?.uid) {
                            view()
                        }
                        else {
                            setPop(!pop)
                        }
                    }} >{
                            currentUser?.uid ? <a href={`postDetails/${post.id}`} className='font-semibold text-sky-500'>Read more</a > : <p className='font-semibold text-sky-500'>Read more</p>
                        }</button></h1>

                    <div className='flex max-sm:flex  max-sm:flex-col max-sm:gap-1 max-sm:my-2 text-sm font-medium items-start justify-center gap-3'>
                        <p><span className='font-semibold text-sky-400 uppercase text-[14px]'>Views:</span> {views.length}</p>
                        <p><span className='font-semibold text-sky-400 uppercase text-[14px]'>Likes:</span> {likedPosts.length}</p>
                        <p><span className='font-semibold text-sky-400 uppercase text-[14px]'>Comments:</span> {commentsPosts.length}</p>

                    </div>
                    <div> <p className=' text-sm flex'><p className='font-semibold'>Created : </p>{date}</p>

                        <section>
                            {
                                currentUser?.uid ? <div>
                                    {
                                        !save ? <button onClick={() => {

                                            savePost()
                                            setSave(true)

                                        }} className='text-sm flex text-black gap-1 items-center justify-start mt-2  font-semibold uppercase'><CiSaveDown1 className='w-6 h-6' /></button> : <button onClick={() => {
                                            deleteSavedPost()
                                            setSave(false)
                                        }} className='text-sm flex text-green-400 gap-1 items-center justify-start mt-2  font-semibold uppercase'><CiSaveDown1 className='w-6 h-6' /></button>

                                    }

                                </div> :
                                    <button onClick={() => setPop(!pop)} className='text-sm flex text-black gap-1 items-center justify-start mt-2  font-semibold uppercase'><CiSaveDown1 className='w-6 h-6' /></button>
                            }
                        </section>
                    </div>
                </div>
                {
                    post?.postImage && <Image className='w-[300px] h-[200px] max-sm:w-full  mt-5 max-sm:h-[300px] rounded-lg object-cover' src={post?.postImage} width={200} height={200} />
                }
            </section>

        </section>


    )
}

export default Post
