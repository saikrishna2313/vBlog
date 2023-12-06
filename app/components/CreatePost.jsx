'use client'

import { useContext, useRef, useState } from "react"
import { MdOutlineCancel } from "react-icons/md";
import Image from "next/image"
import { BlogContext } from "../Context/Context"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { addDoc, collection, deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore"
import { toast } from 'react-toastify'
import { db } from "../backend/firebase"
import { storage } from "../backend/firebase"
import upload from '../assets/upload.png'
const CreatePost = ({ setPostModel }) => {
    const [title, setTitle] = useState('')
    const [Desc, setDesc] = useState('')
    const [ImageUpload, setImageUpload] = useState('')
    const ImageRef = useRef()
    const [ImageUrl, setImageUrl] = useState('')
    const { currentUser } = useContext(BlogContext)
    const [tags, setTags] = useState([])

    const [tag, setTag] = useState('')
    const openImage = () => {
        ImageRef.current.click()
    }

    const post = async () => {

        if (title.length !== 0 && Desc.length !== 0) {
            if (ImageUpload.length !== 0) {
                const postRef = ref(storage, `posts/${Math.floor(Math.random() * 100)}}`)
                await uploadBytes(postRef, ImageUpload)
                const uploadedUrl = await getDownloadURL(postRef)
                await addDoc(collection(db, "posts"), {
                    postTitle: title,
                    postDesc: Desc,
                    postImage: uploadedUrl,
                    userId: currentUser.uid,
                    tags: tags,
                    pageViews: 0,
                    created: serverTimestamp(),
                    likes: [],
                    comments: []
                }

                )
            }

            if (ImageUpload.length == 0) {

                await addDoc(collection(db, "posts"), {
                    postTitle: title,
                    postDesc: Desc,
                    userId: currentUser.uid,
                    tags: tags
                })

            }
        } else {
            alert("Please Write Something")
        }


    }
    return (
        <section className='h-screen inset-1 absolute top-0 left-0 z-[1000] flex flex-col items-center justify-center  max-sm:flex-col w-screen bg-black bg-opacity-20 backdrop-blur-sm'>

            <section className='w-[90%] overflow-auto py-10  relative bg-opacity-[99%] h-[90%] max-sm:flex-col  max-sm:flex flex bg-white' >
                <h1 className="w-full text-center absolute top-0 left-0 bg-black text-white font-semibold px-3 py-2 uppercase">Create Post</h1>
                <form className="px-20 max-sm:px-4 mt-10 max-sm:flex-col w-full flex flex-col gap-5 py-5 ">
                    <section className="flex gap-10 w-full h-auto items-center max-sm:flex-col  justify-center ma">

                        <div>
                            <div>
                                <p className="font-bold text-2xl max-sm:text-xl text-black mt-2">Title:</p>
                                <input required onChange={(e) => setTitle(e.target.value)} className="outline-none w-full max-sm:text-2xl text-4xl" type="text" placeholder="What is Title?" />
                            </div>
                            <p className="font-bold text-2xl text-black mt-2">Description:</p>
                            <textarea onChange={(e) => setDesc(e.target.value)} cols={20} rows={10} className="outline-none  text-lg overflow-auto  w-full " type="text" placeholder="Start Writing Here..✍" />
                            <div className="flex max-sm:flex-col gap-1">
                                <div className=" flex gap-2 justify-center items-center">
                                    {
                                        tags.length !== 0 && <div className="flex gap-1  ">
                                            {
                                                tags.map((tage) => {
                                                    return (<div className="px-1 py-1 flex gap-1 items-center w-full flex-wrap h-auto justify-center">
                                                        <p>{tage.tagName}</p>
                                                        <MdOutlineCancel onClick={(e) => {
                                                            e.preventDefault()
                                                            const filteredTags = tags.filter((tag) => tag.tagId !== tage.tagId)
                                                            setTags(filteredTags)
                                                        }} className="h-4 cursor-pointer w-4" />
                                                    </div>)
                                                })
                                            }
                                        </div>
                                    }
                                </div>
                                <input onChange={(e) => {
                                    setTag(e.target.value)

                                }} type="text" value={tag} className="flex-2  outline-double py-3 text-sm bg-slate-50 px-2" placeholder="Enter Tags" />
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    if (tag.length !== 0) {
                                        setTags([...tags, {
                                            tagName: tag,
                                            tagId: Math.random() * 100
                                        }]

                                        )

                                    }

                                    setTag('')

                                }} className="px-2 py-1 bg-green-400 rounded-full uppercase text-sm max-sm:mt-2 ml-2 font-bold">Add</button>
                            </div>
                        </div>
                        <section className="w-[100%]  max-sm:flex-col-reverse max-sm:w-full max-sm:px-1 flex  h-full px-5  items-center justify-center">
                            <div className="w-full h-[90%] flex flex-col gap-5 px-3 max-sm:flex-col py-3 items-center justify-center">
                                {
                                    ImageUrl && <div className=" sm:ml-36 h-[80%]">
                                        <Image width={100} height={300} src={ImageUrl} className="w-[99%] h-full object-fit rounded-xl border-2 border-slate-600" />
                                    </div>
                                }
                                <div className="flex gap-5 h-[20%] justify-center items-center">
                                    {
                                        !ImageUrl && <Image src={upload} onClick={(e) => {
                                            e.preventDefault()

                                            openImage()
                                        }} className="px-4 max-sm:px-2 py-2 sm:ml-36 bg-slate-100 shadow-xl w-[300px] h-[300px] font-semibold  uppercase   rounded-2xl" />
                                    }
                                    {
                                        ImageUrl && <button onClick={(e) => {
                                            e.preventDefault()

                                            setImageUrl('')

                                            setImageUpload('')

                                        }} className="px-4 py-2 bg-black sm:ml-36 text-white rounded-3xl">Remove Image</button>
                                    }
                                    <input value='' required onChange={(e) => {

                                        setImageUpload(e.target.files[0])
                                        try {
                                            setImageUrl(URL.createObjectURL(e.target.files[0]))
                                        } catch (error) {
                                            console.error(error)
                                        }
                                    }} ref={ImageRef} type="file" name="" hidden accept="image/jpeg,image/jpg,image/png" />
                                </div>

                            </div>

                        </section>
                    </section>
                    <div className="flex items-center justify-center sm:mb-12 gap-6">
                        <button onClick={async () => {
                            await post().then(() => location.reload()).then(() => toast.success("Your Blog Shared Successfully"))
                        }} className="w-[70%] py-2 rounded-lg text-lg font-semibold uppercase text-white bg-sky-400">Share</button>
                        <button onClick={() => {
                            setPostModel(false)
                            setImageUpload("")
                            setImageUrl(null)
                        }} className="w-[70%] py-2 rounded-lg text-lg font-semibold uppercase text-white bg-black">Discard</button>

                    </div>
                </form>

            </section>


        </section>
    )
}

export default CreatePost
