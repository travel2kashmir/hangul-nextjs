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


function adminLanding() {

    const router = useRouter();

    /** State Intialisation for storing all Properties of Current User **/
    const [ownerdata, setOwnerdata] = useState([]);
    const newProperty= () => {
        router.push('./addProperty/addBasicDetails');
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
        router.push('./adminLanding')
    }, [])
    return (
        <div>
            <div className="bg-gray-50  pt-8 lg:px-32 sm:px-1 pb-72">
                <div className="mx-auto  flex flex-col justify-center items-center px-4 pt-8 pt:mt-0">
                    <span
                        className="self-center text-3xl  mb-4 mt-2 tracking-normal font-bold
             text-gray-700 whitespace-nowrap"
                    >
                        Hangul
                    </span>
                    <div className="bg-white shadow rounded-lg md:mt-0 w-full sm:max-w-screen-sm xl:p-0">
                        <div className="p-4 sm:p-8 lg:p-space-y-2">

                            {/** Button for Sign out**/}
                            <button
                                className=" float-right ml-5 text-white bg-cyan-600 
                  hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-semibold 
                  rounded-lg text-sm px-4 py-2 text-center  mr-2"
                                onClick={() => {
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
                                            <Button Primary={language?.Addnewproperty} onClick={newProperty}/>
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

export default adminLanding


adminLanding.getLayout = function PageLayout(page) {
    return (
        <>
            {page}
        </>
    )
}
