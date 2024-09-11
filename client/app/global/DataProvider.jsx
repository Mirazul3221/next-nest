"use client"
import React, { useReducer } from 'react'
import { dataReducer } from './dataReducer'
import storeContext from './createContex'
import { decode_token } from './extract_jwt'
const DataProvider = ({children}) => {
 const localstoreToken = {};
  if(typeof window !== 'undefined'){
    // now access your localStorage
    localstoreToken.token = localStorage.getItem("token")
  }
    const [store,dispatch] = useReducer(dataReducer,{
        userInfo : decode_token(localstoreToken.token || ""),
        token : localstoreToken.token,
        searchReasultFromGeneralUser: '',
        searchReasultFromAuthenticUser: '',
        incomingMessage:[]
       })
  return (
    <div>
       <storeContext.Provider value={ {store, dispatch}}>
        {children}
       </storeContext.Provider>
    </div>
  )
}

export default DataProvider
