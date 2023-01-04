import React from 'react'
import {Routes,Route} from 'react-router-dom';
import MemberDrawer from "./MemberDrawer";
import Home from './Home';
function Routespage() {
  return (
    <MemberDrawer>
   <Routes>
    <Route to="/" element={<Home/>}/>
   </Routes>
   </MemberDrawer>
  )
}

export default Routespage