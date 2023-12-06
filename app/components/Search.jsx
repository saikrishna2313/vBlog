'use client'
import { useContext, useState } from "react";
import { FaSearchengin } from "react-icons/fa6";
import { BlogContext } from "../Context/Context";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import profileLogo from '../assets/profileLogo.png'
const Search = ({ searchModel, setSearchModel }) => {
    const { users } = useContext(BlogContext)
    const [Filter, setFilter] = useState('')
    const router = useRouter()
    return (
        <section className='flex relative z-[1000] items-center  justify-center gap-3'>
            <input value={Filter} onChange={(e) => setFilter(e.target.value)} className='w-[300px] px-3 pr-12 py-2 text-slate-800 bg-slate-50 outline-none text-lg max-sm:text-sm' type='text' placeholder='Search Users' />
            <FaSearchengin className='h-8 max-sm:hidden  absolute top-[50%] translate-y-[-50%] right-3 text-slate-500 w-8' />

            <section className="absolute  max-sm:w-[300px] max-sm:left-[50%] max-sm:translate-x-[-50%] mt-2 max-sm:mt-1 top-10  ">
                {
                    users.filter((user) => (Filter ? user?.userName.toLowerCase().includes(Filter.toLowerCase()) : Filter)).map((user) => {
                        return (
                            <button><section onClick={() => {
                                setSearchModel(!searchModel)
                                router.push(`/profile/${user?.userId}`)
                                setFilter('')
                            }} className="flex mt-2 px-3 py-2 shadow-lg border-2 bg-white bg-opacity-50 items-center justify-start gap-3 max-sm:w-[300px] w-[400px] ">
                                <Image height={30} width={30} src={user?.userImage ? user.userImage : profileLogo} className="h-8 w-8 rounded-lg" />
                                <p className="text-lg max-sm:text-sm font-semibold">{user?.userName}</p>
                            </section></button>
                        )
                    })
                }

            </section>
        </section>

    )
}

export default Search