const TableList = (args) =>{
    return(
                    <table className="table-fixed min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                            <th scope="col" className="p-4">
                             <div className="flex items-center">
                               <input id="checkbox-all" aria-describedby="checkbox-1" type="checkbox"
                                 className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                               <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                             </div>
                           </th>
                                <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Name
                                </th>
                                <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                   Type
                                </th>
                                <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                   Status
                                </th>
                                <th scope="col" className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">
                                   Action
                                </th>
                            </tr>
                        </thead>
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
                                 <span className="p-4 whitespace-nowrap text-base font-medium text-gray-900">{item?.room_name} </span>
                             </td>
                             <td className="p-4 whitespace-nowrap text-base font-medium text-gray-900">{item?.room_type_name} </td>
                             <td className="p-4 whitespace-nowrap text-base font-normal text-gray-900">
                                 <span className="flex items-center">
                                     <span className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></span>
                                    {/* {language?.active} */} active
                                 </span>
                             </td>
                             <td className="p-4 whitespace-nowrap space-x-2"> 
                             </td>
                         </tr>
                     )
                     )} 
                 </tbody>
                 </table>
    )
}
export default TableList