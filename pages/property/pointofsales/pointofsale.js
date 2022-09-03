import React, { useEffect, useState } from 'react'
import Link from "next/link";
import axios from "axios";
import Button from '../../../components/Button';
import lang from "../../../components/GlobalData"
import Sidebar  from "../../../components/Sidebar";
import Header  from "../../../components/Header";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import english from "../../../components/Languages/en"
import french from "../../../components/Languages/fr"
import arabic from "../../../components/Languages/ar";
import Table from '../../../components/Table';
import Headloader from '../../../components/loaders/headloader';
import Lineloader from '../../../components/loaders/lineloader';
import Router from "next/router";
var language;
var currentProperty;
var j = 1;
var i =0;
var currentSale;
var resCou = [];
var disLang = [];
var resLang = [];
var resCurr = [];
const logger = require("../../../services/logger");
var currentLogged;

function Allpointofsale() {
  const [disp, setDisp] = useState(0);
  const [view, setView] = useState(0);
  const [viewEdit, setViewEdit] = useState(0);
  const [flag, setFlag] = useState([]); 
  const [visible, setVisible] = useState(0);
  const [current, setCurrent] = useState([]);
  const [countryCheck, setCountryCheck] = useState(false);
  const [languageCheck, setLanguageCheck] = useState(false);
  const [deviceCheck, setDeviceCheck] = useState(false);
  const [siteCheck, setSiteCheck] = useState(false);
  const [currencyCheck, setCurrencyCheck] = useState(false);
  const [couCheck, setCouCheck] = useState(false);
  const [langCheck, setLangCheck] = useState(false);
  const [devCheck, setDevCheck] = useState(false);
  const [siCheck, setSiCheck] = useState(false);
  const [currCheck, setCurrCheck] = useState(false);
  const [error, setError] = useState({})
  const [sales, setSales] = useState([]);
  const [dSales, setDSales] = useState([]);
  const [gen, setGen] = useState([])
  
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
        currentProperty = JSON.parse(localStorage.getItem('property'));
        currentSale = localStorage.getItem('saleId');
        currentLogged = JSON.parse(localStorage.getItem("Signin Details"));
      }
    }
    firstfun();
  }, [])

  useEffect(() => {
    fetchDetails();
  },[])

  /** Fetch point of sale details **/
  const fetchDetails = async () => {
    var genData = [];
    const url = `/api/point_of_sale/${currentSale}`
    console.log("url " +url)
    axios.get(url)
    .then((response)=>{setSales(response.data);
    
      {
        response.data?.match_status?.map((item) => {
          var temp = {
            name: item.match_status_name,
            match_status_name: item.match_status_name,
            type: item.match_status,
            match_status: item.match_status,
            status: item.status,
            country: item?.country,
            device:item?.device,
            currency:item?.currency,
            site_type:item?.site_type,
            language:item?.language,
            id: item.match_status_id
          }
          genData.push(temp)
        })
        setGen(genData);
        disLang = lang?.LanguageData.filter(el => {
          return response?.data?.display_language === el.language_code;
        });
       setVisible(1)
      }
    logger.info("url  to fetch point of sale hitted successfully"); 
  })
    .catch((error)=>{logger.error("url to fetch point of sale, failed")}); 
  } 
    // Validation Function
