"use client";
import { baseurl } from "@/app/config";
import storeContext from "@/app/global/createContex";
import { MYONLINEFRIEND } from "@/app/global/ProtectRoute";
import { invokeSocket } from "@/app/global/socketInvocation";
import axios from "axios";
import HTMLReactParser from "html-react-parser";
import React, { useContext, useRef, useState } from "react";
import { useEffect } from "react";

const MyCurrentMessage = ({onlineUser, receiverId,receiverName,profile,title,status,desc, msg}) => {
  const { store ,socketConnection } = useContext(storeContext);
  const [msgStatus, setMsgStatus] = useState("sending...");
  const [loader, setLoader] = useState(false);
  const removeMsgRef = useRef(null)
  const sendMessageToMyFriend = async () => {
    const socket = invokeSocket()
    try {
      const urlPattern = /(https?:\/\/[^\s]+)/g; // Regex to detect links
      // Split the message and replace links with anchor tags
      const parts = msg.message.split(urlPattern).map((part, index) => {
        if (urlPattern.test(part)) {
         const linkMsg = ` <a
              key="${index}"
              href="${part}"
              target="_blank"
              rel="noopener noreferrer"
            >
              ${part}
            </a>`
          msg.message = linkMsg
        }
      });

      setLoader(true);
      const { data } = await axios.post(
        `${baseurl}/messanger/create`,
        { receiverId, message: msg.message ? msg.message : "Love" },
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
   await socket?.emit('send-message-to-my-friend',{receiverId,message:msg?.message})
      setMsgStatus("send");
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  useEffect(() => {
    sendMessageToMyFriend();
    return ()=>{
      sendMessageToMyFriend();
     }
  }, []);

  const isOnline =  MYONLINEFRIEND?.some(O=> O === receiverId)
  if (onlineUser) {
    removeMsgRef.current.remove()
  }

  console.log(msg)
  return (
    <div ref={removeMsgRef} className={`my-message py-2`}>
      <div className="w-full">
        <div className="w-full flex justify-end relative">
          <div
            style={{ borderRadius: "20px 20px 0px 20px" }}
            className="max-w-[80%] box-border overflow-hidden bg-gray-100 border border-gray-150 py-2 px-3 text-right"
          >
            {HTMLReactParser(msg.message)}
          </div>
          {
              msg.hasSeen && (<img className="absolute w-4 -bottom-2 -right-1" src={profile} alt="profile" />)
          }
        </div>
      </div>
    </div>
  );
};
////////////////////////////////

export default MyCurrentMessage;
