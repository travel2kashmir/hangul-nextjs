import React from 'react'
import Image from 'next/image'
import email from '../../public/email.png'
import tollfree from '../../public/tollfree.png'
import phone from '../../public/phone.png'
import website from '../../public/website.png'
import tdd from '../../public/tdd.png'
function Contact(args) {
    const item = [{
        "contact_type": "phone",
        "contact_data": "9513388"
    },
    {
        "contact_type": "website",
        "contact_data": "www.changeover.com"
    },
    {
        "contact_type": "TDD",
        "contact_data": "9513388"
    },
    {
        "contact_type": "toll-free",
        "contact_data": "9513388"
    },
    {
        "contact_type": "email",
        "contact_data": "change@renage.com"
    }

    ]
    return (<>
        <div className={`p-4 ${args?.bg} flex h-auto w-auto allign-items-start allign-items-top`}>
            {item.map((item, idx) => {
                switch (item?.contact_type) {
                    case "phone":
                        return (
                            <div key={idx} className='mx-4 flex'><span className="mx-2" ><Image src={phone} height={30} width={30} alt='phone'/></span>{item?.contact_type} {item?.contact_data}</div>
                        )
                        break;
                    case "website":
                        return (
                            <div key={idx} className='mx-4 flex'><span className="mx-2"><Image src={website} height={30} width={30} alt='website'/></span>{item?.contact_type} {item?.contact_data}</div>
                        )
                        break;
                    case "TDD":
                        return (
                            <div key={idx} className='mx-4 flex'><span className="mx-2"><Image src={tdd} height={30} width={30} alt='tdd'/></span>{item?.contact_type} {item?.contact_data}</div>
                        )
                        break;
                    case "toll-free":
                        return (
                            <div key={idx} className='mx-4 flex'><span className="mx-2"><Image src={tollfree} height={30} width={30} alt='tdd'/></span>{item?.contact_type} {item?.contact_data}</div>
                        )
                        break;
                    case "email":
                        return (
                            <div key={idx} className='mx-4 flex'><span className="mx-2 "><Image src={email} height={30} width={30} alt='email'/></span><span>{item?.contact_type} {item?.contact_data}</span></div>
                        )
                        break;
                }
                
            })}

        </div>
    </>
    )
}

export default Contact
Contact.getLayout = function getLayout(page) {
    return (<>{page}</>)
}