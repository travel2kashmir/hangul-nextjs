import React from 'react'
import Image from 'next/image'
import map from '../../public/map.PNG'

function Address() {
  return (
    <div><Image src={map} height={700} width={2000} alt='website'/></div>
  )
}

export default Address

Address.getLayout = function Layout(page)
{
    return(<>{page}</>)
}