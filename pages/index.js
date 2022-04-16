import { useState } from 'react';
import Axios from "axios";
import bcrypt from 'bcryptjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import en from './authorization/en'
import fr from './authorization/fr'

function Signin() {
  /** Router for Redirection **/
  const router = useRouter();
  const {locale} = router
  const t = locale === 'en'? en:fr;

  /** Function for Internationalisation **/
  const changelanguage= (e) => {
  const locale = e.target.value
  router.push('/', '/', {locale});
  };

  /** State for Sign In **/
  const [signinDetails, setSigninDetails] = useState({
    "email": '',
    "password": ''
  });

 
  /** Storing Sign in data in Local Storage **/
  const LocalSignin=(whoIsLogged) =>
    {   
        localStorage.setItem('Signin Details',JSON.stringify(whoIsLogged))
       }


  /** Sign In Submit Function **/
  const submitSignIn = async () => {
    var item = {
      "user_email": signinDetails.email,
    }

    /** API POST call to send Sign Details **/
    Axios.post('/api/signin/user', item, { headers: { 'content-type': 'application/json' } })
      .then(
        async response => {
          /** Password Encryption **/
          const salt = response.data.salt
          const EncryptedPass = await bcrypt.hash(signinDetails.password, salt)
          if
           (EncryptedPass === response.data.user_password) {
            /** Toast emitter Sign in Successfull **/
            toast.success(response?.data?.user_name + "  logged in ", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            const whoIsLogged = {
              "id": response.data.user_id,
              "name": response.data.user_name,
              "email": signinDetails?.email,
              "password": response.data?.user_password
            }
           LocalSignin(whoIsLogged);
           router.push('/landing')
          }
          else {
            /** Toast emitter for error wrong email password combination  **/
            toast.error("Please check your email and password",
              {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
          }
        }
      )
      .catch(
        error => {
          /** Toast emitter for Sign in error  **/
          toast.error("Sign in Error!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
  }

  return (
    <div className="bg-gray-50 p-8">
      <div
        className="mx-auto  flex flex-col justify-center items-center 
  px-4 pt-8 pt:mt-0"
      >
        <span
          className="self-center text-3xl  mb-4 mt-2 tracking-normal font-bold
       text-gray-700 whitespace-nowrap"
        >
          Hangul
        </span>

        <div className="bg-white shadow rounded-lg md:mt-0 w-full sm:max-w-screen-sm xl:p-0">
          <div className="p-4 sm:p-8 lg:p-16 space-y-8">
            <h2 className="text-2xl lg:text-3xl capitalize font-bold text-gray-700">
              {t.title}
            </h2>
           
            {/** Signin Form **/}
            <form className="mt-8 space-y-6" action="#">
              <div>
              <label
              className="text-base font-semibold
                   text-gray-700 
                  block mb-2"
            >
              {t.language}
            </label>
            <select
              onChange={changelanguage}
              defaultValue={"locale"}
              className="bg-gray-50 border border-gray-300 
            text-gray-900  sm:text-sm rounded-lg focus:ring-cyan-600
             focus:border-cyan-600 block w-full mb-2  p-2.5 "
            >
              <option value="en">English</option>
              <option value="fr">French</option>
            </select>
            </div>
            <div>
                <label
                  className="text-base font-semibold
                   text-gray-700 
                  block mb-2"
                >
                  {t.email}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 
                  text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600
                   focus:border-cyan-600 block w-full p-2.5"
                  onChange={(e) =>
                    setSigninDetails({
                      ...signinDetails,
                      email: e.target.value,
                    })
                  }
                  placeholder={t.enteremail}
                  required
                ></input>
              </div>
              <div>
                <label
                  className="text-base font-semibold
                   text-gray-700 block mb-2"
                >
                  {t.password}
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) =>
                    setSigninDetails({
                      ...signinDetails,
                      password: e.target.value,
                    })
                  }
                  placeholder={t.enterpassword}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                  required
                ></input>
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
                    required
                  />
                </div>
                <div className="text-sm ml-3">
                  <label className="text-sm font-semibold text-gray-700">
                    {t.remember}
                  </label>
                </div>
                <a
                  href=""
                  className="text-sm font-semibold
                   text-teal-500 hover:underline  ml-auto"
                >
                  {t.lost}
                </a>
              </div>

              <button
                type="submit"
                onClick={() => {
                  submitSignIn();
                }}
                className="font-semibold text-white bg-cyan-600 
              hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 mt-6
              rounded-lg text-base px-5 py-2 capitalize w-full sm:w-auto text-center"
              >
                {t.title}
              </button>
              <div className="text-base font-semibold text-gray-500">
                {t.remember}
                <a href="" className="text-teal-500 hover:underline px-2">
                  {t.create}
                </a>
              </div>
            </form>
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
