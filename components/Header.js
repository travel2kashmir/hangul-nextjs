import React, {useState, useEffect} from 'react';
import english from "./Languages/en";
import french from "./Languages/fr";
import arabic from "./Languages/ar";
import { useRouter } from "next/router";
import Link from 'next/link'
var language;

function Navbar() {

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
       
      } 
    }
    firstfun();
  },[])
  /** UseState to check whether its small screen or large screen **/
  const [smSidebar,setSmSidebar]=useState(false)
  const router = useRouter();

  
     
  return (
    <div>
      {/** Header **/}
      <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <div className={smSidebar === false ? 'block' : 'hidden'}>
              <button onClick={()=>setSmSidebar(true)} aria-expanded="true" aria-controls="sidebar" className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                <svg  className="w-6 h-6 hidden" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button></div>
              <div className={smSidebar === true ? 'block' : 'hidden'}>
              <button id="toggleSidebarMobile" onClick={()=>setSmSidebar(false)} aria-expanded="true" aria-controls="sidebar"
                className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded">
                <svg id="toggleSidebarMobileHamburger" className="w-6 h-6 hidden" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                <svg id="toggleSidebarMobileClose" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
              </div>

              <li className="text-2xl text-cyan-600 font-bold flex items-center lg:ml-2.5">
                <span className="self-center whitespace-nowrap">hangul</span>
              </li>
              <form action="#" method="GET" className="hidden lg:block lg:pl-32">
                <label htmlFor="topbar-search" className="sr-only text-sm font-semibold">{language?.search}</label>
                <div className="mt-1 relative lg:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  </div>
                  <input type="text" name="email" id="topbar-search" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full pl-10 p-2.5" placeholder={language?.search}>
                  </input>
                </div>
              </form>
            </div>
            
            
       {/** Button for Sign out**/}        
       <button
                className=" float-right ml-5 text-white bg-cyan-600 
              hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-semibold 
              rounded-lg text-sm px-4 py-2 text-center  mr-2"
              onClick={() => {
                router.push("/");
                localStorage.clear();
              }}
                type="button"
              >
             {language?.signout}
              </button>
            
          </div>
        </div>
        </nav>

     {/** Sidebar for small screens **/}
      <div className={smSidebar===true?"block":"hidden"}>
      <aside id="sidebar" className="fixed lg:hidden z-20 h-full top-0 left-0 pt-16 flex sm:flex flex-shrink-0 flex-col w-64 transition-width duration-75" aria-label="Sidebar">
        <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex-1 px-3 bg-white divide-y space-y-1">
            <ul className="space-y-2 pb-2">
                <li>
                  <form action="#" method="GET" className="lg:hidden">
                    <label htmlFor="mobile-search" className="sr-only">{language?.search}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center 
                       pointer-events-none"> 
                      </div>
                    </div>
                  </form>
                </li>
               
                  <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                    <svg className="w-6 h-6 text-gray-500 group-hover:text-gray-900 transition duration-75" fill="currentColor"
                      viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                    <span className="ml-3">{language?.dashboard}</span>
                 
                </li>

               
                  <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                    <svg className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"></path></svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                    <Link href="./basicdetails"><a>{language?.basicdetails}</a></Link></span>
                  </li>
                
              
                  <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                    <svg className="w-7 h-7  text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" >
                      <path d="M16,3C10.5,3,6,7.5,6,13c0,8.4,9,15.5,9.4,15.8c0.2,0.1,0.4,0.2,0.6,0.2s0.4-0.1,0.6-0.2C17,28.5,26,21.4,26,13
	C26,7.5,21.5,3,16,3z M16,17c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S18.2,17,16,17z"></path>
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                    <Link href="./address"><a>{language?.address}</a></Link></span> 
                </li>

                
                  <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                    <svg className="w-5 h-5 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 2H6a2 2 0 0 0-2 2v3H2v2h2v2H2v2h2v2H2v2h2v3a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-8 2.999c1.648 0 3 1.351 3 3A3.012 3.012 0 0 1 13 11c-1.647 0-3-1.353-3-3.001 0-1.649 1.353-3 3-3zM19 18H7v-.75c0-2.219 2.705-4.5 6-4.5s6 2.281 6 4.5V18z">
                      </path></svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                    <Link href="./contact"><a>{language?.contact}</a></Link></span>
                 
                </li>
                
                  <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                    <svg className="w-5 h-5 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.25 3C4.00736 3 3 4.00736 3 5.25V11.25H11.25V3H5.25Z" />
                      <path d="M12.75 3V11.25H21V5.25C21 4.00736 19.9926 3 18.75 3H12.75Z" />
                      <path d="M21 12.75H12.75V21H18.75C19.9926 21 21 19.9926 21 18.75V12.75Z" />
                      <path d="M11.25 21V12.75H3V18.75C3 19.9926 4.00736 21 5.25 21H11.25Z" />
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                    <Link href="./gallery"><a>{language?.gallery}</a></Link></span>
                 
                </li>
               
                  <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                    <svg className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 55.867 55.867" xmlns="http://www.w3.org/2000/svg">
                    <path d="M55.818,21.578c-0.118-0.362-0.431-0.626-0.808-0.681L36.92,18.268L28.83,1.876c-0.168-0.342-0.516-0.558-0.896-0.558
	s-0.729,0.216-0.896,0.558l-8.091,16.393l-18.09,2.629c-0.377,0.055-0.689,0.318-0.808,0.681c-0.117,0.361-0.02,0.759,0.253,1.024
	l13.091,12.76l-3.091,18.018c-0.064,0.375,0.09,0.754,0.397,0.978c0.309,0.226,0.718,0.255,1.053,0.076l16.182-8.506l16.18,8.506
	c0.146,0.077,0.307,0.115,0.466,0.115c0.207,0,0.413-0.064,0.588-0.191c0.308-0.224,0.462-0.603,0.397-0.978l-3.09-18.017
	l13.091-12.761C55.838,22.336,55.936,21.939,55.818,21.578z"></path>
                      </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                    <Link href="./reviews"><a>{language?.reviews}</a></Link></span>
                
                </li>
               
                  <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                    <svg className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                  </svg>
                     <span className="ml-3 flex-1 whitespace-nowrap">
                     <Link href="./services"><a>{language?.services}</a></Link></span>    
                </li>
                
                  <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                    <svg className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                    <Link href="./rooms">
                    <a>{language?.rooms}</a></Link></span>  
                </li>
              
                  <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                  <svg className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd"></path></svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                    <Link href="./packages">
                    <a>{language?.packages}</a></Link>
                      </span>
                </li>
                <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                  <svg className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd"></path></svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">
                    <Link href="./allroombundles">
                    <a>Room Bundles</a></Link>
                      </span>
                </li>
              </ul>
              <div className="space-y-2 pt-2">
              <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                  <svg className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75"
                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 
              0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2
               2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                  <span className="ml-3 flex-1 whitespace-nowrap">
                  <Link href="./propertysummary"><a>{language?.propertysummary}</a></Link></span>
                </li>
                <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                  <svg className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
                  <span className="ml-3 flex-1 whitespace-nowrap">
                  <Link href="./propertyxml">
                    <a>{language?.propertyxml}</a></Link>
                    </span>
                </li>
                <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                  <svg className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
                  <span className="ml-3 flex-1 whitespace-nowrap">
                  <Link href="./roomsxml">
                    <a>{language?.roomxml}</a></Link></span>
                </li>

              </div>
            </div>
          </div>
        </div>
      </aside>
        </div>
        </div>
)
}

export default Navbar