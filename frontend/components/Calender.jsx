'use client'
import { Fugaz_One } from 'next/font/google'
import React, { useState } from 'react'

const months = { 'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr', 'May': 'May', 'June': 'Jun', 'July': 'Jul', 'August': 'Aug', 'September': 'Sept', 'October': 'Oct', 'November': 'Nov', 'December': 'Dec' }
const monthsArr = Object.keys(months)
const now = new Date()
const dayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] })

// 💜 Purple shades for moods
const moodColors = {
  'Very Sad': '#a78bfa',   // light purple
  'Sad': '#8b5cf6',        // medium purple
  'Existing': '#7c3aed',   // darker purple
  'Good': '#6d28d9',       // deep purple
  'Elated': '#5b21b6',     // darkest purple
}

export default function Calendar(props) {
  const { completeData } = props
  const currMonth = now.getMonth()
  const [selectedMonth, setSelectMonth] = useState(Object.keys(months)[currMonth])
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())

  const numericMonth = monthsArr.indexOf(selectedMonth)
  // Expect flat data like { "2025-09-11": { mood, content } }
const data = {}
Object.keys(completeData || {}).forEach(dateKey => {
  const [y, m, d] = dateKey.split("-").map(Number)
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

  const monthNow = new Date(selectedYear, Object.keys(months).indexOf(selectedMonth), 1)
  const firstDayOfMonth = monthNow.getDay()
  const daysInMonth = new Date(selectedYear, monthsArr.indexOf(selectedMonth) + 1, 0).getDate()
  const daysToDisplay = firstDayOfMonth + daysInMonth
  const numRows = (Math.floor(daysToDisplay / 7)) + (daysToDisplay % 7 ? 1 : 0)

  return (
    <div className='flex flex-col gap-2'>
      {/* Header */}
      <div className='grid grid-cols-5 gap-4'>
        <button onClick={() => handleIncrementMonth(-1)} className='mr-auto text-indigo-400 text-lg sm:text-xl duration-200 hover:opacity-60'>Previous</button>
        <p className={'text-center col-span-3 capitalized whitespace-nowrap textGradient ' + fugaz.className}>{selectedMonth}, {selectedYear}</p>
        <button onClick={() => handleIncrementMonth(+1)} className='ml-auto text-indigo-400 text-lg sm:text-xl duration-200 hover:opacity-60'>Next</button>
      </div>

      {/* Calendar Grid */}
      <div className='flex flex-col overflow-hidden gap-1 py-4 sm:py-6 md:py-10'>
        {[...Array(numRows).keys()].map((row, rowIndex) => {
          return (
            <div key={rowIndex} className='grid grid-cols-7 gap-1'>
              {dayList.map((dayOfWeek, dayOfWeekIndex) => {
                let dayIndex = (rowIndex * 7) + dayOfWeekIndex - (firstDayOfMonth - 1)

                let dayDisplay = dayIndex > daysInMonth ? false : (row === 0 && dayOfWeekIndex < firstDayOfMonth) ? false : true
                let isToday = dayIndex === now.getDate() && selectedMonth === monthsArr[currMonth] && selectedYear === now.getFullYear()

                if (!dayDisplay) {
                  return <div className='bg-white' key={dayOfWeekIndex} />
                }

                // 🎨 Apply mood color
                let dayMood = data?.[dayIndex]
                let color = dayMood ? moodColors[dayMood.mood] : "white"
                let note = dayMood ? dayMood.content : ""

                return (
                  <div
                    style={{ background: color }}
                    className={
                      'text-xs sm:text-sm border border-solid p-2 flex items-center justify-center rounded-lg relative ' +
                      (isToday ? ' border-indigo-500 font-bold' : ' border-indigo-200') +
                      (color === "white" ? ' text-indigo-500' : ' text-white')
                    }
                    key={dayOfWeekIndex}
                    title={note}
                  >
                    <p>{dayIndex}</p>
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
