import React from 'react'
import { Fugaz_One } from 'next/font/google'
import Button from './Button'
import Link from 'next/link';
const fugaz=Fugaz_One({subsets:["latin"],weight:['400']});

export default function Signup() {
  return (
    <div className='flex flex-col items-center justify-center gap-4 mr-5 ml-5 sm:mr-0 sm:ml-0'>
        <h3 className={`text-4xl sm:text-5xl md:text-6xl ${fugaz.className} text-gray-400`}>
            SignUp
        </h3>
        <p className='text-gray-600'>Create Your Account</p>
        <input 
          className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none' placeholder='Name'
        />
        <input 
          className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none' placeholder='Email'
        />
        <input 
          className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none' placeholder='Password' type='password'
        />
        <div className='max-w-[400px] w-full mx-auto'>
            <Button text='Submit' full />
        </div>
        <Link href='/login'>
          <div className='flex flex-row gap-2 justify-center items-center'>
               <p className='text-center'>Already have an account </p>
               <button className='text-indigo-600'>Log in</button>

          </div>
         
          
        </Link>
    </div>
  )
}
