import React, { useState } from "react";
import Axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bcrypt from "bcryptjs";
export default function Register(props) {
  const [adminFlag, setAdminFlag] = useState("Admin")
  const [admin, setAdmin] = useState({
    "admin_type": "",
    "admin_name": "",
    "admin_email": "",
    "admin_password": "",
    "salt":""
  })
  const [user, setUser] = useState({
    "user_name": "",
    "user_email": "",
    "user_password": "",
    "salt":""
  })


  const validateAdminData = (props) => {

    const pswdValid = CheckPassword(props.admin.admin_password)
    return pswdValid
  }

  const validateUserData = (props) => {

    const pswdValid = CheckPassword(props.user.user_password)
    return pswdValid
  }

  function CheckPassword(inputtxt) {
    var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    console.log("pswd" + inputtxt)
    if (inputtxt.match(passw)) {
      return true;
    }
    else {
      return false;
    }
  }

  const registerUser = (e) => {
    console.log("user details" + JSON.stringify(user))
    const result = validateUserData({ user })
    if (result === true) {
      Axios.post('/signup/user', JSON.stringify(user),
        {
          headers: { 'content-type': 'application/json' }
        }).then(response => {
          console.log(response.data)
          toast.success("user created with id " + response.data.user_id, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          props.setOpenTab(1) // setContext(response.data.property_id)
        })
        .catch(error => {
          console.log(error.response)
          toast.error("Some thing went wrong \n " + JSON.stringify(error.response.data), {
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
    else {
      toast.error("password should be as per instructions", {
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

  const registerAdmin = (e) => {
    e.preventDefault()
    console.log("Admin details" + JSON.stringify(admin))

    const result = validateAdminData({ admin })

    if (result === true) {
        
        bcrypt.getSalt(10).then(salt=>{
            setAdmin({...admin,salt:salt});
            bcrypt.hash(admin?.admin_password,salt).then(enc_pass=>{
                setAdmin({...admin,admin_password:enc_pass})
            })
        });
        alert(JSON.stringify(admin))
        

      Axios.post('/signup/admin', JSON.stringify(admin),
        {
          headers: { 'content-type': 'application/json' }
        }).then(response => {
          console.log(response.data)
          toast.success("Admin Account created with id " + response.data.admin_id, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
      

        })
        .catch(error => {
          console.log(error.response)
          toast.error("Some thing went wrong \n " + JSON.stringify(error.response.data), {
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
    else {
      toast.error("password should be as per instructions", {
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

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Sign up
                  </h6>
                </div>

                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">

                <form>
                  <div>
                    <label
                      className="block uppercase mt-1 text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Register As
                    </label>
                    <select onChange={(e) => setAdminFlag(e.target.value)} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                      <option value="">Select</option>
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                  </div>
                  {adminFlag === "User" ? <><div>
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2 mt-2"
                      htmlFor="grid-password"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="User name"
                      onChange={(e) => { setUser({ ...user, user_name: e.target.value }) }}

                    />


                  </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2 mt-2"
                        htmlFor="grid-password"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Email"
                        onChange={(e) => { setUser({ ...user, user_email: e.target.value }) }}
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2 mt-2"
                        htmlFor="grid-password"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                        onChange={(e) => { setUser({ ...user, user_password: e.target.value }) }}
                      />

                      {user?.user_password === '' ? <></> : user?.user_password.length < 6 ? <p>Password must be 6 to 20 character long with atleast 1 upper case character , 1 lower case character and 1 number</p> : <></>}
                    </div>

                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          id="customCheckLogin"
                          type="checkbox"
                          className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                        />
                        <span className="ml-2 text-sm font-semibold text-blueGray-600">
                          I agree with the{" "}
                          <a
                            href="#pablo"
                            className="text-lightBlue-500"
                            onClick={(e) => e.preventDefault()}
                          >
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div></> :

                    <>
                      <div>
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2 mt-2"
                          htmlFor="grid-password"
                        >
                          Admin-Type
                        </label>
                        <select

                          className="border-0 px-3 py-3 mt-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Admin-name"
                          onChange={(e) => { setAdmin({ ...admin, admin_type: e.target.value }) }}
                        >
                          <option value="">Select</option>
                          <option value="Super-admin">Super-Admin</option>
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                        </select>

                        <label
                          className="block uppercase mt-2 text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Admin-name
                        </label>
                        <input
                          type="text"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Admin-name"
                          onChange={(e) => { setAdmin({ ...admin, admin_name: e.target.value }) }}
                        />


                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase mt-2 text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Admin-Email
                        </label>
                        <input
                          type="email"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Admin-Email"
                          onChange={(e) => { setAdmin({ ...admin, admin_email: e.target.value }) }}
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase mt-2 text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Admin-Password
                        </label>
                        <input
                          type="password"
                          className="border-0 px-3 py-3 mt-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Admin-Password"
                          onChange={(e) => { setAdmin({ ...admin, admin_password: e.target.value }) }}
                        />
                        {admin?.admin_password === '' ? <></> : admin?.admin_password.length < 6 ? <p>Password must be 6 to 20 character long with atleast 1 upper case character , 1 lower case character and 1 number</p> : <></>}
                      </div>

                      <div>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            id="customCheckLogin"
                            type="checkbox"
                            className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                          />
                          <span className="ml-2 text-sm font-semibold text-blueGray-600">
                            I agree with the{" "}
                            <a
                              href="#pablo"
                              className="text-lightBlue-500"
                              onClick={(e) => e.preventDefault()}
                            >
                              Privacy Policy
                            </a>
                          </span>
                        </label>
                      </div>
                    </>}


                  <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="button"
                      onClick={adminFlag === 'Admin' ? registerAdmin : registerUser}
                    >
                      Create Account
                    </button>
                    <button  className="bg-blue-500 h-8 w-36" onClick={adminFlag === 'Admin' ? registerAdmin : registerUser}><small>create account</small></button>
                  </div>

                </form>
                <ToastContainer position="top-center"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover />
                 
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  );
}
