import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
import Button from "../../components/Button";
const logger = require("../../services/logger");
var language;
var currentUser;


function AdminLanding() {
    var locale;
    const [properties, setProperties] = useState([])
    const router = useRouter();

    /** State Intialisation for storing all Properties of Current User **/
    const [ownerdata, setOwnerdata] = useState([]);

    const newProperty = () => {
        router.push('./addProperty/addbasicdetails');
    }

    //fetch all properties
    const fetchAllProperties = () => {
        axios.get('/api/all_properties').then(response => {
            setProperties(response.data)
        }).catch(error => alert(error))
    }
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
                currentUser = JSON.parse(localStorage.getItem("Signin Details"));
            }
        }
        firstfun();
        router.push('./AdminLanding')
        fetchAllProperties();
    }, [])

    const LocalProperty = ({ item }) => {
        localStorage.setItem("property", JSON.stringify(item));
      };
    return (
        <div>
            <div className="bg-gray-50  pt-8 lg:px-32 sm:px-1 pb-72">
                <div className="mx-auto  flex flex-col justify-center items-center px-4 pt-8 pt:mt-0">
                    <span
                        className="self-center text-3xl  mb-4 mt-2 tracking-normal font-bold
             text-gray-700 whitespace-nowrap"
                    >
                        enGage
                    </span>
                    <div className="bg-white shadow rounded-lg md:mt-0 w-full sm:max-w-screen-sm xl:p-0">
                        <div className="p-4 sm:p-8 lg:p-space-y-2">
                            <Button Primary={language?.Addnewproperty} onClick={newProperty} />
                            {/** Button for Sign out**/}
                            <button
                                className=" float-right ml-5 text-white bg-cyan-600 
                  hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-semibold 
                  rounded-lg text-sm px-4 py-2 text-center  mr-2"
                                onClick={(e) => { e.preventDefault();
                                  router.push("/");
                                    localStorage.clear();
                                  }}
                                type="button"
                            >
                                {language?.signout} 
                            </button>
                            <div className="text-center mt-16">
                                <p className="capitalize font-semibold text-3xl font-sans sm:mt-12 mx-12 mt-24 mb-6 text-cyan-500">
                                    {language?.welcome} {currentUser?.name}
                                </p>
                            </div>


                            <form className=" space-y-1" action="#">
                                <div className="flex flex-col">
                                    <div className="overflow-x-auto">
                                        <div className="align-middle inline-block min-w-full">
                                            <div className="shadow overflow-hidden">
                                                <table className="table-fixed min-w-full divide-y divide-gray-200">
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
                                                                                router.push("../property/propertysummary");
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
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>


            </div>
            <ToastContainer
                position="top-center"
                autoClose={10000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}

export default AdminLanding


AdminLanding.getLayout = function PageLayout(page) {
    return (
        <>
            {page}
        </>
    )
}
