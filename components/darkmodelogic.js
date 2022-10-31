const DarkModeLogic = (switcher) =>{

var color ={}
if((switcher===false) || (switcher==="") ||  (switcher===undefined)){
    color.text="text-gray-700",
    color.tableheader="bg-gray-100",
    color.cross="bg-gray-200",
    color.crossbg="text-gray-800",
    color.greybackground="bg-gray-50",
    color.whitebackground="bg-white",
    color.hover='hover:bg-gray-100',
    color.error='text-red-500',
    color.textgray='text-gray-600',
    color.sidebar="hover:bg-gray-100",
    color.deltext="text-gray-500",
    color.iconhover="group-hover:text-gray-900",
    color.footerhover="hover:text-gray-900",
    color.widget="text-slate-600"
}
if(switcher === true)
{
    color.text= "text-white",
    color.tableheader="bg-gray-700",
    color.crossbg="text-gray-200",
    color.cross="bg-gray-700",
    color.deltext="text-gray-200",
    color.greybackground= "bg-gray-900",
    color.whitebackground="bg-gray-800",
    color.hover='hover:bg-gray-900',
    color.error='text-red-500',
    color.textgray='text-gray-400',
    color.sidebar="hover:bg-gray-700",
    color.iconhover="group-hover:text-white",
    color.footerhover="hover:text-white",
    color.widget="text-slate-400"
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