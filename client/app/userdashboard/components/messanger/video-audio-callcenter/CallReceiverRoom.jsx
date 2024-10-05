import React, { useEffect } from 'react'
const CallReceiverRoom = ({remoteUser}) => {
  const {name,profile,type,ring} = remoteUser
  useEffect(() => {
    const audio = new Audio('/call-ringtone/nokia-1600-47764.mp3')
    const autoPlay =async ()=>{
       try {
         await audio.play()
         audio.loop = true
       } catch (error) {
          console.log(error)
       }
    }
    autoPlay()
    return () => {
      audio.pause()
      audio.currentTime = 0
    };
  }, []);

  return (
    <div className='w-screen h-screen bg-gray-300/60 text-white fixed flex justify-center items-center left-0 top-0 z-40'>
        <div className="w-1/3 h-1/2 rounded-md shadow-md bg-white justify-center flex items-center">
        <div className="relative">
          <h2>{profile}</h2>
          <img
            className="border-[3px] border-white mx-auto w-32 h-32 shadow-[-1px_5px_40px_0px_gray] rounded-full"
            src={profile}
            alt="profile-image"
          />
          {type === "Video" && (
            <h3 className="text-2xl text-gray-500">
              You are in video call with {name}
            </h3>
          )}
          {type === "Audio" && (
            <h3 className="text-2xl text-gray-500">
              You are in audio call with {name}
            </h3>
          )}
      <div className="flex justify-center items-center gap-4 mt-6">
      <h4 className="text-white w-fit bg-red-500 px-6 rounded-md cursor-pointer" >
            End Call
          </h4>
          <h4 className="text-white w-fit bg-green-500 px-6 rounded-md cursor-pointer" >
            Receive Call
          </h4>
      </div>
        </div>
      </div>
    </div>
  )
}

export default CallReceiverRoom
