'use client'

import { useContext, useState } from "react";
import { BlogContext } from "../Context/Context";
import { useRouter } from "next/navigation";

const About = () => {
    const { pop, setPop, currentUser } = useContext(BlogContext)

    const router = useRouter()
    return (
        <section>
            <div className="w-full flex justify-center items-center px-4 py-8">
                <div className=" shadow-lg rounded-lg overflow-hidden">
                    <div className="p-8">
                        <h2 className="block text-2xl text-gray-800 font-bold mb-6">NOTE</h2>
                        <p className="text-gray-600 mb-4">
                            Welcome to vBlog, a professional educational knowledge sharing application.
                            <span className='text-red-400'> We are currently in the testing phase, and I appreciate your support and patience. </span>
                            If you encounter any <span className="text-red-400">errors</span> while using the application, please kindly skip them and
                            continue exploring our content. Your support is highly valued, and we are committed
                            to providing a seamless experience for all our users.
                        </p>
                        <p className="text-gray-600">
                            Our mission is to create a platform where students can share their knowledge
                            and insights with a wider audience. Whether you're looking to learn something new
                            or share your expertise, vBlog is the place for you. Join us on this journey of
                            learning and growth.
                        </p>
                        <p className='text-gray-600'>The Future updates includes Group Chat, mobile version etc!</p>
                        <p className='text-gray-600'>The Webiste is Fullstack App developed by <button onClick={() => {
                            if (currentUser?.uid) {
                                router.push('profile/evCegXgs3bNn95iqpkAWn7nfNgE2')
                            } else {
                                setPop(!pop)
                            }
                        }}><button className="text-sky-400">VARMA</button></button> using tools React,Tailwind-CSS, AWS and Firebase.</p>
                        <p className="mt-3">Thank You 🙏</p>
                        <button onClick={() => router.push('/')} className="px-4 py-1 text-sm bg-green-400 text-white uppercase font-semibold rounded-full">Back</button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;
