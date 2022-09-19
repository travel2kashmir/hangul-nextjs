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
import bcrypt from "bcryptjs";
var language;
var currentProperty;
var currentLogged;

function Adduser() {
  const [spinner, setSpinner] = useState(0)
  const [error, setError] = useState({})
  const [user, setUser] = useState({
    "user_name": "",
    "user_email": "",
    "user_password": ""
  })

  const registerUser = (e) => {
    console.log("user details" + JSON.stringify(user))
    const result = validateUserData(user)
    if (result === true) {
      const salt = bcrypt.genSaltSync(10);
      alert("plain pass" + user.user_password)
      const encryptedPassword = bcrypt.hashSync(user.user_password, salt)
      const data = {
        "user_name": user?.user_name,
        "user_email": user?.user_email,
        "user_password": encryptedPassword,
        "salt": salt,
        "status": true
      }
      axios.post('/api/signup/user', data,
        {
          headers: { 'content-type': 'application/json' }
        }).then(response => {
          console.log(response.data)
          toast.success("API: User created Sucessfully", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setUser({
            "user_name": "",
            "user_email": "",
            "user_password": ""
          })
          setError({})
          setSpinner(0)
          setTimeout(() => Router.push('./allusers'), 2000)
        })
        .catch(error => {
          console.log(error.response)
          setSpinner(0);
          toast.error("Some thing went wrong \n " + JSON.stringify(error.response.data), {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

        });
    }
    else {
      setError(result)
      setSpinner(0)
    }


  }


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
    Router.push("./adduser");
  }, [])
  return (<>
    {/*privacy policy*/}
    <Header admin={english?.Sideadminlanding}/>
    <Sidebar admin={english?.Sideadminlanding}/>
    <div id="main-content"
      className="  bg-gray-50 px-4 min-h-screen pt-24 relative overflow-y-auto lg:ml-64" >
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
              <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">Add User</span>
            </div>
          </li>
        </ol>
      </nav>

      {/*Sign up form */}
      <div className="flex  justify-center bg-white xl:m-64 xl:mt-8 shadow-xl rounded-lg  sm: mt-4 p-6 xl:p-8  2xl:col-span-2 md:mx-8">
        <form className=' sm:w-full md:w-2/3 lg:w-2/5 py-4'>
          <div className="relative w-full mb-3">
            <label
              className="text-base font-semibold
                   text-gray-700 
                  block mb-2 "
              htmlFor="grid-password"
            >
               {language?.username}
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 
                  text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600
                   focus:border-cyan-600 block w-full p-2.5 "
              placeholder="User name"
              onChange={(e) => { setUser({ ...user, user_name: e.target.value }) }}

            />
            <p className="text-red-700 font-light">
              {error?.user_name}
            </p>
          </div>

          <div className="relative w-full mb-3">
            <label
              className="text-base font-semibold
                   text-gray-700 
                  block mb-2"
              htmlFor="grid-password"
            >
              {language?.email}
            </label>
            <input
              type="email"
              className="bg-gray-50 border border-gray-300 
                  text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600
                   focus:border-cyan-600 block w-full p-2.5"
              placeholder="Email"
              onChange={(e) => { setUser({ ...user, user_email: e.target.value }) }}
            /> <p className="text-red-700 font-light">
              {error?.email}
            </p>
          </div>

          <div className="relative w-full mb-3">
            <label
              className="text-base font-semibold
                   text-gray-700 
                  block mb-2"
              htmlFor="grid-password"
            >
              {language?.userPassword}
            </label>
            <input
              type="password"
              className="bg-gray-50 border border-gray-300 
                  text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600
                   focus:border-cyan-600 block w-full p-2.5"
              placeholder="Password"
              onChange={(e) => { setUser({ ...user, user_password: e.target.value }) }}
            />

            <p className="text-blue-700 font-light"> {user?.user_password === '' ? <></> : user?.user_password.length < 6 ?
              <p className='w-48'>
                Password must be 6 to 20 character long with atleast 1 upper case character , 1 lower case character and 1 number</p> : <></>}
            </p>
            <p className="text-red-700 font-light">
              {error?.password}
            </p>
          </div>
          <div className="flex justify-start text-center mt-6">
            <button
              className={` bg-gradient-to-r bg-cyan-600 hover:bg-cyan-700 text-white sm:inline-flex  
                      focus:ring-4 focus:ring-cyan-200 font-semibold 
                       rounded-lg text-sm px-5 py-2 text-center 
                       items-center  mb-1 ease-linear transition-all duration-150`}
              type="button"
              onClick={() => { setSpinner(1); registerUser() }}
            >
              {spinner === 1 ? <> <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
              </svg>
                {language?.creatinguser}</> : <>{language?.createuser}</>}
            </button>

          </div>

        </form>
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
  )
}

export default Adduser