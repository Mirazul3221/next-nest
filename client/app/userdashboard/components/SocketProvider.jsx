import storeContext from "@/app/global/createContex";
import { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import {io} from "socket.io-client";
export const socketContext = createContext();


export const SocketProvider = ({children})=>{
const [socket,setSocket] = useState('')
const { store } = useContext(storeContext)
let mysocketUrl = "https://edu-socket.onrender.com";
mysocketUrl = "http://localhost:3001";
useEffect(() => {
    const socketInstance = io(mysocketUrl, {
        query: {
          myId: store.userInfo.id
        },
      });
      setSocket(socketInstance)
    return () => {
        socketInstance.disconnect()
    };
}, []);
return (
    <div >
     <socketContext.Provider value={{bal}}>
         {children}
     </socketContext.Provider>
    </div>
)
}

export const useSocket = ()=>{
    return useContext(socketContext)
}