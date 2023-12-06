import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/DemoNavbar'

const inter = Inter({ subsets: ['latin'] })
import Context from './Context/Context'
import HomeNavbar from './components/HomeNavbar'
import Footer from './components/Footer'
export const metadata = {
  title: 'vBlog',
  description: 'Shares the Knowledge',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>

        <Context>
          <div className='w-full'>  <HomeNavbar /></div>
          <div className=''>
            {children}
          </div>
          <Footer />
        </Context>

      </body>
    </html>
  )
}
