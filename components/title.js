import React from 'react'
import Head from 'next/head';

function Title(args) {
  return (
    <Head>
 
    <title>
   {args?.name}
    </title>
   
    </Head>
  )
}

export default Title