import React from 'react'


function Createuser(data) {
    var error = {};
    
    var passRegx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
    var emailRegx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    
    if (passRegx.test(data?.user_password) === false)
        {
        error.password = `Password must be 6 to 20 character long with atleast 1 upper case character , 1 lower case character and 1 number`
    }

    if(data?.user_name==='')
    {
        error.user_name= `User's name is required`
    }

    if(data?.user_email==='')
    {
        error.email= `User's email is required`
    }
    
    if((emailRegx.test(data?.user_email)===false) && data.user_email!=='')
    {
        error.email = "The email field is in invalid format."
    }
     
    if(data?.user_name !== '' && data?.user_name.length<5)
    {
        error.user_name=`User's name must be atleast 5 characters`
    }
console.log("eror"+JSON.stringify(error))
    return Object.keys(error).length>0? error : true 
}

export default Createuser