import React from 'react'

function Room(args) {
    return (<>
        <div className={` p-4 m-8 ${args?.bg} h-auto w-auto border border-2 border-black`}>
           <img src='https://res.cloudinary.com/dvczoayyw/image/upload/v1649054831/ogbutkrfzgrm99mjdv6h.jpg' alt="room image" style={{ height: "200px", width: "200px" }}></img>
           <span>King Room</span>
           <span>Double bed king size</span>
           <div>This room is best for 3 people</div>
           <span>see more...</span>
        </div>
    </>
    )
}

export default Room
Room.getLayout = function getLayout(page) {
    return (<>{page}</>)
}