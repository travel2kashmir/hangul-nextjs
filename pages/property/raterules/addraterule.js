import React, { useEffect, useState } from 'react'
import Link from "next/link";
var langs = require('langs');
import Multiselect from 'multiselect-react-dropdown';
import Button from '../../../components/Button';
import countries from "countries-list";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from '../../../components/Header'
import Sidebar from '../../../components/Sidebar'
import english from '../../../components/Languages/en'
import french from '../../../components/Languages/fr'
import arabic from '../../../components/Languages/ar'
import axios from "axios";
import Router from 'next/router';
var i = 0;
var j = 1;
var res =[]
var resDev = []
var resCou = []
var resLang = []
var languageCodes;
const logger = require("../../../services/logger");

var currentraterule;
var language;
var currentProperty;
function Addraterule() {
    const [allUserRateDetails, setAllUserRateDetails] = useState([])
    const [disp, setDisp] = useState(0);
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
            /** Current Property Basic Details fetched from the local storage **/
            currentraterule = localStorage.getItem('RateRuleId');
            /** Current Property Details fetched from the local storage **/
            currentProperty = JSON.parse(localStorage.getItem("property"));
            
          }
        }
        firstfun();
        Router.push("./addraterule")
      }, [])
  return (
    <>
    <Header Primary={english?.Side1} />
      <Sidebar Primary={english?.Side1} />
    <div id="main-content"
        className="  bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64">
        {/* Navbar */}
        <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <svg
                className="w-5 h-5 mr-2.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              <Link
                href="./landing"
                className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"
              >
                <a>{language?.home}</a>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2">
                  <Link href="./propertysummary" >
                    <a> {currentProperty?.property_name}</a>
                  </Link></span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2">
                  <Link href="../raterules" >
                    <a>Rate Rules</a>
                  </Link></span>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span
                  className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  "
                  aria-current="page"
                >
                  Add Rate Rules
                </span>
              </div>
            </li>
          </ol>
        </nav>
        
         {/** Discount (Rate Eligibility)  **/}
         <div id='0' className={disp===0?'block':'hidden'}>
         <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8 mt-3 2xl:col-span-2">
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[56%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
               <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary"> 1</button>
              <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">Rates</div>
            </div>

            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> Rate Modification and Discount</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">
             
            3</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Rate Conditions </div>
            </div>


          </div>
          <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
            Rates
            <svg className="ml-2 h-6 mb-2 w-6 font-semibold" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
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
                      {language?.baserate} {language?.currency}
                    </label>
                    <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"

                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, base_rate_currency: e.target.value })
                        )
                      }>
                      <option selected>Select</option>
                      <option value="USD" >USD</option>
                      <option value="INR">INR</option>
                      <option value="Euro">Euro</option>
                    </select>
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.baserate} {language?.amount}
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                     onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, base_rate_amount: e.target.value })
                        )
                      }
                    />
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.taxrate} {language?.currency}
                    </label>
                    <select className="shadow-sm ca bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, tax_currency: e.target.value })
                        )
                      }>
                      <option selected >Select</option>
                      <option value="USD" >USD</option>
                      <option value="INR">INR</option>
                      <option value="Euro">Euro</option>
                    </select>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.taxrate} {language?.amount}
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, tax_amount: e.target.value })
                        )
                      } />
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.other} {language?.capacity} {language?.currency}
                    </label>
                    <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"

                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, otherfees_currency: e.target.value })
                        )
                      }>
                      <option value="USD" >Select</option>
                      <option value="USD" >USD</option>
                      <option value="INR">INR</option>
                      <option value="Euro">Euro</option>
                    </select>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.other} {language?.charges} {language?.amount}
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                     onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, otherfees_amount: e.target.value })
                        )
                      }
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      Payment Holder
                    </label>
                    <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, charges_currency: e.target.value })
                        )
                      }>
                      <option selected >Select</option>
                      <option value="web">Web</option>
                      <option value="hotel">Hotel</option>
                      <option value="installment">Installment</option>
                      <option value="deposit">Deposit</option>
                    </select>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      Refundable
                    </label>
                    <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, refundable: e.target.value })
                        )
                      }>
                      {allUserRateDetails?.refundable === "true"
                        ?
                        <option selected value={true}>Yes</option>
                        : <option value={false}>No</option>}

                      <option value={true}>Yes</option>
                      <option selected value={false}>No</option>
                    </select>
                  </div>
                </div>

                {allUserRateDetails?.refundable === "true" ? (
                  <>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="text-sm font-medium text-gray-900 block mb-2"
                          htmlFor="grid-password"
                        >
                          Refundable until days
                        </label>
                        <input
                          type="text"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                          onChange={
                            (e) => (
                              setAllUserRateDetails({ ...allUserRateDetails, refundable_until_days: e.target.value })
                            )
                          } />
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="text-sm font-medium text-gray-900 block mb-2"
                          htmlFor="grid-password"
                        >
                          Refundable until time
                        </label>
                        <input
                          type="time" step="2"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                          
                          onChange={
                            (e) => (
                              setAllUserRateDetails({ ...allUserRateDetails, refundable_until_time: e.target.value })
                            )
                          } />
                      </div>
                    </div></>)
                  :
                  (<></>)}

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      Expiration Timezone
                    </label>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allUserRateDetails?.expiration_time}
                      onChange={
                        (e) => (
                          setAllUserRateDetails({ ...allUserRateDetails, expiration_time: e.target.value })
                        )
                      } />

                  </div>
                </div>
              </div>
              <div id="btn" className="flex items-center justify-end mt-2 space-x-2 sm:space-x-3 ml-auto">
                {Button !== 'undefined' ?
                  <Button Primary={language?.Next}  onClick={()=>{setDisp(1)}}/>
                  : <></>
                }
              </div>

            </div>
          </div>
        </div>
         </div>
         <div id='1' className={disp===1?'block':'hidden'}>
        <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[56%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400"> 1</button>
              <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">Rates 
              
             </div>
            </div>

            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              
              <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">2</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">Rate Modification and Discount</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
              <button className="w-10 h-10 rounded-full btn text-slate-500 bg-slate-100 dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
              <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400"> Rate Conditions</div>
            </div>

          </div>
          <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
         Rate Modification and Discount 
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
                      Program Name
                    </label>
                    <input type="text"
                      className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={(e) =>
                        setUserRateDetails({
                          ...userRateDetails,
                          MembershipProgram: e.target.value,
                        },setBasicFlag(1))
                      }/>
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="text-sm font-medium text-gray-900 block "
                  htmlFor="grid-password"
                >
                  Discount Type
                </label>
                <select
                  className="shadow-sm bg-gray-50 border mb-1.5 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  onChange={(e) =>
                    setDiscount({
                      ...discount,
                      ineligibility_type: e.target.value,
                    },setBasicFlag(1))}
                >
                  <option selected >Select</option>
                  <option value="exact">exact</option>
                  <option value="price_band">price band</option>
                  <option value="existence">existence</option>
             </select>
              </div>
            </div>
            
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label
                  className="text-sm font-medium text-gray-900 block mb-2"
                  htmlFor="grid-password"
                >
                  Hotel Amenity(Free Wifi)
                </label>
                <input
                  type="text"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                 onChange={(e) =>
                    setRateRule({
                      ...rateRule,
                      hotel_amenity: e.target.value,
                    },setLang(1))
                  }

                /></div></div>

            <div className="w-full lg:w-6/12 px-4">
              <div className="relative w-full mb-3">
                <label className="text-sm font-medium text-gray-900 block"
                  htmlFor="grid-password">
                  Price Multiplier
                </label>
                <input
                  type="text"
                  className="shadow-sm bg-gray-50 border my-2 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                 onChange={(e) =>
                    setRateRule({
                      ...rateRule,
                      price_multiplier: e.target.value,
                    },setLang(1))
                  }

                /></div></div>
              

                <div className="flex items-center justify-end space-x-2  sm:space-x-3 ml-auto">
                  <div className="relative w-full ml-4 mb-4">
                  <Button Primary={language?.Next} />  
                  </div>
                </div>
                <div>
                </div>
              </div>

            </div>

          </div>
        </div>
         </div>
        </div></>
  )
}

export default Addraterule