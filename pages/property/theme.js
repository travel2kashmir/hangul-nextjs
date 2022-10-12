import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import axios from 'axios';
import Link from "next/link";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
import Router, { useRouter } from "next/router";
const logger = require("../../services/logger");
import { ToastContainer, toast } from "react-toastify";
import Classic from "../themes/classic";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/Button";
import Footer from '../../components/Footer';
import Loader from "../../components/loader";
import Carousal from "../template/carousal";
var language;
var currentUser;
var currentProperty;

var currentLogged;

function Theme() {
  /** State to store Current Property Details **/
  var theme1 = "bg-sky-50";
  var theme2 = "bg-lime-50";
  var theme3 = "bg-rose-50";
  var theme4 = "bg-orange-50";
  var theme5 = "bg-indigo-50";
  const [allHotelDetails, setAllHotelDetails] = useState([]);
  const [allRooms, setAllRooms] = useState({});
   const [allPackages, setAllPackages] = useState({});
  const [themes, setThemes] = useState(false)
  const [phone, setPhone] = useState({});
  const [email, setEmail] = useState({});
  const [theme, setTheme] = useState(theme1)
  const [themeName, setThemeName] = useState()
  const [bgColor, setBgColor] = useState(theme1)
  const [uri, setUri] = useState("")
  const [loc,setLoc]=useState()
  const [lang,setLang]=useState('en')
  const [visible,setVisible]=useState(0) 
  var locale;

  /** Router for Redirection **/
  const router = useRouter();
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

  const initialtheme = () => {
    var url;
    url = `/api/property_page/${allHotelDetails?.property_name.replaceAll(' ', '-')}-${currentProperty?.address_city}`;
    axios.get(url)
      .then((response) => {
        setTheme(response.data.theme_id);
        setBgColor(response.data.theme_id);
        switch (response.data.theme_id) {
          case "bg-sky-50":
            setThemeName("Theme 1");
            break;
          case "bg-lime-50":
            setThemeName("Theme 2");
            break;
          case "bg-rose-50":
            setThemeName("Theme 3");
            break;
          case "bg-orange-50":
            setThemeName("Theme 4");
            break;
          case "bg-indigo-50":
            setThemeName("Theme 5");
            break;
          default: setThemeName(response.data.theme_id)
}
        logger.info("url  to fetch property details hitted successfully")
        setVisible(1)
      })
      .catch((error) => { logger.error("url to fetch property details, failed") });

  }
  /* Function call to fetch Current Property Details when page loads */
  useEffect(() => {
    setThemeName("Classic")
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
        setAllHotelDetails(response.data);
        response.data.contacts.map(i => { if (i.contact_type === 'Phone') { setPhone(i) } });
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

  return (
    <div>
   
    
      <Header Primary={english?.Side} />
      <Sidebar Primary={english?.Side} />
      {/* Body */}
      <div
        id="main-content"
        className={`bg-white  pt-24 relative overflow-y-auto lg:ml-64`}
      >
        {/* Navbar */}
        <nav className="flex mb-5 px-4 ml-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <div className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center">
                <svg
                  className="w-5 h-5 mr-2.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>

                <Link href={currentLogged?.id.match(/admin.[0-9]*/)?"../admin/AdminLanding":"./landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>

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
                <span className="text-gray-700 text-sm   font-medium hover:text-gray-900 ml-1 md:ml-2">
                  {allHotelDetails?.property_name}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div>
        </div>
 
        {/* Themes Selection*/}
       
        <div className="flex px-4" >
          <h6 className="text-xl pb-4 flex mr-4 leading-none  pt-2 font-bold text-gray-800 ">
           Themes 
          </h6>
          <div className="flex items-center justify-end space-x-1  sm:space-x-2 ml-auto">
            <div>
              <button onClick={() => { setThemes(!themes) }} className="text-cyan-600 sm:text-xs bg-white hover:bg-gray-50 
                    focus:ring-4  border focus:outline-none focus:ring-gray-200 font-semibold rounded-lg text-base px-4 py-2.5 
                         text-center inline-flex items-center"
                      type="button">
                         <span className="flex items-center">
              <span className="h-2.5 w-2.5 capitalize rounded-full bg-green-400 mx-2"></span>
                     Classic
                        <svg className="ml-2 w-4 h-4" aria-hidden="true" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" stroke-Linejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
             </span> </button>

               <div className={themes === true ?'block': 'hidden'}>
                <div className="z-10 w-40 absolute bg-gray-50 rounded overflow-hidden divide-y divide-gray-100 shadow dark:bg-gray-700">
                   
                  <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
                    <li className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <button onClick={() => { setTheme(theme1); setThemeName("Classic");setThemes(!themes) }} >Classic</button>
                    </li>
                    <li className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <button onClick={() => {  setTheme(theme2); setThemeName("Classic-Dark"); setThemes(!themes) }} >Classic-Dark</button>
                    </li>
                    <li className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <button onClick={() => {  setTheme(theme3); setThemeName("Theme-3"); setThemes(!themes) }} >Theme-3</button>
                    </li>
                    <li className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <button onClick={() => {  setTheme(theme4); setThemeName("Theme-4"); setThemes(!themes) }} >Theme-4</button>
                    </li>
                    <li className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <button onClick={() => { setTheme(theme5); setThemeName("Theme-5"); setThemes(!themes) }} >Theme-5</button>
                    </li>
                  </ul>
                </div></div>
                </div>

            <div>
              <button className="bg-cyan-600 text-sm text-center hover:bg-cyan-700 text-white  py-2 px-4 rounded" onClick={() => {
                setUri(`${allHotelDetails?.property_name.replaceAll(' ', '-')}-${currentProperty?.address_city}`.toLowerCase());
                sendLink();
              }}
              >Save</button>

            </div>

            <div className="flex hover:underline py-2 hover:decoration-cyan-600">
            <svg className="h-6 w-6 pt-1 flex-none stroke-sky-500" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M17.25 10c0 1-1.75 6.25-7.25 6.25S2.75 11 2.75 10 4.5 3.75 10 3.75 17.25 9 17.25 10Z"></path><circle cx="10" cy="10" r="2.25"></circle></svg>
              <button className=" text-base text-center text-cyan-600 mr-2  rounded"
              >  
               <Link href={`${loc}/${currentProperty?.address_province.replace(
        /\s+/g,
        "-"
      )}/${currentProperty?.address_city}/${currentProperty?.property_category
        }s/${allHotelDetails?.property_name?.replaceAll(' ', '-')}/${theme}/${lang}`}>
               <a target="_blank">Preview </a></Link></button>

            </div>

          </div>
        </div>
        { themeName === "Classic" ?
        <div className="sticky">
        <Classic language={language} allHotelDetails={allHotelDetails} 
        allRooms={allRooms} allPackages={allPackages}
        phone={phone} email={email}/></div>:<div className="sticky"></div>}

        

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
   
  );
}
export default Theme;
Theme.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )
  }