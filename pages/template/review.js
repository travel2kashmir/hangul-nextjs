import React from 'react'

function Review(args) {
    return (<>
        <div className={` p-4 m-8 ${args?.bg} h-auto w-auto`}>
           <center>
           <svg className='border-2'
                width="50"
                height="50"
                viewBox="0 0 24 24"
                stroke="#212b36"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            >
                <circle cx="12" cy="8" r="7" />
                <path d="M3,21 h18 C 21,12 3,12 3,21" />
            </svg>
            <span>Abhishek</span>
            <div className="flex">
                {[...Array(4)].map(
                    (elementInArray, index) => (
                        <div key={index}>
                            <svg
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fas"
                                data-icon="star"
                                className="w-4 text-yellow-500 mr-1"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 576 512"
                            >
                                <path
                                    fill="currentColor"
                                    d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
                                ></path>
                            </svg>
                        </div>
                    )
                )}
            </div></center>
            <p>Beautiful property situated at hill top. Lavish rooms. Good service. Breakfast spread is nice. Only con is you cannot walk down to nearby gardens, places despite its close proximity to those places. Road is bit curvy and dangerous for pedestrians.</p>
        </div>
    </>
    )
}

export default Review
Review.getLayout = function getLayout(page) {
    return (<>{page}</>)
}