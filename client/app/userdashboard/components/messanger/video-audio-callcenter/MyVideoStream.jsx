'use client'
import React, { useRef } from 'react'

const MyVideoStream = ({stream}) => {
    const localuserRef = useRef(null);
    if (stream &&  localuserRef.current) {
       localuserRef.current.srcObject = stream;
    }
  return (
    <video
    style={{ borderRadius: "10px" }}
    ref={localuserRef}
    autoPlay
    className="w-full h-ful"
  />
  )
}

export default MyVideoStream
