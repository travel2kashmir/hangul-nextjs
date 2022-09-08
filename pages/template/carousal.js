import React,{useEffect, useState} from "react"
import next from "../../public/next.png"
import prev from "../../public/prev.png"
import Image from 'next/image'
function Carousal() {
  const images=[
    {"image_id": "img009",
     "image_link": "https://www.vivantahotels.com/content/dam/vivanta/hotels/VBT-Dal_View_Srinagar/images/gallery/Private_Dining_3x2.jpg/_jcr_content/renditions/cq5dam.web.756.756.jpeg",
    "image_title": "Private Dinning ",
    "image_description": "Mesmerising place to get the feel of solitude."},
    {"image_id": "img009",
     "image_link": "https://res.cloudinary.com/dvczoayyw/image/upload/v1649054831/ogbutkrfzgrm99mjdv6h.jpg",
    "image_title": "Private Dinning ",
    "image_description": "Mesmerising place to get the feel of solitude."},
    {"image_id": "img009",
     "image_link": "https://www.vivantahotels.com/content/dam/vivanta/hotels/VBT-Dal_View_Srinagar/images/gallery/suite%20living%202%20w.jpg/_jcr_content/renditions/cq5dam.web.756.756.jpeg",
    "image_title": "Private Dinning ",
    "image_description": "Mesmerising place to get the feel of solitude."}
  ]
    const [current,setCurrent]=useState(0)
//     setInterval(()=>{
//       setCurrent(current<images.length-1?current+1:0)
// },7000);
  
     
  return (
    <div className='flex'><h1>{current}</h1>
    <button className="w-2/12" 
    onClick={()=>setCurrent(current>0?current-1:images.length-1)}>
      <Image src={prev} alt="prev" height={50} width={50}/>
      </button>
      <img className="w-9/12" src={images[current]?.image_link} alt={`${images[current]?.image_title}`} style={{ height: "500px", width: "1200px" }} />
  <button className="w-2/12" onClick={()=>setCurrent(current<images.length-1?current+1:0)}>
    <Image src={next} alt="next" height={50} width={50}/>
    </button>
    </div>
  )
}

export default Carousal
Carousal.getLayout = function PageLayout(page) {
    return (
      <>
        {page}
      </>
    )
  }
  

 