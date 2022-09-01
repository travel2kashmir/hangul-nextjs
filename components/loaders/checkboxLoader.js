import React from 'react'

function CheckboxLoader() {
  return (
    <>
    <div className="flex flex-row ml-6 items-start my-4">
    <div className="flex items-center h-5">
    <div className="animate-pulse h-6 w-8 bg-slate-200 rounded "></div>  
    <div className="ml-3">
    <div className="animate-pulse h-6 w-36 bg-slate-200 rounded "></div>  
    </div>
    </div>
    </div>
    
    </>
  )
}

export default CheckboxLoader