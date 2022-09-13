import React, { useEffect, useState } from "react"
import next from "../../public/next.png"
import prev from "../../public/prev.png"
import Image from 'next/image'
function Carousal({ images }) {
  // const images=[
  //   {"image_id": "img009",
  //    "image_link": "https://www.vivantahotels.com/content/dam/vivanta/hotels/VBT-Dal_View_Srinagar/images/gallery/Private_Dining_3x2.jpg/_jcr_content/renditions/cq5dam.web.756.756.jpeg",
  //   "image_title": "Private Dinning ",
  //   "image_description": "Mesmerising place to get the feel of solitude."},
  //   {"image_id": "img009",
  //    "image_link": "https://res.cloudinary.com/dvczoayyw/image/upload/v1649054831/ogbutkrfzgrm99mjdv6h.jpg",
  //   "image_title": "Private Dinning ",
  //   "image_description": "Mesmerising place to get the feel of solitude."},
  //   {"image_id": "img009",
  //    "image_link": "https://www.vivantahotels.com/content/dam/vivanta/hotels/VBT-Dal_View_Srinagar/images/gallery/suite%20living%202%20w.jpg/_jcr_content/renditions/cq5dam.web.756.756.jpeg",
  //   "image_title": "Private Dinning ",
  //   "image_description": "Mesmerising place to get the feel of solitude."}
  // ]
  const [current, setCurrent] = useState(0)
  //     setInterval(()=>{
  //       if(images)
  //       {setCurrent(current<images.length-1?current+1:0)}
  // },2000);


  return (
    <div className="flex mx-auto w-auto">
      <div className="bg-gray-400  relative z-0">
        {/*image on show*/}
        {images === undefined ? <></> : <img  src={images?.[current]?.image_link} alt={`${images[current]?.image_title}`} style={{ height: "600px", width: "2000px" }} />}
        {/*div for buttons */}
        <div className="absolute inset-0 flex  z-10">
          {/*Previous Button */}
          <button className="justify-start items-center"
            onClick={() => setCurrent(current > 0 ? current - 1 : images.length - 1)}>
            <Image src={prev} alt="prev" height={50} width={50} />
          </button>
          {/*Next Button */}
          <button className="justify-end items-center ml-auto"
            onClick={() => setCurrent(current < images.length - 1 ? current + 1 : 0)}>
            <Image src={next} alt="next" height={50} width={50} />

          </button>
        </div>



      </div>
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


