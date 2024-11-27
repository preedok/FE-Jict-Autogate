import React, { useState, useEffect } from "react";
import jictLogo from "../../assets/jict-logo.png";
import { useNavigate } from "react-router";
import Swal from 'sweetalert2';
import api from '../../service/api'
import { StartLoading } from "../../utils/swal2";
import { isAuth, setAuth } from "../../utils/token";
import { useFormik } from "formik";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { TextField, IconButton, Typography } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import { Helmet } from "react-helmet";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Link } from "react-router-dom";
import style from './style.module.css'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import * as Yup from "yup";
import AOS from "aos";
import "aos/dist/aos.css";
const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username harus di isi"),
      password: Yup.string().required("Password harus di isi")
    }),
    onSubmit: (values) => {
      handleLogin(values);
    },
  });

  const [enteredCredentials, setEnteredCredentials] = useState({ username: '', password: '' });
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [isResendOTP, setIsResendOTP] = useState(false);


  const handleLogin = async (values) => {
    setIsLoading(true);
    if (!values.username || !values.password) {
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        username: values.username,
        password: values.password,
        otp: values.otp || "",
      };

      const response = await api.post("/Auth/login", payload);
      console.log('response', response);

      StartLoading("Please Wait...");
      if (response.status === 200) {
        const user = response.data;
        setAuth(user.token);
        console.log('user', response.data)
        sessionStorage.setItem("fullname", user.fullname);
        sessionStorage.setItem("role", user.role);
        localStorage.setItem("role", user.role)
        setEnteredCredentials({ username: values.username, password: values.password });

        // if (user.role === "Admin" || user.role === "User" || user.role === "SUPERADMIN" || user.role === "AUDITOR" || user.role === "OCR") {
        //   navigate("/dashboard");
        // }
        const allowedRoles = ["admin", "user", "superadmin", "auditor", "ocr"];
        if (allowedRoles.includes(user.role.toLowerCase())) {
          navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        if (error.response.status === 401 && error.response.data === 'Need 2FA code'  ) {
          setIsResendOTP(true);
          setEnteredCredentials({ username: values.username, password: values.password });
        } else if (error.response.status === 401 && error.response.data === 'Unexpected error accurred or OTP not match') {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Unexpected error accurred or OTP not match',
          });
        } else {
          setIsResendOTP(false)
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: error.response.data,
          });
        }
      } else {
        setIsResendOTP(false)
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'An unexpected error occurred. Please try again later.',
        });
      }

    } finally {
      setIsLoading(false);
    }
  };
  const [isLoadingOtp, setIsLoadingOtp] = useState(false)
  const handleOtpSubmit = async (otpValue) => {
    setIsLoadingOtp(true)
    const otpRegex = /^[a-zA-Z0-9]{5,}$/;

    if (!otpRegex.test(otpValue)) {
      setOtpError('Please enter a valid 6-digit OTP.');
      setIsLoadingOtp(false)
      return;
    }
    setOtpError("");
    const otpSubmissionValues = {
      username: enteredCredentials.username,
      password: enteredCredentials.password,
      otp: otpValue,
    };
    try {
      const otpResponse = await api.post("/Auth/login", otpSubmissionValues);
      StartLoading("Please Wait...");
      if (otpResponse.status === 200) {
        const user = otpResponse.data;
        setAuth(user.token);
        sessionStorage.setItem("fullname", user.fullname);
        sessionStorage.setItem("role", user.role);
        localStorage.setItem("role", user.role)
        setIsResendOTP(false);
        if (user.role === "Admin" || user.role === "User" || user.role === "SUPERADMIN" || user.role === "AUDITOR") {
          navigate("/dashboard");
        }
      } else {
        setIsResendOTP(false)
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Unknown error occurred',
        });
      }
    } catch (error) {
      if (error.response.status === 401 && error.response.data === 'Need 2FA code'  ) {

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Need OTP password',
        });
      } else if (error.response.status === 401 && error.response.data === 'Unexpected error accurred or OTP not match') {

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Unexpected error accurred or OTP not match',
        });
      } else if (error.response.status === 401 && error.response.data === 'OTP not match') {

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'OTP not match',
        });
      } else if (error.response.status === 401 && error.response.data === 'Expired OTP code') {
  
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Expired OTP code',
        });
      } else if (error.response.status === 401 && error.response.data === 'Authentication failed') {

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Authentication failed',
        });
      } else if (error.response.status === 401 && error.response.data === 'Generate OTP failed') {

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Generate OTP failed',
        });
      } else {
        setIsResendOTP(false)
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error.response.data,
        });
      }
    } finally {
      setIsLoadingOtp(false)
    }
  };

  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const handleResendOtp = async (values) => {
    setIsLoading(true);
    try {
      const payload = {
        username: formik.values.username,
        password: formik.values.password,
        otp: "",
      };


      const response = await api.post("/Auth/login", payload);
      console.log('response', response);
      if (response.status === 200) {
        const user = response.data;
        setIsResendOTP(false)
        setAuth(user.token);
        setEnteredCredentials({ username: values.username, password: values.password });
      }
      setOtpError("");
      setCanResend(false);
      setCountdown(30);


      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
        setCanResend(true);
      }, 30000);
    } catch (error) {
      if (error.response.status === 401 && error.response.data === 'Need 2FA code'  ) {

        Swal.fire({
          icon: 'success',
          title: 'Success Send OTP',
          text: 'Need OTP password',
        });
      } else if (error.response.status === 401 && error.response.data === 'Unexpected error accurred or OTP not match') {

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Unexpected error accurred or OTP not match',
        });
      } else if (error.response.status === 401 && error.response.data === 'OTP not match') {

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'OTP not match',
        });
      } else if (error.response.status === 401 && error.response.data === 'Expired OTP code') {

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Expired OTP code',
        });
      } else if (error.response.status === 401 && error.response.data === 'Authentication failed') {

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Authentication failed',
        });
      } else if (error.response.status === 401 && error.response.data === 'Generate OTP failed') {

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Generate OTP failed',
        });
      } else {
        setIsResendOTP(false)
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error.response.data,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    let countdownText = '';

 
  }, [countdown]);
  const handleCancel = () => {
    formik.resetForm();
    setIsResendOTP(false);
  };
  AOS.init();
  AOS.refresh();
  return (
    <>
      <Helmet>
        <title>JICT OCR Monitoring | Login</title>
      </Helmet>
      <div className={`relative ${style.bgjictbg} bg-cover bg-no-repeat w-full h-screen`}>
        <div className="absolute bg-black opacity-50 w-full h-screen"></div>
        <div className="z-10 absolute flex flex-col items-center justify-center m-auto left-0 right-0 top-0 bottom-0 md:h-screen lg:py-0">
          <div data-aos="zoom-in-up"
            data-aos-duration="1000" className="w-full bg-white rounded-lg shadow-lg dark:border md:mt-0 md: sm:max-w-md xl:p-0  ">
            {isResendOTP ? (
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                {/* <img data-aos="zoom-in-left"
                  data-aos-duration="1000" className="w-96" src={jictLogo} alt="logo" /> */}
                <div className="flex flex-col mt-4 gap-5 px-5">
                  {/* <TextField type="text" label="Username" value={enteredCredentials.username} disabled />
                  <TextField
                    type={showPasswordResent ? 'text' : 'password'}
                    label="Password"
                    value={enteredCredentials.password}
                    disabled
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handlePasswordVisibilityToggle}
                          >
                            {showPasswordResent ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  /> */}
                  <TextField type="text" label="2FA" onChange={(e) => setEnteredOtp(e.target.value)} />
                  {otpError && <p className="text-red-500 text-xs">{otpError}</p>}
                  {/* {otpMatch && <p className="text-red-500 text-xs">{otpMatch}</p>} */}
                  {/* <button
                    id="resendButton"
                    onClick={handleResendOtp}
                    style={{
                      color: isLoading ? 'grey' : 'blue',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: isLoading || !canResend ? 'not-allowed' : 'pointer',
                      textAlign: 'right',
                    }}
                    disabled={isLoading || !canResend}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2 justify-end ms-auto">
                        <div className="w-4 h-4 border-t-2 border-black rounded-full animate-spin"></div>
                        <p>{countdown > 0 ? `Resend OTP (${countdown}s)` : 'Resend OTP'}</p>
                      </div>
                    ) : (
                      <p>{countdown > 0 ? `Resend OTP (${countdown}s)` : 'Resend OTP'}</p>
                    )}
                  </button> */}
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={handleCancel}
                      color="secondary"
                      style={{ backgroundColor: 'grey' }}
                      variant="contained"
                    >
                      <ArrowBackIcon fontSize="small" /> Cancel
                    </Button>
                    <Button variant="contained" onClick={() => handleOtpSubmit(enteredOtp)} color="primary">
                      {isLoadingOtp ? (
                        <div className="flex px-8 py-1 items-center gap-2 justify-center">
                          <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <span>
                          <SendIcon fontSize="small" /> Submit
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <img data-aos="zoom-in-left"
                  data-aos-duration="1000" className="w-96" src={jictLogo} alt="logo" />
                <form
                  className="space-y-4 md:space-y-6"
                  action="#"
                  onSubmit={formik.handleSubmit}
                >
                  <div className="flex flex-col space-y-2">
                    <label
                      className="form-label"
                      data-aos="zoom-in-right"
                      data-aos-duration="1000"
                    >
                      User Name
                    </label>
                    <TextField
                      id="username"
                      name="username"
                      type="text"
                      className={`form-control ${formik.touched.username && formik.errors.username ? 'invalid' : ''}`}
                      placeholder="Masukkan User Name"
                      {...formik.getFieldProps("username")}

                    />
                    {formik.touched.username && formik.errors.username && (
                      <div className="invalid-feedback text-red-500 text-xs">
                        {formik.errors.username}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label
                      className="form-label"
                      data-aos="zoom-in-right"
                      data-aos-duration="1000"
                    >
                      Password
                    </label>
                    <TextField
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${formik.touched.password && formik.errors.password ? 'invalid' : ''}`}
                      placeholder="Password"
                      {...formik.getFieldProps("password")}

                      InputProps={{
                        endAdornment: (
                          <IconButton
                            style={{ cursor: "pointer", background: "none" }}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />
                    {formik.touched.password && formik.errors.password && (
                      <div className="invalid-feedback text-red-500 text-xs">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    data-aos="zoom-in-left"
                    data-aos-duration="1000"
                    className="w-full text-white bg-[#7752FE] transition-all hover:bg-[#7752FE] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

    </>

  );
};

export default Login;
