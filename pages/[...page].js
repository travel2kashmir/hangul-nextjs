
import React from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import en from "../components/Languages/en"
import fr from "../components/Languages/fr"
import ar from "../components/Languages/ar"
import { useRouter } from "next/router";
import Classic from "./themes/classic";
import ClassicDark from './themes/classic-dark'
const logger = require("../services/logger");

var language;

function Page() {
 
  const [allHotelDetails, setAllHotelDetails] = useState([]);
  const [allRooms, setAllRooms] = useState({});
  const [allPackages, setAllPackages] = useState({});
  const [phone, setPhone] = useState({});
  const [email, setEmail] = useState({});
  const [services, setServices] = useState([]);
  const [disp,setDisp]=useState(0); 
  const [theme, setTheme] = useState("Classic")
 /** Router for Redirection **/
  const router = useRouter();
  const fetchLanguage = (lang) => {
    console.log("fetched language is "+lang)
    if (lang === "ar") {
      language = ar;
    }
    else if (lang === "en") {
      language = en;
    }
    else if (lang === "fr") {
      language = fr;
    }
    else {
      language = en;
    }
    
  }
  const fetchProperty = async (data) => {
  var url = data;
    console.log("url to fetch data is "+url)
    axios.get(url)
      .then((response) => {
       setAllHotelDetails(response.data);
       setTheme(response.data.theme != "" ?response.data.theme:'Classic');
        fetchRoomDetails(response.data.property_id);
        fetchPackageDetails(response.data.property_id);
        response.data.contacts.map(i => { if (i.contact_type === 'Phone') { setPhone(i) } });
        response.data.contacts.map(i => { if (i.contact_type === 'Email') { setEmail(i) } });
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
        setDisp(1);
        logger.info("url  to fetch property details hitted successfully")
      })
      .catch((error) => { 
        document.getElementById('datanotfound').innerHTML='Error 404 Page Not Found'
        logger.error("url to fetch property details, failed") });
  }

  const fetchHotelDetails = async () => {
  console.log('page is '+ router.query.page)
  if (router?.query?.page) {
    if(router.query.page.length===4){
      var url;
      var language= router.locale || 'en';
      console.log("language is "+language)
      fetchLanguage(language)
     url=`/api/${router?.query?.page[0]}/${router?.query?.page[1]}/${router?.query?.page[2]}/${router?.query?.page[3]}`
      fetchProperty(url);
    }
    else{
      document.getElementById('datanotfound').innerHTML='Error 404 Page Not Found'
    }
      
    }
    else
    {
      console.log("waiting for router.query.page")
    }
  
  }
  const fetchRoomDetails = async (property_id) => {
   const url = `/api/all_rooms_details/${property_id}`;
    axios.get(url)
       .then((response) => {
          setAllRooms(response.data);
          logger.info("url  to fetch room details hitted successfully")
         })
       .catch((error) => { logger.error("url to fetch property details, failed") });
 }

 const fetchPackageDetails = async (property_id) => {
    const url = `/api/all_packages_details/${property_id}`;
    axios.get(url)
       .then((response) => {
         setAllPackages(response.data);
          logger.info("url  to fetch package details hitted successfully")
         })
       .catch((error) => { logger.error("url to fetch package details, failed") });
 }

  /* Function call to fetch Current Property Details when page loads */
  useEffect(() => {
    fetchHotelDetails();
  
  },[router.query.page]);


  return (<>{disp === 0?<h1 id='datanotfound' className="text-blue-900 text-4xl  h-96 grid content-center mx-24">LOADING.....</h1>:
    <div>
    {/* Classic Theme */}
    { theme === "Classic" ?
    <div className="sticky">
    <Classic language={language} allHotelDetails={allHotelDetails} 
    allRooms={allRooms} allPackages={allPackages} services={services}
    phone={phone} email={email}/></div>:<div className="sticky"></div>}
 
    {/* Classic Dark */}
    { theme === "Classic-Dark" ?
    <div className="sticky">
    <ClassicDark language={language} allHotelDetails={allHotelDetails} 
    allRooms={allRooms} allPackages={allPackages} services={services}
    phone={phone} email={email}/></div>:<div className="sticky"></div>}

   
    </div>


  }</>
   
  );
}
export default Page;
Page.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )
}
