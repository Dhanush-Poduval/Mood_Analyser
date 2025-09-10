'use client'
import { Fugaz_One } from 'next/font/google';
import React from 'react'
import Button from './Button';
import Link from 'next/link';
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Login() {
    return (
        <div className='flex flex-col flex-1 justify-center items-center gap-4 ml-5 mr-5 sm:ml-0 sm:mr-0'>
            <h3 className={`text-4xl sm:text-5xl md:text-6xl ${fugaz.className} text-gray-400`} >Log In</h3>
            <p className='text-gray-600'>You&#39;re one step away!</p>
            <input 
               
             className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none' placeholder='Email' />
            <input  className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none' placeholder='Password' type='password' />
            <div className='max-w-[400px] w-full mx-auto'>
                <Button  text= "Submit" full />
            </div>
            <Link href="/signup">
                <p className='text-center'>Don't have an account? <button  className='text-indigo-600'>Sign up</button></p>
            </Link>
            
        </div>
    )
}