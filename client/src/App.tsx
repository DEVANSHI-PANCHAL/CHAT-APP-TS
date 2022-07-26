import React, { useState } from 'react';
import './App.css';
import   AuthScreen  from './pages/AuthScreen'
import   HomeScreen  from './pages/HomeScreen'

function App() {

  const [loggedin,setloggedIn] = useState(localStorage.getItem('jwt')?true:false)
  return (
    
   <>
    {loggedin? <HomeScreen setloggedIn={setloggedIn}/> :<AuthScreen setloggedIn={setloggedIn}/>}
    {/* <AuthScreen/> */}
   </>
  );
}

export default App;
