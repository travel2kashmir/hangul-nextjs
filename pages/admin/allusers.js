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


function Allusers() {
  const [spinner, setSpinner] = useState(0)
  const [error, setError] = useState({})
  const [users, setUsers] = useState(
    [{"user_id":"user008",
    "user_name":"hangul",
    "user_email":"hangul@travel2kashmir.com",
    "status":true},
    {"user_id":"user0016",
    "user_name":"rameez",
    "user_email":"ramiz@gmail.com",
    "status":true}]
  )

   //fetch all properties
   const fetchAllUsers = () => {
    alert("fetch users")
    axios.get('/api/all_users').then(response => {
        setUsers(response.data)
    }).catch(error => {
        toast.error("Error in fetching Users!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    })
}

  const registerUser = (e) => {}


  useEffect(() => {
    const firstfun = () => {
      if (typeof window !== 'undefined') {
        var locale = localStorage.getItem("Language");
        if (locale === "ar") {
          language = arabic;
        }
        if (locale === "en") {
          language = english;
        }
        if (locale === "fr") {
          language = french;

        }
        /** Current Property Details fetched from the local storage **/


        currentLogged = JSON.parse(localStorage.getItem("Signin Details"));

      }
    }
    firstfun();
   // fetchAllUsers();
    Router.push("./allusers");
  }, [])
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
              <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">All Users</span>
            </div>
          </li>
        </ol>
      </nav>

      {/*Sign up form */}
      <div className="flex  justify-center bg-white shadow-xl rounded-lg  sm: mt-4 p-6 xl:p-8  2xl:col-span-2">
       
      
                    <div className="pt-6">
                        <div className=" md:px-4 mx-auto w-full">
                            <div className="flex flex-wrap">

                                
                                <h6 className="text-xl mt-6 flex leading-none  pt-2 font-bold text-gray-900 mb-2">
                                    List of All Users
                                </h6>
                                <form className=" space-y-1" action="#">
                                    <table className="table-fixed  w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-1 mx-2 py-4 text-left text-sm font-semibold text-gray-500 uppercase"
                                                >
                                                    User Name
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-1 mx-2 py-4 text-left text-sm font-semibold text-gray-500 uppercase"
                                                >
                                                   User Email
                                                </th>
                                              
                                                <th
                                                    scope="col"
                                                    className="px-8 py-4 text-left text-sm font-semibold text-gray-500 uppercase"
                                                >
                                                    {language?.Status}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-1 py-4 text-left text-sm font-semibold text-gray-500 uppercase"
                                                >
                                                    {language?.action}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users?.map((item, idx) => {
                                                return (item?.status === true ?
                                                    <tr className="hover:bg-gray-100" key={idx}>
                                                        <td className="p-1 whitespace-nowrap text-base font-medium text-gray-900 capitalize">
                                                            {item?.user_name}
                                                        </td>
                                                        <td className="p-1 whitespace-nowrap text-base font-medium text-gray-900 capitalize">
                                                            {item?.user_email}
                                                        </td>
                                                        
                                                        <td className="p-4 whitespace-nowrap text-base font-normal text-gray-900">
                                                            <div className="flex items-center">
                                                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                                                {item?.status === true ? "Active" : "Inactive"}
                                                            </div>
                                                        </td>
                                                        <td className="p-2 whitespace-nowrap space-x-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                   localStorage.setItem("user", JSON.stringify(item));
                                                                    Router.push('./userdetails')
                                                                }}
                                                                className="text-white bg-cyan-600
                                         hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-semibold rounded-lg
                                        text-sm inline-flex items-center px-2 py-1.5 text-center"
                                                            >
                                                                {language?.view}
                                                            </button>


                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    alert("deactivated") 
                                                                    
                                                                }}
                                                                className="text-white ml-4 bg-red-600
                                         hover:bg-red-700 focus:ring-4 focus:ring-cyan-200 font-semibold rounded-lg
                                        text-sm inline-flex items-center px-2 py-1.5 text-center"
                                                            >
                                                               De-Activate
                                                            </button>
                                                        </td>
                                                    </tr> : <></>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                                </form>

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

export default Allusers





