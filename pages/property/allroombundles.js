import React, { useEffect, useState } from 'react'
import Link from "next/link";
import Table from '../../components/Table';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import axios from "axios";
import LoaderTable from "./loaderTable";
import Headloader from "../../components/loaders/headloader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
import Router from "next/router";
var language;
var currentProperty;
var currentLogged;
var  currentPackageDetails;
const logger = require("../../services/logger");

function Allroombundles() {
  const [visible, setVisible] = useState(0)
  const [gen, setGen] = useState([])
  const [allBundles, setAllBundles] = useState([])


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
            currentPackageDetails=JSON.parse(localStorage.getItem('packageDescription'))
            currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
          } 
        
      }
    firstfun();
    Router.push("./allroombundles");
  }, [])

  /**Function to save Current property to be viewed to Local Storage**/
  const currentRoomBundle = (props) => {
    localStorage.setItem("currentRoomBundle", JSON.stringify(props.id));
    Router.push("./allroombundles/roombundle");
  };

  const fetchBundles = async () => {
    var genData = [];
    const url = `/api/room_bundle/${currentProperty.property_id}`;
    axios.get(url)

      .then((response) => {
        setAllBundles(response.data);
        {
          response.data?.map((item) => {
            var temp = {
              name: item.room_name,
              type: item.package_name,
              status: item.status,
              id: item.room_bundle_id
            }
            genData.push(temp)
          })
          setGen(genData);
          setVisible(1)
        }
      })
      .catch((error) => { logger.error("url to fetch property details, failed") });
  }
  const addRoomBundle = async () => {

    Router.push("./allroombundles/addroombundles")
  }

  useEffect(() => {
    fetchBundles();
  }
    , [])


  /* Delete Room Function*/
  const deleteRoomBundle = (props) => {
    const url = `/api/package/${props}`
    axios.delete(url).then((response) => {
      toast.success(("Room Bundle Deleted Successfully!"), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      fetchBundles();

    })
      .catch((error) => {
        toast.error(("Room Bundle Delete Error!"), {
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
      <Header Primary={english?.Side} />
      <Sidebar Primary={english?.Side} />
      <div id="main-content"
        className="  bg-white pt-24 relative overflow-y-auto lg:ml-64">
        {/* Navbar */}
        <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../admin/AdminLanding" : "./landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
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
                  <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                  <div className={visible === 1 ? 'block' : 'hidden'}>
                    <Link href="./propertysummary" >
                      <a> {currentProperty?.property_name}
                      </a></Link></div></span>
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
                  Room Bundles
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <div className={visible === 0 ? 'block' : 'hidden'}><LoaderTable /></div>
        <div className={visible === 1 ? 'block' : 'hidden'}>
          <Table gen={gen} setGen={setGen} add={addRoomBundle}
            edit={currentRoomBundle}
            delete={deleteRoomBundle} common={language?.common} cols={language?.RoomBundleCols} name="Rooms" />
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

export default Allroombundles
Allroombundles.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )
}