import React from 'react'
import Address from './address';
import Contact from './contact';
import Review from './review';
import Carousal from './carousal';
import Description from './description';
import Room from './room';
import next from "../../public/next.png"
import prev from "../../public/prev.png"
import Services from './services';
import Image from 'next/image'
import Link from 'next/link'
const item = {
    "property_name": "Taj vivanta",
    "brand": "taj",
    "property_type": "hotel",
    "star_rating": 6,
    "established_year": "02-02-2010",
    "description": "Vivanta dal view. rejoice in the valley for something like a new high. vivanta dal view, srinagar enchants you with a nice new buzz that makes it a high spot of style in the valley. drive just 20 kilometers from srinagar international airport and discover delightful backseat surprises along the way. check out the breathtaking views around every bend as the road ascends to the main entrance. and these alter with the seasons"
}
function Complete() {
    var bg = `bg-white`
    return (<>
        <div className={`border-2 ${bg}`}>
            {/*Header */}
            <div className={`p-6 px-8 h-30 relative  ${bg} flex border border-1 border-black`}>

                    <div className='justify-start text-4xl font-black capitalize font-mono'>
                        {item?.property_name}<p className='text-lg'>6 Star Hotel by Taj</p></div>
                    <div className='flex items-center justify-end text-xl ml-auto font-black capitalize'>
                    <span className="ml-6 capitalize"><Link href='#gallery'>home</Link></span>
                     <span className="ml-6 capitalize"><Link href='#room'>room</Link></span>
                     <span className="ml-6 capitalize"><Link href='#services'>service</Link></span>
                     <span className="ml-6 capitalize"><Link href='#contact'>contacts</Link></span>
                     <span className="ml-6 capitalize"><Link href='#review'>review</Link></span>
                     <span className="ml-6 capitalize"><Link href='#about'>about us</Link></span>
                    </div>

                </div>

            <div className='relative grid grid-cols-4 my-2 '>
                <div id="gallery" className='col-span-3'><Carousal /></div>
                <div id="detail" className='col-span-1 p-4'><Description /></div>
            </div>
            <span id="room" className="ml-14 text-2xl font-black capitalize font-mono">Rooms</span>
            <div className='flex'>
                <button>
                    <Image src={prev} alt="prev" height={50} width={50} />
                </button>
                <Room /><Room /><Room /><Room /><Room />
                <button>
                    <Image src={next} alt="next" height={50} width={50} />
                </button>
            </div>
            <span className="ml-14 text-2xl font-black capitalize font-mono">Services</span>
            <div id="services" className=''><Services /></div>
            <span className="ml-14 text-2xl font-black capitalize font-mono">Reviews</span>
            <div id="review" className='flex'><Review bg={bg} /><Review bg={bg} />
                <Review bg={bg} /><Review bg={bg} /></div>
            <div id="address"><Address bg={bg} /></div>
            <div id="about"></div>
            <div id="contact">Contact us:<Contact bg={bg} /></div>
{/*Footer*/}
            <div className={` p-4 m-8 ${bg} h-auto w-auto border border-2 border-black`}>
           Powered by Vitcamp IT Solutions- all rights reserved 
           </div>
            
        </div>
    </>
    )
}

export default Complete

Complete.getLayout = function getLayout(page) {
    return (<>{page}</>)
}