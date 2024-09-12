"use client";
import { baseurl } from "@/app/config";
import storeContext from "@/app/global/createContex";
import axios from "axios";
import HTMLReactParser from "html-react-parser";
import React, { useContext, useState } from "react";
import { useEffect } from "react";

const MyCurrentMessage = ({ receiverId,receiverName,profile,title,status,desc, msg, bottomRef}) => {
  const { store ,socketConnection } = useContext(storeContext);
  const [msgStatus, setMsgStatus] = useState("sending...");
  const [loader, setLoader] = useState(false);
  const sendMessageToMyFriend = async () => {
    try {
      const urlPattern = /(https?:\/\/[^\s]+)/g; // Regex to detect links
      // Split the message and replace links with anchor tags
      const parts = msg.split(urlPattern).map((part, index) => {
        if (urlPattern.test(part)) {
         const linkMsg = ` <a
              key="${index}"
              href="${part}"
              target="_blank"
              rel="noopener noreferrer"
            >
              ${part}
            </a>`
          msg = linkMsg
        }
      });

      setLoader(true);
      const { data } = await axios.post(
        `${baseurl}/messanger/create`,
        { receiverId, message: msg ? msg : "Love" },
        {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        }
      );
    socketConnection?.emit('send-message-to-my-friend',{receiverId,msg})
      setMsgStatus("send");
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  useEffect(() => {
    sendMessageToMyFriend();
  }, []);

  // useEffect(() => {
  // const fetchData = async ()=>{
  //   SOCKET?.ROOT?.on("get-message-from-my-friend",(data=>{
  //     console.log(data)
  //   }))
  // }
  // fetchData()//
  //   return ()=>{
  //     fetchData()
  //   }
  // }, []);
  return (
    <div className="my-message py-2">
      <div className="w-full">
        <div className="w-full flex justify-end">
          <div
            style={{ borderRadius: "20px 20px 0px 20px" }}
            className="max-w-[80%] box-border overflow-hidden bg-gray-100 border border-gray-150 py-2 px-3 text-right"
          >
            {HTMLReactParser(msg)}
          </div>
        </div>
        <p ref={bottomRef} className="text-[8px] text-right">
          {msgStatus}
        </p>
      </div>
    </div>
  );
};
////////////////////////////////

export default MyCurrentMessage;
