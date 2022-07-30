import React, { useEffect, useState } from 'react';
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Link from "next/link";
import Button from "../../components/Button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
const logger = require("../../services/logger");
var language;
var currentProperty;
import Router from 'next/router'
import arabic from "../../components/Languages/ar"

function Services() {
    const [additionalServices, setAdditionalServices] = useState({})
    const [services, setServices] = useState([])
    const [edit, setEdit] = useState(0)
    const [actionService, setActionService] = useState({})
    const [modified, setModified] = useState([])
    const [addEdit, setAddEdit] = useState(0)
    const [addDel, setAddDel] = useState(0)
    const [add, setAdd] = useState(0)
    const [gen, setGen] = useState([])
    const [gene, setGene] = useState([])

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
                services = JSON.parse(localStorage.getItem('allPropertyDetails'))
                /** Current Property Details fetched from the local storage **/
                currentProperty = JSON.parse(localStorage.getItem("property"));
            }
        }
        firstfun();
        Router.push("./services")
    }, [])

    /* Function call to fetch Current Property Details when page loads */
    const fetchHotelDetails = async () => {
        var genData = [];
        const url = `/api/${currentProperty.address_province.replace(
            /\s+/g,
            "-"
        )}/${currentProperty.address_city}/${currentProperty.property_category
            }s/${currentProperty.property_id}`;
        axios.get(url)
            .then((response) => {
                setServices(response.data);
                logger.info("url  to fetch property details hitted successfully")

                {
                    response.data?.services?.map((item) => {
                        var temp = {
                            name: item.local_service_name,
                            description: item.service_comment,
                            type: item.service_value,
                            status: item.status,
                            id: item.service_id
                        }
                        genData.push(temp)
                    })
                    setGen(genData);
                }

            })

            .catch((error) => { logger.error("url to fetch property details, failed") });
    }

    const fetchAdditionalServices = async () => {
        var geneData = [];
        const url = `/api/additional_services/${currentProperty.property_id}`
        axios.get(url)
            .then((response) => {
                setAdditionalServices(response.data);
                logger.info("url  to fetch additional services hitted successfully")

                {
                    response.data?.map((item) => {
                        var temp = {
                            name: item.add_service_name,
                            type: item.add_service_comment,
                            status: item.status,
                            id: item.add_service_id
                        }
                        geneData.push(temp)
                    })
                    setGene(geneData);
                }
            })
            .catch((error) => { logger.error("url to fetch additional services, failed") });
    }

    useEffect(() => {
        fetchHotelDetails();
        fetchAdditionalServices();

    }, [])

    /*Function to edit additional services*/
    const editAdditionalServices = () => {
        if (modified.length !== 0) {
            const final_data = {
                "add_service_id": actionService.id,
                "add_service_name": modified.add_service_name,
                "property_id": currentProperty?.property_id,
                "add_service_comment": modified.add_service_comment,
                "status": modified.active
            }
            const url = '/api/additional_services'
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
                    fetchAdditionalServices();
                    Router.push("./services");
                    setModified([])
                })
                .catch((error) => {

                    toast.error("Additional Services Update Error!", {
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

    /* Function to edit services*/
    const updateServices = () => {
        if (modified.length !== 0) {
            const final_data = {
                "service_id": actionService.id,
                "property_id": currentProperty?.property_id,
                "service_value": modified.service_value,
                "service_comment": modified.service_comment,
                "status": modified.status
            }

            const url = '/api/services'
            axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
                ((response) => {
                    toast.success("Services Updated Successfully!", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    fetchHotelDetails();
                    Router.push("./services");
                    setModified([])
                })
                .catch((error) => {
                    toast.error("Service Update Error!", {
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
        const url = `/api/additional_service/${actionService?.id}`
        axios.delete(url).then((response) => {
            toast.success(("Additional Service Deleted Successfully!"), {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            fetchAdditionalServices();
            Router.push("./services");

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

    /*Function to add additional service*/
    const newAdditionalService = () => {
        if (modified.length !== 0) {
            const final_data = {

                "additional_service": [{
                    "property_id": currentProperty?.property_id,
                    "add_service_name": modified.add_service_name,
                    "add_service_comment": modified.add_service_comment,
                    "status": true
                }]
            }
            const url = '/api/additional_services'
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

                    fetchAdditionalServices();
                    Router.push("./services");
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

    return (
        <>
            <Header Primary={english?.Side} />
            <Sidebar Primary={english?.Side} />
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
                                        <a> {services?.property_name}</a>
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
                                    {language?.services}
                                </span>
                            </div>
                        </li>
                    </ol>
                </nav>

                <div className="bg-white shadow rounded-lg  mt-4 mb-4 px-8 sm:p-6 xl:p-8  2xl:col-span-2">

                <Table  gen={gen} setGen={setGen}   
                edit={updateServices}  common={language?.common} cols={language?.ServicesCols}
                name="Services"/> 
                </div>

                {/* Additional Services Table */}
                {additionalServices === '' ? <></> : 
                <div className="bg-white shadow rounded-lg  mt-4 mb-4 px-8 sm:p-6 xl:p-8  2xl:col-span-2">
                <Table  gen={gene} setGen={setGene} add={()=> setView(1)} name="Additional Services"
                edit={editAdditionalServices}
                delete={deleteAdditionalServices}
                common={language?.common} cols={language?.AdditionalServicesCols}  /> 
                </div>
                }
                

           
                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-6 gap-6">
                                            <div className="col-span-6 sm:col-span-3">
                                                <label htmlFor="name" className="text-base pr-2 font-semibold text-gray-900 block mb-2">{actionService?.name}</label>
                                                <div className="flex">
                                                    <div className="form-check form-check-inline">
                                                        <input type="radio"


                                                            onChange={(e) => (setModified({ ...modified, service_value: e.target.value }))}
                                                            className="form-check-input form-check-input 
                                                         appearance-none rounded-full h-4 w-4 border 
                                                         border-gray-300 
                                                         bg-white checked:bg-blue-600 
                                                         checked:border-blue-600 focus:outline-none
                                                          transition duration-200 mt-2  align-top
                                                           bg-no-repeat bg-center bg-contain float-left
                                                            mr-2 cursor-pointer"

                                                            value="yes"
                                                            name="who" id='ip1' />
                                                        <label
                                                            className="form-check-label inline-block 
                                                      text-gray-700 text-base pr-2 "
                                                            htmlFor="ip1">
                                                            Yes
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input type="radio" id='ip2' value="no"
                                                            onChange={(e) => (setModified({ ...modified, service_value: e.target.value }))}
                                                            className="form-check-input form-check-input appearance-none 
                                                         rounded-full h-4 w-4 border border-gray-300
                                                          bg-white checked:bg-blue-600 checked:border-blue-600
                                                           focus:outline-none transition duration-200 mt-2 
                                                            align-top bg-no-repeat bg-center bg-contain float-left mb-2
                                                             mr-1 ml-2 cursor-pointer"
                                                            name="who" />
                                                        <label
                                                            className="form-check-label inline-block 
                                                        text-gray-700 text-base  "
                                                            htmlFor="ip2"
                                                        >
                                                            No</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label htmlFor="name" className="text-base pr-2 font-semibold text-gray-900 block mb-2">Status</label>
                                                <div className="flex">
                                                    <div className="form-check form-check-inline">
                                                        <input type="radio"
                                                            onChange={(e) => (setModified({ ...modified, status: true }))}

                                                            className="form-check-input form-check-input 
                                                         appearance-none rounded-full h-4 w-4 border 
                                                         border-gray-300 
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
                                                            onChange={(e) => (setModified({ ...modified, status: false }))}
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
                                            <div className="col-span-6 sm:col-span-3">
                                                <label htmlFor="service_comment" className="text-sm font-medium text-gray-900 block mb-2">
                                                    Service Description</label>
                                                <textarea rows="2" columns="50" defaultValue={actionService?.description}
                                                    id="service_comment" onChange={(e) => (setModified({ ...modified, service_comment: e.target.value }))} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="items-center p-6 border-t border-gray-200 rounded-b">
                                        <Button Primary={language?.Update} onClick={() => { updateServices(); setEdit(0) }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : <div>
                        {/* Modal Edit Dropdown */}
                        <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
                            <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
                                <div className="bg-white rounded-lg shadow relative">
                                    <div className="flex items-start justify-between p-5 border-b rounded-t">
                                        <h3 className="text-xl font-semibold">
                                            Edit service
                                        </h3>
                                        <button type="button" onClick={() => setEdit(0)}
                                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="user-modal">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                        </button>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-6 gap-6">
                                            <div className="col-span-6 sm:col-span-3">
                                                <label htmlFor="first-name" className="text-sm capitalize font-medium text-gray-900 block mb-2">{actionService?.local_service_name}</label>
                                                {(() => {
                                                    switch (actionService?.service_id) {
                                                        case 'ser0016': return (<div>
                                                            {/*Kitchen Availability*/}
                                                            <select onClick={(e) => setModified({ ...modified, service_value: e.target.value })} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" >
                                                                <option value="Available in all rooms">Available in all rooms</option>
                                                                <option value="Available in some rooms">Available in some rooms</option>
                                                                <option value="Not available">Not available</option>
                                                            </select>
                                                        </div>)
                                                        case 'ser0017': return (<div>
                                                            {/*Parking Type*/}
                                                            <select onClick={(e) => setModified({ ...modified, service_value: e.target.value })} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" >
                                                                <option value="No payment required">No Payment Required</option>
                                                                <option value="Paid">Paid</option>
                                                                <option value="Not available">Not available</option>
                                                            </select>
                                                        </div>)
                                                        case 'ser0020': return (<div>
                                                            {/*Swimming Pool*/}
                                                            <select onClick={(e) => setModified({ ...modified, service_value: e.target.value })} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" >
                                                                <option selected>{actionService?.service_value}</option>
                                                                <option value="Indoors">Indoors</option>
                                                                <option value="Outdoors">Outdoors</option>
                                                                <option value="Indoors and outdoors">Indoors and Outdoors</option>
                                                                <option value="Not available">Not available</option>
                                                            </select>
                                                        </div>)
                                                        case 'ser0022': return (<div>
                                                            {/*Wifi Type*/}
                                                            <select onClick={(e) => setModified({ ...modified, service_value: e.target.value })} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" >
                                                                <option selected>{actionService?.service_value}</option>
                                                                <option value="No payment required">No Payment Required</option>
                                                                <option value="Paid">Paid</option>
                                                                <option value="Not available">Not available</option>
                                                                <option value="Not available">Not available</option>
                                                            </select>
                                                        </div>)
                                                        default: return (<div></div>)
                                                    }
                                                })()}
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label htmlFor="last-name" className="text-sm font-medium text-gray-900 block mb-2">Service Description</label>
                                                <textarea rows="2"
                                                    defaultValue={actionService?.description}
                                                    onChange={(e) => (setModified({ ...modified, service_comment: e.target.value }))} columns="50" id="last-name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label htmlFor="name" className="text-base pr-2 font-semibold text-gray-900 block mb-2">Status</label>
                                                <div className="flex">
                                                    <div className="form-check form-check-inline">
                                                        <input type="radio"
                                                            onChange={(e) => (setModified({ ...modified, status: true }))}
                                                            className="form-check-input form-check-input 
                                                         appearance-none rounded-full h-4 w-4 border 
                                                         border-gray-300 
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
                                                            onChange={(e) => (setModified({ ...modified, status: false }))}
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
                                        <Button Primary={language?.Update} onClick={() => { updateServices(); setEdit(0) }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
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
                                            <label htmlFor="first-name" className="text-sm font-medium text-gray-900 block mb-2">{language?.service} {language?.name}</label>
                                            <input type="text"
                                                onChange={(e) => setModified({ ...modified, add_service_name: e.target.value })}
                                                defaultValue={actionService?.name}
                                                name="first-name" id="first-name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="last-name" className="text-sm font-medium text-gray-900 block mb-2">Service Description</label>
                                            <textarea rows="2"
                                                onChange={(e) => setModified({ ...modified, add_service_comment: e.target.value })}
                                                defaultValue={actionService?.type} columns="50" name="last-name" id="last-name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="name" className="text-base pr-2 font-semibold text-gray-900 block mb-2">Status</label>
                                            <div className="flex">
                                                <div className="form-check form-check-inline">
                                                    <input type="radio"
                                                        onChange={(e) => setModified({ ...modified, active: true })}
                                                        className="form-check-input form-check-input 
                                                         appearance-none rounded-full h-4 w-4 border 
                                                         border-gray-300 
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
                                                        onChange={(e) => setModified({ ...modified, active: false })}
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
                                    <Button Primary={language?.Update}
                                        onClick={
                                            () => { editAdditionalServices(); setAddEdit(0); }
                                        } />

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
                                        {language?.add} {language?.new} {language?.service}
                                    </h3>
                                    <button type="button" onClick={() => setAdd(0)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="add-user-modal">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-6 gap-6">
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="first-name" className="text-sm font-medium text-gray-900 block mb-2">{language?.service} {language?.name}</label>
                                            <input type="text" name="first-name"
                                                onChange={(e) => { setModified({ ...modified, add_service_name: e.target.value }) }}
                                                id="first-name"
                                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            <label htmlFor="last-name" className="text-sm font-medium text-gray-900 block mb-2">{language?.service} {language?.description}</label>
                                            <textarea rows="2" columns="50" name="last-name"
                                                onChange={(e) => { setModified({ ...modified, add_service_comment: e.target.value }) }}
                                                id="last-name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" required />
                                        </div>
                                    </div>
                                </div>

                                <div className="items-center p-6 border-t border-gray-200 rounded-b">
                                    <Button Primary={language?.Add} onClick={() => { newAdditionalService(); setAdd(0); }} />
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
                                    <Button Primary={language?.Delete} onClick={() => { deleteAdditionalService(); setAddDel(0) }} />
                                    <Button Primary={language?.Cancel} onClick={() => setAddDel(0)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
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

export default Services