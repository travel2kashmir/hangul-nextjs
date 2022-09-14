import React, {useEffect, useState} from "react";
// import english from "./Languages/en";
// import french from "./Languages/fr";
// import arabic from "./Languages/ar";
 import Link from 'next/link'
var language;

const Sidebar = (args) => {

  const [services, setServices] = useState(false)
  // useEffect(()=>{

  //   const firstfun=()=>{
  //     if (typeof window !== 'undefined'){
  //       var locale = localStorage.getItem("Language");
  //       if (locale === "ar") {
  //       language = arabic;
  //       }
  //       if (locale === "en") {
  //       language=english;
  //       }
  //       if (locale === "fr") {
  //         language = french;
  //       } 
  //     } 
  //   }
  //   firstfun();
   
  // },[])

  return (
      <div
        id="sidebar"
        className="hidden  fixed z-20 h-full 
      top-0 left-0 pt-16  lg:flex flex-shrink-0 flex-col w-64 
      transition-width duration-75"
        aria-label="Sidebar"
      >
        <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
          <div className="flex-1 flex flex-col  pb-4 overflow-y-auto">
            <div className="flex-1 py-4 px-3 bg-white divide-y space-y-1">
              <ul className="space-y-2 pb-2">
                <li>
                  <form action="#" method="GET" className="lg:hidden">
                    <label htmlFor="mobile-search" className="sr-only">
                      Search
                    </label>
                    <div className="relative">
                      <div
                        className="absolute inset-y-0 left-0 pl-3 flex items-center 
                       pointer-events-none"
                      ></div>
                    </div>
                  </form>
                </li>
                <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                  <svg
                    className="w-6 h-6 text-gray-500 group-hover:text-gray-900 transition duration-75"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  <span className="ml-3">
                    <Link href={{pathname:args?.admin?.allusers, query: { id: 1 }}}><a>All Users</a></Link> 
                    </span>
                </li>

                <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                  <svg
                    className="w-6 h-6 text-gray-500 group-hover:text-gray-900 transition duration-75"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  <span className="ml-3">
                  <Link href={{pathname:args?.admin?.allproperties, query: { id: 1 }}}><a>All Properties </a></Link>
                    </span>
                </li>
                
                <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                  <svg
                    className="w-6 h-6 text-gray-500 group-hover:text-gray-900 transition duration-75"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  <span className="ml-3">
                    <Link href={{pathname:args?.admin?.adduser, query: { id: 1 }}}><a>Add User </a></Link>
                    </span>
                </li>

                
                <li className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group">
                  <svg
                    className="w-6 h-6 text-gray-500 group-hover:text-gray-900 transition duration-75"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  <span className="ml-3">
                    <Link href={{pathname:args?.admin?.addnewproperty, query: { id: 1 }}}><a>Add New Property </a></Link>
                    </span>
                </li>
              </ul>
              
            </div>
          </div>
        </div>
      </div> 
  );
};
export default Sidebar;
