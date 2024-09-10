import { baseurl } from '@/app/config';
import storeContext from '@/app/global/createContex';
import React, { useContext, useEffect, useState } from 'react'
import { io } from "socket.io-client";

export let SOCKET = {};
export let MYONLINEFRIEND = [];
export const SocketInvocation = () => {
  const { store } = useContext(storeContext)
  useEffect(() => {
    const socket = io('ws://localhost:3221/',{query : {
      userId : store.userInfo.id
      }})
      SOCKET.ROOT = socket

      socket.on("onlineFriends",((data)=>{
        data.map(u=> MYONLINEFRIEND.push(u))
      }))
  }, []);
    // console.log(socket)
  return (
    <div className="hidden">Socket</div>
  )
}



