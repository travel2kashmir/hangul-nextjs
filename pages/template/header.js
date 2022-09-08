import React from 'react'

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
    
        <div className={`p-2 ${args.bg} `}>
        
            <span className='flex justify-center text-5xl font-black capitalize font-mono'>
                {item?.property_name}</span>
        
            <span className='capitalize flex justify-center text-lg font-semibold  text-gray-600 mt-2 pt-2 '>{item?.star_rating} star {item?.property_type} by {item?.brand}</span>
          
            <p className='flex justify-center text-lg font-semibold capitalize text-gray-600 mt-2 pt-2'>Since {item?.established_year}</p>
            <p className='flex justify-start text-sm font-semibold capitalize text-gray-600 font-semibold h-10 mt-8 '>{item?.description}</p>


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