import React, { useEffect, useState } from 'react';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import axios from "axios";
import Button from '../../components/Button';
import Table from "../../components/Table"
import Link from "next/link";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from "next/router";
var language;
var currentProperty;

function Packages() {

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
        Router.push("./packages");
    }, [])
    const [gen, setGen] = useState([])
    const [deletePackage, setDeletePackage] = useState(0)
    const [actionPackage, setActionPackage] = useState({});
    const [allpackages, setAllPackages] = useState([])


    const fetchPackages = async () => {
        var genData = [];
        const url = `/api/package/${currentProperty?.property_id}`;
        axios.get(url)
            .then((response) => {
                setAllPackages(response.data);
                {
                    response.data?.map((item) => {
                        var temp = {
                            name: item.package_name,
                            type: item.contact_data,
                            status: item.status,
                            id: item.package_id
                        }
                        genData.push(temp)
                    })
                    setGen(genData);
                }
            })
            .catch((error) => { logger.error("url to fetch property details, failed") });
    }
    const addPackage = () =>{
        Router.push("./packages/addpackage")
      }


    useEffect(() => {
        fetchPackages();
    }
        , [])

    /* Delete Package Function*/
    const deletePackages = (props) => {
        alert(JSON.stringify(props))
        const url = `/api/package/${props}`
        axios.delete(url).then((response) => {
            toast.success(("Package Deleted Successfully!"), {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            fetchPackages();
            Router.push("./packages");
        })
            .catch((error) => {
                toast.error(("Package Delete Error!"), {
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

    /**Function to save Current property to be viewed to Local Storage**/
    const currentPackage = (props) => {
        localStorage.setItem("packageId", props?.id);
        Router.push("./packages/package")
    };

    return (
        <>
            <Header Primary={english?.Side} />
            <Sidebar Primary={english?.Side} />
            <div id="main-content"
                className="  bg-white  pt-24 relative overflow-y-auto lg:ml-64">
                {/* Navbar */}
                <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                        <li className="inline-flex items-center">
                            <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                            <span className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2">
                                <Link href="./landing" >
                                    <a>  {language?.home}</a>
                                </Link></span>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                <span className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2">
                                    <Link href="./propertysummary" >
                                        <a>{currentProperty?.property_name}</a></Link></span>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.property} {language?.packages}</span>
                            </div>
                        </li>
                    </ol>
                </nav>
                {/* Header */}
                <Table  gen={gen} setGen={setGen} add={addPackage} 
      edit={currentPackage}
        delete={deletePackages} common={language?.common} cols={language?.PackageCols} name="Packages"/> 

                {/* Modal Delete */}
                <div className={deletePackage === 1 ? "block" : "hidden"}>
                    <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full" >
                        <div className="relative w-full max-w-md px-4 h-full md:h-auto">
                            <div className="bg-white rounded-lg shadow relative">
                                <div className="flex justify-end p-2">
                                    <button type="button" onClick={() => setDeletePackage(0)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    </button>
                                </div>
                                <div className="p-6 pt-0 text-center">
                                    <svg className="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
                                        {language?.areyousureyouwanttodelete}</h3>
                                    <button
                                        onClick={() => { deletePackages(); setDeletePackage(0) }}
                                        className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2">
                                        {language?.yesiamsure}
                                    </button>
                                    <button
                                        onClick={() => setDeletePackage(0)} className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center" data-modal-toggle="delete-user-modal">
                                        {language?.nocancel}
                                    </button>
                                </div>
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
        </>
    )
}

export default Packages
Packages.getLayout = function PageLayout(page){
    return(
      <>
      {page}
      </>
    )
    }