import React, { useState, useEffect } from 'react'
import validateCountry from '../../../components/Validation/Promotions/editCountry';
import validateFreeNights from '../../../components/Validation/Promotions/promotionfreenights';
import validateDiscount from '../../../components/Validation/Promotions/editdiscount';
import validatePromotionsEdit from '../../../components/Validation/Promotions/editpromotion';
import validateDates from '../../../components/Validation/Promotions/addpromotiondates';
import DatesTable from '../../../components/datestables';
import DarkModeLogic from "../../../components/darkmodelogic";
import Lineloader from '../../../components/loaders/lineloader';
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import Multiselect from 'multiselect-react-dropdown';
import lang from '../../../components/GlobalData'
import axios from 'axios';
import Link from "next/link";
import Router from 'next/router'
import english from "../../../components/Languages/en"
import french from "../../../components/Languages/fr"
import arabic from "../../../components/Languages/ar"
import Button from "../../../components/Button";
import Footer from '../../../components/Footer';
import Headloader from '../../../components/loaders/headloader';
import Textboxloader from '../../../components/loaders/textboxloader';
var language;
var currentProperty;
var currentLogged;
var days_of_week;
var keys =[];
var currentPackage;
var resCou = []
var i=0;
var currentPromotion;
var availabilityId;
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const logger = require("../../../services/logger");

