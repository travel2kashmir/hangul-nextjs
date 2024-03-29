import React, { useEffect, useState } from 'react'
import Link from "next/link";
import Headloader from '../../../../components/loaders/headloader';
import Lineloader from '../../../../components/loaders/lineloader';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../../../components/Button';
import english from "../../../../components/Languages/en"
import french from "../../../../components/Languages/fr"
import arabic from "../../../../components/Languages/ar"
import Footer from "../../../../components/Footer"
import Sidebar from '../../../../components/Sidebar';
import Header from '../../../../components/Header'
import Router from "next/router";
const logger = require("../../../../services/logger");
var language;
var currentProperty;
var max_age = [];
var final = [];
var currentPackage;
var currentLogged;

function Packagedescription() {
  const [disp, setDisp] = useState([]);
  const [flag, setFlag] = useState([]);
  const [age, setAge] = useState([]);

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
        currentPackage = localStorage.getItem('packageId')
        currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
        setDisp([])
      }
    }
    firstfun();
    Router.push("./packagedescription");
  }, [])

  const [allPackageDetails, setAllPackageDetails] = useState([])
  const [packageDetails, setPackageDetails] = useState([])
  const [visible,setVisible]=useState(0) 
 
  /* Edit Package Fetch Function */
  const fetchDetails = async () => {
    const url = `/api/package/${currentPackage}`
    axios.get(url, { header: { "content-type": "application/json" } }).then
      ((response) => {
        logger.info("package success");
        setAllPackageDetails(response.data)
        setVisible(1)
      })
      .catch((error) => {
        logger.info("Package fetch error")
      })

  }
  useEffect(() => {
    fetchDetails();
  }, [])

  /* Edit Package Edit Function */
  const submitPackageEdit = () => {
    if (flag.length !== 0) {
      var time;
      var temp = `2022-01-01 ` + allPackageDetails?.refundable_until_time;
      time = new Date(temp.toString())
      const final_data = {
        "package_id": allPackageDetails?.package_id,
        "package_name": allPackageDetails?.package_name,
        "package_description": allPackageDetails?.package_description,
        "charge_currency": allPackageDetails?.charge_currency,
        "refundable": allPackageDetails?.refundable,
        "refundable_until_days": allPackageDetails?.refundable_until_days,
        "refundable_until_time":  time.getTime() ,
        "max_number_of_intended_occupants": allPackageDetails?.max_number_of_intended_occupants,
        "max_number_of_adult_guest": allPackageDetails?.max_number_of_adult_guest,
        "check_in":allPackageDetails?.check_in,
        "check_out":allPackageDetails?.check_out
      }
      const url = '/api/package/package_description'
      axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
        ((response) => {
          toast.success("Package Description Updated Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          fetchDetails();
          setFlag([])
          setPackageDetails([])
        })
        .catch((error) => {
          toast.error("Package Description Update Error!", {
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
    else {
      toast.error("Please fill the package details", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  /** Function submit max age **/
  const submitAge = () => {
    if(age.length !== 0){
    axios.delete(`/api/package/${allPackageDetails?.package_id}/max_age`)
      .then((response) => {
        logger.info("max age delete success");
        max_age.forEach((item) => {
          const temp = {
            package_id: allPackageDetails?.package_id,
            max_age: item
          }
          final.push(temp);
        });
        const final_data = { "max_age_child": final }
        const url = '/api/package/max_age_children'
        axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
          ((response) => {
            toast.success("Max age Updated Successfully!", {
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
            logger.error("Max age child error");
          })
      })
      .catch((error) => {
        logger.error("max age delete error")
      });
    }
  }

  return (
    <>
      <Header Primary={english?.Side2}/>
      <Sidebar  Primary={english?.Side2}/>
      <div id="main-content"
        className="bg-gray-50 px-4 pt-24 py-2 relative overflow-y-auto lg:ml-64">
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
              <span className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center">
              <Link href={currentLogged?.id.match(/admin.[0-9]*/)?"../../../admin/AdminLanding":"../../landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
                </Link>
              </span>
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
                <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
                <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                                <div className={visible === 1 ? 'block' : 'hidden'}>
                  <Link href="../../propertysummary">
                    <a>{currentProperty?.property_name}</a>
                  </Link></div>
                </span>
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
                <span className="text-gray-700 text-sm   font-medium hover:text-gray-900 ml-1 md:ml-2">
                  <Link href="../../packages">
                    <a>{language?.packages}</a>
                  </Link>
                </span>
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
                <span className="text-gray-700 text-sm capitalize font-medium hover:text-gray-900 ml-1 md:ml-2">
                <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                                <div className={visible === 1 ? 'block' : 'hidden'}>
		
                  <Link href="../package">
                    <a> {allPackageDetails?.package_name}</a>
                  </Link></div>
                </span>
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
                  {language?.package} {language?.description}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        {/* Package Details Form */}
        <div className="bg-white shadow rounded-lg  my-2 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
          <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
            {language?.package} {language?.description}
            <svg
              className="ml-2 h-6 mb-2 w-6 font-semibold"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clipRule="evenodd"
              ></path>
            </svg>
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
                      {language?.package} {language?.name}
                    </label>
                    <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <input
                      type="text"
                      className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allPackageDetails?.package_name}
                      onChange={(e) =>
                        setAllPackageDetails({
                          ...allPackageDetails,
                          package_name: e.target.value
                        }, setFlag(1))
                      }
                    /></div>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block  mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.package} {language?.description}
                    </label>
                    <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <textarea
                      rows="2"
                      columns="50"
                      className="shadow-sm bg-gray-50 border capitalize border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allPackageDetails?.package_description}
                      onChange={(e) =>
                        setAllPackageDetails({
                          ...allPackageDetails,
                          package_description: e.target.value,
                        }, setFlag(1))
                      }
                    /></div>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.paymentholder}
                    </label>
                    <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <select
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={(e) =>
                        setAllPackageDetails({
                          ...allPackageDetails,
                          charge_currency: e.target.value,
                        }, setFlag(1))
                      }
                    >
                      <option value="web">Web</option>
                      <option value="hotel">Hotel</option>
                      <option value="installment">Installment</option>
                      <option value="deposit">Deposit</option>
                    </select></div>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.refundable}
                    </label>
                    <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <select
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={(e) =>
                        setAllPackageDetails({
                          ...allPackageDetails,
                          refundable: e.target.value,
                        }, setFlag(1))
                      }
                    >
                      {allPackageDetails?.refundable == "true"
                        ?
                        <option value={true}>Yes</option>
                        : <option value={false}>No</option>}

                      <option value={true}>Yes</option>
                      <option value={false}>No</option>
                    </select></div>
                  </div>
                </div>
                {allPackageDetails?.refundable === "true" ? (
                  <>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="text-sm font-medium text-gray-900 block mb-2"
                          htmlFor="grid-password"
                        >
                          {language?.refundable} {language?.till} {language?.days}
                        </label>
                        <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="text"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                          defaultValue={allPackageDetails?.refundable_until_days}
                          onChange={(e) =>
                            setAllPackageDetails({
                              ...allPackageDetails,
                              refundable_until_days: e.target.value,
                            }, setFlag(1))
                          }
                        /></div>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="text-sm font-medium text-gray-900 block mb-2"
                          htmlFor="grid-password"
                        >
                          {language?.refundable} {language?.till} {language?.time}
                        </label>
                        <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="time" step="2"
                          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                          defaultValue={allPackageDetails?.refundable_until_time}
                          onChange={(e) =>
                            setAllPackageDetails({
                              ...allPackageDetails,
                              refundable_until_time: e.target.value,
                            }, setFlag(1))
                          }
                        /></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.number} {language?.of} {language?.occupants}
                    </label>
                    <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      onChange={(e) =>
                        setAllPackageDetails({
                          ...allPackageDetails,
                          max_number_of_intended_occupants: e.target.value,
                        }, setFlag(1), setDisp(1))
                      }
                      defaultValue={
                        allPackageDetails?.max_number_of_intended_occupants
                      }
                    /></div>
                  </div>
                </div>

                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="text-sm font-medium text-gray-900 block mb-2"
                      htmlFor="grid-password"
                    >
                      {language?.number} {language?.of} {language?.adult}
                    </label>
                    <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <input
                      type="text"
                      className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={allPackageDetails?.max_number_of_adult_guest}
                      onChange={(e) =>
                        setAllPackageDetails({
                          ...allPackageDetails,
                          max_number_of_adult_guest: e.target.value,
                        }, setFlag(1), setDisp(1))
                      }
                    /></div>
                  </div>
                </div>

                {disp.length !== 0 ? <>
                  {allPackageDetails?.max_number_of_intended_occupants -
                    allPackageDetails?.max_number_of_adult_guest >= 1 ?
                    <>
                      {final = []} {max_age = []}
                      {[...Array(allPackageDetails?.max_number_of_intended_occupants -
                        allPackageDetails?.max_number_of_adult_guest)]
                        ?.map((item, index) => (
                          <div className="w-full lg:w-6/12 px-4" key={index}>
                            <div className="relative w-full mb-3">
                              <label
                                className="text-sm font-medium text-gray-900 block mb-2"
                                htmlFor="grid-password"
                              >
                                Maximum Age Of Child
                              </label>
                              <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                              <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 
                 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                                onChange={(e) =>
                                  max_age[index] = e.target.value
                                }>
                                <option selected >Select </option>
                                <option value="1" >1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5" >5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9" >9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                              </select></div>
                            </div>

                          </div>
                        ))}
                    </>
                    : <></>}
                </> : <></>}

                {disp.length === 0 ? <>
                  {allPackageDetails?.max_age_children?.map((item, idx) => {
                    return (
                      <div className="w-full lg:w-6/12 px-4" key={idx}>
                        <div className="relative w-full mb-3">
                          <label
                            className="text-sm font-medium text-gray-900 block mb-2"
                            htmlFor="grid-password"
                          >
                            Maximum Age Of Child
                          </label>
                          <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                          <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 
                         sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={(e) =>
                             (max_age[index] = e.target.value,setAge(1))
                            }>
                            <option selected >{item?.max_age_of_child_guest} </option>
                            <option value="1" >1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5" >5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9" >9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                          </select></div>
                        </div>

                      </div>
                    );
                  })}
                </> : <></>}

                {/*Check in */}
            <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.checkin}  {language?.time}
                  </label>
                  <input type="time" name="time" defaultValue={allPackageDetails?.check_in}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  onChange={
                    (e) => (
                        setAllPackageDetails({ ...allPackageDetails, check_in: e.target.value })
                    )
                } />
                 </div>
              </div>

               {/*Check out */}
            <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block  mb-2"
                    htmlFor="grid-password"
                  >
                    {language?.checkout} {language?.time}
                  </label>
                  <input type="time" name="time" 
                  defaultValue={allPackageDetails?.check_out}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  onChange={
                    (e) => {
                      
                        setAllPackageDetails({ ...allPackageDetails, check_out: e.target.value })
                    }
                } />
                 </div>
              </div>


                <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                  <Button Primary={language?.Update}  onClick={() => { alert(JSON.stringify(allPackageDetails));submitPackageEdit(); submitAge(); }} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Toast Container */}
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
      </div>
      <Footer />
    
    </>
  );
}

export default Packagedescription
Packagedescription.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )


}