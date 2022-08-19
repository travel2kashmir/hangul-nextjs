import React from 'react'
function blinker(circle,height){
  return ( <div className={`border border-white bg-white shadow rounded-md m-2  h-${height}`}>
  <div className="m-8 animate-pulse flex space-x-4 ">
  {circle===1?<div className="rounded-full bg-slate-300 h-10 w-10"></div>:<></>} 
    <div className="flex-1 space-y-6 py-1">
     <div className="h-2 bg-slate-300 rounded"></div>
     {height==='screen'?
     <><div className="space-y-3">
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
   
   </>:<></>} 
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
  return (<div className='w-screen h-screen bg-zinc-200 p-8'>
  <div >{blinker(1,'9')}</div>
  <div className='grid grid-cols-6'>
  <div className='hidden lg:block'>{blinker(0,'screen')}</div>
  <div className='col-span-6 lg:col-span-5 '>
  {blinker(0,'screen')}
  </div>
 
  </div>
</div>
  )
}
export default Loader
