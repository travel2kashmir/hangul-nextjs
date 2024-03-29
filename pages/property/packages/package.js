import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import Link from "next/link";
import Headloader from '../../../components/loaders/headloader';
import english from "../../../components/Languages/en"
import french from "../../../components/Languages/fr"
import arabic from "../../../components/Languages/ar"
import Router from "next/router";
import Footer from "../../../components/Footer"
import Sidebar from '../../../components/Sidebar'
import Header from '../../../components/Header'
import Loader from "../../../components/loader";
var language;
var currentProperty;
var currentPackage;
var property;
var id=[];
var filtered=[]
var resArr=[]
var currentPackageRooms=[]
import { ToastContainer, toast } from 'react-toastify';
var currentLogged;

function Package() {
    const [visible,setVisible]=useState(0)
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
             /** To fetch current Package from Local Storage **/
            currentPackage=localStorage.getItem('packageId')
            currentPackageRooms=JSON.parse(localStorage.getItem('packageDescription'))
            currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
          } 
        }
        firstfun();
        Router.push("./package");
      },[]) 

    const [allRooms, setAllRooms] = useState([])
    const [allPackageDetails, setAllPackageDetails] = useState([])
    const [allBundleDetails, setAllBundleDetails] = useState([])
    const [fill,setFill]=useState([])

    useEffect(() => {
        
      const fetchDetails = async () => {
          try {
              const url = `/api/package/${currentPackage}`
              const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
              setAllPackageDetails(response.data)
              setVisible(1)
          }
          catch (error) {
              if (error.response) {
                  toast.error("Package Error!", {
                      position: "top-center",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
              } else {
                  toast.error("Package Error!", {
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

      }
      fetchDetails();
     
      const fetchRooms = async () => {
        try {
            const url = `/api/rooms/${currentProperty.property_id}`
            const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
           setAllRooms(response.data)
         }
        catch (error) {

            if (error.response) {
                } 
            else {
            }
        }
    }
    fetchRooms();
  },[])

  return (
    <>
     <Header Primary={english?.Side1}/>
    <Sidebar  Primary={english?.Side1}/>
    <div id="main-content"
        className="bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64">
        {/* Header */}
     <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2">
                    <li className="inline-flex items-center">
                            <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                            <p className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2">
                            <Link href={currentLogged?.id.match(/admin.[0-9]*/)?"../../admin/AdminLanding":"../landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
                </Link></p>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                            <p className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2">
                                <Link href="../propertysummary"><a>{currentProperty?.property_name}</a></Link>
                            </p> </div>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                             <p className="text-gray-700 text-sm   font-medium hover:text-gray-900 ml-1 md:ml-2">
                            <Link href="../packages"><a>{language?.propertypackages}</a></Link></p>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                            <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                                <div className={visible === 1 ? 'block' : 'hidden'}>
                            <p className="text-gray-400 ml-1 md:ml-2 capitalize font-medium text-sm  " aria-current="page"> {allPackageDetails?.package_name}</p>
                         </div>
                        </div>
                    </li>
                </ol>
     </nav>
            <h6 className="text-xl pb-4 flex mr-4 leading-none  pt-2 font-bold text-gray-800 ">
               {language?.package} {language?.summary}
            </h6>
            {/* Body */} 
            <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-3">
                {/* Package Description */}
                <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-shrink-0">
                            <p className="text-xl sm:text-xl leading-none capitalize font-bold text-gray-800">{allPackageDetails?.package_name}</p>
                        </div>
                        <div className="flex items-center justify-end flex-1">
                          <p  className="text-sm font-sans underline decoration-cyan-600
                          font-semibold text-cyan-600
                           rounded-lg p-2"> 
                             <Link href="./package/packagedescription"
                               ><a>{language?.seemore}</a></Link></p>
                        </div>
                    </div>
                    <div className="align-middle inline-block min-w-full">
                        <div className="shadow-xl overflow-hidden">
                            <table className="table-fixed min-w-full divide-y divide-gray-200">
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                            <p className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">{language?.packagedescription}</p>
                                        </td>
                                        <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">{allPackageDetails?.package_name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                            <p className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">Charge currency</p>
                                        </td>
                                        <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">{allPackageDetails?.charge_currency}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                            <p className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">{language?.occupants}</p>
                                        </td>
                                        <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">{allPackageDetails?.max_number_of_intended_occupants}
                                        </td>
                                    </tr>
                                   
                                    <tr>
                                        <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                            <p className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">{language?.adult}</p>
                                        </td>
                                        <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">{allPackageDetails?.max_number_of_intended_occupants}
                                      </td>
                                    </tr>
                                   { allPackageDetails?.refundable === "true" ?
                                   <>
                                    <tr >
                                        <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                            <p className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">{language?.refundable} {language?.till}</p>
                                        </td>
                                        <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">{allPackageDetails?.refundable_until_days}{language?.days}, {allPackageDetails?.refundable_until_time}
                                      </td>
                                    </tr> 
                                    </>:<></>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                   
                </div>

                {/* Package Rates */}
                <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-shrink-0">
                            <h3 className="text-base font-bold text-gray-900 mb-4">  {language?.package} {language?.rates}</h3>
                        </div>
                        <div className="flex items-center justify-end flex-1">
                        <p  className="text-sm font-sans underline decoration-cyan-600
                          font-semibold text-cyan-600
                           rounded-lg p-2"> 
                         <Link href = './package/packagerates' 
                                ><a>{language?.seemore}</a></Link></p>
                        </div>
                    </div>
                    <div className="align-middle inline-block min-w-full">
                        <div className="shadow-xl overflow-hidden">
                            <table className="table-fixed min-w-full divide-y divide-gray-200">
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                            <p className="p-1 whitespace-wrap text-xs font-semibold text-gray-500"> {language?.baserate}</p>
                                        </td>
                                        <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">{allPackageDetails?.base_rate_amount}<p className="ml-1 uppercase"> {allPackageDetails?.base_rate_currency}</p></td>
                                    </tr>
                                    <tr>
                                        <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                            <p className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">{language?.taxrate}</p>
                                        </td>
                                        <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">{allPackageDetails?.tax_rate_amount}<p className="ml-1 uppercase"> {allPackageDetails?.tax_rate_currency}</p></td>
                                    </tr>
                                    <tr>
                                        <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                            <p className="p-1 whitespace-wrap text-xs font-semibold text-gray-500"> {language?.other} {language?.charges}</p>
                                        </td>
                                        <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">{allPackageDetails?.other_charges_amount}
                                        <p className="ml-1 uppercase"> {allPackageDetails?.other_charges_currency}</p></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                   
                   
                </div>

                {/* Package Services */}
               
                 <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-shrink-0">
                            <h3 className="text-base font-bold text-gray-900 mb-4">{language?.package} {language?.services}</h3>
                        </div>
                        <div className="flex items-center justify-end flex-1">
                        <p  className="text-sm font-sans underline decoration-cyan-600
                          font-semibold text-cyan-600
                           rounded-lg p-2"> 
                        <Link href= './package/packageservices'
                         className="text-sm font-sans underline decoration-cyan-600
             font-semibold text-cyan-600 p-1"><a>{language?.seemore}</a></Link></p>
                        </div>
                    </div>
                    <div className="flex flex-wrap">
              <p>
                <button
                  className="text-sm  font-semibold  text-cyan-700 
                            bg-gray-200 rounded-lg p-2 mx-1  mb-2 "
                >
                  Breakfast Included
                </button>
                <button
                  className="text-sm  font-semibold  text-cyan-700 
                            bg-gray-200 rounded-lg p-2 mx-1  mb-2"
                >
                 Parking Available
                </button>
              </p>
              <br />
              <p>
                <button
                  className="text-sm  font-semibold  text-cyan-700 
                            bg-gray-200 rounded-lg p-2 mx-1  mb-2"
                >
                  Internet Included
                </button>
                <button
                  className="text-sm  font-semibold  text-cyan-700 
                            bg-gray-200 rounded-lg p-2 mx-1  mb-2"
                >
                  Airport Shuttle
                </button>
              </p>
              <br />
              <p>
                <button
                  className="text-sm  font-semibold  text-cyan-700 
                            bg-gray-200 rounded-lg p-2 mx-1  mb-2"
                >
                 Transportation Charges
                </button>
              </p>
             
            </div>
                </div>
            </div>

            <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-3">
                {/* Elite Membership Benefits */}
                <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-shrink-0">
                            <h3 className="text-base font-bold text-gray-900 mb-4">{language?.elite} {language?.membership}</h3>
                        </div>
                        <div className="flex items-center justify-end flex-1">
                        <p  className="text-sm font-sans underline decoration-cyan-600
                          font-semibold text-cyan-600
                           rounded-lg p-2">   
                            <Link href= './package/eliterewards'><a>{language?.seemore}</a></Link></p>
                        </div>
                    </div>

                    <div className="align-middle inline-block min-w-full">
                        <div className="shadow-xl overflow-hidden">
                            <table className="table-fixed min-w-full divide-y divide-gray-200">
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allPackageDetails?.membership?.map((item,idx) => {
                                        return (
                                            <>
                                                <tr  key={idx}>
                                                    <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                                        <p className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">{language?.program} {language?.name}</p>
                                                    </td>
                                                    <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">{item?.program_name}</td>
                                                </tr>
                                                <tr >
                                                    <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                                        <p className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">{language?.program} {language?.level}</p>
                                                    </td>
                                                    <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">   {item?.program_level}</td>
                                                </tr>
                                            </>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Package Miles */}
                <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-shrink-0">
                            <h3 className="text-base font-bold text-gray-900 mb-4"> {language?.package} {language?.miles}</h3>
                        </div>
                        <div className="flex items-center justify-end flex-1">
                        <p  className="text-sm font-sans underline decoration-cyan-600
                          font-semibold text-cyan-600
                           rounded-lg p-2"> 
                            <Link href='./package/packagemiles'><a>{language?.seemore}</a></Link></p>
                        </div>
                    </div>
                    <div className="align-middle inline-block min-w-full">
                        <div className="shadow-xl overflow-hidden">
                            <table className="table-fixed min-w-full divide-y divide-gray-200">
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allPackageDetails?.package_miles?.map((item,idx) => {
                                        return (
                                            <>
                                                <tr  key={idx}>
                                                    <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                                        <p className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">{language?.number} {language?.of} {language?.miles}</p>
                                                    </td>
                                                    <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">   {item?.number_of_miles}</td>
                                                </tr>
                                                <tr >
                                                    <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                                        <p className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">{language?.miles} {language?.provider}</p>
                                                    </td>
                                                    <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">  {item?.provider}</td>
                                                </tr>
                                            </>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Property Credit */}
                <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-shrink-0">
                            <h3 className="text-base font-bold text-gray-900 mb-4">{language?.property} {language?.credit}</h3>
                        </div>
                        <div className="flex items-center justify-end flex-1">
                        <p  className="text-sm font-sans underline decoration-cyan-600
                          font-semibold text-cyan-600
                           rounded-lg p-2"> 
                            <Link href='./package/propertycredit'><a>{language?.seemore}</a></Link></p>
                        </div>
                    </div>
                    <div className="align-middle inline-block min-w-full">
                        <div className="shadow-xl overflow-hidden">
                            <table className="table-fixed min-w-full divide-y divide-gray-200">
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allPackageDetails?.package_property_credit?.map((item,idx) => {
                                        return (
                                           
                                                <tr className="hover:bg-gray-100" key={idx}>
                                                    <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                                        <p className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">{language?.credit} {language?.amount}</p>
                                                    </td>
                                                    <td className="p-1 whitespace-wrap text-xs uppercase font-medium text-gray-900">{item.property_credit_amount}
                                                        {''} {item.property_credit_currency}</td>
                                                </tr>
                                            
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                 {/* Package Rooms */}
                <div className="bg-white shadow-xl rounded-lg p-4 sm:p-6 xl:p-8 ">
                <div className="flex items-center justify-between mb-4">
                        <div className="flex-shrink-0">
                            <h3 className="text-base font-bold text-gray-900 mb-4"> {language?.package} {language?.rooms}</h3>
                        </div>
                        <div className="flex items-center justify-end flex-1">
                        <p  className="text-sm font-sans underline decoration-cyan-600
                          font-semibold text-cyan-600
                           rounded-lg p-2"> 
                         <Link href = './package/packagerooms' 
                                ><a>{language?.seemore}</a></Link></p>
                        </div>
                    </div>
                <div className="align-middle pt-4 inline-block min-w-full">
                        <div className="shadow-xl overflow-hidden">
                            <table className="table-fixed min-w-full divide-y divide-gray-200">
                                <tbody className="bg-white divide-y divide-gray-200">
                                <tr className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                <p className=" whitespace-wrap text-xs font-semibold text-gray-500">{language?.package} {language?.rooms}</p>
                                 </tr>
                                    {allPackageDetails?.package_rooms?.map((item,idx) => {
                                        return (
                                            <>
                                                <tr  key={idx}> 
                                                    <td className="p-2 capitalize whitespace-wrap text-xs font-medium text-gray-900">{item?.room_name}</td>
                                                </tr>
                                                
                                            </>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </div>
                   
            </div>
    </div>
    <Footer/>
    </>
  )
}

export default Package
Package.getLayout = function PageLayout(page){
    return(
      <>
      {page}
      </>
    )
  }