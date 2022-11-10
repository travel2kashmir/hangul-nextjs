const validatePromotions = (data) =>{
    var error={};
     var flag=[]
     var final_flag=true;
    
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
     
    
     
     if(data?.packages==="" || data?.packages===undefined)
     {
         flag.push(false)
         error.packages="The packages is required."
     }
     if(data?.min_amount_before_discount==="" || data?.min_amount_before_discount===undefined)
     {
         flag.push(false)
         error.min_amount_before_discount="The min amount before discount is required."
     }
     if(data?.inventory_min === undefined && (data?.inventory_max !== undefined || ""))
     {
         flag.push(false)
         error.inventory_min="The inventory count min is required."
     }
     if(data?.inventory_max === undefined && (data?.inventory_min !== undefined || ""))
     {
         flag.push(false)
         error.inventory_max="The inventory count max is required."
     }
     if(data?.length_of_stay_min === undefined && (data?.length_of_stay_max !== undefined || ""))
     {
         flag.push(false)
         error.length_of_stay_min="The length of stay min is required."
     }
     if(data?.length_of_stay_max === undefined && (data?.length_of_stay_min !== undefined || ""))
     {
         flag.push(false)
         error.length_of_stay_max="The length of stay max is required."
     }
     if(data?.occupancy_min === undefined && (data?.occupancy_max !== undefined || ""))
     {
         flag.push(false)
         error.occupancy_min="The occupancy min is required."
     }
     if(data?.occupancy_max === undefined && (data?.occupancy_min !== undefined || ""))
     {
         flag.push(false)
         error.length_of_stay_max="The occupancy max is required."
     }
    //  Greater or Less
     if(data?.length_of_stay_min >= data?.length_of_stay_max)
     {
         flag.push(false)
         error.length_of_stay_min="The length of stay min should be less than the length of stay max."
         error.length_of_stay_max="The length of stay max should be greater than the length of stay min."
     }
     
     if(data?.occupancy_min >= data?.occupancy_max)
     {
         flag.push(false)
         error.occupancy_min="The occupancy min should be less than the occupancy max."
         error.occupancy_max="The occupancy count max should be greater than the occupancy min."
     }
     if(data?.inventory_min >= data?.inventory_max)
     {
         flag.push(false)
         error.inventory_min="The inventory count min should be less than the inventory count max."
         error.inventory_max="The inventory count max should be greater than the inventory count min."
     }
     
   
   //Accept only Numbers
    if(data?.inventory_min != undefined && data?.inventory_min != "" && !(/^[0-9]*$/.test(data.inventory_min)))
    {
        error.inventory_min="The inventory count min accepts only numbers." 
    }
    if(data?.inventory_max != undefined && data?.inventory_max != "" && !(/^[0-9]*$/.test(data.inventory_max)))
    {
        error.inventory_max="The inventory count max accepts only numbers." 
    }
    if(data?.length_of_stay_max != undefined && data?.length_of_stay_max != "" && !(/^[0-9]*$/.test(data.length_of_stay_max)))
    {
        error.occupancy_max="The length_of_stay max accepts only numbers." 
    }
    if(data?.length_of_stay_min != undefined && data?.length_of_stay_min != "" && !(/^[0-9]*$/.test(data.length_of_stay_min)))
    {
        error.length_of_stay_min="The length of stay min accepts only numbers." 
    }
    if(data?.occupancy_min != undefined && data?.occupancy_min != "" && !(/^[0-9]*$/.test(data.occupancy_min)))
    {
        error.occupancy_min="The occupancy min accepts only numbers." 
    }
    if(data?.occupancy_max != undefined && data?.occupancy_max != "" && !(/^[0-9]*$/.test(data.occupancy_max)))
    {
        error.occupancy_max="The occupancy max accepts only numbers." 
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
 
 