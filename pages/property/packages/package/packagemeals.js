import React, { useEffect, useState } from 'react'
import Link from "next/link";
import Headloader from '../../../../components/loaders/headloader';
import Imageloader from '../../../../components/loaders/imageloader';
import validateRoomGallery from '../../../../components/Validation/editGallery';
import DarkModeLogic from "../../../../components/darkmodelogic";
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
var i=0;
var currentPackage;
var currentLogged;

function PackageMeals() {
  const [disp, setDisp] = useState([]);
  const [flag, setFlag] = useState([]);
  const [error, setError] = useState({})
  const [darkModeSwitcher, setDarkModeSwitcher] = useState();
  const [color, setColor] = useState({})
  const [allPackageDetails, setAllPackageDetails] = useState([]);
  const [meals, setMeals] = useState([]);
  const [packageDetails, setPackageDetails] = useState([])
  const [visible,setVisible]=useState(0) 

  useEffect(() => {
    const firstfun = () => {
      if (typeof window !== 'undefined') {
        var locale = localStorage.getItem("Language");
        const colorToggle = JSON.parse(localStorage.getItem("ColorToggle"));
        const color = JSON.parse(localStorage.getItem("Color"));
         setColor(color);
         setDarkModeSwitcher(colorToggle)
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
    Router.push("./packagemeals");
  }, [])

 
  /* Edit Package Fetch Function */
  const fetchDetails = async () => {
    const url = `/api/package/${currentPackage}`
    axios.get(url, { header: { "content-type": "application/json" } }).then
      ((response) => {
        logger.info("package success");
        setAllPackageDetails(response.data);
        setMeals(response?.data?.package_meals?.[i])
        setVisible(1)
      })
      .catch((error) => {
        logger.info("Package fetch error")
      })

  }

  useEffect(() => {
    fetchDetails();
  }, [])

  useEffect(()=>{ 
    setColor(DarkModeLogic(darkModeSwitcher))
   },[darkModeSwitcher])

/* Function for Package Property Credit */
const editPackageMeals= () => {
    const current_data = [{
      "meal_id": meals?.meal_id,
      "meal_type": meals?.meal_type,
      "included": meals?.included,
      "buffet": meals?.buffet,
      "in_room": meals?.in_room,
      "in_private_space": meals?.in_private_space,
  
    }]
    const final_data= {"package_meals": current_data}
    const url = '/api/package/package_meals'
    axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Package meals update success.", {
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
        toast.error("Package meals update error. ", {
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
 
   /* Function for Package Property Credit */
const submitPackageMeals= () => {
 
    const current_data = [{
      "package_id":currentPackage,
      "meal_type": meals?.meal_type,
      "included": meals?.included,
      "buffet": meals?.buffet,
      "in_room": meals?.in_room,
      "in_private_space": meals?.in_private_space,
  
    }]
    const final_data= {"package_meals": current_data}
    const url = '/api/package/package_meals'
    axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Package meals add success.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
         setAllPackageDetails([]);
         setDisp(6);
      })
      .catch((error) => {
        toast.error("Package meals add error! ", {
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
                  {language?.package} Meals
                </span>
              </div>
            </li>
          </ol>
        </nav>
        {/* Package Meals Form */}
        <div className="bg-white shadow rounded-lg  my-2 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
          <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
            {language?.package} Meals
            
          </h6>
          <div className="pt-6">
                <div className=" md:px-2 mx-auto w-full">
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                         Meal Type
                        </label>
                        <select className={`shadow-sm ${color?.greybackground} capitalize border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setMeals({ ...meals, meal_type: e.target.value })
                            )
                          }>
                          <option selected disabled>
                            {allPackageDetails?.package_meals?.[i] === undefined ?
                            <>{language?.select}</>
                            :
                            <>
                            {meals?.meal_type}
                            </>
                            }</option>
                          <option value="breakfast">Breakfast</option>
                          <option  value="dinner">Dinner</option>
                         
                        </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.meal_type}</p>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                         Included
                        </label>
                        <select className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setMeals({ ...meals, included: e.target.value })
                            )
                          }>
                          <option selected disabled>
                          <option selected disabled>
                            {allPackageDetails?.package_meals?.[i] === undefined ?
                            <>{language?.select}</>
                            :
                            <>
                            {JSON.stringify(meals?.included) === "true" ? "Yes" : "No"}
                            </>
                            }</option>
                           </option>
                          <option value={true}>Yes</option>
                          <option  value={false}>No</option>
                         
                        </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.included}</p>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                         Buffet
                        </label>
                        <select className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setMeals({ ...meals,buffet: e.target.value })
                            )
                          }>
                          <option selected disabled>
                          {allPackageDetails?.package_meals?.[i] === undefined ?
                            <>{language?.select}</>
                            :
                            <>
                            {JSON.stringify(meals?.buffet) === "true" ? "Yes" : "No"}
                            </>
                            }

                            </option>
                          <option value={true}>Yes</option>
                          <option  value={false}>No</option>
                         
                        </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.buffet}</p>
                      </div>
                    </div>

                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                         In Room
                        </label>
                        <select className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setMeals({ ...meals, in_room: e.target.value })
                            )
                          }>
                          <option selected disabled>
                          {allPackageDetails?.package_meals?.[i] === undefined ?
                            <>{language?.select}</>
                            :
                            <>
                             {JSON.stringify(meals?.in_room) === "true" ? "Yes" : "No"}
                         </>
                            }
                            </option>
                          <option value={true}>Yes</option>
                          <option  value={false}>No</option>
                         
                        </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.in_room}</p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className={`text-sm font-medium ${color?.text} block mb-2`}
                          htmlFor="grid-password"
                        >
                        Private Space
                        </label>
                        <select className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setMeals({ ...meals, in_private_space: e.target.value })
                            )
                          }>
                          <option selected disabled>
                          {allPackageDetails?.package_meals?.[i] === undefined ?
                            <>{language?.select}</>
                            :
                            <>
                           {JSON.stringify(meals?.in_private_space) === "true" ? "Yes" : "No"}
                            </>
                            }</option>
                          <option value={true}>Yes</option>
                          <option  value={false}>No</option>
                         
                        </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                          {error?.in_private_space}</p>
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                        {allPackageDetails?.package_meals?.[i] === undefined ?
                      <Button Primary={language?.Submit} onClick={submitPackageMeals} />:
                      <Button Primary={language?.Update} onClick={editPackageMeals} />}
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

export default PackageMeals
PackageMeals.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )


}