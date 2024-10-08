import storeContext from '@/app/global/createContex';
import { useSocket } from '@/app/userdashboard/global/SocketProvider';
import React, { useContext, useEffect, useState } from 'react'
const CallReceiverRoom = () => {
  const {socket} = useSocket()
  const {store} = useContext(storeContext)
  const [window, setWindow] = useState(true)
  const [cancleWindow,setCancleWindow] = useState(false)
  const [data,setData] = useState(null)
  const audio = new Audio('/call-ringtone/nokia-1600-47764.mp3')
  const autoPlay =async ()=>{
    try {
      await audio.play()
      audio.loop = true
    } catch (error) {
       console.log(error)
    }
 }
// window && autoPlay()


  useEffect(() => {
    socket?.on('signal-call',(data)=>{
      setCancleWindow(true)
      setWindow(true)
        setData(data)
    })
    return () => {
      socket?.off("signal-call")
    };
  }, [socket]);

  useEffect(() => {
    socket?.on('end-call-signal',(res)=>{
       if (res) {
         setWindow(false)
       }
    })
    return () => {
      socket?.off("end-call-signal")
    };
  }, [socket]);
  
  const handleReceivecall = ()=>{
    socket?.emit('callStatus',{id:data?.senderId,msg:'call-received'})
  }

  const cancleCall = ()=>{
    socket?.emit('callStatus',{id:data?.senderId,msg:'call-cancle'})
  }
  return (
     <div>
       {
        cancleWindow &&    <div>
        {
          window ? <div className='w-screen h-screen bg-gray-300/60 text-white fixed flex justify-center items-center left-0 top-0 z-40'>
          <div className="md:w-1/3 md:h-1/2 w-full h-full rounded-md shadow-md bg-gray-50/90 md:bg-white justify-center flex items-center">
          <div className="relative">
            <img
              className="border-[3px] border-white mx-auto w-32 h-32 shadow-[-1px_5px_40px_0px_gray] rounded-full"
              src={data?.profile}
              alt="profile-image"
            />
            {data?.type === "Video" && (
              <h3 className="text-md md:text-2xl text-gray-500 text-center">
                You are in video call with {data?.name}
              </h3>
            )}
            {data?.type === "Audio" && (
              <h3 className="text:md md:text-2xl text-gray-500 text-center">
                You are in audio call with {data?.name}
              </h3>
            )}
        <div className="flex justify-center items-center gap-4 mt-3 md:mt-6">
        <h4 onClick={()=>{
          setCancleWindow(false)
          cancleCall()
        }} className="text-white w-fit bg-red-500 px-6 rounded-md cursor-pointer" >
              Decline
            </h4>
            <h4 onClick={handleReceivecall} className="text-white w-fit bg-green-500 px-6 rounded-md cursor-pointer" >
               <a target='_blank' href={`/userdashboard/components/messanger/video-audio-callcenter?userid=${encodeURIComponent(data?.senderId)}&name=${encodeURIComponent(data?.name)}&profile=${data?.profile}&title=${data?.title}&type=${data?.type}&action=call-received`}> Receive Call</a>
            </h4>
        </div>
          </div>
        </div>
        <audio autoPlay loop src="/call-ringtone/nokia-1600-47764.mp3"></audio>
      </div> : <div className='w-screen h-screen bg-gray-300/60 text-white fixed flex justify-center items-center left-0 top-0 z-40'>
          <div className="md:w-1/3 md:h-1/2 w-full h-full rounded-md shadow-md bg-gray-50/90 md:bg-white justify-center flex items-center">
          <div className="relative">
            <img
              className="border-[3px] border-white mx-auto w-32 h-32 shadow-[-1px_5px_40px_0px_gray] rounded-full"
              src={data?.profile}
              alt="profile-image"
            />
            {data?.type === "Video" && (
              <h3 className="text-md md:text-2xl text-gray-500 text-center">
                You are in video call with {data?.name}
              </h3>
            )}
            {data?.type === "Audio" && (
              <h3 className="text:md md:text-2xl text-gray-500 text-center">
                You are in audio call with {data?.name}
              </h3>
            )}
        <div className="flex justify-center items-center gap-4 mt-3 md:mt-6">
        <h4 onClick={()=>{
          setCancleWindow(false)
        }} className="text-white w-fit bg-red-500 px-6 rounded-md cursor-pointer" >
            Decline
            </h4>
            <h4 className="text-white w-fit bg-green-500 px-6 rounded-md cursor-pointer" >
               <a target='_blank' href={`/userdashboard/components/messanger/video-audio-callcenter?userid=${encodeURIComponent(data?.senderId)}&name=${encodeURIComponent(data?.name)}&profile=${data?.profile}&title=${data?.title}&type=${data?.type}&action=call-start`}> start Call</a>
            </h4>
        </div>
          </div>
        </div>
      </div> 
        }
       </div>
       }
     </div>
  )
}

export default CallReceiverRoom
