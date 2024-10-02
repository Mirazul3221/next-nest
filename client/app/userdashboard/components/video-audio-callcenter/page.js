'use client'
import { useSearchParams } from 'next/navigation';
import React from 'react'

const Page = () => {

    if(typeof window !== 'undefined'){
        const data = useSearchParams();
        console.log(data)
      }
  return (
    <div>
        hello
    </div>
  )
}

export default Page