const validationMatchStatus = (data) => {
  var Result = checkMatchStatusData(data);
  if (Result === true){
   return true;
  }
  else{
    setError(Result);
    return false;

   }
  }
   //Checking Form Data for Validations
  const checkMatchStatusData = (data) => {
    var error={};
    if(data?.match_status_name === "" ||data?.match_status_name === undefined){
      error.match_status_name = "This field is required."
    } 
    if(data?.match_status === "" || data?.match_status === undefined){
      error.match_status = "This field is required."
    }  
  
   return Object.keys(error).length === 0 ? true :  error;
  
   }
   const validationPOS = (data) => {
    var Result = checkPOSData(data);
    if (Result === true){
     return true;
    }
    else{
     setError(Result);
     return false;

    }

 }

 //Checking Form Data for Validations
 const checkPOSData = (data) => {
  var error={};
  if(data?.display_name === "" || data?.display_name === undefined){
    error.display_name = "This field is required."
  }
  if(data?.url === "" || data?.url === undefined){
    error.url = "This field is required."
  }
  if((!data?.url?.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) && (data.url != "" &&  data.url != undefined))){
    error.url = "The url has invalid format."
  } 
  
 return Object.keys(error).length === 0 ? true :  error;

 }

 //Delete Match status 
   const submitMatchStatusDelete = (props) => {
    const url = `/api/point_of_sale/${props}`;
    axios
      .delete(url)
      .then((response) => {
        toast.success("API: Match status deleted successfully.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
       fetchDetails()
        Router.push("./pointofsale");
      })
      .catch((error) => {
        toast.error("API: Match status delete error.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setDeleteContact(0)
      });
  };


   // Point of Sale Add Function
const submitMatchstatus = () =>
 { if (validationMatchStatus(dSales)){ 
  if(couCheck || currCheck || langCheck || devCheck || siCheck === true){
    const data =[{
        match_status: dSales?.match_status,
        match_status_name:dSales?.match_status_name,
        country: dSales?.country,
        language: dSales?.language,
        device:dSales?.device,
        currency:dSales?.currency,
        site_type: dSales?.site_type  
    }];
    const final_data={match_status: data}
    const url = "/api/point_of_sale/match_status";
    axios
      .post(url, final_data, {
        header: { "content-type": "application/json" },
      })
      .then((response) => {
        toast.success("API: Match Status added successfully!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        const datas = [{
           match_status_id:response.data.match_status_id,
          sale_id:sales?.sale_id
          }];
        
          const final_datas={pos_match_status_link: datas}
          const url = "/api/point_of_sale/pos_match_status_link";
          axios.post(url, final_datas, {header: { "content-type": "application/json" }, })
            .then((response) => {

              toast.success("API: Match Status added successfully!", {
   position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
              setView(0);
            })
            .catch((error) => {
              toast.error("API: Match Status error", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            })      
      })
      .catch((error) => {
        toast.error("API: Match status add error", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    }
    else{
      toast.error("APP: Please select at least one condition", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    }
  }
};

  /**Function to save Current property to be viewed to Local Storage**/
  const currentMatch = (props) => {
    setCurrent(props)
    setError([])
    setViewEdit(1);
    filterByCountry(props)
   
    if(props?.device != undefined){
      setDeviceCheck(true)
    }
    filterByMLanguage(props)
    if(props?.site_type != undefined){
      setSiteCheck(true)
    }
    filterByCurrency(props)
  };

{/** Filter Functions for Drop Down **/}
// Filter Language Selected One in Dropdown
const filterByMLanguage = (props) => {
  if(props?.language != undefined) {
  setLanguageCheck(true)
  resLang = lang?.LanguageData.filter(el => {
    return props?.language === el?.language_code;
   });
  }
  else{
    resLang= []
    }
}

  // Filter Country Selected One in Dropdown
  const filterByCountry = (props) => {
    if(props?.country != undefined) {
    setCountryCheck(true)
    resCou = lang?.CountryData.filter(el => {
     return props?.country === el.country_code;
     });
    }
    else{
    resCou= []
    }
  Router.push('./pointofsale')
  }
 
  // Filter Currency Selected One in Dropdown
  const filterByCurrency = (props) => {
    if(props?.currency != undefined) {
    setCurrencyCheck(true)
    resCurr = lang?.CurrencyData.filter(el => {
      return props?.currency === el?.currency_code;
     });
 
    }
    else{
      resCurr= []
      }
  Router.push('./pointofsale')
  }

  const submitMatchStatusEdit = () => {
    if (validationMatchStatus(current)){
    if(deviceCheck || countryCheck || currencyCheck || siteCheck  === true){
     
    const final_data ={
      match_status:current?.match_status,
        match_status_name:current?.match_status_name,
        country: current?.country,
        language: current?.language,
        device:current?.device,
        currency:current?.currency,
        site_type: current?.site_type,
        match_status_id:current?.id  
    };
      const url = '/api/point_of_sale/match_status'
      axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
        ((response) => {
          toast.success("API: Match Status Updated Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          fetchDetails();
          setViewEdit(0);
          setFlag([])
          setCurrent([])
        })
        .catch((error) => {
          toast.error("API: Match Status Update Error!", {
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
      else{
        toast.error("APP: Please check one of the condition", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  }
  
  const submitPointOfSaleEdit = () => {
    if (validationPOS(sales)){ 
    const final_data ={
       display_name:sales?.display_name,
       display_language:sales?.display_language,
        url: sales?.url,
        sale_id:sales?.sale_id  
    };
      const url = '/api/point_of_sale'
      axios.put(url, final_data, { header: { "content-type": "application/json" } }).then
        ((response) => {
          toast.success("API: Point of sale Updated Successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          fetchDetails();
          setDisp(1)
        })
        .catch((error) => {
          toast.error("API: Point of sale update error!", {
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
    
  }

  return (
    <div>
        <Header Primary={english?.Side1}/>
      <Sidebar  Primary={english?.Side1}/>
      <div id="main-content"
       className= {disp===1? "bg-white pt-24 relative overflow-y-auto lg:ml-64" :
       "bg-gray-50 px-4 pt-24 relative overflow-y-auto lg:ml-64"}>
       {/* Navbar */}
       <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                <Link href={currentLogged?.id.match(/admin.[0-9]*/) ? "../../admin/AdminLanding" : "../landing"} className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"><a>{language?.home}</a>
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
              <Link href="../propertysummary" >
               <a> {currentProperty?.property_name}</a>
              </Link></div></span>
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
              <span className="text-gray-700 text-sm capitalize  font-medium hover:text-gray-900 ml-1 md:ml-2">
              <Link href="../pointofsales" >
               <a>{language?.pointofsales}</a>
              </Link></span>
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
              {language?.pointofsale}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div id='0' className={disp===0?'block':'hidden'}>
      <div className="bg-white shadow rounded-lg mx-1 px-12 sm:p-6 xl:p-8  2xl:col-span-2">
      <div className="relative before:hidden  before:lg:block before:absolute before:w-[45%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">1</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto"> {language?.pointofsale}</div>
            </div>
            
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">2</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.matchstatus}</div>
            </div>
        </div>
        <h6 className="text-xl flex leading-none pl-6 pt-2 font-bold text-gray-900 mb-2">
        {language?.pointofsale}
        </h6>
        <div className="pt-6">
          <div className=" md:px-4 mx-auto w-full">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                   {language?.pointofsale} {language?.name}
                  </label>
                  <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                  <input
                    type="text"
                    className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  defaultValue={sales?.display_name}
                    onChange={
                      (e) => (
                       setSales({ ...sales, display_name: e.target.value },setFlag(1))
                      )
                    } />
                      <p className="text-red-700 font-light">
                   {error?.display_name}
            </p>
                    </div>
                </div>
              </div>
                <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
                 {language?.pointofsale} {language?.language}
                  </label>
                  <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                  <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    onChange={
                      (e) => (
                        setSales({ ...sales,display_language: e.target.value },setFlag(1))
                      )
                    }>
                    <option selected>{disLang?.[i]?.language_name}</option>
                    {lang?.LanguageData?.map(i => {
                          return (
                            <option key={i} value={i.language_code}>{i.language_name}</option>)
                        }
                        )}
                   
                  </select></div>
                </div>
              </div>
            
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3">
                  <label
                    className="text-sm font-medium text-gray-900 block mb-2"
                    htmlFor="grid-password"
                  >
               {language?.pointofsale} URL
                  </label>
                  <div className={visible === 0 ? 'block' : 'hidden'}><Lineloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                  <input
                    type="text"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                    defaultValue={sales?.url}
                    onChange={
                      (e) => (
                        setSales({ ...sales, url: e.target.value },setFlag(1))
                      )
                    } />
                      <p className="text-red-700 font-light">
                   {error?.url}
            </p></div>
                </div>
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-3"></div></div>
              <div id="btn" className="flex items-center justify-end space-x-2 sm:space-x-3 ml-auto">
              <Button Primary={language?.Next} onClick={()=>{setDisp(1)}}/>
                    {Button !== 'undefined' ?
                      <Button Primary={language?.Update} onClick={()=>{
                       if(flag === 1){
                        submitPointOfSaleEdit()}
                      } }/>
                      : <></>
                    }
                   
                  </div>
            </div>
          </div>
        </div>
        </div>
     </div>
     
      <div id='1' className={disp===1?'block':'hidden'}>
      <div className="relative before:hidden  before:lg:block before:absolute before:w-[43%] before:h-[3px] before:top-0 before:bottom-0 before:mt-4 before:bg-slate-100 before:dark:bg-darkmode-400 flex flex-col lg:flex-row justify-center px-5 my-10 sm:px-20">
            <div className="intro-x lg:text-center flex items-center lg:block flex-1 z-10">
            <button className="w-10 h-10 rounded-full btn text-slate-500  bg-slate-100  dark:bg-darkmode-400 dark:border-darkmode-400">1</button>
                <div className="lg:w-32 font-medium  text-base lg:mt-3 ml-3 lg:mx-auto">{language?.pointofsale}</div>
            </div>
            
            <div className="intro-x lg:text-center flex items-center mt-5 lg:mt-0 lg:block flex-1 z-10">
                 <button className="w-10 h-10 rounded-full btn text-white bg-cyan-600 btn-primary">2</button>
                <div className="lg:w-32 text-base lg:mt-3 ml-3 lg:mx-auto text-slate-600 dark:text-slate-400">{language?.matchstatus}</div>
            </div>
        </div> 
      <Table gen={gen} setGen={setGen} 
            common={language?.common} add={()=> {setView(1);setError([])}} edit={currentMatch} 
            cols={language?.MatchStatusCols} name="Rooms" 
            delete={submitMatchStatusDelete} status="matchstatus"/></div>
        
</div>

 {/* Modal Add Match Status  */}
 <div className={view === 1 ? "block" : "hidden"}>
 <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
            <div className="relative w-full max-w-2xl px-4 h-full  md:h-auto">
              <div className="bg-white rounded-lg shadow relative">
                <div className="flex items-start justify-between p-5 border-b rounded-t">
                  <h3 className="text-xl font-semibold">{language?.add} {language?.new} {language?.MatchStatusCols?.name}</h3>
                  <button
                    type="button"
                    onClick={() => setView(0)}
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
                <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                        {language?.matchstatus} {language?.name} 
                      </label>
                      <input
                        type="text"
                        className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setDSales({ ...dSales, match_status_name: e.target.value })
                          )
                        } />
                         <p className="text-red-700 font-light">
                   {error?.match_status_name}
            </p>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                      {language?.matchstatus} 
                      </label>
                      <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                        onChange={
                          (e) => (
                            setDSales({ ...dSales, match_status: e.target.value })
                          )
                        }>
                        <option selected>{language?.select}</option>
                        <option value="yes">Yes</option>
                        <option value="never">Never</option>
                      </select>
                      <p className="text-red-700 font-light">
                   {error?.match_status}
            </p>
                    </div>
                  </div>
                </div>
                <div className="flex mx-2 flex-wrap my-4">
                  <div className="lg:w-11/12  px-1">
                    <div className="relative w-full ">

                      <div className='flex mb-2'>
                        <div className="w-full lg:w-2/12 ">
                          <span className="flex  ">
                            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                              onClick={() => { setCouCheck(!couCheck) }} checked={couCheck === true}
                              className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 my-2 h-4 w-4 rounded" />
                            <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                            <label
                              className="text-sm font-medium mx-2 my-1 text-gray-900 block "
                              htmlFor="grid-password"
                            >
                             {language?.country}
                            </label> </span></div>
                        <div className="w-full lg:w-4/12 ">
                          <select className="shadow-sm capitalize bg-gray-50 border border-gray-300
                      text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={
                              (e) => (
                                setDSales({ ...dSales, country: e.target.value })
                              )
                            }>
                            <option selected>{language?.select}</option>
                            {lang?.CountryData?.map(i => {
                              return (
                                <option key={i} value={i.country_code}>{i.country_name}</option>)
                            }
                            )}

                          </select>
                        </div>
                      </div>

                      <div className='flex mb-2'>
                        <div className="w-full lg:w-2/12 ">
                          <span className="flex">
                            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                              onClick={() => { setDevCheck(!devCheck) }} checked={devCheck === true}
                              className="bg-gray-50 border-gray-300 my-2 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                            <label htmlFor="checkbox-1" className="sr-only">checkbox</label>

                            <label
                              className="text-sm font-medium mx-2 my-1 text-gray-900 block "
                              htmlFor="grid-password"
                            >
                            {language?.device}
                            </label> </span></div>

                        <div className="w-full lg:w-4/12 ">
                          <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={
                              (e) => (
                                setDSales({ ...dSales, device: e.target.value })
                              )
                            }>
                            <option selected>{language?.select}</option>
                            {lang?.DeviceData?.map(i => {
                              return (
                                <option key={i} value={i.user_device}>{i.user_device}</option>)
                            }
                            )}

                          </select></div>
                      </div>

                      <div className='flex mb-2'>
                        <div className="w-full lg:w-2/12 ">
                          <span className="flex ">
                            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                              onClick={() => { setLangCheck(!langCheck) }} checked={langCheck === true}
                              className="bg-gray-50 border-gray-300 my-2 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                            <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                            <label
                              className="text-sm font-medium mx-2 my-1 text-gray-900 block "
                              htmlFor="grid-password"
                            >
                             {language?.language}
                            </label> </span></div>
                        <div className="w-full lg:w-4/12 ">
                          <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={
                              (e) => (
                                setDSales({ ...dSales, language: e.target.value })
                              )
                            }>
                            <option selected>{language?.select}</option>
                            {lang?.LanguageData?.map(i => {
                              return (
                                <option key={i} value={i.language_code}>{i.language_name}</option>)
                            }
                            )}

                          </select>
                        </div>
                      </div>
                      <div className='flex mb-2'>
                        <div className="w-full lg:w-2/12 ">
                          <span className="flex">
                            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                              onClick={() => { setCurrCheck(!currCheck) }} checked={currCheck === true}
                              className="bg-gray-50 border-gray-300 focus:ring-3 my-2 focus:ring-cyan-200 h-4 w-4 rounded" />
                            <label htmlFor="checkbox-1"
                              className="sr-only">checkbox</label>

                            <label
                              className="text-sm font-medium my-1 text-gray-900 mx-2 block "
                              htmlFor="grid-password"
                            >
                             {language?.currency}
                            </label> </span></div>
                        <div className="w-full lg:w-4/12 ">
                          <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={
                              (e) => (
                                setDSales({ ...dSales, currency: e.target.value })
                              )
                            }>
                            <option selected>{language?.select}</option>
                            {lang?.CurrencyData?.map(i => {
                              return (
                                <option key={i} value={i.currency_code}>{i.currency_name}</option>)
                            }
                            )}

                          </select></div>
                      </div>
                      <div className='flex my-2'>
                        <div className="w-full lg:w-2/12 ">
                          <span className="flex">
                            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                              onClick={() => { setSiCheck(!siCheck) }} checked={siCheck === true}
                              className="bg-gray-50 border-gray-300 my-2 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                            <label htmlFor="checkbox-1"
                              className="sr-only">checkbox</label>

                            <label
                              className="text-sm font-medium my-1 text-gray-900 mx-2 block "
                              htmlFor="grid-password"
                            >
                               {language?.sitetype}
                            </label> </span></div>
                        <div className="w-full lg:w-4/12 ">
                          <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={
                              (e) => (
                                setDSales({ ...dSales, site_type: e.target.value })
                              )
                            }>
                            <option selected>{language?.select}</option>
                            <option value="localuniversal">Google</option>
                            <option value="mapresults">Google Maps</option>
                            <option value="placepage">Place page</option>
                          </select></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div></div>
                <div className="items-center flex p-6 border-t border-gray-200 rounded-b">
                  <Button  Primary={language?.Add}
                   onClick={() => {  submitMatchstatus() }}  />
                </div></div>
</div> 
</div>
</div>

{/* Modal Edit Match Status */}
<div className={viewEdit === 1 ? "block" : "hidden"}>
 <div className="overflow-x-hidden overflow-y-auto fixed top-4 left-0 right-0 backdrop-blur-xl bg-black/30 md:inset-0 z-50 flex justify-center items-center h-modal sm:h-full">
            <div className="relative w-full max-w-2xl px-4 h-full  md:h-auto">
              <div className="bg-white rounded-lg shadow relative">
                <div className="flex items-start justify-between p-5 border-b rounded-t">
                  <h3 className="text-xl font-semibold">{language?.edit} {language?.MatchStatusCols?.name}</h3>
                  <button
                    type="button"
                    onClick={() => setViewEdit(0)}
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
                <div className="pt-6">
              <div className=" md:px-4 mx-auto w-full">
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                     {language?.matchstatus} {language?.name}
                      </label>
                      <input
                        type="text"
                        className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                         defaultValue={current?.match_status_name}
                        onChange={
                          (e) => (
                            setCurrent({ ...current, match_status_name: e.target.value},setFlag(1))
                          )
                        }
                      />
                         <p className="text-red-700 font-light">
                   {error?.match_status_name}
            </p>
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label
                        className="text-sm font-medium text-gray-900 block mb-2"
                        htmlFor="grid-password"
                      >
                       {language?.matchstatus} 
                      </label>
                      <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                      defaultValue={current?.match_status}
                      onChange={
                          (e) => (
                            setCurrent({...current, match_status: e.target.value},setFlag(1))
                          )
                        }>
                        <option selected>{current?.type}</option>
                        <option value="yes">Yes</option>
                        <option value="never">Never</option>
                      </select>
                      <p className="text-red-700 font-light">
                   {error?.match_status}
            </p>
                    </div>
                  </div>
                </div>
                <div className="flex mx-2 flex-wrap my-4">
                  <div className="lg:w-11/12  px-1">
                    <div className="relative w-full ">

                      <div className='flex mb-2'>
                        <div className="w-full lg:w-2/12 ">
                          <span className="flex  ">
                            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                              onClick={() => { setCountryCheck(!countryCheck),setFlag(1) }} checked={countryCheck === true}
                              className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 my-2 h-4 w-4 rounded" />
                            <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                            <label
                              className="text-sm font-medium mx-2 my-1 text-gray-900 block "
                              htmlFor="grid-password"
                            >
                              {language?.country}
                            </label> </span></div>
                        <div className="w-full lg:w-4/12 ">
                          <select className="shadow-sm capitalize bg-gray-50 border border-gray-300
                      text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            
                          onChange={
                              (e) => (
                                setCurrent({ ...current, country: e.target.value },setFlag(1))
                              )
                            }>
                            <option selected>{resCou?.[i]?.country_name}</option>
                            {lang?.CountryData?.map(i => {
                              return (
                                <option key={i} value={i.country_code}>{i.country_name}</option>)
                            }
                            )}

                          </select>
                        </div>
                      </div>

                      <div className='flex mb-2'>
                        <div className="w-full lg:w-2/12 ">
                          <span className="flex">
                            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                              onClick={() => { setDeviceCheck(!deviceCheck),setFlag(1) }} checked={deviceCheck === true}
                              className="bg-gray-50 border-gray-300 my-2 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                            <label htmlFor="checkbox-1" className="sr-only">checkbox</label>

                            <label
                              className="text-sm font-medium mx-2 my-1 text-gray-900 block "
                              htmlFor="grid-password"
                            >
                              {language?.device}
                            </label> </span></div>

                        <div className="w-full lg:w-4/12 ">
                          <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={
                              (e) => (
                                setCurrent({ ...current, device: e.target.value },setFlag(1))
                              )
                            }>
                            <option selected>{current?.device}</option>
                            {lang?.DeviceData?.map(i => {
                              return (
                                <option key={i} value={i.user_device}>{i.user_device}</option>)
                            }
                            )}

                          </select></div>
                      </div>

                      <div className='flex mb-2'>
                        <div className="w-full lg:w-2/12 ">
                          <span className="flex ">
                            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                              onClick={() => { setLanguageCheck(!languageCheck),setFlag(1) }} checked={languageCheck === true}
                              className="bg-gray-50 border-gray-300 my-2 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                            <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                            <label
                              className="text-sm font-medium mx-2 my-1 text-gray-900 block "
                              htmlFor="grid-password"
                            >
                             {language?.language}
                            </label> </span></div>
                        <div className="w-full lg:w-4/12 ">
                          
                          <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={
                              (e) => (
                                setCurrent({ ...current, language: e.target.value },setFlag(1))
                              )
                            }>
                            <option selected>{resLang?.[i]?.language_name}</option>
                            
                            {lang?.LanguageData?.map(i => {
                              return (
                                <option key={i} value={i.language_code}>{i.language_name}</option>)
                            }
                            )}

                          </select>
                        </div>
                      </div>
                      <div className='flex mb-2'>
                        <div className="w-full lg:w-2/12 ">
                          <span className="flex">
                            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                              onClick={() => { setCurrencyCheck(!currencyCheck),setFlag(1) }} checked={currencyCheck === true}
                              className="bg-gray-50 border-gray-300 focus:ring-3 my-2 focus:ring-cyan-200 h-4 w-4 rounded" />
                            <label htmlFor="checkbox-1"
                              className="sr-only">checkbox</label>

                            <label
                              className="text-sm font-medium my-1 text-gray-900 mx-2 block "
                              htmlFor="grid-password"
                            >
                              {language?.currency}
                            </label> </span></div>
                        <div className="w-full lg:w-4/12 ">
                          <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={
                              (e) => (
                                setCurrent({ ...current, currency: e.target.value },setFlag(1))
                              )
                            }>
                            <option selected>{resCurr?.[i]?.currency_name}</option>
                            {lang?.CurrencyData?.map(i => {
                              return (
                                <option key={i} value={i.currency_code}>{i.currency_name}</option>)
                            }
                            )}

                          </select></div>
                      </div>
                      <div className='flex my-2'>
                        <div className="w-full lg:w-2/12 ">
                          <span className="flex">
                            <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox"
                              onClick={() => { setSiteCheck(!siteCheck),setFlag(1) }} checked={siteCheck === true}
                              className="bg-gray-50 border-gray-300 my-2 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                            <label htmlFor="checkbox-1"
                              className="sr-only">checkbox</label>

                            <label
                              className="text-sm font-medium my-1 text-gray-900 mx-2 block "
                              htmlFor="grid-password"
                            >
                             {language?.sitetype}
                            </label> </span></div>
                        <div className="w-full lg:w-4/12 ">
                          <select className="shadow-sm capitalize bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                            onChange={
                              (e) => (
                                setCurrent({ ...current, site_type: e.target.value },setFlag(1))
                              )
                            }>
                            <option selected>{current?.site_type}</option>
                            <option value="localuniversal">Google</option>
                            <option value="mapresults">Google Maps</option>
                            <option value="placepage">Place page</option>
                          </select></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div></div>
                <div className="items-center flex p-6 border-t border-gray-200 rounded-b">
                  <Button  Primary={language?.Update}  onClick= {()=>{
                    if(flag === 1){
                    submitMatchStatusEdit()}}} />
                </div></div>
</div> 
</div>
</div>
  {/* Toast Container */}
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
</div>
  )
}

export default Allpointofsale
