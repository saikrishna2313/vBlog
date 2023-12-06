import React, { useState } from 'react'
import { LuChevronDown } from "react-icons/lu";
const Faq = ({ q }) => {
    const [pop, setPop] = useState(false)
    return (
        <section onClick={() => setPop(!pop)} className='flex flex-col cursor-pointer gap-4 m-2 shadow-lg bg-slate-50 px-20 max-sm:px-3 py-5'>
            <div className='w-full flex justify-between items-center'> <h1 className='text-lg font-semibold '>{q.question}</h1>
                <button><LuChevronDown className={`h-6 w-6 ${pop ? 'rotate-180 transition-all duration-500' : "rotate-0 transition-all duration-500"}`} /></button></div>
            {
                pop && <div>
                    <p className='text-sm text-slate-800'>{q.answer}</p>

                </div>
            }
        </section>

    )
}

export default Faq