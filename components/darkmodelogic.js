const DarkModeLogic = (switcher) =>{

var color ={}
if((switcher===false) || (switcher==="") ||  (switcher===undefined)){
    color.text="text-grey-700",
    color.greybackground="bg-gray-50",
    color.whitebackground="bg-white",
    color.hover='hover:bg-gray-100'
}
if(switcher === true)
{
    color.text= "text-white",
    color.greybackground= "bg-gray-900",
    color.whitebackground="bg-gray-800",
    color.hover='hover:bg-gray-900'
}
localStorage.setItem("Color",JSON.stringify(color))
if((switcher===false) || (switcher==="") ||  (switcher===undefined)){
localStorage.setItem("ColorToggle",(false))}
if(switcher === true){
    localStorage.setItem("ColorToggle",(true)) 
}
return color
}
export default  DarkModeLogic