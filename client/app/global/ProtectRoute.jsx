"use client"
import { useRouter } from "next/navigation";
import { useContext } from "react";
import storeContext from "./createContex";
export const MYONLINEFRIEND = []
const ProtectRoute = ({children}) => {
  const { store ,socketConnection } = useContext(storeContext)
  socketConnection?.on("onlineFriends",((data)=>{
    data.map(u=> MYONLINEFRIEND.push(u))
  }))
  const router = useRouter();
  const protectRoute = ()=>{
    router.push("/login")
  }
    if (store?.userInfo?.id) {
      return <div>
        {children}
        </div>  
    } else {
      protectRoute()
    }
}

export default ProtectRoute
