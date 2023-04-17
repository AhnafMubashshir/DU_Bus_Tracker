import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './css/container.css'
import axios from 'axios';

const Home = () => {

  const [positions, setPositions] = useState([]);

  const getPositions = async () => {
    try {
      const response = await axios.post('http://localhost:5050/getPositions');
      setPositions(response.data)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    // const savePosition = (latitude, longitude) => {
    //     try {
    //         axios.post('http://localhost:5050/savePosition', {
    //             email,
    //             latitude,
    //             longitude,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    getPositions();

    // console.log('====================================');
    // console.log(positions);
    // console.log('====================================');

    // navigator.geolocation.watchPosition(
    //     position => {
    //         setLoading(false);
    //         savePosition(position.coords.latitude, position.coords.longitude);
    //     },
    //     error => console.log(error),
    //     {
    //         enableHighAccuracy: true,
    //         maximumAge: 0,
    //         timeout: 5000,
    //     }
    // );

    // positions.map((position, index) => {
    //     console.log('====================================jjj');
    //     console.log("pos: ",position,"ind: ", index);
    //     console.log('====================================jjj');
    // });
  }, []);
  return (
    <div>

      <div className="flex flex-col">
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a className="flex items-center">
              {/* <img src="Location_Tracker/location_tracker/src/Design/img/bus.png" className="h-8 mr-3" alt="Flowbite Logo" /> */}
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">BusTracker</span>
            </a>
            <div className="flex md:order-2 px-2">
              <div className="space-x-6">
                <button type="button" className="px-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"><a href="/login">Login</a></button>
              </div>

            </div>
            <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
              <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <a class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
                </li>
                <li>
                  <a href="#" class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
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

export default Home