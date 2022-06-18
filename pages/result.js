import React, { useEffect, useState } from 'react'
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import english from "../components/Languages/en"
import french from "../components/Languages/fr"
import arabic from "../components/Languages/ar"
import Router from "next/router";
var language;
var currentProperty;
var  currentPackageDetails;

function Result() {
    useEffect(()=>{
        const firstfun=()=>{
          if (typeof window !== 'undefined'){
            var locale = localStorage.getItem("Language"); 
            if (locale === "ar") {
            language = arabic;
            }
            if (locale === "en") {
            language=english;
            }
            if (locale === "fr") {
              language = french;
            }
            /** Current Property Basic Details fetched from the local storage **/
            currentProperty=JSON.parse(localStorage.getItem('property'))  
            currentPackageDetails=JSON.parse(localStorage.getItem('packageDescription'))
          } 
        }
        firstfun();
        Router.push("/result");
      },[]) 
  return (
    <div id="main-content"
    className="bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64">
     <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
              <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
              <span className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center">
              <Link href="/landing" >
            <a> {language?.home}</a>
            </Link>
            </span>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
                <Link href="/propertysummary" ><a>{currentProperty?.property_name}</a></Link>
              </span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm   font-medium hover:text-gray-900 ml-1 md:ml-2">
               <Link href="/packages"><a>{language?.packages}</a></Link></span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
              <Link href="/package">
              <a> {currentPackageDetails?.package_name}</a></Link>
            </span>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
              <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">Result</span>
            </div>
          </li>
        </ol>
      </nav>
      <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
      <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
        Result
         </h6>
         <div className="pt-6">
          <div className=" md:px-4 mx-auto w-full">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                  Check In
                  </label>
                  <input
                    type="text"
                    className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                 /> 
                </div>
              </div>
              
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    Nights
                  </label>
                  <input
                    type="text"
                    className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                 /> 
                </div>
              </div>

              <div className="flex flex-col mt-8">
        <div className="overflow-x-auto">
          <div className="align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden">
              <table className="table-fixed min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-semibold text-gray-500 uppercase"
                    >
                      {language?.room} {language?.name}
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-semibold text-gray-500 uppercase"
                    >
                      {language?.room} {language?.type}
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-semibold text-gray-500 uppercase"
                    >
                      {language?.baserate}
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-semibold text-gray-500 uppercase"
                    >
                      {language?.taxrate}
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-semibold text-gray-500 uppercase"
                    >
                    Other Charges
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-left text-xs font-semibold text-gray-500 uppercase"
                    >
                     Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                 
                      <tr className="hover:bg-gray-100">
                        <td
                          className="p-4 flex items-center whitespace-nowrap space-x-6
                                                     mr-12 lg:mr-0"
                        >
                             <input
                    id="remember"
                    aria-describedby="remember"
                    name="remember"
                    type="checkbox"
                    className="bg-gray-50 
                   border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                    rounded"
                    required
                  />
                          <td
                            className="p-4 whitespace-nowrap text-base font-medium
                                                         text-gray-900"
                          >
                           Rose Suite
                          </td>
                        </td>
                        <td
                          className="p-4 whitespace-nowrap text-base font-medium
                                                     text-gray-900"
                        >
                         Triple Room
                        </td>
                        <td
                          className="p-4 whitespace-nowrap text-base font-normal 
                                                    text-gray-900"
                        >
                            35,000 INR
                        </td>
                        <td
                          className="p-4 whitespace-nowrap text-base font-normal 
                                                    text-gray-900"
                        >
                            5,000 INR
                        </td>
                        <td
                          className="p-4 whitespace-nowrap text-base font-normal 
                                                    text-gray-900"
                        >
                            300 INR
                        </td>
                        <td
                          className="p-4 whitespace-nowrap text-base font-normal 
                                                    text-gray-900"
                        >
                          <div className="flex items-center">
                            <div
                              className="h-2.5 w-2.5 rounded-full bg-green-400 
                                                            mr-2"
                            ></div>
                            {language?.active}
                          </div>
                        </td>
                       
                      </tr>
                 
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
              </div></div></div>
         </div>
      </div>
  )
}

export default Result