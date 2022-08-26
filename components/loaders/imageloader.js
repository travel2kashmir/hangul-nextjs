import React from 'react'
import LineLoader from './lineloader'
function imageloader() {
return <div className='m-4'>
    <div className="animate-pulse bg-slate-200 rounded" style={{ height: "250px", width: "400px" }}></div>
    <div className='flex mt-4 '>
      <div className="animate-pulse h-4 w-32 bg-slate-200 rounded"></div>
      <div className="animate-pulse  ml-2 h-4 w-4 bg-slate-200 rounded"></div>
      <div className="animate-pulse  ml-2 h-4 w-4 bg-slate-200 rounded"></div></div>
    </div>
}

export default imageloader