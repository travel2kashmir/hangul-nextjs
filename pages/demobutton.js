import Button from "../components/Button";

// export default {
//     title: 'UI/Control/Buttons'
// }

// const Template = args => <Button {...args} />

// export const Primary = Template.bind({})
const call=()=>{console.log("db called")}
const changestate=()=>{console.log("state changed")}
const onClick = () =>{
    call();
    changestate();
   
   }

   
 const Primary ={
    label: "Submit",
     color: "bg-cyan-600 hover:bg-cyan-700 text-white ",
     icon:<svg className="-ml-1 mr-2 h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
     
}

const Secondary ={
    label: "reject",
     color: "bg-gray-600 hover:bg-gray-700",
     
}


const demobutton =()=>{

return(<div>
        <p style={{fontSize:50}}>crap-sih thing want to show</p>
        <Button Primary={Primary}  onClick={call}/>
        <Button Primary={Secondary}  onClick={call}/>
    </div>)
}
export default demobutton
demobutton.getLayout = function PageLayout(page) {
    return (
      <>
        {page}
      </>
    )
  
  
  }