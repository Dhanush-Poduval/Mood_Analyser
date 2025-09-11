'use client'
import { Fugaz_One } from 'next/font/google'
import React, { useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'

const months = { 'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr', 'May': 'May', 'June': 'Jun', 'July': 'Jul', 'August': 'Aug', 'September': 'Sept', 'October': 'Oct', 'November': 'Nov', 'December': 'Dec' }
const monthsArr = Object.keys(months)
const now = new Date()
const dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] })
const moodColors = {
  'Very Sad': '#a78bfa',
  'Sad': '#8b5cf6',
  'Existing': '#7c3aed',
  'Good': '#6d28d9',
  'Elated': '#5b21b6',
}

export default function Calendar({ completeData, onUpdateMood }) {
  const currMonth = now.getMonth()
  const [selectedMonth, setSelectMonth] = useState(monthsArr[currMonth])
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())

  const numericMonth = monthsArr.indexOf(selectedMonth)

  async function handleUpdate(dayId, newMood) {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('http://127.0.0.1:8000/update_mood', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id: dayId,
          mood: newMood
        })
      })
      const update = await res.json()
      onUpdateMood(dayId, update.mood_set)
    } catch (error) {
      console.log("Error", error)
    }
  }

  // Map completeData keys (YYYY-MM-DD) to easy-to-access format
  const data = {}
  Object.keys(completeData || {}).forEach(dateKey => {
    const [y, m, d] = dateKey.split('-').map(Number)
    if (y === selectedYear && m - 1 === numericMonth) {
      data[d] = completeData[dateKey]
    }
  })

  function handleIncrementMonth(val) {
    if (numericMonth + val < 0) {
      setSelectedYear(curr => curr - 1)
      setSelectMonth(monthsArr[monthsArr.length - 1])
    } else if (numericMonth + val > 11) {
      setSelectedYear(curr => curr + 1)
      setSelectMonth(monthsArr[0])
    } else {
      setSelectMonth(monthsArr[numericMonth + val])
    }
  }

  const firstDayOfMonth = new Date(selectedYear, numericMonth, 1).getDay()
  const daysInMonth = new Date(selectedYear, numericMonth + 1, 0).getDate()
  const numRows = Math.ceil((firstDayOfMonth + daysInMonth) / 7)

  return (
    <div className='flex flex-col gap-2'>
      <div className='grid grid-cols-5 gap-4'>
        <button onClick={() => handleIncrementMonth(-1)} className='mr-auto text-indigo-400 text-lg sm:text-xl duration-200 hover:opacity-60'>Previous</button>
        <p className={'text-center col-span-3 capitalized whitespace-nowrap textGradient ' + fugaz.className}>
          {selectedMonth}, {selectedYear}
        </p>
        <button onClick={() => handleIncrementMonth(+1)} className='ml-auto text-indigo-400 text-lg sm:text-xl duration-200 hover:opacity-60'>Next</button>
      </div>

      <div className='flex flex-col overflow-hidden gap-1 py-4 sm:py-6 md:py-10'>
        {Array.from({ length: numRows }).map((_, rowIndex) => {
          let dayNumber = rowIndex * 7 - firstDayOfMonth + 1
          return (
            <div key={rowIndex} className='grid grid-cols-7 gap-1'>
              {dayList.map((_, colIndex) => {
                if (dayNumber < 1 || dayNumber > daysInMonth) {
                  dayNumber++
                  return <div className='bg-white' key={colIndex} />
                }

                const isToday = dayNumber === now.getDate() && numericMonth === now.getMonth() && selectedYear === now.getFullYear()
                const dayMood = data[dayNumber]
                const color = dayMood ? moodColors[dayMood.mood] : 'white'
                const note = dayMood ? dayMood.content : ''
                const dayId = dayMood ? dayMood.id : null

                const renderedDay = dayNumber
                dayNumber++

                return (
                  <div
                    key={colIndex}
                    style={{ background: color }}
                    title={note}
                    className={
                      'text-xs sm:text-sm border border-solid p-2 flex flex-col items-center justify-center rounded-lg relative ' +
                      (isToday ? ' border-indigo-500 font-bold' : ' border-indigo-200') +
                      (color === 'white' ? ' text-indigo-500' : ' text-white')
                    }
                  >
                    <p>{renderedDay}</p>
                    {dayMood && (
                      <div className="flex gap-1 absolute bottom-1 right-1">
                        <Edit
                          size={14}
                          className="text-white cursor-pointer hover:text-yellow-300"
                          onClick={() => {
                            const newMood = prompt(
                              "Choose a new mood (Very Sad, Sad, Existing, Good, Elated):",
                              dayMood.mood
                            )
                            if (newMood && dayId) handleUpdate(dayId, newMood)
                          }}
                        />
                        <Trash2
                          size={14}
                          className="text-white cursor-pointer hover:text-red-500"
                          onClick={() => handleDelete(dayNumber)}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
