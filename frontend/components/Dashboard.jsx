'use client'
import { Fugaz_One } from 'next/font/google';
import React, { useEffect, useState } from 'react'
import Calendar from './Calender';
import { Input} from './ui/input';
import { Button } from './ui/button';





const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });


export default function Dashboard() {
  const [moody , setMood]=useState("")
  const[content,setContent]=useState("")
  const[timeline,setTimeline]=useState({});

  const handleContent=(e)=>{
    const data=e.target.value;
    setContent(data)
    console.log(data)
  }
useEffect(() => {
  const token = localStorage.getItem('token')
  async function fetchTimeline() {
    try {
      const res = await fetch('http://127.0.0.1:8000/moods', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error("Failed to fetch moods")
      const data = await res.json()

      const formatted = {}
      data.forEach(entry => {
        const dateKey = new Date(entry.created_at)
          .toISOString()
          .split("T")[0];
        formatted[dateKey] = { mood: entry.mood_set, content: entry.content }
      })

      setTimeline(formatted)
    } catch (err) {
      console.error("Error loading moods:", err)
    }
  }

  fetchTimeline()
}, [])

  const handleSubmit=async()=>{
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${(today.getMonth()+1)
    .toString()
    .padStart(2,'0')}-${today.getDate().toString().padStart(2,'0')}`;
    const token=localStorage.getItem('token')
    try{
        const res=await fetch('http://127.0.0.1:8000/add_mood',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
            mood:moody,
            content:content,
            
        })
        
      })
      const data=await res.json();
      setTimeline(prev=>({...prev,[dateKey]:{mood:moody,content}}));
      setMood('')
      setContent('')


    }catch(error){
       console.log("error",error);
       alert('Error Saving Mood')
    }
   

  }
  
  const now = new Date()

  

  const statuses = {
    num_days:14,
    time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`,
    date:new Date().toDateString()
  }

  

    
      



  const moods = {
    'Very Sad': '😭',
    'Sad': '🥲',
    'Existing': '😶',
    'Good': '😊',
    'Elated': '😍',
  }

  
  
  return (
    <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>
      <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg'>
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div key={statusIndex} className=' flex flex-col gap-1 sm:gap-2'>
              <p className='font-medium capitalize text-xs sm:text-sm truncate'>{status.replaceAll('_', ' ')}</p>
              <p className={'text-base sm:text-lg truncate ' + fugaz.className}>{statuses[status]}{status === 'num_days' ? ' 🔥' : ''}</p>
            </div>
          )
        })}
      </div>
      <h4 className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}>
        How do you <span className='textGradient'>feel</span> today?
      </h4>
      <div className='flex items-stretch flex-wrap gap-4'>
        {Object.keys(moods).map((mood, moodIndex) => {
          return (
            <button onClick={()=>setMood(mood)}  className={'p-4 px-5 rounded-2xl purpleShadow duration-200 bg-indigo-50 hover:bg-indigo-100 text-center flex flex-col items-center gap-2 flex-1 '} key={moodIndex}>
              <p className='text-4xl sm:text-5xl md:text-6xl'>{moods[mood]}</p>
              <p className={'text-indigo-500 text-xs sm:text-sm md:text-base ' + fugaz.className}>{mood}</p>
            </button>
           
          )
        })}
        {moody ? (  <div className="flex w-full max-w-sm items-center gap-2">
      <Input type="" placeholder={`Why Feeling ${moody}`} onChange={handleContent}/>
      <Button type="submit" variant="outline" onClick={handleSubmit}>
        Add Mood
      </Button>
    </div>
):""}
        
      </div>
      <Calendar completeData={timeline}/>
    </div>
    
  )
}