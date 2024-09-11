"use client";
import { baseurl } from "@/app/config";
import storeContext from "@/app/global/createContex";
import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { useEffect } from "react";
import { HiOutlineFaceFrown } from "react-icons/hi2";
import { IoHeartSharp, IoImageOutline } from "react-icons/io5";
import { RiSendPlaneLine } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import loader_gif from "@/public/loader.gif";
import "@/app/userdashboard/components/cssfiles/scrolling_bar.css";
import Image from "next/image";
import MyCurrentMessage from "./MyCurrentMessage";
import HTMLReactParser from "html-react-parser";
import { SOCKET } from "../SocketInvocation";
const Messanger = ({
  id,
  name,
  profile,
  title,
  status,
  desc,
  switcher,
  setSwitcher,
}) => {
  const [message, setMessage] = useState("");
  const [myAndFriendMessage, setMyAndFriendMessage] = useState();
  const [currentMessage, setCurrentMessage] = useState([]);
  const [leftHide, setLeftHide] = useState(false);
  const [loader, setLoader] = useState(false);
  const messangerRef = useRef(null);
  const { store } = useContext(storeContext);
  const bottomRef = useRef(null);

  let myFriendCurrentMessags = [];
  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // messangerRef.current.addEventListener("keyUp",()=>alert("helo"))
    if (messangerRef.current) {
      messangerRef.current.style.height = "auto";
      messangerRef.current.style.height = `${messangerRef.current.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    scrollToBottom();
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        scrollToBottom();
      }, 500 * 1);
    }
  }, [loader, leftHide]);

  const handleMessage = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    async function fetchMessage() {
      try {
        const { data } = await axios.get(`${baseurl}/messanger/get/${id}`, {
          headers: {
            Authorization: `Bearer ${store.token}`,
          },
        });
        setMyAndFriendMessage(data);
      } catch (error) {}
    }

    fetchMessage();
  }, [loader]);

  useEffect(() => {
   const fetchData = async ()=>{
    await SOCKET?.ROOT?.on("get-message-from-my-friend",( data=>{
      myFriendCurrentMessags = []
          console.log(data)
      }))
      fetchData()
   }
   return () => {
    fetchData()
  };
  }, []);

  let a = ['am','jam','kola','kathal','lichu'];
  let b = ['golap','hasnahena','joba']
  let c = [a,b]
  console.log(c)
  return (
    <div
      className={`${
        switcher ? "scale-1" : "scale-0"
      } fixed duration-200 -left-0 md:left-1/3 md:h-auto pb-4 bg-white h-screen origin-bottom-left bottom-0 md:bottom-10 w-full md:w-4/12 z-50 md:ml-6 border rounded-md`}
    >
      <div className="py-3 bg-fuchsia-500 rounded-t-md flex justify-between items-center px-4">
        <div className="flex gap-2">
          <img
            className="w-8 h-8 border border-white rounded-full"
            src={profile}
            alt={name}
          />
          <div>
            <h2 className="text-white font-semibold text-sm">{name}</h2>
            <p className="text-[9px] text-white">{status}</p>
          </div>
        </div>
        <div>
          <RxCross1
            onClick={() => setSwitcher(false)}
            className="cursor-pointer"
            size={22}
            color="white"
          />
        </div>
      </div>
      <div className="body-footer-box overflow-auto md:h-[74vh] hidden_scroll">
        <div className="message flex flex-col justify-between px-4 overflow-auto h-[83vh] md:h-[68vh] hidden_scroll">
          <div className="mt-4 flex justify-center w-full">
            <div>
              <img
                className="w-32 h-32 mx-auto rounded-full border-4"
                src={profile}
                alt={name}
              />
              <h3 className="text-gray-500 text-center font-semibold text-2xl">
                {name}
              </h3>
              {title?.length > 0 && title !== "Untitled User" && (
                <h2 className="text-gray-400 text-center text-lg">{title}</h2>
              )}
              {desc?.length > 0 && (
                <h2 className="text-gray-300 text-center text-sm">{desc}</h2>
              )}
            </div>
          </div>

          {myAndFriendMessage && myAndFriendMessage?.length > 0 && (
            <div>
              {myAndFriendMessage.map((m, i) => {
                return m.senderId === store.userInfo.id ? (
                  <div key={i} className="my-message py-2 flex justify-end">
                    <div
                      style={{ borderRadius: "20px 20px 0px 20px" }}
                      className="max-w-[80%] w-fit bg-slate-100"
                    >
                      <p ref={bottomRef} className="text-right px-4 py-2">
                        {HTMLReactParser(m.message)}
                      </p>
                    </div>
                  </div>
                ) : (
                     <div key={i} className="friend-message py-2 relative mb-6">
                    <div className="image-box absolute -bottom-6">
                      <img
                        className="w-8 h-8 rounded-full border border-fuchsia-500"
                        src={profile}
                        alt={name}
                      />
                    </div>
                    <div
                      style={{ borderRadius: "20px 20px 20px 0px" }}
                      className="px-2 ml-6 bg-fuchsia-500 max-w-[80%] w-fit text-white text-left"
                    >
                      <p ref={bottomRef} className="px-4 py-1">
                        {HTMLReactParser(m.message)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {currentMessage && currentMessage.length > 0 && (
            <div>
              {currentMessage?.map((m, i) => {
                return (
                  <MyCurrentMessage
                    key={i}
                    receiverId={id}
                    receiverName={name}
                    profile={profile}
                    title={title}
                    status={status}
                    desc={desc}
                    msg={m}
                    bottomRef={bottomRef}
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className="px-4 w-full rounded-b-md gap-3 flex justify-between items-center">
          <div
            className={`items-center gap-3 duration-200 ${
              leftHide ? "hidden" : "flex"
            }`}
          >
            <label htmlFor="file">
              <IoImageOutline size={25} />
            </label>
            <span>
              <HiOutlineFaceFrown size={25} />
            </span>
          </div>
          <div className="media hidden">
            <input className="" id="file" type="file" />
          </div>
          <div className="flex items-end gap-2 w-full">
            <textarea
              ref={messangerRef}
              value={message}
              onMouseUp={() => setLeftHide(true)}
              onChange={(e) => handleMessage(e)}
              rows={1}
              style={{
                width: "100%",
                resize: "none",
                overflow: "hidden",
                padding: "6px 14px",
                boxSizing: "border-box",
                outline: "none",
                border: "none",
                borderRadius: "20px",
                background: "#ededed",
              }}
            />
            {message ? (
              <span>
                {loader ? (
                  <Image
                    className="w-5 h-5 mb-[9px]"
                    src={loader_gif}
                    alt="Loading"
                  />
                ) : (
                  <RiSendPlaneLine
                    className="cursor-pointer"
                    onClick={() => {
                      // sendMessageToMyFriend();
                      setCurrentMessage((prev) => [...prev, message]);
                      setLeftHide(false);
                      setMessage("");
                    }}
                    size={25}
                    color="violet"
                  />
                )}
              </span>
            ) : (
              <span
                onClick={() => {
                  // sendMessageToMyFriend();
                }}
                className="mb-1 cursor-pointer"
              >
                {<IoHeartSharp color="violet" size={25} />}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messanger;
