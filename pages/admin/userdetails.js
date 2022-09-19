import React, { useEffect, useState } from 'react'
import Header from '../../components/Languages/adminSection/header'
import Sidebar from '../../components/Languages/adminSection/sidebar'
import Link from 'next/link'
import english from '../../components/Languages/en'
import french from '../../components/Languages/fr'
import arabic from '../../components/Languages/ar'
import Router from 'next/router'
import Button from '../../components/Button'
import axios from 'axios';
import validateUserData from '../../components/Validation/createuser'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

var language;
var currentProperty;
var currentLogged;
var currentUser;
var locale;

const logger = require("../../services/logger");

function UserDetails() {
    const [properties, setProperties] = useState([]);
    const [spinner, setSpinner] = useState(0);
    const [error, setError] = useState({});
    const [userData, setUserdata] = useState([]);
    const [saveData, setSaveData] = useState('');
    useEffect(() => {
        const firstfun = () => {
            if (typeof window !== 'undefined') {
                locale = localStorage.getItem("Language");
                if (locale === "ar") {
                    language = arabic;
                }
                if (locale === "en") {
                    language = english;
                }
                if (locale === "fr") {
                    language = french;
                }
                currentUser = JSON.parse(localStorage.getItem("user"));
                currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
            }
        }
        firstfun();
        fetchProperty();
        fetchAllProperties();
    }, [])



    const LocalProperty = ({ item }) => {
        localStorage.setItem("property", JSON.stringify(item));
    };

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

    const fetchProperty = async () => {
        try {
            
            const url = `/api/properties/${currentUser.user_id}`;
            logger.info("url" + url)
            const response = await axios.get(url, {
                headers: { accept: "application/json" },
            });
            setUserdata(response.data);
} catch (error) {
            if (error.response) {
                logger.error("Current User Properties Error");
            } else {
                logger.error("Current User Properties Error");
            }
        }
    };
    const [assignProperty, setAssignProperty] = useState(0);

    const submitNew = () => {
        var item = JSON.parse(saveData)
       
        const data = {
            property_id: item?.property_id,
            user_id: currentUser.user_id,
            status: true,
            province: item?.address_province,
            city: item?.address_city,
            property_type: item?.property_category,
            language: locale
        }
       

        axios.post('/api/add_property_user', data, { header: { "content-type": "application/json" } })
        .then((response) => {
            fetchProperty();
            toast.success("API: Property For User Assigned", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
           // document.getElementById('ownerform').reset();
            assignProperty(0);
        }).catch(error => 
            {
            toast.error("API: Error In Property User Assignment", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })})
    }
    return (<>
        {<div className={assignProperty === 1 ? 'block' : 'hidden'}>
            <form id='ownerform'>
                <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
                    <div className="relative bg-white  w-full max-w-2xl px-4 h-full md:h-auto">
                        <div className="flex items-start justify-between p-5 border-b rounded-t">
                            <h3 className="text-xl font-semibold">
                                {language?.assignpropertytouser}
                            </h3>
                            <button
                                className="text-gray-400 bg-transparent
                            hover:bg-gray-200 
                            hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                type="button"
                                onClick={() => {
                                    document.getElementById('ownerform').reset();
                                    setAssignProperty(0)

                                }}>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd">
                                </path></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-6" >
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="text-sm font-medium text-gray-900 block mb-2"
                                        htmlFor="grid-password">
                                        {language?.propertyname}
                                    </label>
                                    <select className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"

                                        onChange={
                                            (e) => (
                                                setSaveData(e.target.value)
                                            )
                                        }
                                    >
                                        <option defaultValue="" disabled selected>Select</option>
                                        {properties.map((item,idx) => {
                                            return (
                                                <option Value={JSON.stringify(item)} key={idx}>{item?.property_name}</option>
                                            )
                                        })}
                                    </select>
                                    {saveData === '' ? <></> : <button 
                                    onClick={() => submitNew()}
                                    type="button"
                                        className='text-white mt-2 bg-cyan-600
                                         hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-semibold rounded-lg
                                        text-sm inline-flex items-center px-2 py-1.5 text-center'>
                                        {language?.addpropertytouser}</button>}
                                </div>
                            </div></div>
                    </div></div></form></div>}

        <Header admin={english?.Sideadminlanding} />
        <Sidebar admin={english?.Sideadminlanding} />
        <div id="main-content"
            className="  bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64" >
            {/*Nav Bar*/}
            <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2">
                    <li className="inline-flex items-center">
                        <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                        <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../admin/AdminLanding" : "./landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center">
                            <a>{language?.home}</a>
                        </Link>
                    </li>

                    <li>
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                           <Link href="./allusers" className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>  {language?.allusers}</a></Link>
                        </div>
                    </li>

                    <li>
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                            <span className="capitalize text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{currentUser?.user_name}</span>
                        </div>
                    </li>
                </ol>
            </nav>


            <div className=" bg-white shadow-xl rounded-lg  sm: mt-4 p-6 xl:p-8  2xl:col-span-2">
                <div className='flex justify-self-auto'>
                    <p className="text-l capitalize flex justify-start  leading-none pl-6 pt-2  text-gray-900 ">
                        {language?.welcome} {currentUser?.user_name}
                    </p>

                    <p className="text-l ml-auto capitalize flex justify-end  leading-none pl-6 pt-2  text-gray-900 ">
                        {language?.account} {language?.Status}: {currentUser?.status === true ? 'Active' : 'Inactive'}
                    </p>

                    <p className="text-l ml-auto capitalize text-bold leading-none pl-6 pt-2  text-gray-900 ">
                        {language?.Registered} {language?.Email}: {currentUser?.user_email}
                    </p>
                </div>
                <h6 className="text-xl my-4 flex leading-none pl-6 pt-2 font-bold text-gray-900 ">
                    {language?.listofallpropertiesforuser}
                    <button className='ml-auto text-white bg-cyan-600
                                         hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-semibold rounded-lg
                                        text-sm inline-flex items-center px-2 py-1.5 text-center"' onClick={() => setAssignProperty(1)}>
                        {language?.assignProperty}
                    </button>
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
                                    {Object.keys(userData).length !== 0 ? <tbody className="bg-white divide-y divide-gray-200">
                                        {userData?.map((item, idx) => {
                                            return (
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
                                                                Router.push("../property/propertysummary");
                                                            }}
                                                            className="text-white bg-cyan-600
                                     hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-semibold rounded-lg
                                    text-sm inline-flex items-center px-2 py-1.5 text-center"
                                                        >
                                                            {language?.view}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody> : <></>}
                                </table>

                            </form>

                            {Object.keys(userData).length === 0 ? <h1 className='capitalize'>{currentUser?.user_name} has no property</h1> : <></>}
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div>

        </div>
        {/** Toast Container **/}
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
    </>

    )
}

export default UserDetails





