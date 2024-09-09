import { baseurl } from '@/app/config';
import storeContext from '@/app/global/createContex';
import React, { useContext, useEffect } from 'react'
import { io } from "socket.io-client";

export let SOCKET = {};
export const SocketInvocation = () => {
  const { store } = useContext(storeContext)
  useEffect(() => {
    const socket = io(`${baseurl}`,{query : {
      userId : store.userInfo.id
      }})
      SOCKET.ROOT = socket
  }, []);
    // console.log(socket)
  return (
    <div className="hidden">Socket</div>
  )
}



