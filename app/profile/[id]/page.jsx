'use client'
import { db, storage } from '@/app/backend/firebase'
import HomeNavbar from '@/app/components/HomeNavbar'
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc } from 'firebase/firestore'
import { useParams } from 'next/navigation'

import React, { useContext, useEffect, useRef, useState } from 'react'
import { TbUserEdit } from "react-icons/tb";
import Image from 'next/image'
import Loader from '@/app/components/Loader'
import MyPosts from '@/app/components/MyPosts'
import About from '@/app/components/About'
import { toast } from 'react-toastify'
import profileLogo from "../../assets/profileLogo.png"
import SavedPost from '@/app/components/SavedPost'
import { BlogContext } from '@/app/Context/Context'
import { useRouter } from 'next/navigation'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
const page = () => {
    const { following, users, pop, setPop } = useContext(BlogContext)
    const [user, setUser] = useState({})
    const router = useRouter()
    const [updateName, setUpdateName] = useState('')
    const [updateBio, setUpdateBio] = useState('')
    const [loading, setLoading] = useState(true)
    const params = useParams()
    const id = decodeURI(params.id)
    const [userInfo, setUserInfo] = useState(0)
    const [userUpdateModel, setUserUpdateModel] = useState(false)
    const [imgUrl, setImgUrl] = useState('')
    const ImgRef = useRef(null)
    const { currentUser } = useContext(BlogContext)
    const [uploadImage, setUploadImage] = useState("")
    const [removeProfile, setRemoveProfile] = useState(false)
    const [followers, setFollowers] = useState([])
    const [Following, setFollowing] = useState([])
    const FollowingUsers = following
    const [FollowList, setFollowList] = useState([])
    const [FollowingList, setFollowingList] = useState([])

    const [presentUser] = users?.filter((user) => user.userId === currentUser?.uid)

    const [isFollwed, setisFollowed] = useState(true)


    const getFollowersDetails = async () => {
        const follow = doc(db, 'users', id)
        const detailsFollowers = await getDocs(collection(follow, 'followers'))
        const detailsFollowing = await getDocs(collection(follow, 'following'))
        const filteredFollowers = detailsFollowers.docs.map((item) => ({ ...item.data() }))
        const filteredFollowing = detailsFollowing.docs.map((item) => ({ ...item.data() }))

        setFollowers(filteredFollowers)
        setFollowing(filteredFollowing)


    }


    const getUser = async () => {

        try {
            const userData = await getDoc(doc(db, "users", id))
            setUser(userData.data())
            setLoading(false)
        } catch (error) {
            toast.error("Network is Slow, Chek Connection 🤦‍♂️")
        }
    }





    const updateProfile = async () => {
        if (updateName.length !== 0 && updateBio.length !== 0) {
            if (uploadImage.length !== 0) {
                const userProfile = ref(storage, `profiles/${user.userName}`)
                await uploadBytes(userProfile, uploadImage)
                const uploadedUrl = await getDownloadURL(userProfile)
                await updateDoc(doc(db, 'users', user?.userId), {
                    ...user, userName: updateName, userBio: updateBio, userImage: uploadedUrl
                }).then(() => {

                    location.reload()
                }

                )

            } else {

                if (!removeProfile) {
                    await updateDoc(doc(db, 'users', user?.userId), {
                        ...user, userName: updateName, userBio: updateBio
                    }).then(() => {

                        location.reload()
                    }

                    )

                } else {
                    await updateDoc(doc(db, 'users', user?.userId), {
                        ...user, userName: updateName, userBio: updateBio, userImage: ""
                    }).then(() => {

                        location.reload()
                    }

                    )

                }

            }


        }
        else {
            toast.error("These Fields are Requied")
        }
    }




    useEffect(() => {
        getUser()
        getFollowersDetails()

    }, [])



    const updatePic = () => {
        ImgRef.current.click()
    }
    const followUser = async () => {
        await setDoc(doc(db, 'users', currentUser?.uid, 'following', id), { userId: id, userName: user?.userName, userImage: user?.userImage })
        await setDoc(doc(db, 'users', id, 'followers', currentUser?.uid), { userId: currentUser.uid, userName: presentUser?.userName, userImage: presentUser?.userImage })


    }
    const unfollowUser = async () => {
        await deleteDoc(doc(db, 'users', currentUser?.uid, 'following', id))
        await deleteDoc(doc(db, 'users', id, 'followers', currentUser?.uid))
    }

    useEffect(() => {
        getFollowersDetails()
    })
    useEffect(() => {



        if (FollowingUsers.length > 0) {
            const Followed = FollowingUsers.filter((user) => user.userId === id)
            if (Followed.length > 0) {
                setisFollowed(false)
            }
            else {
                setisFollowed(true)
            }
        }





    }, [FollowingUsers])
    const [followerPop, setFollowerPop] = useState(true)
    const [followingrPop, setFollowingrPop] = useState(false)
    return (
        <section className={`${currentUser ? 'h-auto' : 'h-screen'}`}>
            {
                currentUser ? <section className='h-auto  w-full'>

                    {
                        loading ?
                            <section className='h-screen'>
                                <Loader />
                            </section> :
                            <section className='w-screen max-sm:text-sm flex flex-col overflow-x-hidden items-center justify-start max-sm:px-5 px-20 py-5'>
                                <section className='w-full flex flex-col items-center justify-start px-20 max-sm:px-2 py-5'>
                                    <h1 className='text-3xl max-sm:text-xl font-semibold text-center uppercase  m-5'>User Profile</h1>
                                    <div className='flex flex-col gap-2 justify-center items-center'>
                                        <Image alt='profile' src={user?.userImage ? user.userImage : profileLogo} width={150} height={150} className='rounded-xl w-[150px] max-sm:w-[100px] max-sm:h-[100px] object-cover h-[150px] shadow-lg' />
                                        <h1 className='text-xl max-sm:text-lg font-semibold mt-2'>{user?.userName}</h1>
                                        <div>
                                            {
                                                currentUser?.uid !== user?.userId && <div>
                                                    {isFollwed ? <button onClick={() => {

                                                        followUser()
                                                        getFollowersDetails()
                                                        setisFollowed(false)

                                                    }} className='text-black bg-white font-medium max-sm:px-2 max-sm:text-[13px] uppercase text-sm px-4 py-1 border-2 rounded-3xl'>Follow</button> :
                                                        <button onClick={() => {
                                                            unfollowUser()
                                                            getFollowersDetails()
                                                            setisFollowed(true)

                                                        }} className='px-4 py-1 bg-black text-white rounded-full max-sm:px-2 max-sm:text-[13px] font-medium uppercase text-sm'>Unfollow</button>}

                                                </div>
                                            }
                                        </div>

                                        {
                                            user?.userBio ? <h1>{user?.userBio}</h1> : <h1>No Bio Yet</h1>
                                        }
                                        <div className='flex gap-3 justify-center items-center m-2 text-sm font-semibold'><button onClick={() => {
                                            setFollowerPop(!followerPop)
                                            setFollowingrPop(false)
                                        }} className={`flex gap-1 px-3 py-1 bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 rounded-full ${followerPop && 'border-4 border-slate-300'}`}>Followers:  <span>{followers.length}</span></button>
                                            <button onClick={() => {
                                                setFollowerPop(false)
                                                setFollowingrPop(!followingrPop)
                                            }} className={`flex gap-1 px-3 py-1 bg-gradient-to-r to-indigo-200 via-red-200 from-yellow-100 rounded-full ${followingrPop && 'border-4 border-slate-300'}`}>Following: <span>{Following.length}</span></button></div>
                                    </div>

                                    {/* dadsdddqad                         */}
                                    <section className='h-auto w-full flex items-center justify-center'>
                                        {
                                            followerPop && <section className='flex flex-col gap-10 h-auto w-[300px] bg-white shadow-xl rounded-xl m-2 py-3 px-4 justify-center items-centert'>
                                                <div className='flex items-center justify-center'> <h1 className='text-xl font-semibold uppercase text-center'>Followers</h1></div>
                                                {
                                                    followers.length > 0 ? <section className='flex flex-col items-start justify-center gap-2'>
                                                        {
                                                            followers.map((user) => {
                                                                return (
                                                                    <a href={`/profile/${user?.userId}`} className='flex items-center  justify-center gap-1 '>
                                                                        <Image className='rounded-xl h-12 object-cover w-12' src={user?.userImage ? user.userImage : profileLogo} height={30} width={30} />
                                                                        <h1 className='text-lg max-sm:text-sm font-semibold  capitalize'>{user?.userName}</h1>
                                                                    </a >
                                                                )
                                                            })
                                                        }
                                                    </section> :
                                                        <h1>No Followers Yet</h1>
                                                }


                                            </section>
                                        }
                                        {

                                            followingrPop && <section className='flex flex-col gap-10 h-auto w-[300px] bg-white shadow-xl m-2 rounded-xl py-3 px-4 justify-center items-centert'>
                                                <h1 className='text-xl font-semibold uppercase text-center'>Following</h1>
                                                <section className='flex flex-col items-start justify-center gap-2'>

                                                    {
                                                        Following.length > 0 ? <section className='flex flex-col items-start justify-center gap-2'>
                                                            {Following.map((user) => {
                                                                return (
                                                                    <a href={`/profile/${user?.userId}`} className='flex items-center  justify-center gap-1 '>
                                                                        <Image className='rounded-xl object-cover h-12 w-12' src={user?.userImage ? user.userImage : profileLogo} height={30} width={30} />
                                                                        <h1 className='text-lg max-sm:text-sm font-semibold capitalize'>{user?.userName}</h1>
                                                                    </a >
                                                                )
                                                            })}
                                                        </section> :
                                                            <h1>Not Following Anyone</h1>
                                                    }
                                                </section>

                                            </section>
                                        }
                                    </section>
                                    {
                                        user?.userId === currentUser?.uid && <div onClick={() => {
                                            setUserUpdateModel(!userUpdateModel)
                                            setImgUrl(user?.userImage)
                                            setUpdateName(user?.userName)
                                            setUpdateBio(user?.userBio)

                                        }} className='flex rounded-full justify-center items-center bg-green-400 px-3 py-1 max-sm:text-sm text-white  gap-1'><button className='px-3 py-1  uppercase font-semibold'>Edit</button><TbUserEdit className='h-6 w-6' /></div>
                                    }

                                </section>
                                {

                                    userUpdateModel && <section className='h-screen w-screen bg-black flex items-center justify-center inset-0  absolute top-0 left-0 backdrop-blur-sm bg-opacity-30'>

                                        <section className='w-[400px] flex items-center justify-center flex-col h-auto px-5 pb-5 bg-slate-50'>
                                            <div className='bg-slate-600  mb-4 mt-1 text-white font-semibold text-center w-full'>UPDATE YOUR DETAILS</div>
                                            <div className='flex justify-center w-[80px] h-[80px] items-center gap-2'> <Image src={imgUrl.length !== 0 ? imgUrl : profileLogo} className=' object-cover h-full w-full  rounded-full' width={150} height={150} />
                                                <button onClick={() => {

                                                    updatePic()



                                                }} className='text-sky-400 font-semibold uppercase text-sm'>Update</button>
                                                <input accept='image/jpg,image/jpeg,image/png' value='' ref={ImgRef} onChange={(e) => {
                                                    try {
                                                        setImgUrl(URL.createObjectURL(e.target.files[0]))

                                                        setUploadImage(e.target.files[0])
                                                    } catch (error) {
                                                        console.log(error)
                                                    }
                                                }} id='imgFile' type='file' hidden />
                                                <button onClick={() => {
                                                    setRemoveProfile(true)
                                                    setImgUrl('')

                                                }} className='text-black0 font-semibold uppercase text-sm'>Remove</button>
                                            </div>
                                            <div className='flex w-full mt-5 flex-col items-center justify-center gap-3'>
                                                <input required type='text' value={updateName} onChange={(e) => setUpdateName(e.target.value)} className='w-full px-3 py-2 bg-slate-300 text-slate-900 outline-none shadow-lg' placeholder='Update Name' />
                                                <input required type='text' value={updateBio} onChange={(e) => setUpdateBio(e.target.value)} className='w-full px-3 py-2 bg-slate-300 text-slate-900 outline-none shadow-lg' placeholder='Update Bio' />
                                                <div className='flex gap-5 justify-between px-13 py-2 m-2 items-center'>
                                                    <button onClick={() => setUserUpdateModel(!userUpdateModel)} className='px-4 py-2 bg-slate-900 rounded-full font-semibold uppercase text-white'>Cancel</button>
                                                    <button onClick={() => updateProfile()} className='px-4 py-2 bg-green-400 rounded-full font-semibold uppercase text-white'>Save</button>
                                                </div>
                                            </div>


                                        </section>
                                    </section>
                                }
                                <section>
                                    <div className='w-full mb-3  px-20 flex justify-center items-center gap-10'>
                                        <button onClick={() => setUserInfo(0)} className={`uppercase font-bold  max-sm:text-sm text-xl  ${userInfo === 0 && 'text-sky-400'}`}>Posts</button>
                                        {
                                            currentUser?.uid === id && <button onClick={() => setUserInfo(1)} className={`uppercase font-bold  max-sm:text-sm text-xl  ${userInfo === 1 && 'text-sky-400'}`}>Saved </button>
                                        }
                                        <button onClick={() => setUserInfo(2)} className={`uppercase font-bold  max-sm:text-sm text-xl  ${userInfo === 2 && 'text-sky-400'}`}>About</button>

                                    </div>
                                    <div className='w-full flex justify-center items-center'>
                                        {
                                            userInfo === 0 && <MyPosts />

                                        }
                                        {


                                            userInfo === 1 && <SavedPost />


                                        }

                                        {
                                            userInfo === 2 && <About currentUser={currentUser} user={user} setUserUpdateModel={setUserUpdateModel} bio={user?.userBio} />
                                        }

                                    </div>
                                </section>
                            </section>


                    }

                </section > : <section className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 w-full">
                    <div onClick={() => setPop(!pop)}>
                        <h1 className="text-xl font-semibold cursor-pointer px-4 py-1 text-white bg-blue-400 uppercase rounded-full ">Please Login to Continue</h1>
                    </div>

                </section>
            }</section>
    )
}

export default page