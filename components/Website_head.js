import React, {useState, useEffect} from 'react';
function Website_head(args) {
 return (
    <div>
      {/** Header **/}
      <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
             

              <li className="text-2xl text-cyan-600 font-bold flex items-center lg:ml-2.5">
                <span className="self-center whitespace-nowrap">{args.property_name}</span>
              </li>
             
            </div>
            
            
       {/** Button for Sign out**/}        
      
            
          </div>
        </div>
        </nav>

     
     
        </div>
)
}

export default Website_head