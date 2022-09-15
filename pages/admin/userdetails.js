import React, { useEffect, useState } from 'react'
import Header from '../../components/Languages/adminSection/header'
import Sidebar from '../../components/Languages/adminSection/sidebar'
import Link from 'next/link'
import english from '../../components/Languages/en'
import french from '../../components/Languages/fr'
import arabic from '../../components/Languages/ar'
import Router from 'next/router'
import Button from '../../components/Button'
import axios from 'axios';
import validateUserData from '../../components/Validation/createuser'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
var language;
var currentProperty;
var currentLogged;
var currentUser;
var locale;
const logger = require("../../services/logger");

function userDetails() {
  const [spinner, setSpinner] = useState(0)
  const [error, setError] = useState({})
  const [userData, setUserdata] = useState([])
useEffect(()=>{
    const firstfun=()=>{
      if (typeof window !== 'undefined'){
       locale = localStorage.getItem("Language");
         if (locale === "ar") {
        language = arabic;
        }
        if (locale === "en") {
        language=english;
        }
        if (locale === "fr") {
          language = french;
        } 
        currentUser = JSON.parse(localStorage.getItem("user"));    
      } 
    }
    firstfun();
    fetchProperty();
  },[])

  const fetchProperty = async () => { 
    try {
      const url = `/api/properties/${currentUser.id}`;
      logger.info("url" +url)
      const response = await axios.get(url, {
        headers: { accept: "application/json" },
      });
      setUserdata(response.data);
      setVisible(1)
    } catch (error) {
      if (error.response) {
        logger.error("Current User Properties Error");
      } else {
        logger.error("Current User Properties Error");
      }
    }
  };
  return (<>
    
    <Header admin={english?.Sideadminlanding}/>
    <Sidebar admin={english?.Sideadminlanding}/>
    <div id="main-content"
      className="  bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64" >
      {/*Nav Bar*/}
      <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
            <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../admin/AdminLanding" : "./landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
            </Link>
          </li>

          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">User Detail</span>
            </div>
          </li>
        </ol>
      </nav>

      
      <div className=" bg-white shadow-xl rounded-lg  sm: mt-4 p-6 xl:p-8  2xl:col-span-2">
      <div className='flex'>
        <p className="text-l flex justify-start  leading-none pl-6 pt-2  text-gray-900 ">
          User Name
        </p>
   
        <p className="text-l flex justify-end  leading-none pl-6 pt-2  text-gray-900 ">
         Status
        </p>
     </div>
    <p className="text-l   leading-none pl-6 pt-2  text-gray-900 ">
         User Email
    </p> 
      
                    <div className="pt-6">
                        <div className=" md:px-4 mx-auto w-full">
                            <div className="flex flex-wrap">

                               <p>list of properties</p> 
                               <button className='ml-auto' onClick={()=>alert("assigned")}>Assign Property</button>
                              

                            </div>
                        </div>
                    </div>
      </div>
    </div>

    <div>

    </div>
    {/** Toast Container **/}
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </>

)}

export default userDetails





