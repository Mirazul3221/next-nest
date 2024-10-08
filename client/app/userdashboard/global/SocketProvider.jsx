'use client'
import React, { useCallback, useContext, useState } from 'react'
import { useEffect } from 'react'
import { io } from 'socket.io-client';
import socketContext from './socketContext'
import storeContext from '@/app/global/createContex';
const SocketProvider = ({children}) => {
let mysocketUrl = "https://edu-socket.onrender.com";
// mysocketUrl = "http://localhost:3001";
const { store } = useContext(storeContext)
const [socket,setSocket] = useState(null)
const [localStream,setLocalStram] = useState(null)
const [myActiveFriends,setMyActiveFriends] = useState(null)
useEffect(() => {
    const socketInstance = io(mysocketUrl, {
        query: {
          myId: store?.userInfo?.id
        },
      });
      setSocket(socketInstance)
      socketInstance?.emit("myUserInfo",{id:store?.userInfo?.id,name:store.userInfo.name})
    return () => {
        socketInstance.disconnect()
    };
}, []);

useEffect(() => {
   socket && socket.on('onlineFriends',(res)=>{
        setMyActiveFriends(res)
        console.log(res)
    })
    return () => {
       socket?.off('onlineFriends') 
    };
}, [socket]);
console.log(socket)

const testAlert = ()=>{
  alert("I am from socket provider")
}

/////////////////////All logic for webRTC///////////////////////////
    // const getMediaStream = useCallback(async (faceMode)=>{
    //   if (localStream) {
    //       return localStream
    //   }
    //   try {
    //      const devices = await navigator.mediaDevices.enumerateDevices()
    //      const videoDevices = devices?.filter(device => device.kind = 'videoinput')
    //      const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:{
    //       width:{min:320,ideal:1280,max:1920},
    //       height:{min:180,ideal:720,max:1080},
    //       frameRate:videoDevices.length > 0 ? faceMode : undefined
    //      }})
    //       setLocalStram(stream)
    //       return stream
    //   } catch (error) {
    //     console.log(error)
    //     setLocalStram(null)
    //     return null
    //   }
    // },[
    //    localStream
    // ])
////////////////////////////////////////////////////////////////////
  return (
    <socketContext.Provider value={{socket,myActiveFriends}}>
        {children}
    </socketContext.Provider>
  )
}

export default SocketProvider

export const useSocket = () => {
    const socketCall = useContext(socketContext)
    return socketCall && socketCall
}
