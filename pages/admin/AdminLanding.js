import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Header from '../../components/Languages/adminSection/header'
import Sidebar from "../../components/Languages/adminSection/sidebar";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
import Button from "../../components/Button";
const logger = require("../../services/logger");
var language;
var currentUser;
import Lineloader from "../../components/loaders/lineloader";
import Textboxloader from "../../components/loaders/textboxloader";

function AdminLanding() {

    const [properties, setProperties] = useState([])
    const router = useRouter();

    /** State Intialisation for storing all Properties of Current User **/
    const [ownerdata, setOwnerdata] = useState([]);
    const [deleteProperty, setDeleteProperty] = useState(0)
    const [property, setProperty] = useState({})

    const newProperty = () => {
        router.push('./addProperty/addbasicdetails');
    }

    //fetch all properties
    const fetchAllProperties = () => {
        axios.get('/api/all_properties').then(response => {
            setProperties(response.data)
        }).catch(error => {
            toast.error("Error in fetching Properties!", {
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
                currentUser = JSON.parse(localStorage.getItem("Signin Details"));
            }
        }
        firstfun();
        router.push('./AdminLanding');
        fetchAllProperties();
    }, [])


    const LocalProperty = ({ item }) => {
        localStorage.setItem("property", JSON.stringify(item));
    };

    const submitDelete = () => {
        axios.put(`/api/basic`,{ property_id:property?.property_id, status: false},{ header: { "content-type": "application/json" } })
        .then((response) => {
            fetchAllProperties();
            toast.success("Property De-activated Successfully!", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setDeleteProperty(0)
            setProperty({})

        }).catch((error) => {
            toast.error("Property De-activate Error!", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setDeleteProperty(0)
            setProperty({})

        })
    }


    const activateProperty = (property_id) => {
        axios.put(`/api/basic`,{ property_id:property_id, status: true},{ header: { "content-type": "application/json" } })
        .then((response) => {
            fetchAllProperties();
            toast.success("Property Activated Successfully!", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setDeleteProperty(0)
            setProperty({})

        }).catch((error) => {
            toast.error("Property De-activate Error!", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setDeleteProperty(0)
            setProperty({})

        })
    }
    return (
        <div>
            <div className={deleteProperty === 1 ? 'block' : 'hidden'}>
                <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
                    <div className="relative w-full max-w-md px-4 h-full md:h-auto">
                        <div className="bg-white rounded-lg shadow relative">
                            <div className="flex justify-end p-2">
                                <button
                                    onClick={() => setDeleteProperty(0)}
                                    type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="delete-user-modal">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>

                            <div className="p-6 pt-0 text-center">
                                <svg className="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <h3 className="text-base font-normal text-gray-500 mt-5 mb-6">
                                    {/*language?.deletingthiswillcauseloosingalldata*/}
                                    Are you sure you want to deactivate property
                                </h3>
                                <Button Primary={language?.Delete} onClick={() => submitDelete()} />
                                <Button Primary={language?.Cancel} onClick={() => setDeleteProperty(0)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Header />
            <Sidebar admin={english?.Sideadminlanding} />
            <div id="main-content"
                className="  bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64" >
                <div className=" bg-white shadow rounded-lg  px-12 sm:p-6 xl:p-8  2xl:col-span-2">
                    <div className="text-center ">
                        <p className="capitalize font-semibold text-3xl font-sans  mx-12  mb-6 text-cyan-500">
                            {language?.welcome} {currentUser?.name}
                        </p>
                    </div>
                    <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
                        List of All Active Properties
                    </h6>
                    <div className="pt-6">
                        <div className=" md:px-4 mx-auto w-full">
                            <div className="flex flex-wrap">

                                <form className=" space-y-1" action="#">
                                    <table className="table-fixed  w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-1 mx-2 py-4 text-left text-sm font-semibold text-gray-500 uppercase"
                                                >
                                                    {language?.property} {language?.name}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-1 mx-2 py-4 text-left text-sm font-semibold text-gray-500 uppercase"
                                                >
                                                    {language?.property} {language?.category}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-8  py-4 text-left text-sm font-semibold text-gray-500 uppercase"
                                                >
                                                    {language?.Province}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-8 py-4 text-left text-sm font-semibold text-gray-500 uppercase"
                                                >
                                                    {language?.Status}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-1 py-4 text-left text-sm font-semibold text-gray-500 uppercase"
                                                >
                                                    {language?.action}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {properties?.map((item, idx) => {
                                                return (item?.status === true ?
                                                    <tr className="hover:bg-gray-100" key={idx}>
                                                        <td className="p-1 whitespace-nowrap text-base font-medium text-gray-900 capitalize">
                                                            {item?.property_name}
                                                        </td>
                                                        <td className="p-1 whitespace-nowrap text-base font-medium text-gray-900 capitalize">
                                                            {item?.property_category}
                                                        </td>
                                                        <td className="pr-4 pl-0 whitespace-nowrap text-base font-normal text-gray-900">
                                                            <div className="flex items-center">

                                                                {item?.address_province}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 whitespace-nowrap text-base font-normal text-gray-900">
                                                            <div className="flex items-center">
                                                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                                                {item?.status === true ? "Active" : "Inactive"}
                                                            </div>
                                                        </td>
                                                        <td className="p-2 whitespace-nowrap space-x-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    LocalProperty({ item });
                                                                    router.push("../property/propertysummary");
                                                                }}
                                                                className="text-white bg-cyan-600
                                         hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-semibold rounded-lg
                                        text-sm inline-flex items-center px-2 py-1.5 text-center"
                                                            >
                                                                {language?.view}
                                                            </button>


                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setDeleteProperty(1)
                                                                    setProperty(item)
                                                                }}
                                                                className="text-white ml-4 bg-red-600
                                         hover:bg-red-700 focus:ring-4 focus:ring-cyan-200 font-semibold rounded-lg
                                        text-sm inline-flex items-center px-2 py-1.5 text-center"
                                                            >
                                                                De-activate
                                                            </button>
                                                        </td>
                                                    </tr> : <></>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                                </form>
                                <h6 className="text-xl mt-6 flex leading-none  pt-2 font-bold text-gray-900 mb-2">
                                    List of All In-Active Properties
                                </h6>
                                <form className=" space-y-1" action="#">
                                    <table className="table-fixed  w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-1 mx-2 py-4 text-left text-sm font-semibold text-gray-500 uppercase"
                                                >
                                                    {language?.property} {language?.name}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-1 mx-2 py-4 text-left text-sm font-semibold text-gray-500 uppercase"
                                                >
                                                    {language?.property} {language?.category}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-8  py-4 text-left text-sm font-semibold text-gray-500 uppercase"
                                                >
                                                    {language?.Province}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-8 py-4 text-left text-sm font-semibold text-gray-500 uppercase"
                                                >
                                                    {language?.Status}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-1 py-4 text-left text-sm font-semibold text-gray-500 uppercase"
                                                >
                                                    {language?.action}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {properties?.map((item, idx) => {
                                                return (item?.status !== true ?
                                                    <tr className="hover:bg-gray-100" key={idx}>
                                                        <td className="p-1 whitespace-nowrap text-base font-medium text-gray-900 capitalize">
                                                            {item?.property_name}
                                                        </td>
                                                        <td className="p-1 whitespace-nowrap text-base font-medium text-gray-900 capitalize">
                                                            {item?.property_category}
                                                        </td>
                                                        <td className="pr-4 pl-0 whitespace-nowrap text-base font-normal text-gray-900">
                                                            <div className="flex items-center">

                                                                {item?.address_province}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 whitespace-nowrap text-base font-normal text-gray-900">
                                                            <div className="flex items-center">
                                                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                                                {item?.status === true ? "Active" : "Inactive"}
                                                            </div>
                                                        </td>
                                                        <td className="p-2 whitespace-nowrap space-x-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    LocalProperty({ item });
                                                                    router.push("../property/propertysummary");
                                                                }}
                                                                className="text-white bg-cyan-600
                                         hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-semibold rounded-lg
                                        text-sm inline-flex items-center px-2 py-1.5 text-center"
                                                            >
                                                                {language?.view}
                                                            </button>


                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    activateProperty(item?.property_id)
                                                                    setProperty(item)
                                                                }}
                                                                className="text-white ml-4 bg-red-600
                                         hover:bg-red-700 focus:ring-4 focus:ring-cyan-200 font-semibold rounded-lg
                                        text-sm inline-flex items-center px-2 py-1.5 text-center"
                                                            >
                                                                Activate
                                                            </button>
                                                        </td>
                                                    </tr> : <></>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                                </form>

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

        </div>
    );
}

export default AdminLanding


