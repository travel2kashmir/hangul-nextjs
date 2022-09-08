import React from 'react'
import Header from './header';
import Address from './address';
import Contact from './contact';
import Review from './review';
import Carousal from './carousal';
function Complete() {
    var bg=`bg-sky-200`
  return (<>
    <div className='border-2 bg-sky-200 w-full'>
<Header bg={`bg-sky-300`}/>
    <Contact bg={bg}/>
    <Carousal/>
    <div className='flex'><Review bg={bg}/><Review bg={bg}/>
    <Review bg={bg}/><Review bg={bg}/></div>
    <Address bg={bg}/>
    
    </div>
    </>
  )
}

export default Complete

Complete.getLayout= function getLayout(page)
{
    return(<>{page}</>)
}