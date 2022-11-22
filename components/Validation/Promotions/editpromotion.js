const validatePromotionsEdit = (data) =>{
    var error={};
     var flag=[]
     var final_flag=true;
     console.log(data)
   
     if(data?.promotion_name==="" || data?.promotion_name===undefined)
     {
         flag.push(false)
         error.promotion_name="The promotion name is required."
     }
     if(data?.stacking_type==="" || data?.stacking_type===undefined)
     {
         flag.push(false)
         error.stacking_type="The stacking type is required."
     } 
    
     if(data?.packages?.length === 0 )
     {
         flag.push(false)
         error.packages="The packages is required."
     }
    
     if(data?.min_amount_before_discount==="" || data?.min_amount_before_discount===undefined)
     {
         flag.push(false)
         error.min_amount_before_discount="The min amount before discount is required."
     }
     //Accepts only possitive and decimal values
     if(data?.min_amount_before_discount !="" || data?.min_amount_before_discount != undefined){
        if(!(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/.test(data?.min_amount_before_discount))){
       {
           flag.push(false)
           error.min_amount_before_discount="The min amount before discount accepts numbers and decimal values."
       }
      }
      }
  
       //Mandatory
       if(data?.length_of_stay_min !== "" && data?.length_of_stay_min !== undefined ){
          if(data?.length_of_stay_max === "" || data?.length_of_stay_max === undefined) {
           flag.push(false);
           error.length_of_stay_max="The length of stay maximum is required."
          }
      }
  
      if(data?.length_of_stay_max !== "" && data?.length_of_stay_max !== undefined ){
      if (data?.length_of_stay_min === "" || data?.length_of_stay_min ===undefined){
      
       flag.push(false);
       error.length_of_stay_min="The length of stay minimum is required."
      }    
  }
    
   if((data?.length_of_stay_min !== "" && data?.length_of_stay_min !== undefined )&& (data?.length_of_stay_max !== "" && data?.length_of_stay_max !== undefined))
   {
   if((/^([1-9]+[0-9]*)$/.test(data.length_of_stay_min)) && (/^([1-9]+[0-9]*)$/.test(data.length_of_stay_max)))
    {
        if(data?.length_of_stay_min >= data?.length_of_stay_max)
    {
        flag.push(false);
        error.length_of_stay_min="The length of stay min should be less than the length of stay max."
        error.length_of_stay_max="The length of stay max should be greater than the length of stay min."
    }
   }
   else{
       if(!(/^([1-9]+[0-9]*)$/.test(data.length_of_stay_min)))
       {
          flag.push(false);
          error.length_of_stay_min="The length of stay min accepts only numbers." 
       }
       if(!(/^([1-9]+[0-9]*)$/.test(data.length_of_stay_max)))
       {
                  flag.push(false);
                    error.length_of_stay_max="The length of stay maximum accepts only numbers."
                   }
   }
   }
  
   // Inventory
    //Mandatory
    if(data?.inventory_min !== "" && data?.inventory_min !== undefined ){
       if(data?.inventory_max === "" || data?.inventory_max === undefined) {
        flag.push(false);
        error.inventory_max="The inventory maximum is required."
       }
   }
   if(data?.inventory_max !== "" && data?.inventory_max !== undefined ){
   if (data?.inventory_min === "" || data?.inventory_min ===undefined){
   
    flag.push(false);
    error.inventory_min="The inventory minimum is required."
   }    
  }
  //  Greater or Less and only numbers
  if((data?.inventory_min !== "" && data?.inventory_min !== undefined )&& (data?.inventory_max !== "" && data?.inventory_max !== undefined)){
  if((/^([1-9]+[0-9]*)$/.test(data.inventory_min)) && (/^([1-9]+[0-9]*)$/.test(data.inventory_max)))
  {
   if(data?.inventory_min >= data?.inventory_max)
  {
     flag.push(false);
     error.inventory_min="The inventory min should be less than the inventory max."
     error.inventory_max="The inventory max should be greater than the inventory min."
  }
   }
   else{
       if(!(/^([1-9]+[0-9]*)$/.test(data.inventory_min))){
           flag.push(false);
           error.inventory_min="The occupancy min accepts only numbers."
          } 
          if(!(/^([1-9]+[0-9]*)$/.test(data.inventory_max))){
           flag.push(false);
           error.inventory_max="The occupancy maximum accepts only numbers."
          }
   }
  }
  
   
   // Occupancy
  //Mandatory
  if(data?.occupancy_min !== "" && data?.occupancy_min !== undefined ){
    if(data?.occupancy_max === "" || data?.occupancy_max === undefined) {
     flag.push(false);
     error.occupancy_max="The occupancy maximum is required."
    }
}
if(data?.occupancy_max !== "" && data?.occupancy_max !== undefined ){
if (data?.occupancy_min === "" || data?.occupancy_min ===undefined){

 flag.push(false);
 error.occupancy_min="The occupancy minimum is required."
}    
}
//  Greater or Less and only numbers
if((data?.occupancy_min !== "" && data?.occupancy_min !== undefined )&& (data?.occupancy_max !== "" && data?.occupancy_max !== undefined)){
if((/^([1-9]+[0-9]*)$/.test(data.occupancy_min)) && (/^([1-9]+[0-9]*)$/.test(data.occupancy_max)))
{
if(data?.occupancy_min >= data?.occupancy_max)
{
  flag.push(false);
  error.occupancy_min="The occupancy min should be less than the occupancy max."
  error.occupancy_max="The occupancy max should be greater than the occupancy min."
}
}
else{
    if(!(/^([1-9]+[0-9]*)$/.test(data.occupancy_min))){
        flag.push(false);
        error.occupancy_min="The occupancy min accepts only numbers."
       } 
       if(!(/^([1-9]+[0-9]*)$/.test(data.occupancy_max))){
        flag.push(false);
        error.occupancy_max="The occupancy maximum accepts only numbers."
       }
}
}

 
  
    if(data?.country === undefined && (data?.country_type !== undefined || ""))
     {
         flag.push(false)
         error.country="Please select the countries."
     }
     if(data?.country_type === undefined && (data?.country!== undefined || ""))
     {
         flag.push(false)
         error.country_type="Please select the country type."
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
 export default  validatePromotionsEdit
 
 