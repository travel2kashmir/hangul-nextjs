import { useEffect, useState } from "react";
import Axios from "axios";
import bcrypt from "bcryptjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Cookies from 'js-cookie'
import english from "../components/Languages/en"
import french from "../components/Languages/fr"
import arabic from "../components/Languages/ar"
const logger = require("../services/logger");
var language;
function Signin(args) {
  const [lang, setLang] = useState("");


  const [spinner, setSpinner] = useState(0)
  /** Router for Redirection **/
  const router = useRouter();
  const { locale } = router;
  const [current, setCurrent] = useState(false)
  const [error, setError] = useState({})
  /** State for internationalization **/
  useEffect(() => {
    firstfun()
    getCookieData();
  }, [locale])
  const firstfun = () => {
    if (typeof window !== 'undefined') {
      locale = localStorage.getItem("Language");
      /*checks if language is already there in local storage */
      if (locale === null) {
        language = english
        setLang("en")
        localStorage.setItem("Language", "en")
      }
      else {
        if (locale === "ar") {
          language = arabic;
          setLang("ar")
        }
        if (locale === "en") {
          language = english;
          setLang("en")
        }
        if (locale === "fr") {
          language = french;
          setLang("fr")
        }
      }
    }
  }
  //write into cookies
  function setCookieData(checked) {
    if (checked) {
      Cookies.set("email", signinDetails.email, { expires: 30 })
      Cookies.set("password", signinDetails.password, { expires: 30 })
    }
    else {
      Cookies.remove("email");
      Cookies.remove("password")
    }
  }
  //read from cookies
  function getCookieData() {
    var mail = Cookies.get("email");
    var pass = Cookies.get("password")
    setSigninDetails({ "email": mail, "password": pass })
    if (mail != undefined) {
      document.getElementById('email').value = mail;
      document.getElementById('password').value = pass;
    }
  }
  /** Function for Internationalisation **/
  const changelanguage = (item) => {
    const locale = item;
    /** Language selected stored to the localstorage **/
    localStorage.setItem("Language", locale);
    language = locale;
    router.push("/", "/", { locale });
    logger.info("Language fetched: " + locale);
  };

  /** State for Sign In **/
  const [signinDetails, setSigninDetails] = useState({
    email: "",
    password: "",
  });

  /** Storing Sign in data in Local Storage **/
  const LocalSignin = (whoIsLogged) => {
    localStorage.setItem("Signin Details", JSON.stringify(whoIsLogged));
  };

  /** Sign In Submit Function **/
  const submitSignIn = async (e) => {
    e.preventDefault()
   if (validation(signinDetails)){
    setSpinner(1)
    var item = {
      user_email: signinDetails.email,
    };

    /** API POST call to send Sign Details **/
    Axios.post("/api/signin/user", item, {
      headers: { "content-type": "application/json" },
    })
      .then(async (response) => {
        /** Password Decryption **/
        const salt = response.data.salt;
        const EncryptedPass = await bcrypt.hash(signinDetails.password, salt);
        if (EncryptedPass === response.data.password) {
          /** Toast emitter Sign in Successfull **/
          logger.info("Login Successful!");
          const whoIsLogged = {
            id: response.data.id,
            name: response.data.name,
            email: signinDetails?.email,
            password: response.data?.password,
            admin_type: response.data?.admin_type
          };
          {/*To re-direct to required module*/ }
          if (response.data.id.match(/admin00.[0-9]*/g)) {
            LocalSignin(whoIsLogged);
            router.push("./admin/AdminLanding")
          }
          else {
            LocalSignin(whoIsLogged);
            router.push("./property/landing");
          }



        } else {
          setSpinner(0)
          /** Toast emitter for error wrong email password combination  **/
          toast.error("API: The password that you've entered is incorrect.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          logger.error("API: The password that you've entered is incorrect.")

        }
      })

      .catch((error) => {
        if(error.message===`Request failed with status code 401`)
        {
          logger.error("API:The email address you entered isn't connected to an account.");
        setSpinner(0);
        /** Toast emitter fo: Invalid Email error  **/
        toast.error("API: The email address you entered isn't connected to an account.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        }
        else{
          logger.error('API: Network error');
        setSpinner(0);
        /** Toast emitter for Sign in error  **/
        toast.error("API: Network error!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        }
        
      });
    }
  };
  // Validation Function
  const validation = (signinDetails) => {
     var Result = checkFormData(signinDetails);
     if (Result === true){
      return true;
     }
     else{
      setError(Result);
      return false;

     }

  }
  //Checking Form Data for Validations
   const checkFormData = (signinDetails) => {
    var error={};
    if(signinDetails?.email === "" ||  signinDetails.email === undefined){
      error.email = "The email field is required."
    }
    if((!signinDetails?.email?.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) && (signinDetails?.email != "" &&  signinDetails.email != undefined))){
      error.email = "The email field is in invalid format."
    }
    if(signinDetails?.password === "" || signinDetails.password === undefined){
      error.password = "The password field is required"
    }
    
   return Object.keys(error).length === 0 ? true :  error;

   }
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div
        className="mx-auto  flex flex-col justify-center items-center 
  px-4 pt-8 pt:mt-0"
      >
        <span
          className="self-center text-3xl  mb-4 mt-2 tracking-normal font-bold
       text-gray-700 whitespace-nowrap"
        >
          enGage
        </span>

        <div className="bg-white shadow rounded-lg md:mt-0 w-full sm:max-w-screen-sm xl:p-0">
          <div className="p-4 sm:p-8 lg:p-16 space-y-8">
            <h2 className="text-2xl lg:text-3xl capitalize font-bold text-gray-700">
              {language?.title}
            </h2>

            {/** Signin Form **/}
            <form className="mt-8 space-y-6" action="#">
              <div>
                <label
                  className="text-base font-semibold
                   text-gray-700 
                  block mb-2"
                >
                  {language?.email}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 
                  text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600
                   focus:border-cyan-600 block w-full p-2.5"
                  onChange={(e) =>
                    {setSigninDetails({
                      ...signinDetails,
                      email: e.target.value,
                    }),
                    setError({...error,email:''})}
                  }
                  placeholder={language?.enteremail}
                  required
                ></input>
                 <p className="text-red-700 font-light">
                   {error?.email}
            </p>
              </div>
              <div>
                <label
                  className="text-base font-semibold
                   text-gray-700 block mb-2"
                >
                  {language?.password}
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) =>{
                    setSigninDetails({
                      ...signinDetails,
                      password: e.target.value,
                    })
                    setError({...error,password:''})
                  }
                    
                  }
                  placeholder={language?.enterpassword}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  required
                ></input>
                <p className="text-red-700 font-light">
                   {error?.password}
            </p>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    name="remember"
                    type="checkbox"
                    className="bg-gray-50 
                   border-gray-300 focus:ring-3 focus:ring-cyan-200 h-4 w-4
                    rounded"
                    onClick={() => { setCookieData(!current); setCurrent(!current) }}

                  />
                </div>
                <div className="text-sm ml-3">
                  <label className="text-sm font-semibold text-gray-700">
                    {language?.remember}
                  </label>
                </div>
                <a
                  href=""
                  className="text-sm font-semibold
                   text-teal-500 hover:underline  ml-auto"
                >
                  {language?.lost}
                </a>
              </div>
              <div className={spinner === 0 ? 'block' : 'hidden'}>
                <button
                  type="submit"
                  onClick={(e) => {
                    submitSignIn(e);
                   
                  }}
                  className={`font-semibold text-white bg-cyan-600 
              hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 mt-6
              rounded-lg text-base px-5 py-2 capitalize w-full sm:w-auto text-center`}
                >
                  {language?.title}
                </button>
              </div>
              <div className={spinner === 1 ? 'block' : 'hidden'}>
              <button disabled type="button" className="font-semibold text-white bg-cyan-600 
              hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 mt-6
              rounded-lg text-base px-5 py-2 capitalize w-full sm:w-auto text-center">
    <svg role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg>
    {language?.signingin}
</button>
              </div>

              <div className="text-base font-semibold text-gray-500">
                {language?.remember}
                <a href="" className="text-teal-500 hover:underline px-2">
                  {language?.create}
                </a>
              </div>
            </form>
          </div>
        </div>
        <div className="mx-64 mt-2 text-teal-600">
          <div>
            <button
              className={lang === "en" ? "text-teal-600 text-sm font-bold mx-1 " : "mx-1 text-teal-600 text-sm"}
              onClick={() => {
                setLang("en");
                changelanguage("en");
              }}
            >
              English
            </button>|
            <button
              className={lang === "fr" ? "mx-1 text-teal-600 text-sm font-bold" : "mx-1 text-teal-600 text-sm"}
              onClick={() => {
                setLang("fr");
                changelanguage("fr");
              }}
            >
              Français
            </button>|
            <button
              className={lang === "ar" ? "text-teal-600 text-sm font-bold mx-1" : "mx-1 text-teal-600 text-sm"}
              onClick={() => {
                setLang("ar");
                changelanguage("ar");
              }}
            >
              عربى
            </button>
          </div>
        </div>
      </div>

      {/** Toast Container **/}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
export default Signin;

Signin.getLayout = function PageLayout(page) {
  return (
    <>
      {page}
    </>
  )
}
