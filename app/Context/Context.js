'use client'
import { onAuthStateChanged } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "../backend/firebase"
import Loader from "../components/Loader"
import { collection, doc, getDocs } from "firebase/firestore"
export const BlogContext = createContext()
import loading from '../assets/loading.gif'
import Image from 'next/image'
const Context = ({ children }) => {
    const [Loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState(false)
    const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [savedPosts, setsavedPosts] = useState([])
    const [blogUser, setBlogUser] = useState([])
    const [following, setFollowing] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
    const [commentsPosts, setCommentsPosts] = useState([])
    const [pop, setPop] = useState(false)
    const [tags, setTags] = useState([])
    const getTags = () => {
        posts.map((post) => setTags([...tags, post.tags]))

    }
    const getUsers = async () => {
        const users = await getDocs(collection(db, 'users'))
        const usersData = users.docs.map((user) => ({ ...user.data(), id: user.id }))
        setUsers(usersData)


    }
    const presentUser = async () => {
        const user = users.filter((user) => user.userId === currentUser?.uid)
        setBlogUser(user)
    }
    const getAllPosts = async () => {
        const posts = await getDocs(collection(db, "posts"))
        const postsData = posts.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setPosts(postsData)

    }
    const getSavedPosts = async () => {
        const savedDoc = doc(db, 'users', `${currentUser?.uid}`)
        const saved = collection(savedDoc, 'saved')
        const savedFetch = await getDocs(saved)
        const savedData = savedFetch.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setsavedPosts(savedData)


    }
    const getlikesPosts = async (id) => {
        const likesDoc = doc(db, 'posts', `${id}`)
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

    const getFollowing = async () => {
        const followdoc = doc(db, 'users', `${currentUser?.uid}`)
        const following = collection(followdoc, 'following')
        const followingFetch = await getDocs(following)
        const followingData = followingFetch.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setFollowing(followingData)

    }
    const [tag, setTag] = useState('')

    useEffect(() => {

        onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)

        }


        )

        getUsers()
        presentUser()
        getAllPosts()
        getTags()
        getSavedPosts()
        getFollowing()
        setLoading(false)
    }, [currentUser])

    return (
        <BlogContext.Provider value={{ posts, pop, setPop, getCommentsPosts, commentsPosts, likedPosts, getlikesPosts, following, blogUser, savedPosts, users, currentUser, setCurrentUser, loading, setLoading }}>
            {
                Loading ? <section className="h-screen w-full flex items-center justify-center">
                    <Image src={loading} width={600} height={600} />

                </section> :
                    <div>
                        {children}

                    </div>
            }
        </BlogContext.Provider>
    )
}

export default Context;