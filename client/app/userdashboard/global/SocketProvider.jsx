'use client'
import React, { useCallback, useContext, useState } from 'react'
import { useEffect } from 'react'
import { io } from 'socket.io-client';
import socketContext from './socketContext'
import storeContext from '@/app/global/createContex';
const SocketProvider = ({children}) => {
let mysocketUrl = "https://edu-socket.onrender.com";
mysocketUrl = "http://localhost:3001";
const { store } = useContext(storeContext)
const [socket,setSocket] = useState(null)
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
    })
    return () => {
       socket?.off('onlineFriends') 
    };
}, [socket]);

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
