'use client'
import { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoMdArrowBack, IoMdClose } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { db, provider } from "../backend/firebase";
import { auth } from "../backend/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify'
import { BlogContext } from "../Context/Context";
const AuthModel = ({ pop, setPop }) => {
    const router = useRouter()

    const [signUp, setSignUp] = useState(true)
    const [emailSignUp, setEmailSignUp] = useState(false)
    const [emailSignIn, setEmailSignIn] = useState(false)
    const [signupname, setsignupname] = useState('')
    const [signupmail, setSignupmail] = useState('')
    const [signuppassword, setsignuppassword] = useState('')
    const [checksignuppassword, setchecksignuppassword] = useState('')
    const [signinmail, setSigninmail] = useState('')
    const [signinpassword, setsigninpassword] = useState('')
    const { loading, setLoading } = useContext(BlogContext)
    const googleAuth = async () => {
        try {
            const user = await signInWithPopup(auth, provider)
            const newUser = user.user;
            const ref = doc(db, 'users', newUser.uid)
            const userDoc = await getDoc(ref)
            if (!userDoc.exists()) {


                await setDoc(ref, {
                    userId: newUser.uid,
                    userName: newUser.displayName,
                    userImage: newUser.photoURL,
                    userBio: "",
                    followers: [],
                    following: []

                })
            }
            setPop(!pop)
            toast.success("Welcome to vBlog, Signed In🙏")
            router.push('/')
        } catch (error) {
            toast.error("Something Went Wrong🤷‍♂️, Try Again🙏")
        }

    }
    const EmailLogin = async () => {
        try {
            setLoading(true)
            await signInWithEmailAndPassword(auth, signinmail, signinpassword)
            setPop(!pop)
            toast.success("Welcome to vBlog, Signed In🙏")
            router.push('/')
            setLoading(false)
        } catch (error) {
            toast.error("Check Email, and Password Once Again🤦‍♂️")
            setLoading(false)
        }

    }
    const EmailSignUp = async () => {
        if (signuppassword !== checksignuppassword) {
            toast.error("Passwords are Not Matching, check Again")
            setPop(!pop)

        }
        else {
            try {
                const { user } = await createUserWithEmailAndPassword(auth, signupmail, signuppassword)

                const ref = doc(db, 'users', user.uid)
                const userDoc = await getDoc(ref)
                if (!userDoc.exists()) {

                    await setDoc(ref, {
                        userId: user.uid,
                        userName: signupname,
                        userImage: "",
                        userBio: "",
                        followers: [],
                        following: []

                    })
                }
                setPop(!pop)
                toast.success("Welcome to vBlog, Signed In🙏")
                router.push('/')
            } catch (error) {
                toast.error("Something Went Wrong🤷‍♂️, Try Again🙏")
            }

        }


    }

    return (
        <section className='h-screen flex items-center justify-center fixed left-0 top-0 w-screen inset-0 bg-black backdrop-filter-lg z-[100000] bg-opacity-20'>


            <section className="bg-slate-50 w-[70%] max-sm:w-[99%] relative h-full flex flex-col items-center justify-center">
                <IoMdClose onClick={() => setPop(!pop)} className="absolute cursor-pointer top-8 right-8 h-8 w-8" />
                {
                    signUp ?
                        <section className="w-full gap-2 flex flex-col items-center justify-center h-full">
                            {
                                emailSignUp ? <section className="w-full gap-2 px-3 flex flex-col items-center justify-center h-full">
                                    <h1 className="text-3xl font-semibold">Sign Up with email</h1>
                                    <p className="text-sm max-sm:text-[13px] text-slate-900 max-sm:px-4 mt-3">Enter the email address, and start sharing Knowledge, write blogs effectively 🤝.</p>

                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        EmailSignUp()
                                    }} id="SignUpForm" className="flex m-5  flex-col items-center justify-center gap-2">
                                        <input onChange={(e) => setsignupname(e.target.value)} required type="text" placeholder="Enter UserName" className="w-[300px]  border-2 max-sm:px-2 max-sm:text-sm border-slate-300  px-4 py-2 text-black bg-slate-100 text-lg outline-none shadow-xl rounded-sm" />
                                        <input onChange={(e) => setSignupmail(e.target.value)} required type="email" placeholder="Enter Email " className="w-[300px]  border-2 max-sm:px-2 max-sm:text-sm border-slate-300 px-4 py-2 text-black bg-slate-100 text-lg outline-none shadow-md rounded-sm" />
                                        <input onChange={(e) => setsignuppassword(e.target.value)} required type="password" placeholder="Enter Password" className="w-[300px]  border-2 max-sm:px-2 max-sm:text-sm border-slate-300 px-4 py-2 text-black bg-slate-100 text-lg outline-none shadow-md rounded-sm" />
                                        <input onChange={(e) => setchecksignuppassword(e.target.value)} required type="password" placeholder="ReEnter Password" className="w-[300px]  border-2 max-sm:px-2 max-sm:text-sm border-slate-300 px-4 py-2 text-black bg-slate-100 text-lg outline-none shadow-md rounded-sm" />
                                        <button type="submit" className="px-4 text-sm m-4 py-1 bg-green-400 font-medium rounded-xl uppercase">Sign Up</button>
                                    </form>
                                    <button className="text-sm cursor-pointer font-semibold text-sky-40 flex gap-2 items-center justify-center group" onClick={() => setEmailSignUp(!emailSignUp)}><IoMdArrowBack className="group-hover:translate-x-[-20px] transition-all duration-500" />All Sign Up Options</button>
                                </section> :
                                    <section className="w-full gap-2 flex flex-col items-center justify-center h-full">
                                        <h1 className="text-2xl font-semibold mb-4">Join vBlog.</h1>
                                        <h1 onClick={() => googleAuth()} className="w-[250px]   flex items-center font-semibold justify-center cursor-pointer gap-2 px-4 py-2 bg-white shadow-xl rounded-3xl"> <FcGoogle className="h-8 w-8 cursor-pointer" /><span>Sign Up With Google</span></h1>
                                        <h1 onClick={() => setEmailSignUp(!emailSignUp)} className=" w-[250px] flex items-center font-semibold justify-center cursor-pointer gap-2 px-4 py-2 bg-white shadow-xl rounded-3xl"> <MdEmail className="h-8 w-8 cursor-pointer" /><span>Sign Up With Email</span></h1>
                                        <h1 className="mt-5">Already have an account  <span className="text-green-400 cursor-pointer font-semibold" onClick={() => setSignUp(!signUp)}>Sign In</span></h1>
                                        <p className="text-sm max-sm:text-[13px] w-[50%]  text-center max-sm:w-[80%]  text-slate-900 mt-5">Click “Sign In” to agree to vBlog’s Terms of Service and acknowledge that vBlog's Privacy Policy applies to you.</p>

                                    </section>
                            }
                        </section> :
                        <section className="w-full gap-2 flex flex-col items-center justify-center h-full">
                            {
                                emailSignIn ?
                                    <section className="w-full gap-2 px-3 flex flex-col items-center justify-center h-full">
                                        <h1 className="text-3xl  font-semibold">Sign In with email</h1>
                                        <p className="text-sm max-sm:text-[13px] max-sm:px-4 text-slate-900 mt-3">Enter the email address associated with your account, and we’ll send a magic link to your inbox, Welcome 🙏.</p>

                                        <form onSubmit={(e) => {
                                            e.preventDefault()
                                            EmailLogin()
                                        }} className="flex m-5  flex-col items-center justify-center gap-2">

                                            <input onChange={(e) => setSigninmail(e.target.value)} required type="email" placeholder="Enter Email " className="w-[300px]  border-2 max-sm:px-2 max-sm:text-sm border-slate-300 px-4 py-2 text-black bg-slate-100 text-lg outline-none shadow-md rounded-sm" />
                                            <input onChange={(e) => setsigninpassword(e.target.value)} required type="password" placeholder="Enter Password" className="w-[300px]  border-2 max-sm:px-2 max-sm:text-sm border-slate-300 px-4 py-2 text-black bg-slate-100 text-lg outline-none shadow-md rounded-sm" />

                                            <button type="submit" className="px-4 text-sm m-4 py-1 bg-green-400 font-medium rounded-xl uppercase">Sign In</button>
                                        </form>
                                        <button className="text-sm cursor-pointer font-semibold text-sky-40 flex gap-2 items-center justify-center group" onClick={() => setEmailSignIn(!emailSignIn)}><IoMdArrowBack className="group-hover:translate-x-[-20px] transition-all duration-500" />All Sign In Options</button>

                                    </section> :
                                    <section className="w-full gap-2 flex flex-col items-center justify-center h-full">
                                        <h1 className="text-2xl font-semibold mb-4">Welcome to VBlog.</h1>
                                        <h1 className="w-[250px]   flex items-center font-semibold justify-center cursor-pointer gap-2 px-4 py-2 bg-white shadow-xl rounded-3xl" onClick={() => googleAuth()}> <FcGoogle className="h-8 w-8" /><span>Sign In With Google</span></h1>
                                        <h1 onClick={() => setEmailSignIn(!emailSignIn)} className=" w-[250px] flex items-center font-semibold justify-center cursor-pointer gap-2 px-4 py-2 bg-white shadow-xl rounded-3xl"> <MdEmail className="h-8 w-8" /><span>Sign In With Email</span></h1>
                                        <h1 className="mt-5">Don't have an account  <span className="text-green-400 cursor-pointer font-semibold" onClick={() => setSignUp(!signUp)}>Create One</span></h1>
                                        <p className="text-sm max-sm:text-[13px] w-[50%]  text-center max-sm:w-[80%]  text-slate-900 mt-5">Click “Sign In” to agree to vBlog's Terms of Service and acknowledge that VBlog's Privacy Policy applies to you.</p>
                                    </section>
                            }




                        </section>
                }




            </section>
        </section>
    )
}

export default AuthModel