"use client"
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import storeContext from "./createContex";
import { invokeSocket } from "./socketInvocation";
export const MYONLINEFRIEND = []
const ProtectRoute = ({children}) => {
  const { store } = useContext(storeContext)
  const router = useRouter()
  useEffect(() => {
    const socket = invokeSocket()
    socket.emit("myUserInfo",{id:store.userInfo.id,name:store.userInfo.name})
    return () => {
      socket.disconnect()
    };
  }, []);
  const protectRouter = ()=>{
    router.push("/login")
  }
    if (store?.userInfo?.id) {
      return <div>
        {children}
        </div>  
    } else {
      protectRouter()
    }
}

export default ProtectRoute
//
