import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Table from '../../components/Table';
import Link from "next/link";
import axios from "axios";
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar';
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar";
import DarkModeLogic from "../../components/darkmodelogic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const logger = require("../../services/logger");
import Router from "next/router";
var language;
var currentProperty;
var currentLogged;

function Inventories() {
    const [allRooms, setAllRooms] = useState([])
    const [darkModeSwitcher, setDarkModeSwitcher] = useState()
    const [gen, setGen] = useState([])
    const [color, setColor] = useState({})

    useEffect(() => {
        const firstfun = () => {
            if (typeof window !== 'undefined') {
                var locale = localStorage.getItem("Language");
                const colorToggle = JSON.parse(localStorage.getItem("ColorToggle"));
                const color = JSON.parse(localStorage.getItem("Color"));
                setColor(color);
                setDarkModeSwitcher(colorToggle);
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
                currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
            }
        }
        firstfun();
        Router.push("./inventories");
    }, [])

    useEffect(() => {
        fetchInventoryRooms();
        
    }
        , [])

    const fetchInventoryRooms = async () => {
        var genData = [];
        const url = `/api/ari/inventory/${currentProperty?.property_id}`;
        axios.get(url)
            .then((response) => {
                setAllRooms(response.data);
                {
                    response.data?.map((item) => {
                        var temp = {
                            name: item.room_name,
                            status: true,
                            id: item.room_id
                        }
                        genData.push(temp)
                    })
                    setGen(genData);

                }
            })
            .catch((error) => { logger.error("url to fetch property details, failed") });
    }

    useEffect(() => {
        setColor(DarkModeLogic(darkModeSwitcher))
    }, [darkModeSwitcher])

    const currentRoom = (props) => {
        localStorage.setItem("RoomId", props.id);
        localStorage.setItem("RoomName",props.name);
        Router.push("./inventories/editinventory");
    };

    const submitInventoryDelete = (props) => {
        const url = `/api/ari/inventory/${props}`;
        axios
            .delete(url)
            .then((response) => {
                toast.success("API: Property Availability delete Success!", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                fetchInventoryRooms();
                Router.push('./inventories')
            })
            .catch((error) => {
                toast.error("API: Availability delete error!", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    };



    return (
        <>
            <Header color={color} Primary={english?.Side} />
            <Sidebar color={color} Primary={english?.Side} />
            <div id="main-content"
                className={`${color?.greybackground}  pt-24 relative overflow-y-auto lg:ml-64`}>
               {/* Navbar */}
                <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2">
                        <div className={`${color?.text} text-base font-medium  inline-flex items-center`}>
                            <li className="inline-flex items-center">
                                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                                <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../admin/AdminLanding" : "./landing"} className={`${color?.text} text-base font-medium  inline-flex items-center`}><a>{language?.home}</a>
                                </Link>
                            </li>
                        </div>
                        <li>
                            <div className="flex items-center">
                                <div className={`${color?.text} text-base capitalize font-medium  inline-flex items-center`}>
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

                                    <Link href="./propertysummary" >
                                        <a> {currentProperty?.property_name}
                                        </a></Link></div>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <div className={`${color?.textgray} text-base capitalize font-medium  inline-flex items-center`}>
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
                                    {language?.inventories}
                                    

                                </div></div>
                        </li>
                    </ol>
                </nav>

                <Table gen={gen}
                    setGen={setGen}
                    color={color} edit={currentRoom}
                    add={() => Router.push('./inventories/inventory')}
                    delete={submitInventoryDelete}
                    common={language?.common} cols={language?.InvCols}
                    name="Packages"
                />

            </div>
        </>
    )
}

export default Inventories
Inventories.getLayout = function PageLayout(page) {
    return (
        <>
            {page}
        </>
    )
}