import React from 'react'
import { Fugaz_One } from 'next/font/google'
import Button from './Button'
const fugaz=Fugaz_One({subsets:["latin"],weight:['400']});

export default function Signup() {
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
        <h3 className={`text-4xl sm:text-5xl md:text-6xl ${fugaz.className}`}>
            SignUp
        </h3>
        <p>Create Your Account</p>
    </div>
  )
}
