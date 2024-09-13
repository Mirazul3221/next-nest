"use client";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { dataReducer } from "./dataReducer";
import storeContext from "./createContex";
import { decode_token } from "./extract_jwt";
import { io } from "socket.io-client";
import axios from "axios";
import { baseurl } from "../config";
export let MYONLINEFRIEND = [];
const DataProvider = ({ children }) => {
  let mysocketUrl = "https://edu-socket.vercel.app";
  // mysocketUrl = "http://localhost:3001";

  const [socketConnection, setSocketConnection] = useState(null);
  const [myFriendsId,setMyFriendsId] = useState([])
  const localstoreToken = {};
  if (typeof window !== "undefined") {
    // now access your localStorage
    localstoreToken.token = localStorage.getItem("token");
  }
  const [store, dispatch] = useReducer(dataReducer, {
    userInfo: decode_token(localstoreToken.token || ""),
    token: localstoreToken.token,
    searchReasultFromGeneralUser: "",
    searchReasultFromAuthenticUser: "",
    incomingMessage: [],
  });

  /////////////////////////////collect all my friend ids///////////////////////////////////
  async function getAllMyFriendsId() {
    const { data } = await axios.get(
      `${baseurl}/friend-request/get-friend/accepted`,
      {
        headers: {
          Authorization: `Bearer ${store.token}`,
        },
      }
    );

    /////////////////Send all friends id to the socket server///////////////////
    data && data?.map((user) => setMyFriendsId(prev=>[...prev,user._id]));
  }
  useEffect(() => {
    getAllMyFriendsId();
  }, []);

  /////////////////////////////////////////////////////////////////
  const invockSocketServer = async () => {
    const socket = await io(mysocketUrl, {
      query: {
        myId: store.userInfo.id,
        myFriendsId
      },
    });
    setSocketConnection(socket);
  };
  useEffect(() => {
    invockSocketServer();
  }, [myFriendsId]);
  return (
    <div>
      <storeContext.Provider value={{ store, dispatch, socketConnection }}>
        {children}
      </storeContext.Provider>
    </div>
  );
};

export default DataProvider;
