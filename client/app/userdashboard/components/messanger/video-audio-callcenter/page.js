"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useContext, useState } from "react";
import { useEffect } from "react";
import storeContext from "@/app/global/createContex";
import { useSocket } from "@/app/userdashboard/global/SocketProvider";
import MyVideoStream from "./MyVideoStream";

const Page = () => {
  const data = useSearchParams();
  // const [localStream, setLocalStream] = useState(null);
  const [myFace, setMyFace] = useState(true);
  const [isRing, setIsRing] = useState(true);
  const [isRemoteRing, setIsRemoteRing] = useState(false);
  const [deviceInfo,setDeviceInfo] = useState(null)
  const [localStream,setLocalStram] = useState(null)
  const [toggleVid,setToggleVid] = useState(false)
  const [toggleMick,setToggleMick] = useState(false)
  const {store} = useContext(storeContext)
  const id = data.get("userid");
  const name = data.get("name");
  const profile = data.get("profile");
  const type = data.get("type");
  const action = data.get("action");
  const [callInv,setCallInv] = useState(action)
  //  const invokeSocket = useCallback(()=>{
  //    const {socket} = useSocket()
  //   return socket
  //  },[])
   const {socket} = useSocket()
  if (callInv === 'call-start') {
    socket?.emit('signal-call',{senderId:store.userInfo.id,receiverId:id,name:store.userInfo.name,profile:store.userInfo.profile,type})
  }
 
  useEffect(() => {
    const generateStream = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio:true,
        video: {
          width:{min:320,ideal:1280,max:1920},
          height:{min:180,ideal:720,max:1080},
          frameRate:{min:30, max:90}
         }
      });
      const mike = stream?.getAudioTracks()[0]
      mike.enabled = mike.enabled
      const devices = await navigator.mediaDevices.enumerateDevices()
      setDeviceInfo(devices)
      setLocalStram(stream)
    };

    generateStream();
  }, []);


  const handleCallEnd = () => {
    setIsRemoteRing(false)
    setMyFace(false);
    setIsRing(false)
    socket?.emit("end-call",{id,end:'call-end'})
    socket && socket.on('call-reached',(res)=>{
      console.log(res)
    })
    setCallInv('end-call')
  };
  const handleCallStart = () => {
    setMyFace(true);
    setIsRing(true)
    socket?.emit('signal-call',{senderId:store.userInfo.id,receiverId:id,name:store.userInfo.name,profile:store.userInfo.profile,type})
    setCallInv('call-start')
  };
// useEffect(() => {

// }, [socket]);
useEffect(() => {
  socket && socket.on('call-reached',(res)=>{
    setIsRing(false)
    setIsRemoteRing(true)
  })
  return () => {
    
  };
}, [socket]);

useEffect(() => {
  socket?.on('callStatus',res=>console.log(res))
  return () => {
    socket?.off('callStatus')
  };
}, [socket]);


const toggleVideo = ()=>{
if (localStream) {
  const videoCamera = localStream?.getVideoTracks()[0]
  videoCamera.enabled = !videoCamera.enabled
  setToggleVid(!toggleVid)
}
}
const toggleMike = ()=>{
if (localStream) {
  const mike = localStream?.getAudioTracks()[0]
  mike.enabled = !mike.enabled
  setToggleMick(!toggleMick)
}
}

console.log(callInv)
// const aidioInput = localStream?.getAudioTracks()[0]
if (callInv === 'call-start') {
    return (
      <div className="bg-black w-screen h-screen left-0 fixed justify-center p-10 items-center overflow-x-hidden">
      {myFace && type=== 'Video' && (
        <div className="absolute right-4 top-4 w-3/12 rounded-md h-3/12">
                <MyVideoStream stream={localStream}/>
          <div className="h-[400px] overflow-y-auto">               {
                deviceInfo?.map(info=>{
                  return (
                  !toggleVid &&  <h4 className="text-white mt-4">{info.kind} {info.label}</h4>
                  )
                })
               }</div>
        </div>
      )}

      {
        isRing && <audio autoPlay loop src="/call-ringtone/notification-sound-ringtone-for-phone-163638.mp3"/>
      } {
        isRemoteRing && <audio autoPlay loop src="/call-ringtone/digital-alarm-107256.mp3"/>
      }
      <div className="w-full h-full justify-center flex items-center">
        <div className="relative">
          <img
            className={`border-[10px] duration-500 border-white mx-auto w-48 h-48 shadow-[-1px_5px_40px_0px_white] rounded-full`}
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
          <div className="flex justify-center items-center py-2 px-6 bg-gray-400/15 rounded-md shadow-sm shadow-gray-700">
          <h4 className="text-white w-fit bg-red-500 px-6 rounded-md cursor-pointer" onClick={handleCallEnd}>
            End Call
          </h4>
          <h2 onClick={toggleVideo} className="text-white px-6 py-2 cursor-pointer">{!toggleVid ? 'Disable' : 'Enable'}</h2>
          <button disabled={true} onClick={toggleMike} className="text-white px-6 py-2 cursor-not-allowed">{!toggleMick ? 'Disable Audio' : 'Enable Audio'}</button>
          </div>
        </div>
      </div>
    </div>
    );
} else if (callInv === 'end-call'){
   return(
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
      isRing && <audio autoPlay loop src="/call-ringtone/notification-sound-ringtone-for-phone-163638.mp3"/>
    } {
      isRemoteRing && <audio autoPlay loop src="/call-ringtone/digital-alarm-107256.mp3"/>
    }
    <div className="w-full h-full justify-center flex items-center">
      <div className="relative">
        <img
          className={`border-[10px] border-white mx-auto w-48 h-48 scale-105 ${callInv === 'end-call' && 'scale-75'} duration-500 rounded-full`}
          src={profile}
          alt="profile-image"
        />
        {type === "Video" && (
          <h3 className="text-2xl text-white">
            video call end
          </h3>
        )}
        {type === "Audio" && (
          <h3 className="text-2xl text-white">
            audio call end
          </h3>
        )}
        <h4 className="text-white w-fit bg-green-400 px-6 rounded-md cursor-pointer" onClick={handleCallStart}>
          Call Start
        </h4>
      </div>
    </div>
  </div>
   )
} else if (action === 'call-received'){
  return 'Call is received'
}
};

 const Suspen = ()=>{
  return <Suspense>
    <Page/>
  </Suspense>
}

export default Suspen
