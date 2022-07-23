import React, {useState, useMemo} from "react";

const Table = (args) =>{
  const itemsPerPage = 4;
  const [page, setPage] = useState(1);
  const [view, setView] = useState(0);
  const [viewDel, setViewDel] = useState(0);

    const [update, setUpdate] = useState({
        "edit": 0,
        "id": ''
      });
     
      function myFunction() {
        // Declare variables
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("myTable");
        tr = table.getElementsByTagName("tr");
    
        // Loop through all table rows, and hide those who don't match the search query
        for (i = 1; i < tr.length; i++) {
          td = tr[i];
          if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
            } else {
              tr[i].style.display = "none";
            }
          }
        }
      }
      
      const displayData = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return args?.gen.slice(start, start + itemsPerPage);
      }, [page,args?.gen]);
     
      const handlecheckbox = (e) => {
        const { name, checked } = e.target;
        setViewDel(1);
        if (name === "allSelect") {
          let tempCon = args?.gen.map((item) => {
            return {...item, isChecked: checked }
          });
          args?.setGen(tempCon)
          console.log(args?.gen)
        }
        else {
          let tempCon = args?.gen.map((item) =>
            item.id === name ? {...item, isChecked: checked } : item
          );
          args?.setGen(tempCon)
          console.log(args?.gen)
        }
      }
    
      const allDelete = async () => {
        console.log(args?.gen)
        const checked= args?.gen.filter(i=>i.isChecked===true).map(j=>{return(j.id)})
        alert(JSON.stringify(checked))
      }
      const [editContact, setEditContact] = useState({});
    return(
        
        <>
            {/* TableHeader */}
            <div className="mx-4">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Contact</h1>
                <div className="sm:flex">
                    <div className="hidden sm:flex items-center sm:divide-x sm:divide-gray-100 mb-3 sm:mb-0">
                        <form className="lg:pr-3" action="#" method="GET">
                            <label htmlFor="users-search" className="sr-only">Search</label>
                            <div className="mt-1 relative lg:w-64 xl:w-96">
                                <input type="text" name="email" id="myInput" onKeyUp={myFunction}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" placeholder="Search">
                                </input>
                            </div>
                        </form>
                        <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
                            <span className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
                            </span>
                            {viewDel === 1 ?
                                <button onClick={allDelete} data-tooltip="Delete" aria-label="Delete" className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                </button>

                                : <></>}

                            <span className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                            </span>
                            <span className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                        <button className="bg-gradient-to-r bg-cyan-600 hover:bg-cyan-700 text-white  sm:inline-flex  
            font-semibold
           rounded-lg text-sm px-5 py-2 text-center 
           items-center ease-linear transition-all duration-150" onClick={args?.add} >
                          Add</button>
                        <span className="w-1/2 text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 font-semibold inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:w-auto">
                            <svg className="-ml-1 mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"></path></svg>
                            Import
                        </span>
                    </div>
                </div>
            </div>
            {/* Table */}
            <div className="flex flex-col mt-8">
                <div className="overflow-x-auto">
                    <div className="align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden">
                            <table className="table data table-fixed min-w-full divide-y divide-gray-200" id="myTable">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th scope="col" className="p-4">
                                            <div className="flex items-center">
                                                <input id="checkbox-all" aria-describedby="checkbox-1" type="checkbox"
                                                    name="allSelect" checked={args?.gen?.filter(item => item?.isChecked !== true).length < 1}
                                                    onChange={(e) => { handlecheckbox(e); setViewDel(1); }}
                                                    className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                                                      rounded"  />
                                                <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                            </div>
                                        </th>
                                        <th scope="col"
                                            className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                        <th scope="col"
                                            className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Details</th>
                                        <th scope="col"
                                            className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th scope="col"
                                            className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200" id="TableList" >
                                    {displayData?.map((item, idx) => (
                                        <>
                                            {update?.edit === 1 && update?.id === idx ?
                                                <>
                                                    <tr className="hover:bg-gray-100">
                                                        <td className="p-4 w-4">
                                                            <span className="flex items-center">
                                                                <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded" />
                                                                <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                                                            </span>
                                                        </td>
                                                        <td className="data p-4 text-left text-sm font-semibold  ">
                                                            {item?.name}</td>
                                                        <td className="data p-4 text-left text-sm font-semibold  ">
                                                            <input type="text" className="shadow-sm bg-white border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-64 p-2.5" 
                                                            defaultValue={item?.type}></input> </td>

                                                        <td className="p-4 whitespace-nowrap text-base font-normal text-gray-900">
                                                            <div className="flex">
                                                                <div className="form-check mx-2 form-check-inline">

                                                                    <label htmlFor={"default-toggle"} className="inline-flex relative items-center cursor-pointer">
                                                                        <input type="checkbox" value={item?.status} checked={item.status === true}

                                                                            id={"default-toggle"} className="sr-only peer" />
                                                                        <div
                                                                            className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
                               dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
                               peer-checked:after:translate-x-full 
                               peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                               after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                                after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 whitespace-nowrap space-x-2">
                                                            <button className="bg-gradient-to-r bg-green-600 hover:bg-green-700 text-white  sm:inline-flex 
                                                             font-semibold rounded-lg text-sm px-5 py-2 text-center items-center ease-linear transition-all
                                                              duration-150" 
                                                              onClick={() => { setUpdate({ ...update, edit: 0, id: '' })}}
                                                            >Save</button>
                                                            <button className="bg-gradient-to-r bg-gray-400 hover:bg-gray-500 text-white sm:inline-flex font-semibold rounded-lg text-sm px-5 py-2 text-center items-center ease-linear transition-all duration-150"
                                                                onClick={() => { setUpdate({ ...update, edit: 0, id: '' })}}>Cancel</button>
                                                        </td>
                                                    </tr>
                                                </> :
                                                <>
                                                    <tr>
                                                        <td className="p-4 w-4">
                                                            <span className="flex items-center">
                                                                <input id="checkbox-1" name={item?.id} checked={item.isChecked || false}
                                                                    onChange={(e) => { handlecheckbox(e); setViewDel(1); }}
                                                                    aria-describedby="checkbox-1" type="checkbox"
                                                                    className="bg-gray-50 border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4
                                                                     w-4 rounded" />
                                                                <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                                                            </span>
                                                        </td>
                                                        <td className="data p-4 text-left text-sm font-semibold  ">
                                                            {item?.name}
                                                        </td>
                                                        <td className="data p-4 text-left text-sm font-semibold  ">
                                                            {item?.type}
                                                        </td>
                                                        {item?.status == true ?
                                                            <td className="p-4 whitespace-nowrap text-base font-normal text-gray-900">
                                                                <span className="flex items-center">
                                                                    <span className="h-2.5 w-2.5 capitalize rounded-full bg-green-400 mr-2"></span>
                                                                    Active
                                                                </span>
                                                            </td> :
                                                            <td className="p-4 whitespace-nowrap text-base font-normal text-gray-900">
                                                                <span className="flex items-center">
                                                                    <span className="h-2.5 w-2.5 capitalize rounded-full bg-red-600 mr-2"></span>
                                                                    Inactive
                                                                </span>
                                                            </td>}
                                                        <td className="p-4 whitespace-nowrap space-x-2">
                                                            <button className="bg-gradient-to-r bg-cyan-600 hover:bg-cyan-700 text-white  sm:inline-flex  
            font-semibold
           rounded-lg text-sm px-5 py-2 text-center 
           items-center ease-linear transition-all duration-150" onClick={() => { setEditContact(item); 
            setUpdate({ ...update, edit: 1, id: idx })} }>Edit</button>
                                                            <button className="bg-gradient-to-r bg-red-600 hover:bg-red-700 text-white  sm:inline-flex  
          font-semibold
           rounded-lg text-sm px-5 py-2 text-center 
           items-center ease-linear transition-all duration-150" >Delete</button>
                                                        </td>
                                                    </tr>
                                                </>}
                                        </>
                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div></div></div>
            {/* Pagination */}
            <div className="bg-white sticky sm:flex items-center w-full sm:justify-between bottom-0 right-0 border-t border-gray-200 p-4">
                <div className="flex items-center mb-4 sm:mb-0">
                    <button onClick={() => {
                          if (page > 1) {
                                setPage(page - 1);
                            }
   
                    }} className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center">
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    </button>

                    <button onClick={() => {
                        if (page < Math.ceil(args?.gen?.length/itemsPerPage)) { 
                            setPage(page + 1);
                           
                        }
                    }} className="text-gray-500 hover:text-gray-900 cursor-pointer p-1 hover:bg-gray-100 rounded inline-flex justify-center mr-2">
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                    </ button>
                    <span className="text-sm font-normal text-gray-500">Showing 
                    <span className="text-gray-900 font-semibold ml-1">{page}</span> of <span className="text-gray-900 font-semibold">{Math.ceil(args?.gen?.length/itemsPerPage)}</span></span>
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={() => {
                        if (page > 1) {
                            setPage(page - 1);
                        }
                    }} className="flex-1 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center">
                        <svg className="-ml-1 mr-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                        Previous </button>
                    <button onClick={() => {
                        if (page < Math.ceil(args?.gen?.length/itemsPerPage)) { 
                            setPage(page + 1);
                           
                        }
                    }} className="flex-1 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center">
                        Next
                        <svg className="-mr-1 ml-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
            </div>
        </>
    )}
    export default Table