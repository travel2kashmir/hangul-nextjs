import React, { useState, useMemo } from "react";
import Router from 'next/router';
import Multiselect from "multiselect-react-dropdown";
import lang from './GlobalData'

const DatesTable= (args) => {
   const [itemsPerPage, setItemsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [viewDel, setViewDel] = useState(0);
    const [flag, setFlag] = useState([]);

    const [update, setUpdate] = useState({
        "edit": 0,
        "id": ''
    });
    
    const [del, setDel] = useState({
        "delete": 0,
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
    }, [page, args?.gen,itemsPerPage]);

    function ItemShow(event) {
    setItemsPerPage(event.target.value) ;
    }
    const handlecheckbox = (e) => {
        const { name, checked } = e.target;
        setViewDel(1);
        if (name === "allSelect") {
            let tempCon = args?.gen.map((item) => {
                return { ...item, isChecked: checked }
            });
            args?.setGen(tempCon)
            console.log(args?.gen)
        }
        else {
            let tempCon = args?.gen.map((item) =>
                item.id === name ? { ...item, isChecked: checked } : item
            );
            args?.setGen(tempCon)
            console.log(args?.gen)
        }
    }

    const allDelete = async () => {
        console.log(args?.gen)
        const checked = args?.gen.filter(i => i.isChecked === true).map(j => { return (j.id) })
    }
    const [editContact, setEditContact] = useState({});
    const [updateContact, setUpdateContact] = useState({});
    const [deleteContact, setDeleteContact] = useState({});
   
    return (

        <>
            {/* TableHeader */}
            <div className="mx-4">
                <h1 className={`text-xl sm:text-2xl font-semibold ${args?.color?.text}`}>{args?.name}</h1>
                <div className="sm:flex">
                    <div className=" sm:flex items-center sm:divide-x sm:divide-gray-100 mb-3 sm:mb-0">
                        <form className="lg:pr-3" action="#" method="GET">
                            <label htmlFor="users-search" className="sr-only">{args?.common?.search}</label>
                            <div className="mt-1 relative lg:w-64 xl:w-96">
                                <input type="text" name="email" id="myInput" onKeyUp={myFunction}
                                    className={`${args?.color?.greybackground} border border-gray-300 ${args?.color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5`} placeholder={args?.common?.Search}>
                                </input>
                            </div>
                        </form>
                        <div className="flex space-x-1 pl-0 sm:pl-2 mt-3 sm:mt-0">
                            <span className={`${args?.color?.textgray} hover:${args?.color?.text} cursor-pointer p-1 ${args?.color?.hover} rounded inline-flex justify-center`}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
                            </span>
                            {viewDel === 1 ?
                                <button onClick={allDelete} data-tooltip="Delete" aria-label="Delete" className={`${args?.color?.textgray} hover:${args?.color?.text} cursor-pointer p-1 ${args?.color?.hover} rounded inline-flex justify-center`}>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                </button>

                                : <></>}

                            <span className={`${args?.color?.textgray} hover:${args?.color?.text} cursor-pointer p-1 ${args?.color?.hover} rounded inline-flex justify-center`}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                            </span>
                            <span className={`${args?.color?.textgray} hover:${args?.color?.text} cursor-pointer p-1 ${args?.color?.hover} rounded inline-flex justify-center`}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                            </span>
                        </div>
                    </div>
                
                        <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
                            <button className="bg-gradient-to-r bg-cyan-600 hover:bg-cyan-700 text-white  sm:inline-flex  
            font-semibold
           rounded-lg text-sm px-5 py-2 text-center 
           items-center ease-linear transition-all duration-150" onClick={args?.add} >
                                {args?.common?.Add}</button>
                            <span className={`w-1/2 ${args?.color?.text} ${args?.color?.whitebackground} border border-gray-300 ${args?.color?.hover} focus:ring-4 focus:ring-cyan-200 font-semibold inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 text-center sm:w-auto`}>
                                <svg className="-ml-1 mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"></path></svg>
                                {args?.common?.Import}
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
                                <thead className={` ${args?.color?.tableheader} `}>
                                    <tr>
                                         <th scope="col" className="p-4">
                                                <div className="flex items-center">
                                                    <input id="checkbox-all" aria-describedby="checkbox-1" type="checkbox"
                                                        name="allSelect" checked={args?.gen?.filter(item => item?.isChecked !== true).length < 1}
                                                        onChange={(e) => { handlecheckbox(e); setViewDel(1); }}
                                                        className={`${args?.color?.greybackground} border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                                                      rounded`}/>
                                                    <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                                </div>
                                            </th>
                                        <th scope="col"
                                            className={`p-4 text-left text-xs font-semibold ${args?.color?.textgray} uppercase`}>{args?.cols?.col1}</th>

                                      
                                            <th scope="col"
                                                className={`p-4 text-left text-xs font-semibold ${args?.color?.textgray} uppercase`}>{args?.cols?.col2}</th>
                                           
                                          
                                        <th scope="col"
                                            className={`p-4 text-left text-xs font-semibold ${args?.color?.textgray} uppercase`}>{args?.cols?.col3}</th>
                                            
                                            <th scope="col"
                                            className={`p-4 text-left text-xs font-semibold ${args?.color?.textgray} uppercase`}>{args?.common?.Action}
                                        </th> 
                                    </tr>
                                </thead>
                                <tbody className={` ${args?.color?.whitebackground} divide-y divide-gray-200`} id="TableList" >
                                    {displayData?.map((item, idx) => (
                                        <>
                                            {update?.edit === 1 && update?.id === idx? 
                                             //After Edit
                                                <>
                                                    <tr className={`${args?.color?.hover}`}>
                                                        {args?.name != "Services" ?
                                                            <td className="p-4 w-4">
                                                                <span className="flex items-center">
                                                                    <input id="checkbox-1" aria-describedby="checkbox-1" type="checkbox" className={`${args?.color?.greybackground} border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4 rounded`} />
                                                                    <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                                                                </span>
                                                            </td> : <></>}
                                                        {(args?.name != "Additional Services" && args?.name != "Package Miles" && args?.name != "Elite Rewards" )?
                                                              <td className={`p-4 whitespace-nowrap capitalize text-base font-normal ${args?.color?.text}`}>
                                                                {item?.name}</td> 
                                                                :
                                                            <td className={`p-4 whitespace-nowrap capitalize text-base font-normal ${args?.color?.text}`}>


                                                                <input type="text"
                                                                    onChange={(e) => setEditContact({ ...editContact, name: e.target.value },  setFlag(1))} className={`shadow-sm capitalize ${args?.color?.whitebackground} border border-gray-300 ${args?.color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-64 p-2.5`}
                                                                    defaultValue={item?.name}></input> </td>}

                                                      


                                                            <td className="data text-left text-sm font-semibold  ">

                                                                <input type="text"
                                                                    onChange={(e) => setEditContact({ ...editContact, type: e.target.value }, setFlag(1))} className={`shadow-sm capitalize ${args?.color?.whitebackground} border border-gray-300 ${args?.color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-64 p-2.5`}
                                                                    defaultValue={item?.type}></input> </td>
                                                         

                                                        <td className={`p-4 whitespace-nowrap capitalize text-base font-normal ${args?.color?.text}`}>
                                                        <Multiselect 
                      className={`fixed shadow-sm ${args?.color?.greybackground} ${args?.color?.text} mb-3 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full
                       `}
                      isObject={true}
                      
                      options={lang?.DaysData}
                      onRemove={(event) => { days(event) }}
                      onSelect={(event) => { days(event) }}
                      
                     displayValue="day"
                    
                      />
                                                        </td>

                                                        <td className="p-4 whitespace-nowrap space-x-2">
                                                        {
                                                        (flag.length === 0) ?

                                                           <button className="bg-gradient-to-r bg-green-600 hover:bg-green-700 text-white  sm:inline-flex 
                                                           font-semibold rounded-lg text-sm px-5 py-2 text-center items-center ease-linear transition-all
                                                            duration-150 cursor-not-allowed opacity-60 " 
                                                        >{args?.common?.Save} </button>
                                                        
                                                          :
                                                          <button className="bg-gradient-to-r bg-green-600 hover:bg-green-700 text-white  sm:inline-flex 
                                                          font-semibold rounded-lg text-sm px-5 py-2 text-center items-center ease-linear transition-all
                                                           duration-150"
                                                             onClick={() =>
                                                                 {  if(flag.length != 0){{ setUpdate({ ...update, edit: 0, id: '' }) }; args.edit(editContact,updateContact);  setFlag([])}}}
                                                         >{args?.common?.Save}</button>  
                                                          
                                                      
                                                        }
                                                         
                                                            <button className="bg-gradient-to-r bg-gray-400 hover:${args?.color?.greybackground}0 text-white sm:inline-flex font-semibold rounded-lg text-sm px-5 py-2 text-center items-center ease-linear transition-all duration-150"
                                                                onClick={() => { setUpdate({ ...update, edit: 0, id: '' }) }}>{args?.common?.Cancel}</button>
                                                        </td>
                                                    </tr>
                                                </> 
                                                
                                                
                                                :
                                              //Before Edit
                                                <>
                                                    <tr>
                                                      
                                                            <td className="p-4 w-4">
                                                                <span className="flex items-center">
                                                                    <input id="checkbox-1" name={args?.item?.id} checked={args?.item?.isChecked || false}
                                                                        onChange={(e) => { handlecheckbox(e); setViewDel(1); }}
                                                                        aria-describedby="checkbox-1" type="checkbox"
                                                                        className={`${args?.color?.greybackground} border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4
                                                                     w-4 rounded`} />
                                                                    <label htmlFor="checkbox-1" className="sr-only">checkbox</label>
                                                                </span>
                                                            </td>
                                                            <td className={`p-4 whitespace-nowrap capitalize text-base font-normal ${args?.color?.text}`}>
                                                            {item?.name}
                                                        </td>
                                                        {args?.name === "Packages"  ? <></> :

                                                           <td className={`p-4 whitespace-nowrap text-base font-normal ${args?.color?.text}`}>

                                                                {item?.type}
                                                            </td>}
                                                           

<td className={`p-4 whitespace-nowrap text-base font-normal ${args?.color?.text}`}>

     {item?.status}
 </td>

                                                        {del?.delete === 1 && del?.id === idx ?

                                                            <td className="p-4 whitespace-nowrap  space-x-2">

                                                                <button className="bg-gradient-to-r bg-red-600 hover:bg-red-700 text-white  sm:inline-flex  
                                                                 font-semibold rounded-lg text-sm px-5 py-2 text-center items-center ease-linear transition-all duration-150"
                                                                 
                                                                    onClick={() => { { setDel({ ...del, delete: 0, id: '' }) }; args.delete(item?.id) }} >{args?.common?.yesdelete}</button>
                                                                <button className="bg-gradient-to-r bg-gray-400 hover:${args?.color?.greybackground}0 text-white sm:inline-flex font-semibold rounded-lg text-sm px-5 py-2 text-center items-center ease-linear transition-all duration-150"
                                                                    onClick={() => { setDel({ ...del, delete: 0, id: '' }) }} >{args?.common?.Cancel}</button>
                                                            </td>
                                                            :
                                                            <td className="p-4 whitespace-nowrap capitalize space-x-2">
                               
                                                              
                                                         
                                                             
                                                                 <div>
                                                             
                                                          
                                                                        <button className="bg-gradient-to-r bg-cyan-600 hover:bg-cyan-700 text-white  sm:inline-flex font-semibold rounded-lg text-sm px-5 py-2 text-center items-center ease-linear transition-all duration-150" onClick={() => {
                                                                            setEditContact(item);
                                                                            setUpdateContact(item);
                                                                            setUpdate({ ...update, edit: 1, id: idx })
                                                                        }}>{args?.common?.Edit}</button>
                                                                        {args?.name != "Services" ?
                                                                            <button className="bg-gradient-to-r mx-2 bg-red-600 hover:bg-red-700 text-white  sm:inline-flex font-semibold rounded-lg text-sm px-5 py-2 text-center items-center ease-linear transition-all duration-150"
                                                                                onClick={() => {
                                                                                    setDeleteContact(item);
                                                                                    setDel({ ...del, delete: 1, id: idx })
                                                                                }} >{args?.common?.Delete}</button> : <></>}
                                            </div>
                                                                
                                                                   
                                                                  
                                                            </td>}
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
       <div className={`${args?.color?.whitebackground} sticky sm:flex items-center w-full sm:justify-between bottom-0 right-0 border-t border-gray-200 p-4`}>
                <div className="flex items-center w-64 mb-4 sm:mb-0">
                    <button onClick={() => {
                        if (page > 1) {
                            setPage(page - 1);
                        }

                    }} className={`${args?.color?.textgray} hover:${args?.color?.text} cursor-pointer p-1 ${args?.color?.hover} rounded inline-flex justify-center`}>
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    </button>

                    <button onClick={() => {
                        if (page < Math.ceil(args?.gen?.length / itemsPerPage)) {
                            setPage(page + 1);

                        }
                    }} className={`${args?.color?.textgray} hover:${args?.color?.text} cursor-pointer p-1 ${args?.color?.hover} rounded inline-flex justify-center mr-2`}>
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                    </ button>
                    
                    <span className={`text-sm font-normal ${args?.color?.textgray}`}>{args?.common?.Showing}
                   
                        <span className={`${args?.color?.text} font-semibold ml-1`}>{page}</span> {args?.common?.Of} <span className={`${args?.color?.text} font-semibold`}>{Math.ceil(args?.gen?.length / itemsPerPage)}</span></span>
                       
                </div>
              
                <div className="flex items-center w-44 space-x-3">
                <span className={`text-sm font-normal ${args?.color?.textgray}`}>Entries per page</span>
              
                <select
                         onChange={(e) =>
                            ItemShow(e)
                          }
                        className={`shadow-sm ${args?.color?.greybackground} border border-gray-300 ${args?.color?.text} sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block mr-2 w-12  py-1`}>
                         <option selected disabled>{itemsPerPage}</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                      </select>
                  
                </div>
            </div>
        </>
    )
}
export default DatesTable