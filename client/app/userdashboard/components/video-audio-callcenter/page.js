"use client";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { useSocket } from "../../global/SocketProvider";
import storeContext from "@/app/global/createContex";

const Page = () => {
  const data = useSearchParams();
  const localuserRef = useRef(null);
  // const [localStream, setLocalStream] = useState(null);
  const [myFace, setMyFace] = useState(true);
  const [isRing, setIsRing] = useState(true);
  const {store} = useContext(storeContext)
  const id = data.get("userid");
  const name = data.get("name");
  const profile = data.get("profile");
  const type = data.get("type");
  //  const invokeSocket = useCallback(()=>{
  //    const {socket} = useSocket()
  //   return socket
  //  },[])
   const {socket} = useSocket()
  useEffect(() => {
    const generateStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      localuserRef.current.srcObject = stream;
    };

    generateStream();
    socket?.emit('signal-call',{senderId:store.userInfo.id,receiverId:id,name:store.userInfo.name,profile:store.userInfo.profile,type})
  }, [socket]);
  const handleCallEnd = () => {
    setMyFace(false);
    setIsRing(false)
    socket?.emit("end-call",{id,end:'call-end'})
  };

  socket?.on('signal-call',(res)=>{
    console.log(res)
})
  return (
    <div className="bg-black w-screen h-screen left-0 fixed justify-center p-10 items-center overflow-x-hidden">
      {myFace && type=== 'Video' && (
        <div className="absolute right-4 top-4 w-3/12 rounded-md h-3/12">
          <video
            style={{ borderRadius: "10px" }}
            ref={localuserRef}
            autoPlay
            className="w-full h-ful"
          />
        </div>
      )}

      {
        myFace && <audio autoPlay loop src="/call-ringtone/notification-sound-ringtone-for-phone-163638.mp3"/>
      }
      <div className="w-full h-full justify-center flex items-center">
        <div className="relative">
          <img
            className="border-[10px] border-white mx-auto w-48 h-48 shadow-[-1px_5px_40px_0px_white] rounded-full"
            src={profile}
            alt="profile-image"
          />
          {type === "Video" && (
            <h3 className="text-2xl text-white">
              You are in video call with {name}
            </h3>
          )}
          {type === "Audio" && (
            <h3 className="text-2xl text-white">
              You are in audio call with {name}
            </h3>
          )}
          <h4 className="text-white w-fit bg-red-500 px-6 rounded-md cursor-pointer" onClick={handleCallEnd}>
            End Call
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Page;
