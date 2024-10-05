"use client"
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import storeContext from "./createContex";
import { useSocket } from "../userdashboard/global/SocketProvider";
import CallReceiverRoom from "../userdashboard/components/messanger/video-audio-callcenter/CallReceiverRoom";
export const MYONLINEFRIEND = []
const ProtectRoute = ({children}) => {
  const { store } = useContext(storeContext)
  const [window, setWindow] = useState(false)
  const [data,setData] = useState(null)
  const router = useRouter()
  const {socket} = useSocket()
  useEffect(() => {
   socket && socket.emit("myUserInfo",{id:store.userInfo.id,name:store.userInfo.name})
    return () => {
      socket?.disconnect()
    };
  }, []);

  useEffect(() => {
    socket?.on('signal-call',(data)=>{
      setWindow(true)
      setData(data)
    })
    return () => {
      socket?.off("signal-call")
    };
  }, [socket]);
  const protectRouter = ()=>{
    router.push("/login")
  }
    if (store?.userInfo?.id) {
      return <div>
        {
          window && <CallReceiverRoom remoteUser={{name:data?.name,profile:data?.profile,type:data.type,ring:window}} />
        }
        {children}
        </div>  
    } else {
      protectRouter()
    }
}

export default ProtectRoute
//
