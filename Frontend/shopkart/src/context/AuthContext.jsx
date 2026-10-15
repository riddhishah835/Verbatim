import { createContext, useEffect, useState,useContext } from "react";
import axiosInstance from "../axioscalls/axios";
const AuthContext=createContext()
export const AuthProvider=({children})=>{
    const [customer,setcustomer]=useState(null)
    const [loader,setloader]=useState(true)
    useEffect(()=>{
        axiosInstance.get('/customers/me').then((res)=>{
            setcustomer(res.data)

        }).catch((err)=>{
            console.log(err)
        }).finally(()=>{
            setloader(false)
        })
    },[])

    const logout = async () => {
    try {
      await axiosInstance.post('/customers/logout');
      setcustomer(null);
    } catch (err) {
      console.log(err);
    }
  };
    return (
        <AuthContext.Provider value={{customer,setcustomer,loader,setloader,logout}}>
            {children}

        </AuthContext.Provider>
    )
}
 export const useAuth=()=>useContext(AuthContext)