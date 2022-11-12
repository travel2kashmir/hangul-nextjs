const validatePromotionsEdit = (data) =>{
    var error={};
     var flag=[]
     var final_flag=true;
     console.log(data)
     alert(JSON.stringify(data))
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
     alert(data?.packages?.length)
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
    
    //  Greater or Less
     if(data?.length_of_stay_min >= data?.length_of_stay_max)
     {
         flag.push(false);
         error.length_of_stay_min="The length of stay min should be less than the length of stay max."
         error.length_of_stay_max="The length of stay max should be greater than the length of stay min."
     }
     
     if(data?.occupancy_min >= data?.occupancy_max)
     {
         flag.push(false);
         error.occupancy_min="The occupancy min should be less than the occupancy max."
         error.occupancy_max="The occupancy count max should be greater than the occupancy min."
     }

     if(data?.inventory_min >= data?.inventory_max)
     {
         flag.push(false)
         error.inventory_min="The inventory count min should be less than the inventory count max."
         error.inventory_max="The inventory count max should be greater than the inventory count min."
     }
     
     //Both fields mandatory inventory
     if((data?.inventory_min === undefined || data?.inventory_min === "") && (data?.inventory_max === undefined || data?.inventory_max === "")  && (data?.inventory_max !== undefined || data?.inventory_max != ""))
     {
         flag.push(false)
         error.inventory_min="The inventory count min is required."
     }
     if((data?.inventory_max === undefined || data?.inventory_max === "") && (data?.inventory_min === undefined || data?.inventory_min === "") && (data?.inventory_min !== undefined || data?.inventory_min !== ""))
     {
         flag.push(false)
         error.inventory_max="The inventory count max is required."
     }
       //Both fields mandatory Occupancy
       if((data?.occupancy_min === undefined || data?.occupancy_min === "") && (data?.occupancy_max === undefined || data?.occupancy_max === "") && (data?.occupancy_max !== undefined || data?.occupancy_max != ""))
       {
           flag.push(false)
           error.occupancy_min="The occupancy count min is required."
       }
       if((data?.occupancy_max === undefined || data?.occupancy_max === "") && (data?.occupancy_min !== undefined || data?.occupancy_min !== ""))
       {
           flag.push(false)
           error.occupancy_max="The occupancy count max is required."
       }
        //Both fields mandatory Occupancy
        if((data?.inventory_min === undefined || data?.inventory_min === "") && (data?.inventory_max === undefined || data?.inventory_max === "") && (data?.inventory_max !== undefined || data?.inventory_max != ""))
        {
            flag.push(false)
            error.inventory_min="The inventory count min is required."
        }
        if((data?.inventory_max === undefined || data?.inventory_max === "") && (data?.inventory_min !== undefined || data?.inventory_min !== ""))
        {
            flag.push(false)
            error.inventory_max="The inventory count max is required."
        }
       
       if((data?.inventory_min != undefined && data?.inventory_min != "") && (data?.inventory_max != undefined && data?.inventory_max != "") && !(/^[0-9]*$/.test(data.inventory_min)))
       {
           error.inventory_min="The inventory count min accepts only numbers." 
       }
       
       if((data?.inventory_max != undefined && data?.inventory_max != "") && (data?.inventory_min != undefined && data?.inventory_min != "") && !(/^[0-9]*$/.test(data.inventory_max)))
       {
           error.inventory_max="The inventory count max accepts only numbers." 
       }
       
       if((data?.occupancy_min != undefined && data?.occupancy_min != "") && (data?.occupancy_max != undefined && data?.occupancy_max != "") && !(/^[0-9]*$/.test(data.occupancy_min)))
       {
           error.occupancy_min="The occupancy min accepts only numbers." 
       }
       if((data?.occupation_max != undefined && data?.occupation_max != "") && (data?.occupation_min != undefined && data?.occupation_min != "") && !(/^[0-9]*$/.test(data.occupation_max)))
       {
           error.occupation_max="The occupation max accepts only numbers." 
       }
     if((data?.length_of_stay_min != undefined && data?.length_of_stay_min != "") && (data?.length_of_stay_max != undefined && data?.length_of_stay_max != "") && !(/^[0-9]*$/.test(data.length_of_stay_min)))
       {
           error.length_of_stay_min="The length of stay min accepts only numbers." 
       }
       if((data?.length_of_stay_max != undefined && data?.length_of_stay_max != "") && (data?.length_of_stay_min != undefined && data?.length_of_stay_min != "") && !(/^[0-9]*$/.test(data.length_of_stay_max)))
       {
           error.length_of_stay_max="The length of stay max accepts only numbers." 
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
 
 