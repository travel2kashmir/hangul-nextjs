import React from 'react'
import Link from 'next/link'

function Header(args) {
    const item = {
        "property_name": "Taj vivanta",
        "brand": "taj",
        "property_type": "hotel",
        "star_rating": 6,
        "established_year": "02-02-2010",
        "description": "Vivanta dal view. rejoice in the valley for something like a new high. vivanta dal view, srinagar enchants you with a nice new buzz that makes it a high spot of style in the valley. drive just 20 kilometers from srinagar international airport and discover delightful backseat surprises along the way. check out the breathtaking views around every bend as the road ascends to the main entrance. and these alter with the seasons",
        "address": [
            {
                "address_street_address": "Kralsangri Brein",
                "address_landmark": "Igf Office Crpf",
                "address_city": "Srinagar",
                "address_zipcode": 191120,
                "address_country": "In",
                "address_province": "Jammu And Kashmir"
            }
        ]
    }
    return (<>
    
        <div className={`p-2 ${args.bg} flex  border-t-2 border-l-2 border-r-2 border-black shadow`}>
        
            <span className=' text-2xl font-black capitalize font-mono'>
                {item?.property_name}</span>
            <div className='flex text-xl font-black capitalize'>
                <button className="justify-end mx-2 capitalize">home</button>
                <Link href='#room'>  <button className="mx-2 capitalize">room</button></Link>
                <button className="mx-2 capitalize">service</button>
                <button className="mx-2 capitalize">contacts</button>
                <button className="mx-2 capitalize">review</button>
                <button className="mx-2 capitalize">about us</button>
            </div>
           
        </div>
    </>
    )
}

export default Header

Header.getLayout = function getLayout(page) {
    return (<>
        {page}
    </>)
}