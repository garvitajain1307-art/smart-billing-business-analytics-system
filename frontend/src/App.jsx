import { useState,useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setAdmin } from './features/auth/authSlice'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import CompanySetup from './pages/CompanySetup'
import Dashboard from './pages/Dashboard'

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
        
        const getMe = async () => {
            try {
                const res = await fetch(
                    "http://localhost:4000/api/v1/admin/getme",
                    {
                        credentials: "include",
                    }
                );

                const data = await res.json();

                if (data.success) {
                    dispatch(setAdmin(data.admin));
                }
            } catch (error) {
                console.log(error);
            }
        };

        getMe();
    }, []);
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<AuthPage/>}/>
      <Route path="/company/setup" element={<CompanySetup/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App
