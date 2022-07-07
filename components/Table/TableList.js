const TableList = (args) =>{
    return(
                  
                       <tbody className="bg-white divide-y divide-gray-200">
                      {args?.Primary?.map((item,index) => (
                         <tr className="hover:bg-gray-100" key={index}>
                             <td className="p-4 w-4">
                           <span className="flex items-center">
                             <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                             <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                           </span>
                         </td>
                             <td className="p-4 flex items-center whitespace-nowrap space-x-6 mr-12 lg:mr-0">
                                 <span className="p-4 whitespace-nowrap text-base font-medium text-gray-900">{item?.name} </span>
                             </td>
                             <td className="p-4 whitespace-nowrap text-base font-medium text-gray-900">{item?.type} </td>
                             <td className="p-4 whitespace-nowrap text-base font-normal text-gray-900">
                                 <span className="flex items-center">
                                     <span className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></span>
                                    {/* {language?.active} */} {item?.status == true ? "Active" : "Inactive"}
                                 </span>
                             </td>
                             <td className="p-4 whitespace-nowrap space-x-2"> 
                            <button onClick={() => args?.EditButton(item)} className={` bg-gradient-to-r ${args?.Edit?.color} sm:inline-flex  
            focus:ring-4 focus:ring-cyan-200 font-semibold
             rounded-lg text-sm px-5 py-2 text-center 
             items-center  mb-1 ease-linear transition-all duration-150`}>
                              {args?.Edit?.icon}
                              {args?.Edit?.label}
                            </button>
                            <button onClick={()=>args?.DeleteButton(item)} className={` bg-gradient-to-r ${args?.Delete?.color} sm:inline-flex  
            focus:ring-4 focus:ring-cyan-200 font-semibold
             rounded-lg text-sm px-5 py-2 text-center 
             items-center  mb-1 ease-linear transition-all duration-150`}>
                              {args?.Delete?.icon}
                              {args?.Delete?.label}
                            </button>
                             </td>
                         </tr>
                     )
                     )} 
                 </tbody>
                
    )
}
export default TableList