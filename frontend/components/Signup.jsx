'use client'
import React,{useState} from 'react'
import { Fugaz_One } from 'next/font/google'
import Button from './Button'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const fugaz=Fugaz_One({subsets:["latin"],weight:['400']});

export default function Signup() {
      const [email,setEmail]=useState("");
      const [password,setPassword]=useState("");
      const [name,setName]=useState("");
      const [error,setError]=useState("");
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
              const res=await fetch('http://127.0.0.1:8000/signup',{
                  method:'POST',
                  headers:{
                      'Content-Type':'application/JSON'
                  },
                  body:JSON.stringify({
                      name:name,
                      email:email,
                      password:password
                  })
              })
              const data=await res.json();
              console.log("JWT_token",data.access_token)
              localStorage.setItem('token',data.access_token)
              if (data.access_token==null){
                const text="Email already registered with the account"
                setError(text)

              }
              if(data.access_token!=null){
                 router.push("/dashboard")
              }

             
  
          }catch(error){
              console.log("Error",error)
          }
      }
  return (
    <div className='flex flex-col items-center justify-center gap-4 mr-5 ml-5 sm:mr-0 sm:ml-0'>
        <h3 className={`text-4xl sm:text-5xl md:text-6xl ${fugaz.className} text-gray-400`}>
            SignUp
        </h3>
        <p className='text-gray-600'>Create Your Account</p>
        <input 
          className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none' placeholder='Name' onChange={(e)=>{setName(e.target.value);console.log(e.target.value)}}
        />
        <input 
          className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none' placeholder='Email' onChange={handleEmail}
        />
        <input 
          className='w-full max-w-[400px] mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none' placeholder='Password' type='password'
          onChange={handlePassword}
        />
        <div className='max-w-[400px] w-full mx-auto'>
            <Button text='Submit' full onClick={handleSubmit}/>
        </div>
        <Link href='/login'>
          <div className='flex flex-row gap-2 justify-center items-center'>
               <p className='text-center'>Already have an account </p>
               <button className='text-indigo-600'>Log in</button>
               

          </div>
          {error}
         
          
        </Link>
    </div>
  )
}
