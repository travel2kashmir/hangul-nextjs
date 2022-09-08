import React, { useEffect, useState } from 'react'
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar  from "../../components/Sidebar";
import Header  from "../../components/Header";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
import Router from "next/router";
var language;
var currentProperty;
var i = 0;
const logger = require("../../services/logger");

function Result() {
  const [result, setResult] = useState([])
  const [res, setRes] = useState([])
  const [rates, setRates] = useState([])
  const [rate, setRate] = useState([])
  const [allBundles, setAllBundles] = useState([])

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
        currentProperty = JSON.parse(localStorage.getItem('property'))

      }
    }
    firstfun();
    Router.push("./result");
  }, [])

  const fetchDetails = async () => {
    const url = `/api/package/result/${currentProperty?.property_id}`
    axios.get(url, { header: { "content-type": "application/json" } }).then
      ((response) => {
        logger.info("result details fetch success");
        setResult(response.data)
      })
      .catch((error) => {
        logger.info("result details fetch error")
      })

  }

  const fetchBundles = async () => {
    try {
      const url = `/api/room_bundle/${currentProperty.property_id}`
      const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
      setAllBundles(response.data)
    }
    catch (error) {

      if (error.response) {
        logger.error("Bundles error");
      }
      else {
        logger.error("Bundles error");
      }
    }
  }
  
  useEffect(() => {
    fetchDetails();
    fetchBundles();
  }, [])

  /* Function Edit Result */
  const submitresultEdit = () => {
    if (res.length !== 0) {
      var time;
      var temp = `2022-01-01 ` + res?.check_in;
      time = new Date(temp.toString())
      if (res.length !== 0) {
        const final_data = {
          "check_in": res?.check_in ? time.getTime() : res?.check_in,
          "nights": res?.nights,
          "result_id": result?.result_id,
          "room_bundle_id": res?.room_bundle_id
        }

        const url = '/api/package/result'
        axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
          ((response) => {
            toast.success("Result Updated Successfully!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setRes([])
            fetchDetails();
            Router.push("./result");
          })
          .catch((error) => {
            toast.error("Result Error!", {
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
    }
  }

  /* Function Edit Rate */
  const submitRateEdit = () => {
    if (rates.length !== 0) {
      var time;
      var temp = `2022-01-01 ` + rates?.expiration_time;
      time = new Date(temp.toString())
      const final_data = {
        "rates_id": result?.rate?.[i]?.rates_id,
        "expiration_time": rates?.expiration_time ? time.getTime() : rates?.expiration_time,
      }
      alert("rates" + JSON.stringify(final_data))
      const url = '/api/package/rates'
      axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
        ((response) => {
          toast.success("Package rates updated successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setRates([])
          fetchDetails();
          Router.push("./result");
        })
        .catch((error) => {
          toast.error("Package rates error!", {
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
  }

  /* Function Master Rate Edit */
  const submitMasterRateEdit = () => {
    if (rate.length !== 0) {
      const final_data = {
        "rate_master_id": result?.rate?.[i]?.rate_master_id,
        "base_rate_currency": rate?.base_rate_currency,
        "base_rate_amount": rate?.base_rate_amount,
        "tax_currency": rate?.tax_currency,
        "tax_amount": rate?.tax_amount,
        "other_fees_currency": rate?.other_fees_currency,
        "other_fees_amount": rate?.other_fees_amount,
      }
      alert("final_data" + JSON.stringify(final_data))
      const url = '/api/package/rates_master'
      axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
        ((response) => {
          toast.success("Package rates master successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setRate([])
          fetchDetails();
          Router.push("./result");
        })
        .catch((error) => {
          toast.error("Package rates master error!", {
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
  }

  return (
    <>
     <Header Primary={english?.Side}/>
    <Sidebar  Primary={english?.Side}/>
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
                    type="time" step="2" defaultValue={result?.check_in}
                    className="shadow-sm  bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={(e) => (setRes({ ...res, check_in: e.target.value }))}
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
                    type="number" defaultValue={result?.nights}
                    className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={(e) => (setRes({ ...res, nights: e.target.value }))}
                  />
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    Expiration time
                  </label>
                  <input
                    type="time" step="2" defaultValue={result?.rate?.[i]?.expiration_time}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={(e) => (setRates({ ...rates, expiration_time: e.target.value }))}
                  />
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >Room Bundle
                  </label>
                  <select onClick={(e) => setRes({ ...res, room_bundle_id: e.target.value })}
                    className="shadow-sm bg-gray-50 capitalize border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" >
                    <option >{result?.rate?.[i]?.room_name} - {result?.rate?.[i]?.package_name}</option>

                    {allBundles?.map(i => {
                      return (
                        <option key={i} value={i?.room_bundle_id}>{i?.room_name} - {i?.package_name}</option>)
                    }
                    )}
                  </select>
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    Base rate currency
                  </label>
                  <select onChange={(e) => setRate({ ...rate, base_rate_currency: e.target.value })}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5">
                    <option selected >{result?.rate?.[i]?.base_rate_currency}</option>
                    <option value="USD" >USD</option>
                    <option value="INR">INR</option>
                    <option value="Euro">Euro</option>
                  </select>
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    Base rate amount
                  </label>
                  <input onChange={(e) => (setRate({ ...rate, base_rate_amount: e.target.value }))}
                    type="text" defaultValue={result?.rate?.[i]?.base_rate_amount}
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
                    Tax rate currency
                  </label>
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={(e) => (setRate({ ...rate, tax_currency: e.target.value }))} >
                    <option selected >{result?.rate?.[i]?.tax_currency}</option>
                    <option value="USD" >USD</option>
                    <option value="INR">INR</option>
                    <option value="Euro">Euro</option>
                  </select>
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    Tax rate amount
                  </label>
                  <input onChange={(e) => (setRate({ ...rate, tax_amount: e.target.value }))}
                    type="text" defaultValue={result?.rate?.[i]?.tax_amount}
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
                    Other charges currency
                  </label>
                  <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={(e) => (setRate({ ...rate, other_fees_currency: e.target.value }))} >
                    <option selected >{result?.rate?.[i]?.other_fees_currency}</option>
                    <option value="USD" >USD</option>
                    <option value="INR">INR</option>
                    <option value="Euro">Euro</option>
                  </select>
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    Other charges rate
                  </label>
                  <input
                    onChange={(e) => (setRate({ ...rate, other_fees_amount: e.target.value }))}
                    type="text" defaultValue={result?.rate?.[i]?.other_fees_amount}
                    className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
          <button className="sm:inline-flex  text-white bg-cyan-600 hover:bg-cyan-700 
                    focus:ring-4 focus:ring-cyan-200 font-semibold
                     rounded-lg text-sm px-5 py-2 text-center ml-16
                     items-center mb-1 ease-linear transition-all duration-150"
            onClick={() => {
              submitRateEdit();
              submitresultEdit();
              submitMasterRateEdit();
            }}
            type="button" >
            {language?.update}</button>
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
    </>
  )
}

export default Result