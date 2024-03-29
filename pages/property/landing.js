import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import mode from '../../components/darkmode'
import Buttonloader from '../../components/loaders/buttonloader'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landingloader from "../../components/loaders/landingloader";
import { useRouter } from "next/router";
import DarkModeToggle from "../../components/darkmodetoggle";
import Button from "../../components/Button";
import english from "../../components/Languages/en"
import french from "../../components/Languages/fr"
import arabic from "../../components/Languages/ar"
const logger = require("../../services/logger");   
import DarkModeLogic from "../../components/darkmodelogic";
var language;
var currentUser;
const  Landing=() =>{ 
  var locale;
  
  /** Router for Redirection **/
  const router = useRouter();

  /** State Intialisation for storing all Properties of Current User **/
 const [ownerdata, setOwnerdata] = useState([]);
 const [visible, setVisible] = useState(0);
 const [darkModeSwitcher, setDarkModeSwitcher] = useState()
 const [color, setColor] = useState({})
 const[modeChanger,setModeChanger] = useState("")
 
  useEffect(()=>{
    firstfun();
    fetchProperty();
  },[])

  
  useEffect(()=>{ 
    setColor(DarkModeLogic(darkModeSwitcher))
   },[darkModeSwitcher])

  const firstfun=()=>{
    if (typeof window !== 'undefined'){
     locale = localStorage.getItem("Language");
     const colorToggle = JSON.parse(localStorage.getItem("ColorToggle"));
     const color = JSON.parse(localStorage.getItem("Color"));
     setColor(color);
     setDarkModeSwitcher(colorToggle)
        if (locale === "ar") {
      language = arabic;
      }
      if (locale === "en") {
      language=english;
      }
      if (locale === "fr") {
        language = french;
      }     
     
      currentUser = JSON.parse(localStorage.getItem("Signin Details"));    
    } 
  }

  const changeTheme = (props) => {
    localStorage.setItem("Mode", props)
   }

  /** Use Effect to fetch all the properties of Current user **/
  const fetchProperty = async () => { 
    try {
      const l =await localStorage.getItem("Language");
      console.log("langguage "+l)
      const url = `/api/${l}/properties/${currentUser.id}`;
      logger.info("url" +url)
      const response = await axios.get(url, {
        headers: { accept: "application/json" },
      });
      setOwnerdata(response.data);
      setVisible(1)
    } catch (error) {
      if (error.response) {
        logger.error("Current User Properties Error");
      } else {
        logger.error("Current User Properties Error");
      }
    }
  };

  /**Function to save Current property to be viewed to Local Storage**/
  const LocalProperty = ({ item }) => {
    
    localStorage.setItem("property", JSON.stringify(item));
    router.push('./propertysummary');
  };

  return ( 
  <div className={`${color.greybackground} min-h-screen pt-8 lg:px-32 sm:px-1 `} >
    <div className="mx-auto  flex flex-col justify-center items-center px-4 pt-8 pt:mt-0">
      <span
      className={ `${color.text} self-center text-3xl  mb-4 mt-2 tracking-normal font-bold
      whitespace-nowrap`}>
        Hangul
      </span>
      <div className={`${color.whitebackground} shadow rounded-lg md:mt-0 w-full sm:max-w-screen-sm xl:p-0`} >
        <div className="p-4 sm:p-8 lg:p-space-y-2">
          {/** Button for Sign out**/}
          <div className={visible === 0 ? ' block w-32 h-8  float-right' : 'hidden'}><Buttonloader /></div>
             <div className={visible === 1 ? 'block' : 'hidden'}> 
          <button
            className=" float-right ml-5 text-white bg-cyan-600 
          hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-semibold 
          rounded-lg text-sm px-4 py-2 text-center  mr-2"
            onClick={() => {
              router.push("/");
              localStorage.removeItem("property");
              localStorage.removeItem("Signin Details");   
              //localStorage.clear();
            }}
            type="button"
          >
              {language?.signout}
          </button></div>
          <div className="text-center mt-16">
             <div className={visible === 0 ? ' block w-32 h-8 my-2 flex justify-center' : 'hidden'}><></></div>
          <div className={visible === 1? ' block' : 'hidden'}>
            <p className="capitalize font-semibold text-3xl font-sans sm:mt-12 mx-12 mt-24 mb-6 text-cyan-500">
           {language?.welcome} {currentUser?.name}
            </p></div>
          </div>
          <div className={visible === 0 ? ' block w-36 h-8 my-2 flex justify-center' : 'hidden'}><Buttonloader /></div>
          <div className={visible === 1? ' block' : 'hidden'}>
          <p className={ `${color.text} font-semibold mb-2 text-lg `}
         >
           {language?.List} {language?.ofproperties}
          </p>
          </div>
          <form className=" space-y-1" action="#">
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <div className="align-middle inline-block min-w-full">
                  <div className="shadow overflow-hidden">
                  <div className={visible === 0 ? 'block' : 'hidden'}><Landingloader /></div>
                      <div className={visible === 1 ? 'block' : 'hidden'}>
                    <table className="table-fixed min-w-full divide-y divide-gray-200">
                      <thead className={`${color.greybackground}` }>
                        <tr>
                          <th
                            scope="col"
                            className={`${color.text} px-1 py-4 text-left text-sm font-semibold  uppercase `
                            }
                          >
                           {language?.property} {language?.name}
                          </th>
                          <th
                            scope="col"
                            className={`${color.text} px-1 py-4 text-left text-sm font-semibold  uppercase `
                           }
                          >
                            {language?.property} {language?.category}
                          </th>
                          <th
                            scope="col"
                            className={`${color.text} px-1 py-4 text-left text-sm font-semibold  uppercase `
                            }
                          >
                            {language?.status}
                          </th>
                          <th
                            scope="col"
                            className={ `${color.text} px-1 py-4 text-left text-sm font-semibold  uppercase `
                            }
                          >
                            {language?.action}
                          </th>
                        </tr>
                      </thead>
                      <tbody  className={ `${color.text} divide-y divide-gray-200`
                            }>
                        {Object.keys(ownerdata).length!=0?ownerdata?.map((item, idx) => {
                          return (
                            <tr className={`${color?.hover}`} key={idx}>
                              <td 
                              className={ `${color.text} p-1 whitespace-nowrap text-base font-medium  capitalize`}
                              >
                                {item?.property_name}
                              </td>
                              <td className={ `${color.text} p-1 whitespace-nowrap text-base font-medium  capitalize`}>
                                {item?.property_category}
                              </td>
                              <td className={ `${color.text} p-1 whitespace-nowrap text-base font-medium  capitalize`}>
                                <div className="flex items-center">
                                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                  {language?.active}
                                </div>
                              </td>
                              <td className="p-2 whitespace-nowrap space-x-1">
                                           
                               <Button Primary={language?.View}  onClick={() => {
                                    LocalProperty({ item});
                                    
                                  }} />
                      
               
                              </td>
                            </tr>
                          );
                        }):<></>}
                      </tbody>
                    </table>
                   </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <DarkModeToggle Primary={darkModeSwitcher} Sec={setDarkModeSwitcher}   />
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
export default Landing;
Landing.getLayout = function PageLayout(page){
  return(
    <>
    {page}
    </>
  )
  }
