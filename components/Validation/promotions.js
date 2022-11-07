const validatePromotions = (data,props) =>{
    var error={};
     var flag=[]
     var final_flag=true;
    
     if(data?.promotion_name==="" || data?.promotion_name===undefined)
     {
         flag.push(false)
         error.start_date="The promotion name is required."
     }
     if(data?.stacking_type==="" || data?.stacking_type===undefined)
     {
         flag.push(false)
         error.end_date="The stacking type is required."
     }
     if(data?.discount_type==="" || data?.discount_type===undefined)
     {
         flag.push(false)
         error.end_date="The discount type is required."
     }
     if(data?.discount==="" || data?.discount===undefined)
     {
         flag.push(false)
         error.end_date="The discount is required."
     }
     if(data?.applied_nights==="" || data?.applied_nights===undefined)
     {
         flag.push(false)
         error.end_date="The applied nights is required."
     }
     if(data?.packages==="" || data?.packages===undefined)
     {
         flag.push(false)
         error.end_date="The discount is required."
     }
     if(data?.min_amount_before_discount==="" || data?.min_amount_before_discount===undefined)
     {
         flag.push(false)
         error.end_date="The min amount before discount is required."
     }
     if(data?.start_date >= data?.end_date)
     {
         flag.push(false)
         error.start_date="The start date should be less than the end date."
         error.end_date="The end date should be greater than the end date."
     }
     if(props==="" || data?.start_date===undefined)
     {
         flag.push(false)
         error.days="The days is required."
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
 export default  validatePromotions
 
 