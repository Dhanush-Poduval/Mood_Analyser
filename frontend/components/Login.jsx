'use client'
import { Fugaz_One } from 'next/font/google';
import React, { useState } from 'react'
import Button from './Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Login() {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const router=useRouter();
    const handleEmail=(e)=>{
       const text=e.target.value;
       setEmail(text)
       console.log(text)
    }
    const handlePassword=(e)=>{
        const text=e.target.value;
        setPassword(text)
        console.log(text)
    }
    const handleSubmit=async()=>{
        try{
            const res=await fetch('http://127.0.0.1:8000/login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                body:new URLSearchParams({
                    username:email,
                    password:password
                })
            })
            const data=await res.json();
            console.log("JWT_token",data.access_token)
            localStorage.setItem('token',data.access_token)
            router.push("/dashboard")

        }catch(error){
            console.log("Error",error)
        }
    }
    return (
        <div className='flex flex-col flex-1 justify-center items-center gap-4 ml-5 mr-5 sm:ml-0 sm:mr-0'>
            <h3 className={`text-4xl sm:text-5xl md:text-6xl ${fugaz.className} text-gray-400`} >Log In</h3>
            <p className='text-gray-600'>You&#39;re one step away!</p>
            <input 
               
             className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none' placeholder='Email' onChange={handleEmail}/>
            <input  className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none' placeholder='Password' type='password' onChange={handlePassword}/>
            <div className='max-w-[400px] w-full mx-auto'>
                <Button  text= "Submit" full onClick={handleSubmit}/>
            </div>
            <Link href="/signup">
                <p className='text-center'>Don't have an account? <button  className='text-indigo-600'>Sign up</button></p>
            </Link>
            
        </div>
    )
}