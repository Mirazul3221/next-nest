import { baseurl } from '@/app/config';
import storeContext from '@/app/global/createContex';
import React, { useContext, useEffect, useState } from 'react'
import { io } from "socket.io-client";

export let SOCKET = {};
export let MYONLINEFRIEND = [];
export const SocketInvocation = () => {
  const { store } = useContext(storeContext)
  let mysocketUrl = 'https://edu-socket.onrender.com';
  mysocketUrl = 'http://localhost:3001'

  useEffect(() => {
    const socket = io(mysocketUrl,{query : {
      userId : store.userInfo.id
      }})
      SOCKET.ROOT = socket
     socket.emit("alert-message","user is trying to connect my server....")
     socket.on('send-msg',m=>{
      alert(m)
     })
      socket.on("onlineFriends",((data)=>{
        data.map(u=> MYONLINEFRIEND.push(u))
      }))
  }, []);
    // console.log(socket)
  return (
    <div className="hidden">Socket</div>
  )
}



