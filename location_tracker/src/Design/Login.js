import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthService from './AuthService';

const Login = () => {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        validateForm();
    }, [formData]);

    
    

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!formData.email) {
            errors.email = 'Email is required.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid.';
            isValid = false;
        }

        if (!formData.password) {
            errors.password = 'Password is required.';
            isValid = false;
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long.';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const { email, password } = formData;
            const emailString = JSON.stringify(email);
            const loginSign = 'True';
            console.log({ email, password });

            axios.post('http://localhost:5050/verifyUser', {
                email,
                password,
                loginSign
            }).then(response => {
                if(response.data.sign && response.data.length!=0){
                    const token = response.data.token;

                    if (token) {
                        AuthService.setToken(token)
                        navigate(`/profile/${email}`);
                    }
                    else {
                        navigate('/login');
                    }
                }
                else{
                    window.location.reload();
                }
            })
        }
    };
  return (
    <div>
            <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="./index.html" className="flex items-center">
                        {/* <img src="./img/bus.png" className="h-8 mr-3" alt="Flowbite Logo" /> */}
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">BusTracker</span>
                    </a>
                    <div className="flex md:order-2 px-2">
                        <div className="space-x-6">
                            <button type="button" className="text-white"><a href="./login.html">Login</a></button>
                            <button type="button" className="px-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"><a href="#">About Us</a></button>
                        </div>

                        <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <a href="/" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Home</a>
                            </li>
                            <li>
                                <a href="/login" className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Sign In</a>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>


            <div class="w-full flex flex-wrap">


                <div class="w-full md:w-1/2 flex flex-col">



                    <div class="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-3 px-8 md:px-24 lg:px-32">
                        <p class="text-center text-3xl">Sign In.</p>
                        <form class="flex flex-col pt-3 md:pt-8" onSubmit={handleSubmit}>

                        <div className="flex flex-col pt-4">
                                <label htmlFor="email" className="text-lg">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email address."
                                    onChange={handleChange}
                                    value={formData.email}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline ${formErrors.email && 'border-red-500'
                                        }`}
                                />
                                {formErrors.email && (
                                    <p className="text-red-500 text-sm">{formErrors.email}</p>
                                )}
                            </div>

                            <div className="flex flex-col pt-4">
                                <label htmlFor="password" className="text-lg">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password."
                                    onChange={handleChange}
                                    value={formData.password}
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline ${formErrors.password && 'border-red-500'
                                        }`}
                                />
                                {formErrors.password && (
                                    <p className="text-red-500 text-sm">{formErrors.password}</p>
                                )}
                            </div>

                            <input type="submit" value="Sign In" class="bg-black text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8" />
                        </form>
                        <div class="text-center pt-12 pb-12">
                            <p>Don't have an account? <a href="/registration" class="underline font-semibold">Register here.</a></p>
                        </div>
                    </div>

                </div>


                <div class="w-1/2 shadow-2xl">
                    <img class="object-cover w-full h-screen hidden md:block" src="https://source.unsplash.com/IXUM4cJynP0" alt="Background" />
                </div>
            </div>
        </div>
  )
}

export default Login