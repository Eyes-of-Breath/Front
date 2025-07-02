import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import Layout from './user/Layout';
import Dashboard from './user/Dashboard';
import Patient from './user/Patient';
import Profile from './user/Profile';
import Analysis from './user/Analysis';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route element={<Layout />} >
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='patient' element={<Patient />} />
          <Route path='analysis' element={<Analysis />} />
          <Route path='profile' element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
