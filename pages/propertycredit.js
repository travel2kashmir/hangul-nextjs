import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";
import Link from "next/link";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import english from "./Languages/en";
import french from "./Languages/fr";
import arabic from "./Languages/ar";

function Propertycredit() {
   /** Fetching language from the local storage **/
   let locale = localStorage.getItem("Language");

   var t;
   if (locale === "ar") {
     t = arabic;
   }
   if (locale === "en") {
     t = english;
   }
   if (locale === "fr") {
     t = french;
   }
  const [propertycredit, setPropertyCredit] = useState({});

  /** Fetching property details from the local storage **/
  let currentProperty=JSON.parse(localStorage.getItem('property'))

  /** Fetching package details from the local storage **/
  let currentPropertyCredit = JSON.parse(localStorage.getItem('packageDescription'))

  /* Function Edit Property Credit*/
  const submitPropertyCreditEdit = () => {
    const final_data = {
      "property_credit_id": currentPropertyCredit.package_property_credit[0]?.property_credit_id,
      "property_credit_currency": propertycredit.property_credit_currency,
      "property_credit_amount": propertycredit.property_credit_amount
    }
  
   const url = '/api/package/package_property_credit'
    axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Property Credit Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
       toast.error("Property Credit Error!", {
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

  return (
    <div  id="main-content"
    className="bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64">
       {/* Navbar */}
       <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
              <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              <span className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center">
              <Link href="/landing" >
              {t.home}
            </Link></span>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
              <Link href="/propertysummary" >{currentProperty?.property_name}</Link>
              </span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
              <Link href="/packages">{t.packages}</Link>
           </span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
              <Link href='/package' className="text-gray-700 text-sm capitalize   font-medium hover:text-gray-900 ml-1 md:ml-2">{currentPropertyCredit.package_name}</Link>
            </span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{t.propertycredit}</span>
            </div>
          </li>
        </ol>
      </nav>
      
      <div className="bg-white shadow rounded-lg mt-10 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
      {/* Header */}
     <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
          {t.propertycredit}
          <svg className="ml-2 h-6 mb-2 w-6 font-semibold" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
        </h6>

        {/* Body */}
        <div className="pt-6">
          <div className=" md:px-4 mx-auto w-full">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                   {t.creditcurrency}
                  </label>
                  <select
                    className="shadow-sm bg-gray-50 border  border-gray-
                     text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600
                      focus:border-cyan-600 block w-full p-2.5"
                    onChange={(e) => (setPropertyCredit({ ...propertycredit, property_credit_currency: e.target.value }))}>
                    <option selected >{currentPropertyCredit.package_property_credit[0]?.property_credit_currency}</option>
                    <option value="INR" >INR</option>
                    <option value="Dollar">Dollar</option>
                    <option value="Euro" >Euro</option>

                  </select>

                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                    {t.creditamount}
                  </label>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900
                 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600
                  block w-full p-2.5"
                    defaultValue={currentPropertyCredit.package_property_credit[0]?.property_credit_amount}
                    onChange={(e) => (setPropertyCredit({ ...propertycredit, property_credit_amount: e.target.value }))} />
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                </div>
              </div>

              <div className="w-full lg:w-4/12 px-4">
                <div className="relative w-full ml-4 mb-3"></div></div>
              <div className="w-full lg:w-2/12 px-4">
                <div className="relative w-full ml-4 mb-4">
                  <button
                    className="sm:inline-flex ml-5 text-white bg-cyan-600 hover:bg-cyan-700 
                focus:ring-4 focus:ring-cyan-200 font-semibold
                 rounded-lg text-sm px-5 py-2 text-center 
                 items-center  mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={submitPropertyCreditEdit} type="button" >
                   {t.update}</button>
                </div>
              </div>

            </div>
          </div>
        </div>
        </div>

      {/* Toast Container */}
      <ToastContainer position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />
      </div>
  )
}

export default Propertycredit