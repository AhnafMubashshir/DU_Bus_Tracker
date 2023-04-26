import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import AuthService from './AuthService';

const UserHome = () => {

    const navigate = useNavigate();
    const e = useParams()
    const email = e.uID
    const ip = 'localhost:5050';
    const [loading, setLoading] = useState(true);
    const [positions, setPositions] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(null)


    const getPositions = async () => {
        try {
            const response = await axios.post(`http://${ip}/getPositions`);
            setPositions(response.data)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {

        const token = AuthService.getToken()

        axios.post(`http://${ip}/checkValidation`, {
            token: token,
            email: email
        }).then((response) => {
            console.log(response.data);
            setIsAuthenticated(response.data);
        }).catch((error) => {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
            setIsAuthenticated(false);
        })

        const savePosition = (latitude, longitude) => {
            try {
                axios.post(`http://${ip}/savePosition`, {
                    email,
                    latitude,
                    longitude,
                });
            } catch (error) {
                console.error(error);
            }
        };

        getPositions();

        // console.log('====================================');
        // console.log(positions);
        // console.log('====================================');

        navigator.geolocation.watchPosition(
            position => {
                setLoading(false);
                savePosition(position.coords.latitude, position.coords.longitude);
            },
            error => console.log(error),
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000,
            }
        );

        // positions.map((position, index) => {
        //     console.log('====================================jjj');
        //     console.log("pos: ",position,"ind: ", index);
        //     console.log('====================================jjj');
        // });
    }, [email, setIsAuthenticated]);
    if (isAuthenticated === null) {
        return null; 
    } else if (isAuthenticated === false) {
        navigate('/login');
        return null; 
    }


    return (
        <div>
            <div>
                <nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
                    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <a href="./index.html" class="flex items-center">
                            {/* <img src="./img/bus.png" class="h-8 mr-3" alt="Flowbite Logo" /> */}
                            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">BusTracker</span>
                        </a>
                        <div class="flex md:order-2 px-2">
                            <div class="space-x-6">
                                <button type="button" class="text-white"><a href="./login.html">Login</a></button>
                                <button type="button" class="px-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"><a href={`/logout/${email}`}>Log Out</a></button>
                            </div>

                            <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                                <span class="sr-only">Open main menu</span>
                                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                            </button>
                        </div>
                        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                            <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                                <li>
                                    <a href="#" class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
                                </li>
                                <li>
                                    <a href={`/profile/${email}`} class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Profile</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>

            <div>
                {positions.map((position, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        padding: '20px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
                    }}>
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <table style={{
                                borderCollapse: 'collapse',
                                textAlign: 'left'
                            }}>
                                <tr>
                                    <th>Bus Name: </th>
                                    <td>{position.bus_name}</td>
                                </tr>
                                <tr>
                                    <th>Bus Code: </th>
                                    <td>{position.bus_code}</td>
                                </tr>
                            </table>
                        </div>

                        <div style={{
                            flex: 3,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                position: 'relative',
                                width: '70%',
                                height: '600px',
                                marginTop: '69px'
                            }}>
                                <MapContainer center={[position.latitude, position.longitude]} zoom={17} style={{ width: '100%', height: '100%' }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution="Map data © <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                                    />
                                    <Marker position={[position.latitude, position.longitude]}>
                                        <Popup>
                                            A pretty CSS3 popup. <br /> Easily customizable.
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>

    )
}

export default UserHome