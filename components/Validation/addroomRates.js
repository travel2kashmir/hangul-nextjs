const validateRoomRates = (data) =>{
    var error={};
     var flag=[]
     var final_flag=true;
   
   if(data?.currency==="" || data?.currency===undefined)
   {
       flag.push(false)
       error.currency="The currency is required."
   }
     if(data?.baserate_amount==="" || data?.baserate_amount===undefined)
     {
         flag.push(false)
         error.baserate_amount="The baserate amount is required."
     }
     if(data?.tax_amount==="" || data?.tax_amount===undefined)
     {
         flag.push(false)
         error.tax_amount="The tax amount is required."
     }
     if(data?.otherfees_amount==="" || data?.otherfees_amount===undefined)
     {
         flag.push(false)
         error.otherfees_amount="The other fees amount is required."
     }

     if(data?.baserate_amount!=="" && data?.baserate_amount!==undefined)
     {
        if(!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data?.baserate_amount)))
        {
         flag.push(false)
         error.baserate_amount="The baserate amount accepts only numbers and decimal values."
     }
    }
    
    if(data?.tax_amount!=="" && data?.tax_amount!==undefined)
    {
       if(!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data?.tax_amount)))
       {
        flag.push(false)
        error.tax_amount="The tax amount accepts only numbers and decimal values."
    }
   }

   if(data?.otherfees_amount!=="" && data?.otherfees_amount!==undefined)
   {
      if(!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data?.otherfees_amount)))
      {
       flag.push(false)
       error.otherfees_amount="The other fees amount accepts only numbers and decimal values."
   }
  } 
   
  for (let value in flag) {
     
         if(flag[value]=== false)
          {
            final_flag = false;
            break;
          }
          
   } 

       return final_flag===true ? true : error;
     }
 export default  validateRoomRates