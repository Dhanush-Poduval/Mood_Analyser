'use client'
import { Fugaz_One } from 'next/font/google'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Calendar from './Calender';

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] });

export default function Dashboard() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedMood, setSelectedMood] = useState(null)
  const [moodMap, setMoodMap] = useState({})

  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const formatDate = (day) =>
    `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
    }
  }, [router])

  const statuses = {
    num_days: 14,
    time_remaining: `${23 - currentDate.getHours()}H ${60 - currentDate.getMinutes()}M`,
    date: currentDate.toDateString()
  }

  const moods = {
    'Very Sad': '😭',
    'Sad': '🥲',
    'Existing': '😶',
    'Good': '😊',
    'Elated': '😍',
  }

  const moodColors = {
    'Very Sad': 'bg-red-400',
    'Sad': 'bg-orange-400',
    'Existing': 'bg-gray-300',
    'Good': 'bg-green-300',
    'Elated': 'bg-yellow-300'
  }

  const handleMoodClick = (day, mood) => {
    const dateKey = formatDate(day)
    setMoodMap({ ...moodMap, [dateKey]: mood })
  }

  return (
    <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16 p-4'>
      <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg'>
        {Object.keys(statuses).map((status, idx) => (
          <div key={idx} className='flex flex-col gap-1 sm:gap-2'>
            <p className='font-medium capitalize text-xs sm:text-sm truncate'>
              {status.replaceAll('_', ' ')}
            </p>
            <p className={'text-base sm:text-lg truncate ' + fugaz.className}>
              {statuses[status]}{status === 'num_days' ? ' 🔥' : ''}
            </p>
          </div>
        ))}
      </div>

      <h4 className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}>
        How do you <span className='textGradient'>feel</span> today?
      </h4>

      <div className='flex items-stretch flex-wrap gap-4'>
        {Object.keys(moods).map((mood) => (
          <button
            key={mood}
            onClick={() => setSelectedMood(mood)}
            className={`p-4 px-5 rounded-2xl purpleShadow duration-200 flex flex-col items-center gap-2 flex-1 ${
              selectedMood === mood ? 'bg-indigo-400 text-white' : 'bg-indigo-50 hover:bg-indigo-100'
            }`}
          >
            <p className='text-4xl sm:text-5xl md:text-6xl'>{moods[mood]}</p>
            <p className={'text-indigo-500 text-xs sm:text-sm md:text-base ' + fugaz.className}>{mood}</p>
          </button>
        ))}
      </div>
      <div>
        <Calendar />
      </div>

      
    </div>
  )
}
