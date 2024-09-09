"use client"
import { useRouter } from "next/navigation";
import { SocketInvocation } from "../userdashboard/components/SocketInvocation";
import { useContext } from "react";
import storeContext from "./createContex";
const ProtectRoute = ({children}) => {
  const { store } = useContext(storeContext)
  const router = useRouter();
    if (store?.userInfo?.id) {
      return <div>
        <SocketInvocation/>
        {children}
        </div>  
    } else {
      router.push("/login")
    }
}

export default ProtectRoute
