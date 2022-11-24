import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import axios from 'axios';
import Link from "next/link";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
import Router, { useRouter } from "next/router";
import DarkModeLogic from "../../components/darkmodelogic";
const logger = require("../../services/logger");
import { ToastContainer, toast } from "react-toastify";
import Classic from "../themes/classic";
import ClassicDark from '../themes/classic-dark'
import "react-toastify/dist/ReactToastify.css";
var language;
var currentUser;
var currentProperty;
var currentLogged;

function Theme() {
  /** State to store Current Property Details **/
  const [allHotelDetails, setAllHotelDetails] = useState([]);
  const [darkModeSwitcher, setDarkModeSwitcher] = useState()
  const [color, setColor] = useState({})
  const [allRooms, setAllRooms] = useState({});
  const [allPackages, setAllPackages] = useState({});
  const [themes, setThemes] = useState(false)
  const [phone, setPhone] = useState({});
  const [services, setServices] = useState([]);
  const [email, setEmail] = useState({});
  const [themeName, setThemeName] = useState("")
  const [uri, setUri] = useState("")
  const [loc, setLoc] = useState()
  const [lang, setLang] = useState('en')
  const [visible, setVisible] = useState(0)
  var locale;

  /** Router for Redirection **/
  const router = useRouter();
  useEffect(() => {
    const firstfun = () => {
      if (typeof window !== 'undefined') {
        locale = localStorage.getItem("Language");
        const colorToggle = JSON.parse(localStorage.getItem("ColorToggle"));
        const color = JSON.parse(localStorage.getItem("Color"));
        setColor(color);
        setDarkModeSwitcher(colorToggle)
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
        /** Current Property Details fetched from the local storage **/
        currentProperty = JSON.parse(localStorage.getItem("property"));

        currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
        setLoc(window.location.origin)
        setLang(locale)

      }
    }
    firstfun();
    router.push("./theme");
  }, [])

  useEffect(() => {
    setColor(DarkModeLogic(darkModeSwitcher))
  }, [darkModeSwitcher])

  /* Function call to fetch Current Property Details when page loads */
  useEffect(() => {
    fetchHotelDetails();
    fetchRoomDetails();
    fetchPackageDetails();

  }, []);

  const fetchHotelDetails = async () => {
    const url = `/api/${currentProperty?.address_province.replace(
      /\s+/g,
      "-"
    )}/${currentProperty?.address_city}/${currentProperty?.property_category
      }s/${currentProperty?.property_id}`;
    axios.get(url)
      .then((response) => {
        setThemeName(response.data.theme)
        setAllHotelDetails(response.data);
        response.data.contacts.map(i => { if (i.contact_type === 'Phone') { setPhone(i) } });   
        var ser =[];
        response.data.services.map(i => { 
          if (i.service_value !== "no") 
          if(i.service_value !== "Not available")
          {{
            ser.push(i)
           } 
          }
           setServices(ser)
          }
           
           );
          
        response.data.contacts.map(i => { if (i.contact_type === 'Email') { setEmail(i) } });
        logger.info("url  to fetch property details hitted successfully")
      })
      .catch((error) => { logger.error("url to fetch property details, failed") });
  }
  const fetchRoomDetails = async () => {
    const url = `/api/all_rooms_details/${currentProperty.property_id}`;
    axios.get(url)
      .then((response) => {
        setAllRooms(response.data);
        logger.info("url  to fetch room details hitted successfully")
      })
      .catch((error) => { logger.error("url to fetch property details, failed") });
  }

  const fetchPackageDetails = async () => {
    const url = `/api/all_packages_details/${currentProperty.property_id}`;
    axios.get(url)
      .then((response) => {
        setAllPackages(response.data);
        logger.info("url  to fetch package details hitted successfully")
      })
      .catch((error) => { logger.error("url to fetch package details, failed") });
  }

  const sendLink = () => {
    const data = {
      uuid: `${allHotelDetails?.property_name.replaceAll(' ', '-')}-${currentProperty?.address_city}`,
      property_id: currentProperty?.property_id,
      address_id: allHotelDetails.address[0].address_id,
      theme_id: theme,
      lang: localStorage?.getItem("Language")
    }

    axios.post('/api/property_page', data).then(
      (response) => {
        toast.success("Page Updated Successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        initialtheme();
        Router.push("./theme");
      }).catch((error) => toast.error("Unique URL Update Error!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }))
  }
  const submitTheme = () => {
    const final_data = {
      "property_id": currentProperty?.property_id,
      "theme": themeName
    }
    const url = '/api/basic'
    axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
      ((response) => {
        toast.success("Theme updated successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

      })
      .catch((error) => {

        toast.error("Theme Set Error!", {
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

  const changeTheme = (item) => {
    localStorage.setItem("ThemeName", item);
  }

  return (
    <>
      <Header color={color} Primary={english?.Side} />
      <Sidebar color={color} Primary={english?.Side} Type={currentLogged?.user_type} />
      {/* Body */}
      <div id="main-content" className={`${color?.greybackground}  pt-24 relative overflow-y-auto lg:ml-64`}
      >
        {/* Navbar */}
        <nav className="flex mb-5 px-4 ml-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <div className={`${color?.text} text-base font-medium  inline-flex items-center`}>
                <svg
                  className="w-5 h-5 mr-2.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>

                <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../admin/AdminLanding" : "./landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>

                </Link>
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
                <span className={`${color?.textgray} text-sm   font-medium hover:text-gray-900 ml-1 md:ml-2`}>
                  {allHotelDetails?.property_name}
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
                <span className={`${color?.textgray} text-sm   font-medium hover:text-gray-900 ml-1 md:ml-2`}>
                  Themes 
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div>
        </div>

        {/* Themes Selection*/}
        <div className="flex px-4" >
          <h6 className={`${color?.text} text-xl font-bold mt-2 mb-4`}>
            Themes
          </h6>
          {/* Header */}
          <div className="flex items-center justify-end space-x-1  sm:space-x-2 ml-auto">
            <div>
              <button onClick={() => { setThemes(!themes) }} className={`text-cyan-600 text-xs ${color?.whitebackground} hover:${color?.greybackground} 
                     border font-semibold rounded-lg  pr-2 py-2 
                         text-center inline-flex items-center`}
                type="button">
                <span className="flex items-center">
                  <span className="h-2.5 w-2.5 capitalize rounded-full mx-1 bg-green-400"></span>
                  <span className="mr-0.5">  {themeName}</span>
                  <svg className=" w-4 h-4 px-0.5" aria-hidden="true" fill="none"
                    stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" stroke-Linejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </span> </button>
              <div className={themes === true ? 'block' : 'hidden'}>
                <div className={`z-10 w-40 fixed rounded ${color?.greybackground} overflow-hidden divide-y divide-gray-100 shadow`}>
                  <ul className={`py-1 text-sm ${color?.text}`} aria-labelledby="dropdownDefault">
                    <li className={`block py-2 px-4 ${color?.sidebar} `}>
                      <button onClick={() => { setThemeName("Classic"); setThemes(!themes); changeTheme("Classic") }} >Classic</button>
                    </li>
                    <li className={`block py-2 px-4 ${color?.sidebar} `}>
                      <button onClick={() => { setThemeName("Classic-Dark"); setThemes(!themes); changeTheme("Classic-Dark") }} >Classic-Dark</button>
                    </li>
                  </ul>
                </div></div>
            </div>
            <div>
              <button className="bg-cyan-600 text-sm text-center hover:bg-cyan-700 text-white  py-2 px-4 rounded" onClick={() => {
                submitTheme();
              }}
              >Save</button>
            </div>

            <div className="flex hover:underline py-2 hover:decoration-cyan-600">
              <svg className="h-6 w-6 pt-1 flex-none stroke-sky-500" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M17.25 10c0 1-1.75 6.25-7.25 6.25S2.75 11 2.75 10 4.5 3.75 10 3.75 17.25 9 17.25 10Z"></path><circle cx="10" cy="10" r="2.25"></circle></svg>
              <button className=" text-base text-center text-cyan-600 mr-2  rounded"
              >
                <Link href={
                  `${loc}/${lang}/${currentProperty?.address_province.replace(
                    /\s+/g,
                    "-"
                  )}/${currentProperty?.address_city}/${currentProperty?.property_category
                  }s/${allHotelDetails?.property_name?.replaceAll(' ', '-')}`
                }>
                  <a target="_blank">Preview </a>
                </Link>
              </button>

            </div>

          </div>
        </div>
      </div>

      <div className="lg:ml-64">
        {/* Classic Theme */}
        {themeName === "Classic" ?
          <div className="sticky">
            <Classic language={language} allHotelDetails={allHotelDetails}
              allRooms={allRooms} allPackages={allPackages} services={services}
              phone={phone} email={email} /></div> : <div className="sticky"></div>}

        {/* Classic Dark */}
        {themeName === "Classic-Dark" ?
          <div className="sticky">
            <ClassicDark language={language} allHotelDetails={allHotelDetails}
              allRooms={allRooms} allPackages={allPackages} services={services}
              phone={phone} email={email} /></div> : <div className="sticky"></div>}


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
    </>

  );
}
export default Theme;
Theme.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )
}