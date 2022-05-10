import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import Link from "next/link";
import english from "./Languages/en";
import french from "./Languages/fr";
import arabic from "./Languages/ar";
import { ToastContainer, toast } from 'react-toastify';

function Package() {
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
    const [allPackageDetails, setAllPackageDetails] = useState([])
    const [allBundleDetails, setAllBundleDetails] = useState([])

     /** To fetch current Property from Local Storage **/
    let currentProperty=JSON.parse(localStorage.getItem('property'))

    /** To fetch current Package from Local Storage **/
    let currentPackage=JSON.parse(localStorage.getItem('package'))

    useEffect(() => {
      const fetchDetails = async () => {
          try {
              const url = `/api/package/${currentPackage.package_id}`
              const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
              setAllPackageDetails(response.data)
              localStorage.setItem("packageDescription", JSON.stringify(allPackageDetails));
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
      const fetchRoomBundles = async () => {
          try {
              
              const url = `${ConfigData.SERVER_URL}/package/bundle/${props.package_id.id}`
              const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
             setAllBundleDetails(response.data)
          }
          catch (error) {
              if (error.response) {
                  toast.error("PackageError!", {
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
      fetchRoomBundles();
  },)

 
  return (
    <div id="main-content"
    className="bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64">
     {/* Header */}
     <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2">
                    <li className="inline-flex items-center">
                            <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                            <span className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2">
                            <Link href="/landing" >
                            {t.home}
                        </Link></span>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                            <span className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2"><Link href="/propertysummary" >{currentProperty?.property_name}</Link>
                            </span> </div>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                             <span className="text-gray-700 text-sm   font-medium hover:text-gray-900 ml-1 md:ml-2">
                            <Link href="/packages">Property Packages</Link></span>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                            <span className="text-gray-400 ml-1 md:ml-2 capitalize font-medium text-sm  " aria-current="page"> {allPackageDetails?.package_name}</span>
                        </div>
                    </li>
                </ol>
            </nav>
            <h6 className="text-xl pb-4 flex mr-4 leading-none  pt-2 font-bold text-gray-800 ">
               {t.package} {t.summary}
            </h6>
            {/* Body */} 
            <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-3">
                {/* Package Description */}
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-shrink-0">
                            <span className="text-xl sm:text-xl leading-none capitalize font-bold text-gray-800">{allPackageDetails?.package_name}</span>
                        </div>
                        <div className="flex items-center justify-end flex-1">
                          <span  className="text-sm font-sans underline decoration-cyan-600
                          font-semibold text-cyan-600
                           rounded-lg p-2"> 
                             <Link href='packagedescription'
                               >{t.seemore}</Link></span>
                        </div>
                    </div>
                    <p className="text-base font-semibold text-gray-500 capitalize truncate">
                        {allPackageDetails?.package_name} In {currentProperty?.property_name}
                    </p>
                    <p className="text-sm font-medium text-gray-90  line-clamp-10 ">
                        {allPackageDetails?.package_description}
                    </p>
                    <p className="text-sm capitalize font-semibold text-gray-500 pt-1 truncate">
                        Payment Holder- {allPackageDetails?.charge_currency}
                    </p>
                    <p className="text-sm font-semibold text-gray-500 my-1 truncate">
                        Refundable till, {allPackageDetails?.refundable_until_days} days {allPackageDetails?.refundable_until_time}
                    </p>
                    <div className="flex my-1">
                        <p className="text-sm font-semibold text-gray-500 truncate">
                            {allPackageDetails?.max_number_of_intended_occupants} Occupants
                        </p>
                        <p className="text-sm font-semibold ml-20 text-gray-500 truncate">
                            {allPackageDetails?.max_number_of_adult_guest} Adults
                        </p>
                    </div>
                    <div className="flex">
                        <span className="text-sm font-semibold mr-1 text-gray-500">Child Age-</span>
                        {allPackageDetails?.max_age_children?.map((item,idx) => {
                            return (
                                <span className="text-sm font-semibold text-gray-500" key={idx}>
                                    {item.max_age_of_child_guest}years<span className="ml-1"></span>
                                </span>
                            )
                        })}
                    </div>
                </div>

                {/* Package Rates */}
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-shrink-0">
                            <h3 className="text-base font-bold text-gray-900 mb-4"> {t.package} {t.rates}</h3>
                        </div>
                        <div className="flex items-center justify-end flex-1">
                        <span  className="text-sm font-sans underline decoration-cyan-600
                          font-semibold text-cyan-600
                           rounded-lg p-2"> 
                           <Link href = '/packagerates'
                                >{t.seemore}</Link></span>
                        </div>
                    </div>
                    <div className="align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden">
                            <table className="table-fixed min-w-full divide-y divide-gray-200">
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr className="hover:bg-gray-100">
                                        <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                            <td className="p-1 whitespace-wrap text-xs font-semibold text-gray-500"> {t.baserate}</td>
                                        </td>
                                        <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">{allPackageDetails?.base_rate_amount}<span className="ml-1 uppercase"> {allPackageDetails?.base_rate_currency}</span></td>
                                    </tr>
                                    <tr className="hover:bg-gray-100">
                                        <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                            <td className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">{t.taxrate}</td>
                                        </td>
                                        <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">{allPackageDetails?.tax_rate_amount}<span className="ml-1 uppercase"> {allPackageDetails?.tax_rate_currency}</span></td>
                                    </tr>
                                    <tr className="hover:bg-gray-100">
                                        <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                            <td className="p-1 whitespace-wrap text-xs font-semibold text-gray-500"> {t.other} {t.charges}</td>
                                        </td>
                                        <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">{allPackageDetails?.other_charges_amount}<span className="ml-1 uppercase"> {allPackageDetails?.other_charges_currency}</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Package Room Bundles */}
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-shrink-0">
                            <h3 className="text-base font-bold text-gray-900 mb-4">{t.package} {t.rooms}</h3>
                        </div>
                        <div className="flex items-center justify-end flex-1">
                        <span  className="text-sm font-sans underline decoration-cyan-600
                          font-semibold text-cyan-600
                           rounded-lg p-2"> 
                        <Link href= '/package-services'
                         className="text-sm font-sans underline decoration-cyan-600
             font-semibold text-cyan-600 p-1">{t.seemore}</Link></span>
                        </div>
                    </div>
                    <div className="align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden">
                            <table className="table-fixed min-w-full divide-y divide-gray-200">
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allBundleDetails?.map((item,index) => {
                                        return (
                                            <tr className="hover:bg-gray-100" key={index}>
                                                <td className="px-4 py-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                                    <td className="p-1 whitespace-wrap text-xs capitalize font-semibold text-gray-500">{item.room_name}</td>
                                                </td></tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-1 xl:grid-cols-3 gap-3">
                {/* Elite Membership Benefits */}
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-shrink-0">
                            <h3 className="text-base font-bold text-gray-900 mb-4">{t.elite} {t.membership}</h3>
                        </div>
                        <div className="flex items-center justify-end flex-1">
                        <span  className="text-sm font-sans underline decoration-cyan-600
                          font-semibold text-cyan-600
                           rounded-lg p-2">   
                            <Link href= '/eliterewards'>{t.seemore}</Link></span>
                        </div>
                    </div>
                    {allPackageDetails?.membership?.map((item) => {
                        return (
                            <>
                                <p className="text-sm font-semibold capitalize text-gray-70 truncate">
                                    {item?.program_name}
                                </p>
                                <p className="text-sm capitalize font-semibold text-gray-500 my-2">
                                    {item?.program_level}
                                </p>
                            </>
                        )
                    })}
                </div>

                {/* Package Miles */}
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-shrink-0">
                            <h3 className="text-base font-bold text-gray-900 mb-4"> {t.package} {t.miles}</h3>
                        </div>
                        <div className="flex items-center justify-end flex-1">
                        <span  className="text-sm font-sans underline decoration-cyan-600
                          font-semibold text-cyan-600
                           rounded-lg p-2"> 
                            <Link href='/packagemiles'>{t.seemore}</Link></span>
                        </div>
                    </div>
                    <div className="align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden">
                            <table className="table-fixed min-w-full divide-y divide-gray-200">
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allPackageDetails?.package_miles?.map((item) => {
                                        return (
                                            <>
                                                <tr className="hover:bg-gray-100">
                                                    <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                                        <td className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">{t.number} {t.of} {t.miles}</td>
                                                    </td>
                                                    <td className="p-1 whitespace-wrap text-xs font-medium text-gray-900">   {item?.number_of_miles}</td>
                                                </tr>
                                                <tr className="hover:bg-gray-100">
                                                    <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                                        <td className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">{t.miles} {t.provider}</td>
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
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 ">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-shrink-0">
                            <h3 className="text-base font-bold text-gray-900 mb-4">{t.property} {t.credit}</h3>
                        </div>
                        <div className="flex items-center justify-end flex-1">
                        <span  className="text-sm font-sans underline decoration-cyan-600
                          font-semibold text-cyan-600
                           rounded-lg p-2"> 
                            <Link href='/propertycredit'>{t.seemore}</Link></span>
                        </div>
                    </div>
                    <div className="align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden">
                            <table className="table-fixed min-w-full divide-y divide-gray-200">
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allPackageDetails?.package_property_credit?.map((item) => {
                                        return (
                                            <>
                                                <tr className="hover:bg-gray-100">
                                                    <td className="p-2 flex items-center whitespace-nowrap space-x-6 mr-6 lg:mr-0">
                                                        <td className="p-1 whitespace-wrap text-xs font-semibold text-gray-500">{t.credit} {t.amount}</td>
                                                    </td>
                                                    <td className="p-1 whitespace-wrap text-xs uppercase font-medium text-gray-900">{item.property_credit_amount}
                                                        {''} {item.property_credit_currency}</td>
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
  )
}

export default Package