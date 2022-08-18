import React,{useState, useEffect} from "react";
import axios from 'axios';
import Link from "next/link";
import Sidebar  from "../../components/Sidebar";
import Header  from "../../components/Header";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
import Footer from '../../components/Footer';
import Loader from "../../components/loader";

var language;
var currentProperty;
import Router from 'next/router'
const logger = require("../../services/logger");

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [visible,setVisible]=useState(0) 
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
    /** Current Property Details fetched from the local storage **/
    currentProperty = JSON.parse(localStorage.getItem("property"));
      } 
    }
    firstfun();
   Router.push("./reviews");
  },[])

  useEffect(() => {
    fetchReviews(); 
  },[]);

  const fetchReviews = async () => { 
    const url = `/api/${currentProperty.address_province.replace(
      /\s+/g,
      "-"
    )}/${currentProperty.address_city}/${
      currentProperty.property_category
    }s/${currentProperty.property_id}`;  
    axios.get(url)
    .then((response)=>{setReviews(response.data);
    logger.info("url  to fetch property details hitted successfully")
  setVisible(1)})
    .catch((error)=>{logger.error("url to fetch property details, failed")});  
  }
  return (
    <>
    <div className={visible===0?'block':'hidden'}><Loader/></div>
    <div className={visible===1?'block':'hidden'}>
     <Header Primary={english?.Side}/>
     <Sidebar  Primary={english?.Side}/>
    <div id="main-content"
    className="bg-gray-50 pt-24 relative overflow-y-auto lg:ml-64">
     {/* Navbar */}
     <nav className="flex mb-5 ml-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <svg
              className="w-5 h-5 mr-2.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            <Link
              href="./landing"
              className="text-gray-700 text-base font-medium hover:text-gray-900 inline-flex items-center"
            >
              <a>{language?.home}</a>
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
              <Link href="./propertysummary" >
              <a>  {reviews?.property_name}</a>
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
                {language?.reviews}
              </span>
            </div>
          </li>
        </ol>
      </nav>
       {/* Header */}
       <div>
     <h1 className="text-xl sm:text-2xl mx-2 font-semibold mb-2 text-gray-900">{language?.reviews}</h1>
        </div>

            {/* Form Property Reviews */}
            {reviews?.Reviews?.map((item,idx) => (
                <div className="bg-white shadow rounded-lg mx-4 mb-4 px-8 sm:p-6 xl:p-8  2xl:col-span-2" key={idx}>
                    <div className="pt-2">
                        <div className=" md:px-4 mx-auto w-full ">
                            <div className="border-b-2 py-8 border-cyan-600">

                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <span className="text-xl sm:text-xl leading-none font-bold text-gray-900">{item?.review_author}</span>
                                        <h3 className="text-base font-normal text-gray-500">{item?.review_date}</h3>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-end flex-1 mr-10 text-cyan-600 text-lg font-bold">
                                            {[...Array(item?.review_rating)].map((elementInArray, index) => (
                                                <div key={index}>
                                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" className="w-4 text-yellow-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                        <path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
                                                    </svg>
                                                </div>
                                            )
                                            )
                                            }
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 ">
                                    {item?.review_content}
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            ))}
        
    </div>
    <Footer/>
    </div>
    </>)
}

export default Reviews
Reviews.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )
  }