function Promotion() {
  const [visible, setVisible] = useState(0);
  const [mainPromotion, setMainPromotion] = useState([]);
  const [discount, setDiscount] = useState([]);
  const [freeNights, setFreeNights] = useState([]);
  const [pkg, setPkg] = useState([]);
  const [cou, setCou] = useState([]);
  const [dev, setDev] = useState([]);
  const [view, setView] = useState(0);
  const [gen, setGen] = useState([])
  const [promotion, setPromotion] = useState([])
  const [pro, setPro] = useState([])
  const [allPackages, setAllPackages] = useState([])
  const [country,setCountry]=useState([])
  const [device,setDevice]=useState([])
  const [disp, setDisp] = useState(0);
  const [darkModeSwitcher, setDarkModeSwitcher] = useState()
  const [color, setColor] = useState({})
  const [error, setError] = useState({})

/** Fetching language from the local storage **/
useEffect(() => {
  const firstfun = () => {
    if (typeof window !== 'undefined') {
      var locale = localStorage.getItem("Language");
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
      /** Current Property Details fetched from the local storage **/
      currentProperty = JSON.parse(localStorage.getItem("property"));
      currentPackage = localStorage.getItem('PackageId');
      currentPromotion = localStorage.getItem('promotionId');
      currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
      setVisible(1);
 }
  }
  firstfun();
  Router.push("./promotion");
}, [])

useEffect(()=>{     
  setColor(DarkModeLogic(darkModeSwitcher))
 },[darkModeSwitcher])

// Promotion Validation
 const validationPromotion = () => {
 
  var result = validatePromotionsEdit(promotion)
     console.log("Result" +JSON.stringify(result))
     if(result===true)
     {
      if(pkg === 1){
        packages();
      }
      if(mainPromotion === 1){
       submitPromotion();}
     }
     else
     {
      setError(result)
     }
  }
  const validationDiscount = () => {
    var result = validateDiscount(pro?.discount?.[i])
       console.log("Result" +JSON.stringify(result))
       if(result===true)
       {
      submitPromotionDiscount(pro?.discount?.[i]);
       }
       else
       {
        setError(result)
       }
    }
    const validationCountries = () => {
      var result = validateCountry(promotion?.country?.[i])
         console.log("Result" +JSON.stringify(result))
         if(result===true)
         {
        countries();
         }
         else
         {
          setError(result)
         }
      }
      const validationFreeNights = () => {
        var result = validateFreeNights(freeNights)
           console.log("Result" +JSON.stringify(result))
           if(result===true)
           {
            if(pro?.free_nights === undefined){
              submitPromotionFreeNights()
            }
            if(pro?.free_nights !==undefined){
              submitPromotionFreeNightsEdit();
            }
           }
           else
           {
            setError(result)
           }
        }
        const validationAddPromotionDates = () => {
          var result = validateDates(promotion,days_of_week)
             console.log("Result" +JSON.stringify(result))
             if(result===true)
             {
              if(disp === 2){
                submitDates("check_in")}
                if(disp === 3){
                  submitDates("check_out")} 
                  if(disp === 4){
                    submitDates("booking")} 
             }
             else
             {
              setError(result)
             }
      }
// Promotion Discount
const submitPromotionDiscount = () => {
  const final_data = 
 {"property_promotion_discount": [{
     "discount_id":pro?.discount?.[i]?.discount_id,
     "discount":promotion?.discount_main,
     "discount_type":promotion?.discount_type,
     "applied_nights":promotion?.applied_nights
   }]
 }
 alert(JSON.stringify(final_data))
  const url = '/api/ari/promotions/property_promotion_discount'
   axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Promotion discount success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
       setDiscount([]);
      
     })
     .catch((error) => {
       toast.error("Promotion discount error", {
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

// Promotion
const submitPromotion = () => {
  var k =new Date()
  var day=k.getDate();
  var month=k.getMonth()+1  
  k.getFullYear()
  var year=k.getFullYear()
  var hr=k.getHours()
  var min=k.getMinutes()
  var sec=k.getSeconds()
 var msec=k.getMilliseconds()
  var currentDateTime=`${year}-${month}-${day} ${hr}:${min}:${sec}.${msec}`;
  const final_data = 
 {"property_promotion": [{
     "property_id": currentProperty?.property_id,
     "promotion_id":currentPromotion,
     "promotion_name":promotion?.promotion_name,
     "stacking_type":promotion?.stacking_type,
     "timestamp": currentDateTime,
     "inventory_min":promotion?.inventory_min,
     "inventory_max":promotion?.inventory_max,
     "length_of_stay_min": promotion?.length_of_stay_min,
     "length_of_stay_max": promotion?.length_of_stay_max,
     "occupancy_min": promotion?.occupancy_min,
     "occupancy_max":promotion?.occupancy_max,
     "min_amount_before_discount":promotion?.min_amount_before_discount
   }]
 }
 
  const url = '/api/ari/promotions'
   axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Promotion success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
        setMainPromotion([]);
       
     })
     .catch((error) => {
       toast.error("Promotion error", {
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

// Package
const packages = () => { 
  var final_package_data=[]
  promotion?.packages.map(item => {
    var temp = {
      promotion_id:pro?.promotion_id,
      package_id: item?.package_id
    }
    final_package_data.push(temp) } );
    
    submitPackages(final_package_data)
    
}

// Country
const countries = () => { 
  var final_country_data=[]
  promotion?.country.map(item => {
    var temp = {
      promotion_id: pro?.promotion_id,
      country_code: item?.country_code,
      country_action: promotion?.country_type === undefined ? pro?.countries?.[0]?.country_action : promotion?.country_type
    }
    final_country_data.push(temp) } );
    setCou(1)
    submitCountries(final_country_data);   
}

//Devices
const devices = () => { 
  var final_device_data=[]
   promotion?.devices.map(item => {
     var temp = {
       promotion_id:pro?.promotion_id,
       device: item?.user_device
     }
     final_device_data.push(temp) } );
     setDev(1);
     submitDevices(final_device_data);    
 }

// Devices
const submitDevices = (props) => {
  const final_data =  {"promotion_devices": props }
  alert(JSON.stringify(final_data))
   const url = '/api/ari/promotions/property_promotion_devices'
   axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Devices success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
      setDev([])
   
     })
     .catch((error) => {
       toast.error("Devices error", {
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

// Packages
const submitPackages = (props) => {
  const final_data =  {"promotion_packages": props }
  alert(JSON.stringify(final_data))
   const url = '/api/ari/promotions/property_promotion_packages'
   axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Packages success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
        setPkg([])
      
     })
     .catch((error) => {
       toast.error("Packages error", {
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

// Packages
const submitCountries = (props) => {
  const final_data =  {"property_promotion_country": props}
  alert(JSON.stringify(final_data))
   const url = '/api/ari/promotions/property_promotion_country'
   axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Country success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
       setCou([])
    
     })
     .catch((error) => {
       toast.error("Country error", {
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

//Promotion Free Nights
const submitPromotionFreeNightsEdit = () => {
  const final_data = 
 {"property_promotion_discount": [{
  
     "free_nights_id": pro?.free_nights?.[i]?.free_nights_id,
     "stay_nights":freeNights?.stay_nights,
     "discount_nights":freeNights?.discount_nights,
     "discount_percentage":freeNights?.discount_percentage,
     "night_selection":freeNights?.free_night_selection,
     "repeat":freeNights?.repeat,
   }]
 }
 alert(JSON.stringify(final_data))
  const url = '/api/ari/promotions/property_promotion_free_nights'
   axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Promotion success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
       setDisp(2);
     })
     .catch((error) => {
       toast.error("Promotion error", {
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
const submitPromotionFreeNights = () => {
  const final_data = 
 {"property_promotion_discount": [{
  "promotion_id": pro?.promotion_id,
     "stay_nights":freeNights?.stay_nights,
     "discount_nights":freeNights?.discount_nights,
     "discount_percentage":freeNights?.discount_percentage,
     "night_selection":freeNights?.free_night_selection,
     "repeat":freeNights?.repeat,
   }]
 }
 alert(JSON.stringify(final_data))
  const url = '/api/ari/promotions/property_promotion_free_nights'
  
   axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Promotion success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
      setDisp(2)
     })
     .catch((error) => {
       toast.error("Promotion error", {
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
/** Function to cancel package mile **/
const removecheckIn = (index) => {
  const filteredCheckIn = checkInData.filter((i, id) => i.index !== index)
   setCheckInData(filteredCheckIn)
  }
  
  useEffect(() => {
    const fetchPackages = async () => {
      try {
          const url = `/api/package/${currentProperty?.property_id}`
          const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
         setAllPackages(response.data) 
      }
      catch (error) {
          if (error.response) {
             } 
          else {
             }
      }

  }
  fetchPackages();


fetchPromotion();
filterByCountry();
  },[])

  const fetchPromotion = async () => {
    try {
        const url = `/api//ari/promotions/${currentProperty?.property_id}/${currentPromotion}`
        const response = await axios.get(url, { headers: { 'accept': 'application/json' } });
        setPromotion(response.data) 
        setPro(response.data)
         setCountry(
            lang?.CountryData.filter(el => {
            return response?.data?.countries?.find(element => {
               return element.country_code === el.country_code;
            });
         }));
        setDevice( lang?.DeviceData?.filter(el => {
          return  response?.data?.devices?.find(element => {
             return element.device === el.user_device;
          });
       })); 
       setFreeNights(response.data.free_nights?.[i])   
    }
    catch (error) {
        if (error.response) {
           } 
        else {
           }
    }

}
  const checkInGen = () => {
    var genData = [];
    promotion?.dates?.map((item) => {
      if(item?.type === "check_in"){
      var temp = {
          name: item.start_date,
          type: item.end_date,
          status: item.days_of_week,
          id: item.date_id
      }
    
      genData.push(temp)}
  })
  setGen(genData);
  setDisp(2);
  }
  const checkOutGen = () => {
    var genData = [];
    promotion?.dates?.map((item) => {
      if(item?.type === "check_out"){
      var temp = {
          name: item.start_date,
          type: item.end_date,
          status: item.days_of_week,
          id: item.date_id
      }
    
      genData.push(temp)}
  })
  setGen(genData);
  setDisp(3);
  }

  const BookingGen = () => {
    var genData = [];
    promotion?.dates?.map((item) => {
      if(item?.type === "booking"){
      var temp = {
          name: item.start_date,
          type: item.end_date,
          status: item.days_of_week,
          id: item.date_id
      }
      genData.push(temp)}
  })
  setGen(genData);
  setDisp(4);
  }
  
   /** For Miles**/
   const checkInTemplate = {
    "availability_id":availabilityId,
    "unit_of_time": "",
    "time":"" ,
    "min_max_msg": "" ,
    "pattern": "",
    "fixed_pattern":""
  }  

  /* Mapping Index of each mile*/
    const [checkInData, setCheckInData] = useState([checkInTemplate]?.map((i, id) => { return { ...i, index: id } }))
  
  const addLOS = () => {
    setCheckInData([...checkInData, checkInTemplate]?.map((i, id) => { return { ...i, index: id } }))
  }
 
 /** Function to add mile **/
 const addCheckIn = () => {
  setCheckInData([...checkInData, checkInTemplate]?.map((i, id) => { return { ...i, index: id } }))
}
const filterByCountry = () => {
  if(  promotion?.countries != undefined) {
 resCou = lang?.CountryData.filter(el => {
   return promotion?.countries?.find(element => {
      return element.country_code === el.country_code;
   });
});
setCountry(resCou)
  }
  else{
  resCou= []
  }
Router.push('./promotion')
}

const submitDates= (check_in) => {
  const data =
   [{"promotion_id":pro?.promotion_id,
     "start_date": promotion?.start_date,
     "end_date": promotion?.end_date,
     "days_of_week": days_of_week,
     "type": check_in
   }]
 const final_data = { "property_promotion_rates": data }

 const url = '/api/ari/promotions/property_promotion_dates'
   axios.post(url, final_data, { header: { "content-type": "application/json" } }).then
     ((response) => {
       toast.success("Dates success", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
     days_of_week=[];
    setView(0);
    if(disp === 2){
      checkInGen();
    }
    if(disp === 3){
      checkOutGen();
    }
    if(disp === 4){
      BookingGen();
    }
     })
     .catch((error) => {
       toast.error("Dates error", {
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
const days = (days) => { 
  var days_present=['-','-','-','-','-','-','-'];
  days.map(day=>{
  
  if(day.day==='mon')
  {
  days_present[0]='M'
  }
  else if(day.day==='tue')
  {
  days_present[1]='T'
  }
  else if(day.day==='weds')
  {
  days_present[2]='W'
  }
  else if(day.day==='thur')
  {
  days_present[3]='T'
  }
  else if(day.day==='fri')
  {
  days_present[4]='F'
  }
  else if(day.day==='sat')
  {
  days_present[5]='S'
  }
  else if(day.day==='sun')
  {
  days_present[6]='U'
  }
  })
   days_of_week = days_present.toString().replaceAll(',','');
   
}
//Submit Date Delete
const submitPromotionDelete = (props) => {

  const url = `/api/ari/promotions/property_promotion_dates/${props}`;
   axios
     .delete(url)
     .then((response) => {
       toast.success("API:Date Deleted Successfully!", {
         position: "top-center",
         autoClose: 5000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
         progress: undefined,
       });
       fetchPromotion();
       if(disp === 2){
        checkInGen();
        setDisp(2);
        Router.push('./promotion')
       }
       if(disp === 3){
        checkOutGen();
       }
       if(disp === 4){
        BookingGen();
       }
     })
     .catch((error) => {
       toast.error("API:Date Delete Error!", {
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
    <div>
       <Header color={color} Primary={english.Side1} />
       <Sidebar color={color} Primary={english.Side1} />

    <div id="main-content"
          className={(disp === 2 || disp === 3 || disp === 4)  ? `${color?.whitebackground}  pt-24 relative overflow-y-auto lg:ml-64` :
          ` ${color?.greybackground} pt-24 px-4 relative overflow-y-auto lg:ml-64`}>
         {/* Navbar */}
         <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
              <div className={`${color?.text} text-base font-medium  inline-flex items-center`}>
                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../admin/AdminLanding" : "./landing"} 
                className={`${color?.text} text-base font-medium  inline-flex items-center`}><a>{language?.home}</a>
                </Link></div>
              </li>
              <li>
                <div className="flex items-center">
                <div className={`${color?.text} text-base capitalize font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="./propertysummary" className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2">
                    <a>{currentProperty?.property_name}</a>
                  </Link>
                  </div></div>

                </div>
              </li>
              <li>
                <div className="flex items-center">
                <div className={`${color?.text} text-base capitalize font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <div className={visible === 0 ? 'block w-16' : 'hidden'}><Headloader /></div>
                  <div className={visible === 1 ? 'block' : 'hidden'}>   <Link href="../promotions" className="text-gray-700 text-sm   font-medium hover:{`${color?.text} ml-1 md:ml-2">
                    <a>{language?.promotions}</a>
                  </Link>
                  </div></div>

                </div>
              </li>
              <li>
                <div className="flex items-center">
                <div className={`${color?.textgray} text-base font-medium  inline-flex items-center`}>
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                  <span className="text-gray-400 ml-1 md:ml-2 font-medium text-sm  " aria-current="page">{language?.promotion}</span>
                </div>
                </div>
              </li>
            </ol>
          </nav>
          {/* Promotion */}
          <div id='0' className={disp===0?'block':'hidden'}>
          <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
          <div className="relative before:hidden  before:lg:block before:absolute before:w-[70%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`} >{language?.promotion}</div>
            </div>
          
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className={`${color?.widget} lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotionduration}</div>
            </div>
          
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.checkin}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.checkout}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.booking} {language?.date}</div>
            </div>
           
        </div>
        <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
             {language?.promotion} 
        </h6>
            <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                       {language?.promotion} {language?.name}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                        <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                           defaultValue={pro?.promotion_name}
                          onChange={
                            (e) => (
                              setPromotion({ ...promotion, promotion_name: e.target.value },setMainPromotion(1))
                            )
                          }
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.promotion_name}</p></div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.stackingtype}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select
                        className={`shadow-sm ${color?.greybackground} border capitalize border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        onChange={(e) =>
                          setPromotion({
                            ...promotion,
                            action: e.target.value,
                          },setMainPromotion(1))
                        }
                      >
                        <option disabled selected>
                          
                          {pro?.stacking_type}</option>
                        <option value="any">Any</option>
                        <option value="base">Base</option>
                        <option value="none">None</option>
                        <option value="second">Second</option>
                      </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.stacking_type}</p>
                      </div>
                    </div>
                  </div>
                
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.discount} {language?.type}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                       onChange={
                      (e) => (
                         setPromotion({ ...promotion, discount_type: e.target.value },setDiscount(1))
                      )
                  }>
                     <option selected disabled >{pro?.discount?.[i]?.discount_type} </option>
                    <option value="discount_nights">Discount Percentage</option>
                    <option value="fixed_amount_per_night">Fixed Amount per night</option>
                    <option value="fixed_amount">Fixed Amount</option>
                   </select>
                   <p className="text-sm text-sm text-red-700 font-light">
                      {error?.discount_type}</p>
                       </div>
                    </div>
                  </div>

                <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.discount} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setPromotion({ ...promotion,discount_main: e.target.value },setDiscount(1))
                            )
                          }
                          defaultValue={pro?.discount?.[i]?.discount}
                        />
                   <p className="text-sm text-sm text-red-700 font-light">
                      {error?.discount}</p>
                       </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.appliednights} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                              setPromotion({ ...promotion, applied_nights: e.target.value },setDiscount(1))
                            )
                          }
                          defaultValue={pro?.discount?.[i]?.applied_nights}
                        />
                   <p className="text-sm text-sm text-red-700 font-light">
                      {error?. applied_nights}</p>
                       </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.losmin}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                         onChange={
                            (e) => (
                             setPromotion({ ...promotion,length_of_stay_min: e.target.value },setMainPromotion(1))
                            )
                          }
                          defaultValue={pro?.length_of_stay_min}
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.length_of_stay_min}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.losmax} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                        className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                             setPromotion({ ...promotion, length_of_stay_max: e.target.value },setMainPromotion(1))
                            )
                          }
                          defaultValue={pro?.length_of_stay_max}
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.length_of_stay_max}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.inventorycountmin} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                          defaultValue={pro?.inventory_min}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                             setPromotion({ ...promotion, inventory_min: e.target.value })
                            )
                          }
                        />
                   <p className="text-sm text-sm text-red-700 font-light">
                      {error?.inventory_min}</p>
                       </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                       {language?.inventorycountmax} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                          defaultValue={pro?.inventory_max}
                         className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                             setPromotion({ ...promotion, inventory_max: e.target.value })
                            )
                          }
                        />
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.inventory_max}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                       {language?.minamountbeforediscount} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                        className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                             setPromotion({ ...promotion, min_amount_before_discount: e.target.value },setMainPromotion(1))
                            )
                          }
                          defaultValue={pro?.min_amount_before_discount}
                        />
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.min_amount_before_discount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.occupancymin}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                         className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                          onChange={
                            (e) => (
                             setPromotion({ ...promotion, occupancy_min: e.target.value },setMainPromotion(1))
                            )
                          }
                          defaultValue={promotion?.occupancy_min}
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.occupancy_min}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.occupancymax} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="number" min={1}
                          className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                         onChange={
                            (e) => (
                             setPromotion({ ...promotion,occupancy_max: e.target.value },setMainPromotion(1))
                            )
                          }
                          defaultValue={pro?.occupancy_max}
                        />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.occupancy_max}</p>
                      </div>
                    </div>
                  </div>
                 
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.devices}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <Multiselect 
                      className={` shadow-sm ${color?.greybackground} ${color?.text} mb-3 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full
                       `}
                      isObject={true}
                      selectedValues={device}
                      options={lang?.DeviceData}
                      onRemove={(e)   =>
                        setPromotion({
                          ...promotion,
                        devices: e,
                        },setDev(1))}
                      onSelect={(e)   =>
                        setPromotion({
                          ...promotion,
                        devices: e,
                        },setDev(1))}
                      
                     displayValue="user_device"
                    
                      />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.end_date}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.packages}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <Multiselect 
                      className={` shadow-sm ${color?.greybackground} ${color?.text} mb-3 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full
                       `}
                      isObject={true}
                      options={allPackages}
                      onRemove={(e)   =>
                        setPromotion({
                          ...promotion,
                       packages: e,
                        }, setPkg(1))}
                      onSelect={(e)   =>
                        setPromotion({
                          ...promotion,
                       packages: e,
                        }, setPkg(1))}
                      selectedValues={promotion?.packages}
                     displayValue="package_name"
                    
                      />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.packages}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password">
                        {language?.country}  {language?.type}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select
                        className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                        onChange={(e) =>
                          setPromotion({
                            ...promotion,
                           country_action: e.target.value,
                          },setCou(1))
                        }
                      >
                        <option disabled selected>{JSON.stringify(promotion?.countries?.[i]?.country_action) === "true"?
                        "Include" : "Exclude"}</option>
                        <option value="true">Include</option>
                        <option value="false">Exclude</option>
                        </select>
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.country_type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm capitalize font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                        {language?.country}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <Multiselect 
                      className={` shadow-sm ${color?.greybackground} ${color?.text} mb-3 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full
                       `}
                      isObject={true}
                      options={lang?.CountryData}
                      selectedValues={country}
                      onRemove={(e)   =>
                        setPromotion({
                          ...promotion,
                        country: e,
                        },setCou(1))}
                      onSelect={(e)   =>
                        setPromotion({
                          ...promotion,
                       country: e,
                        },setCou(1))}
                      displayValue="country_name"
                    
                      />
                        <p className="text-sm text-sm text-red-700 font-light">
                      {error?.country}</p>
                       </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-24">
                      
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-24">
                      
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                  <Button Primary={language?.Update} onClick={()=>{
                    if(mainPromotion === 1 || pkg===1) {
                      validationPromotion();
                    }
                    if(discount === 1){
                      validationDiscount();
                    }
                    if(cou === 1){
                      validationCountries();
                    }
                    if(dev=== 1){
                      devices();
                    }
                    }}/>
                    <Button Primary={language?.Next} onClick={()=>{
                     
                     setDisp(1)
                    }}/> 
                </div>
                
                  </div>
                  </div>
           </div>
            </div>
            </div>

           {/* Discount */}
           <div id='1' className={disp===1?'block':'hidden'}>
            <div className={`${color?.whitebackground} shadow rounded-lg px-12 sm:p-6 xl:p-8  2xl:col-span-2`}>
            <div className="relative before:hidden  before:lg:block before:absolute before:w-[70%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotion}</div>
            </div>
          
             <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">2</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>
                   {language?.promotion} {language?.discount}
                </div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}> {language?.checkin} </div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.checkout}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">5</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.booking} {language?.date}</div>
            </div>
           
           
        </div>
            <h6 className={`${color?.text} text-xl flex leading-none pl-6 lg:pt-2 pt-6  font-bold`}>
           {language?.promotion} {language?.duration} 
            </h6>
            <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
                <div className="flex flex-wrap">

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                         {language?.freestaynights} 
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                           defaultValue={freeNights?.stay_nights}
                          onChange={
                            (e) => (
                              setFreeNights({ ...freeNights, stay_nights: e.target.value })
                            )
                          }
                        />
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.stay_nights}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                       {language?.freediscountnights}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                           defaultValue={freeNights?.discount_nights}
                          onChange={
                            (e) => (
                              setFreeNights({ ...freeNights, discount_nights: e.target.value })
                            )
                          }
                        />
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.discount_nights}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                       {language?.freenightsdiscountpercentage}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <input
                          type="text"
                          className={`shadow-sm ${color?.greybackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                           defaultValue={freeNights?.discount_percentage}
                          onChange={
                            (e) => (
                              setPromotion({ ...promotion, discount_percentage: e.target.value })
                            )
                          }
                        />
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.restriction_type}</p>
                      </div>
                    </div>
                  </div>
                 
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                      {language?.freenightselection}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                     onChange={
                      (e) => (
                         setPromotion({ ...promotion, free_night_selection: e.target.value })
                      )}>
                     <option selected >
                     {pro?.free_nights !== undefined ?
                      pro?.free_nights?.[i]?.night_selection : language?.select }</option>
                    <option value="cheapest" >Cheapest
                   </option>
                    <option value="last">Last
                    </option>
                  
                    </select>
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.restriction_type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className={`text-sm font-medium ${color?.text} block mb-2`}
                        htmlFor="grid-password"
                      >
                       {language?.freenightsrepeat}
                      </label>
                      <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                      <select className={`shadow-sm ${color?.greybackground} ${color?.text}  border border-gray-300  sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`}
                     onChange={
                      (e) => (
                         setFreeNights({ ...freeNights, repeat: e.target.value })
                      )}>
                     <option selected >
                     {pro?.free_nights !== undefined ?
                       JSON.stringify(freeNights?.repeat) === "true" ? "Yes" :"No"  :
                      language?.select} </option>
                    <option value="true" >Yes
                   </option>
                    <option value="false">No
                    </option>
                  
                    </select>
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.restriction_type}</p>
                      </div>
                    </div>
                  </div>
                 
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-4">
                      
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-4">
                      
                    </div>
                  </div>
                  
                 
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Next} onClick={()=>{
                      validationFreeNights();
                      
                      checkInGen()
                      }} /> 
                </div>
                
                  </div>
                  </div>
                  </div>
            </div>
            </div>

            {/* Check In */}
            <div id='2' className={disp===2?'block':'hidden'}>
            <div className="relative before:hidden  before:lg:block before:absolute before:w-[70%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotion} {checkInData?.days_of_week}</div>
            </div>
          
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400"> 2</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotion} {language?.duration}</div>
            </div>
           
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.checkin} </div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.checkout}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">5</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.booking} {language?.date}</div>
            </div>
           
        </div>
          {/* Card CheckIn Table */}
          <DatesTable gen={gen} setGen={setGen} color={color}  common={language?.common} cols={language?.CheckInCols}
        name={language?.checkin} delete={submitPromotionDelete} add={()=> setView(1)}/> 
            <div className="flex items-center justify-end space-x-2 mr-4 mb-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Next} onClick={()=>{setDisp(3);checkOutGen()}} /> 
                </div>
            </div>
           
          
           {/* Check Out*/}
           <div id='3' className={disp===3?'block':'hidden'}>
           <div className="relative before:hidden  before:lg:block before:absolute before:w-[70%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotion}</div>
            </div>
          
                <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400"> 2</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotion} {language?.duration}</div>
            </div>
            
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}> {language?.checkin} </div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.checkout}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">5</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>   {language?.booking} {language?.date}</div>
            </div>
           
        </div>

       {/* Card CheckOut Table */}
       <DatesTable gen={gen} setGen={setGen} color={color}  common={language?.common} cols={language?.CheckInCols}
         add={()=> setView(1)} delete={submitPromotionDelete} name={language?.checkout}/> 
            <div className="flex items-center justify-end space-x-2 mr-4 mb-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Next} onClick={()=>{setDisp(4);BookingGen()}} /> 
                </div>
          </div>

            {/* Booking Date*/}
            <div id='4' className={disp===4?'block':'hidden'}>
            <div className="relative before:hidden  before:lg:block before:absolute before:w-[70%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotion}</div>
            </div>
           <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400"> 2</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.promotion} {language?.duration}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">3</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}> {language?.checkin} </div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">4</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.checkout}</div>
            </div>
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">5</button>
                <div className={`${color?.widget} lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto`}>{language?.booking} {language?.date}</div>
            </div>
           
        </div>
       {/* Card Booking Table */}
       <DatesTable gen={gen} setGen={setGen} delete={submitPromotionDelete} color={color}  common={language?.common} cols={language?.CheckInCols}
        name={language?.booking}  add={()=> setView(1)}/> 
            <div className="flex items-center justify-end space-x-2 mr-4 mb-2 sm:space-x-3 ml-auto">
                    <Button Primary={language?.Submit} onClick={()=>{setDisp(4);BookingGen()}} /> 
                </div>
            </div> 
       
           {/* Modal Add */}
        <div className={view === 1 ? "block" : "hidden"}>
          <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
            <div className="relative w-full max-w-2xl px-4 h-full md:h-auto">
              <div className={`bg-white rounded-lg shadow relative`}>
                <div className="flex items-start justify-between p-5 border-b rounded-t">
                  <h3 className="text-xl font-semibold">{language?.add} {language?.new}
                  {disp===2 ?  language?.checkin : disp===3 ?  language?.checkout : language?.booking}</h3>
                  <button
                    type="button"
                    onClick={() =>{
                      setView(0);
                    } }
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
                  <form id='addcontactform'>
                <div className="p-6 space-y-6" >
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className={`text-sm font-medium text-gray-900 block mb-2`}
                      >
                        {language?.startdate} 
                      </label>
                      <input type="date"
                      onChange={
                        (e) => (
                          setPromotion({ ...promotion, start_date: e.target.value })
                        )
                      }
                   className={`shadow-sm  ${color?.whitebackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-64 p-2.5`}></input>
                    <p className="text-sm text-sm text-red-700 font-light">
                      {error?.start_date}</p>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className={`text-sm capitalize font-medium text-gray-900 block mb-2`}
                      >
                        {language?.enddate} 
                      </label>
                      <input type="date"
                       onChange={
                        (e) => (
                          setPromotion({ ...promotion, end_date: e.target.value })
                        )
                      }
                      className={`shadow-sm ${color?.whitebackground} border border-gray-300 ${color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-64 p-2.5`}></input>
                   
                   <p className="text-sm text-sm text-red-700 font-light">
                      {error?.end_date}</p> </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className={`text-sm capitalize font-medium text-gray-900 block mb-2`}
                      >
                        {language?.days} {days_of_week}
                      </label>
                      <Multiselect 
                      className={`fixed shadow-sm ${color?.greybackground} ${color?.text} mb-3 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full
                       `}
                      isObject={true}
                      
                      options={lang?.DaysData}
                      onRemove={(event) => { days(event) }}
                      onSelect={(event) => { days(event) }}
                     displayValue="day"
                    
                      />
                       <p className="text-sm text-sm text-red-700 font-light">
                      {error?.days_of_week}</p>
                    </div>
                  </div>
                </div>
                </form>

                <div className="items-center p-6 border-t border-gray-200 rounded-b">
                     
                      <Button Primary={language?.Add} onClick={()=>{validationAddPromotionDates()
                      }} />
                   
                       
                </div>
              </div>
            </div>
          </div>
        </div>

          </div>
          <div className={(disp === 0 || disp === 1)  ? 'block' :'hidden'}>
          <Footer color={color}  Primary={english.Side}  />
          </div>
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
  )
}

export default Promotion
Promotion.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )
  }