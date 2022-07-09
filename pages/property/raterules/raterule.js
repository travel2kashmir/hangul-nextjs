import React,{useEffect, useState} from 'react'
import Header from '../../../components/Header'
import Sidebar from '../../../components/Sidebar'
import english from '../../../components/Languages/en'
import french from '../../../components/Languages/fr'
import arabic from '../../../components/Languages/ar'
import axios from "axios";
import Router from 'next/router'
const logger = require("../../../services/logger");
var currentraterule;
var language;
var currentProperty;

function Raterule() {
    const [rateRule, setRateRule] = useState([])
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
    currentraterule=localStorage.getItem('RateRuleId');
    /** Current Property Details fetched from the local storage **/
    currentProperty = JSON.parse(localStorage.getItem("property"));
            } }
    firstfun(); 
     Router.push("./raterule")   
      },[])

      const fetchRateRule = async () => {
        const url = `/api/rate_rule/${currentraterule}`
        console.log("url" +url)
        axios.get(url)
      .then((response)=>{setRateRule(response.data);
      alert(JSON.stringify(rateRule()));
      logger.info("url  to fetch raterules hitted successfully")})
     .catch((error)=>{logger.error("url to fetch raterules, failed")}); 
      }
      
      /* Function to load Room Details when page loads*/
      useEffect(() => {
        fetchRateRule();
      },[])
    
  return (
    <>
     <Header Primary={english?.Side1}/>
    <Sidebar  Primary={english?.Side1}/>
    <span>{JSON.stringify(rateRule)}</span>
    </>
  )
}

export default Raterule
Raterule.getLayout = function PageLayout(page){
    return(
      <>
      {page}
      </>
    )
    }