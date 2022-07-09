import React, { useEffect, useState } from 'react'
import Link from "next/link";
import axios from "axios";
import TableList from '../../../../components/Table/TableList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from '../../../../components/Button'
import english from "../../../../components/Languages/en"
import french from "../../../../components/Languages/fr"
import arabic from "../../../../components/Languages/ar"
import Router from "next/router";
const logger = require("../../../../services/logger");
import Footer from "../../../../components/Footer"
var language;
var currentProperty;
var service_name = [];
var service_value = [];
var currentPackage;

function Packageservices() {
  const [packageServices, setPackageServices] = useState([])
  const [additionalPackageServices, setAdditionalPackageServices] = useState([])
  const [allPackageDetails, setAllPackageDetails] = useState([])
 const [actionService, setActionService] = useState({})
  const [modified, setModified] = useState([])
  const [addEdit, setAddEdit] = useState(0)
  const[gen,setGen] = useState([])
  const [addDel, setAddDel] = useState(0)
  const [add, setAdd] = useState(0)

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
    currentPackage = localStorage.getItem('packageId')
    Router.push("./packageservices");
  }, [])

  const fetchPackageServices = async () => {
    const url = `/api/package/package_services_link/${currentPackage}`
    axios.get(url)
      .then((response) => {
        setPackageServices(response.data);
        logger.info("url  to fetch package services hitted successfully")
      }
      )
      .catch((error) => { logger.error("url to fetch package services, failed") });
  }

  const fetchAdditionalPackageServices = async () => {
    var geneData=[];  
    const url = `/api/package/additional_package_services/${currentPackage}`
    axios.get(url)
      .then((response) => {
        setAdditionalPackageServices(response.data);
        logger.info("url  to fetch additional package services hitted successfully")
        {response.data?.map((item) => {
          var temp={
            name:item.add_package_service_name,
            type:item.add_package_service_description,
            status:item.status,
            id:item.add_package_service_id
          }
          geneData.push(temp)
        })
        setGen(geneData);
        
      }

      }
      )
      .catch((error) => { logger.error("url to fetch additional package services, failed") });
  }

 /* Edit Package Fetch Function */
 const fetchDetails = async  () => {
  const url = `/api/package/${currentPackage}`
   axios.get(url, { header: { "content-type": "application/json" } }).then
     ((response) => {
     logger.info("package success");
     setAllPackageDetails(response.data)
     })
     .catch((error) => {
      logger.info("Delete error")
     })

 }
  useEffect(() => {
    fetchAdditionalPackageServices();
    fetchPackageServices();
    fetchDetails();  
  }, [])

  /** Function package services **/
  const submitPackageServices = () => {
    var total = { "package_services": packageServices }
    const url = '/api/package/package_service_link'
    axios.put(url, total, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Package Services Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchPackageServices();
        Router.push("./packageservices");
      })
      .catch((error) => {
        toast.error("Package Services Update Error! ", {
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

  /*Function to edit additional services*/
  const editAdditionalPackageServices = () => {
    if (modified.length !== 0) {
      const data = [{
        "add_package_service_id": actionService.id,
        "add_package_service_name": modified.add_package_service_name,
        "package_id": currentPackage,
        "add_package_service_description": modified.add_package_service_description,
        "status": modified.status
      }]
      const final_data = { "additional_package_services": data }
     
      const url = '/api/package/additional_package_services'
      axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
        ((response) => {
          toast.success("Additional Services Updated Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          fetchAdditionalPackageServices();
          Router.push("./packageservices");
          setModified([])
        })
        .catch((error) => {

          toast.error("Additional Package Services Update Error!", {
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

  /*Function to add additional service*/
  const newAdditionalService = () => {
    if (modified.length !== 0) {
      const final_data = {
        "additional_package_services": [{
          "add_package_service_name": modified.add_package_service_name,
          "add_package_service_description": modified.add_package_service_description,
          "package_id": currentPackage,
          "status": true
        }]
      }
  
      const url = '/api/package/additional_package_services'
      axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
        ((response) => {
          toast.success("Service Added Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          fetchAdditionalPackageServices();
          Router.push("./packageservices");
          setModified([])
        })
        .catch((error) => {
          toast.error("Additional Services Add Error! ", {
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
  
  /* Function to delete additional service */
  const deleteAdditionalService = () => {
    const url = `/api/package/${actionService?.id}`
    axios.delete(url).then((response) => {
      toast.success(("Additional Package Service Deleted Successfully!"), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      fetchAdditionalPackageServices();
      Router.push("./packageservices");

    })
      .catch((error) => {
        toast.error(("Additional Service Delete Error!"), {
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
      <Sidebar  Primary={english?.Side2} />
      <div
        id="main-content"
        className="bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64"
      >
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
                <Link href="../../landing">
                  <a> {language?.home}</a>
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
                  <Link href="../../propertysummary">
                    <a>{currentProperty?.property_name}</a>
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
                  <Link href="../package">
                    <a> {allPackageDetails?.package_name}</a>
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
                <span
                  className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  "
                  aria-current="page"
                >
                  {language?.package} {language?.services}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
          <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-8">
            {language?.package} {language?.services}
          </h6>
          <span className="hidden">
            {(service_name.length = 0)}
            {(service_value.length = 0)}{" "}
          </span>
          {/* Packages Table */}
          <div className="flex flex-col my-4">
            {packageServices?.map((i) => {
              service_name.push(i.service_id);
              service_value.push(i.value);
            })}
            <div className="overflow-x-auto">
              <div className="align-middle inline-block min-w-full">
                <div className="shadow overflow-hidden">
                  <table className="table-fixed min-w-full divide-y mx-8 divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th
                          scope="col"
                          className="py-4 px-2 text-left text-xs font-semibold text-gray-500 uppercase"
                        >
                          {language?.service} {language?.name}
                        </th>
                        <th
                          scope="col"
                          className="py-4 px-2 text-left text-xs font-semibold text-gray-500 uppercase"
                        >
                          {language?.service} {language?.edit}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {packageServices?.map((item, idx) => (
                        <tr className="hover:bg-gray-100" key={idx}>
                          <td className="py-4 py-2 flex items-center whitespace-nowrap space-x-6 mr-12 lg:mr-0">
                            <span className="py-4 px-2 whitespace-nowrap text-base font-medium capitalize text-gray-900">
                              {"  " +
                                item?.package_service_name?.replace(/_+/g, " ")}
                            </span>
                          </td>

                          <td className="px-2 py-4 whitespace-nowrap text-base font-normal text-gray-900">
                            <div className="flex">
                              <div className="form-check ml-4 form-check-inline">

                                <label htmlFor={"default-toggle" + idx} className="inline-flex relative items-center cursor-pointer">

                                  <input type="checkbox" value={item?.value} checked={item.value === true}
                                    onChange={() => {
                                      setPackageServices(packageServices?.map((i) => {

                                        if (i?.service_id === item?.service_id) {
                                          i.value = !i.value
                                        }
                                        return i
                                      }))
                                    }}

                                    id={"default-toggle" + idx} className="sr-only peer" />

                                  <div
                                    className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                                 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
                                 peer-checked:after:translate-x-full 
                                 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                                  after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>

                                </label>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4 justify-end space-x-2 sm:space-x-3 ml-auto">
          
            <Button Primary={language?.Update}  onClick={() => {
                submitPackageServices();
              }}/>
          </div>
        </div>

       
          <div className="my-2">
            <div className="bg-white shadow rounded-lg  mt-4 mb-4 px-8 sm:p-6 xl:p-8  2xl:col-span-2">
              <h1 className="text-xl sm:text-2xl mt-4 font-semibold text-gray-900">{language?.additional} {language?.services}</h1>
              <div className="sm:flex">
                <div className="hidden sm:flex items-center sm:divide-x sm:divide-gray-100 mb-3 sm:mb-0">
                  <form className="lg:pr-3" action="#" method="GET">
                    <label htmlor="users-search" className="sr-only">{language?.search}</label>
                    <div className="mt-1 relative lg:w-64 xl:w-96">
                      <input type="text" name="email" id="users-search" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder={language?.searchforservices}>
                      </input>
                    </div>
                  </form>
                  <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
                    <a href="#" className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                   <Button Primary={language?.AddService} onClick={() => setAdd(1)} />
                  <a href="#" className="w-1/2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 font-semibold inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:w-auto">
                    <svg className="-ml-1 mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"></path></svg>
                    {language?.export}
                  </a>
                </div>
              </div>
              {additionalPackageServices === '' ? <></> : <>
              <div className="flex flex-col my-2">
                <div className="overflow-x-auto">
                  <div className="align-middle inline-block min-w-full">
                    <div className="shadow overflow-hidden">
                      <table className="table-fixed min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th scope="col" className="p-4">
                              <div className="flex items-center">
                                <input id="checkbox-all" aria-describedby="checkbox-1" type="checkbox"
                                  className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                                <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                              </div>
                            </th>
                            <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                              {language?.service} {language?.name}
                            </th>
                            <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                              {language?.service} {language?.description}
                            </th>
                            <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                              Status
                            </th>
                            <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                              {language?.action}
                            </th></tr>
                        </thead>
                        <TableList Primary={gen} Edit={language?.EditService} Delete={language?.DeleteService}
                                                  EditButton={(i) => {
                                                    setAddEdit(1); setActionService(i)
                                                  }}
                                                  DeleteButton={(i) => {
                                                    setAddDel(1); setActionService(i)
    
                                              }} /> 
                      </table>
                    </div>
                  </div>
                </div>
              </div>   </>}
            </div>
          </div>
     

        {/* Modal Edit Additional Services */}
        <div className={addEdit === 1 ? 'block' : 'hidden'}>
          <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
            <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
              <div className="bg-white rounded-lg shadow relative">
                <div className="flex items-start justify-between p-5 border-b rounded-t">
                  <h3 className="text-xl font-semibold">
                    {language?.edit} {language?.service}
                  </h3>
                  <button type="button" onClick={() => setAddEdit(0)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="add-user-modal">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="first-name" className="text-sm capitalize font-medium text-gray-900 block mb-2">{language?.service} {language?.name}</label>
                      <input type="text"
                        onChange={(e) => setModified({ ...modified, add_package_service_name: e.target.value })}
                        defaultValue={actionService?.name}
                        name="first-name" id="first-name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="last-name" className="text-sm capitalize font-medium text-gray-900 block mb-2">Service Description</label>
                      <textarea rows="2"
                        onChange={(e) => setModified({ ...modified, add_package_service_description: e.target.value })}
                        defaultValue={actionService?.type} columns="50" name="last-name" id="last-name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="name" className="text-base pr-2 font-semibold text-gray-900 block mb-2">Status</label>
                      <div className="flex">
                        <div className="form-check form-check-inline">
                          <input type="radio"
                            onChange={(e) => setModified({ ...modified, status: true })}
                            className="form-check-input form-check-input 
                                                         appearance-none rounded-full h-4 w-4 border 
                                                         border-gray-300 capitalize
                                                         bg-white checked:bg-blue-600 
                                                         checked:border-blue-600 focus:outline-none
                                                          transition duration-200 mt-2  align-top
                                                           bg-no-repeat bg-center bg-contain float-left
                                                            mr-2 cursor-pointer"
                            value="Active"
                            name="status" id='st' />
                          <label
                            className="form-check-label inline-block 
                                                         text-gray-700 text-base pr-2 "
                            htmlFor="st">
                            Active
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input type="radio" id='st2' value="Inactive"
                            onChange={(e) => setModified({ ...modified, status: false })}
                            className="form-check-input form-check-input appearance-none 
                                                   rounded-full h-4 w-4 border border-gray-300
                                                    bg-white checked:bg-blue-600 checked:border-blue-600
                                                     focus:outline-none transition duration-200 mt-2 
                                                      align-top bg-no-repeat bg-center bg-contain float-left mb-2
                                                       mr-1 ml-2 cursor-pointer" name="status" />
                          <label
                            className="form-check-label inline-block text-gray-700 text-base  "
                            htmlFor="st2"
                          >
                            Inactive</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="items-center p-6 border-t border-gray-200 rounded-b">
                  <button
                    onClick={
                      () => { editAdditionalPackageServices(); setAddEdit(0); }
                    } className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-semibold rounded-lg text-sm px-5 py-2.5 text-center" type="submit">Update</button>
                </div>

              </div>
            </div>
          </div>
        </div>
        {/* Modal Add */}
        <div className={add === 1 ? 'block' : 'hidden'}>
          <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
            <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
              <div className="bg-white rounded-lg shadow relative">
                <div className="flex items-start justify-between p-5 border-b rounded-t">
                  <h3 className="text-xl font-semibold">
                    {language?.add} {language?.package} {language?.new} {language?.service}
                  </h3>
                  <button type="button" onClick={() => setAdd(0)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="add-user-modal">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="first-name" className="text-sm capitalize font-medium text-gray-900 block mb-2">{language?.service} {language?.name}</label>
                      <input type="text" name="first-name"
                        onChange={(e) => { setModified({ ...modified, add_package_service_name: e.target.value }) }}
                        id="first-name"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="last-name" className="text-sm font-medium text-gray-900 block mb-2">{language?.service} {language?.description}</label>
                      <textarea rows="2" columns="50" name="last-name"
                        onChange={(e) => { setModified({ ...modified, add_package_service_description: e.target.value }) }}
                        id="last-name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                    </div>
                  </div>
                </div>

                <div className="items-center p-6 border-t border-gray-200 rounded-b">
                  <button
                    onClick={() => { newAdditionalService(); setAdd(0); }}
                    className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-semibold rounded-lg text-sm px-5 py-2.5 text-center" type="submit">
                    {language?.add} {language?.service}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Delete additional services*/}
        <div className={addDel === 1 ? 'block' : 'hidden'}>
          <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
            <div className="relative w-full max-w-md px-4 h-full md:h-auto">
              <div className="bg-white rounded-lg shadow relative">
                <div className="flex justify-end p-2">
                  <button onClick={() => setAddDel(0)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="delete-user-modal">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  </button>
                </div>

                <div className="p-6 pt-0 text-center">
                  <svg className="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">{language?.areyousureyouwanttodelete}</h3>
                  <button onClick={() => { deleteAdditionalService(); setAddDel(0) }} className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2">
                    {language?.yesiamsure}
                  </button>
                  <button onClick={() => setAddDel(0)} className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center" data-modal-toggle="delete-user-modal">
                    {language?.nocancel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div >
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

export default Packageservices
Packageservices.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )


}