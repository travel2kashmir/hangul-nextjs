import React from 'react'
import LineLoader from './lineloader'
function imageloader() {

  return <div>
    <div className="animate-pulse bg-neutral-200  rounded" style={{ height: "200px", width: "250px" }}></div>
    <div className="animate-pulse my-2 h-4 bg-neutral-200" style={{width:"250px"}}></div> 
    <div className="animate-pulse mb-2 h-4  bg-neutral-200" style={{width:"250px"}}></div> 
    <div className="animate-pulse mb-2  h-4  bg-neutral-200" style={{width:"250px"}}></div> 
    <div className="animate-pulse mb-2 h-4  w-full bg-neutral-200" style={{width:"250px"}}></div> 
    <div className="animate-pulse mb-2 h-4 w-32 w-full bg-neutral-200"></div> 
    </div>
}

export default imageloader