'use client'


import { BlogContext } from './Context/Context';
import { useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home';
const page = () => {
  const { currentUser } = useContext(BlogContext)
  return (
    <>

      <section>

        <Home />

        <ToastContainer />
      </section>

    </>
  )
}

export default page