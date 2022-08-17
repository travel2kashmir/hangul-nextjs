import React from 'react'
function blinker(arg){
  return ( <div className="border border-white bg-white shadow rounded-md m-2 w-100">
  <div className="m-8 animate-pulse flex space-x-4 ">
  {arg===1?<div className="rounded-full bg-slate-300 h-10 w-10"></div>:<></>} 
    <div className="flex-1 space-y-6 py-1">
     <div className="h-2 bg-slate-300 rounded"></div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
        <div className="h-2 bg-slate-300 rounded col-span-2"></div>
          <div className="h-2 bg-slate-300 rounded col-span-1"></div>
        </div>
        <div className="h-2 bg-slate-300 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
        <div className="h-2 bg-slate-300 rounded col-span-2"></div>
          <div className="h-2 bg-slate-300 rounded col-span-1"></div>
        </div>
        <div className="h-2 bg-slate-300 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
        <div className="h-2 bg-slate-300 rounded col-span-2"></div>
          <div className="h-2 bg-slate-300 rounded col-span-1"></div>
        </div>
        <div className="h-2 bg-slate-300 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-4">
        <div className="h-2 bg-slate-300 rounded col-span-2"></div>
          <div className="h-2 bg-slate-300 rounded col-span-1"></div>
        </div>
        <div className="h-2 bg-slate-300 rounded"></div>
      </div>
    </div>
  </div>
</div>)
}
function Loader() {
  return (<div className='w-full h-100 bg-zinc-200 p-8'>
  <div className='grid grid-cols-1'>{blinker(1)}</div>
  <div className='grid grid-cols-2'>
  {blinker()}
  {blinker()}
  </div>
</div>
  )
}
export default Loader
