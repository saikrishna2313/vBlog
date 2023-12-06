import React from 'react'

import { useContext } from "react"
import { BlogContext } from "../Context/Context"
import SavedMiniPost from './SavedMiniPost'
const SavedPost = () => {
    const { currentUser, posts, savedPosts } = useContext(BlogContext)


    return (
        <section>
            {
                savedPosts.map((post) => {

                    return (
                        <div className='flex flex-col w-[100%] max-sm:w-[80%] items-center justify-center gap-3'>
                            <SavedMiniPost post={post} />

                        </div>

                    )
                })
            }
        </section>
    )
}

export default SavedPost