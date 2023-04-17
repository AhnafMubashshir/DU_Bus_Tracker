import './App.css';
import React from 'react';
import Home from './Design/Home';
import Registration from './Design/Registration';
import Login from './Design/Login';
import Profile from './Design/Profile';
import UserHome from './Design/UserHome';
import Delete from './Design/Delete';
import LogOut from './Design/LogOut';
import 'leaflet/dist/leaflet.css';
import { Route, Routes } from 'react-router-dom';

function App() {

  return (
    // <Home/>
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/registration' element={<Registration/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/profile/:uID' element={<Profile/>} />
        <Route path='/home/:uID' element={<UserHome/>} />
        <Route path='/logout/:uID' element={<LogOut/>} />
        <Route path='/deleteAccount/:uID' element={<Delete/>} />
      </Routes>
    </>
  );
}

export default React.memo(App);
