import { useState,useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setAdmin } from './features/auth/authSlice'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux';

import Analytics from './pages/Analytics';
import AuthPage from './pages/AuthPage'
import Billing from './pages/Billing';
import CompanySetup from './pages/CompanySetup'
import CompanySetUpSuccess from './pages/CompanySetUpSuccess'
import Customers from './pages/Customers';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Notifications from './pages/Notifications';
import Products from './pages/Products';
import Settings from './pages/Settings';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';



function App() {
  const dispatch = useDispatch();
 
  const { admin, isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
        
        const getMe = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/getme`,
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
      <Route path="/" element={isAuthenticated ? (admin?.companyId ? <Navigate to="/dashboard"/> : <Navigate to="/company/setup"/>) : <AuthPage/>}/>
      <Route
  path="/company/setup"
  element={!isAuthenticated ? <Navigate to="/" /> : <CompanySetup />}
/>
      <Route path="/company/setup/success" element={!isAuthenticated ? <Navigate to="/" /> : <CompanySetUpSuccess />}/>
      <Route path="/dashboard" element={!isAuthenticated ? <Navigate to="/"/> : !admin?.companyId ? <Navigate to="/company/setup"/> : <Dashboard/>}/> 
      <Route path="/billing" element={!isAuthenticated ? <Navigate to="/"/> : !admin?.companyId ? <Navigate to="/company/setup"/> : <Billing/>}/>
 
      <Route path="/products" element={!isAuthenticated ? <Navigate to="/"/> : !admin?.companyId ? <Navigate to="/company/setup"/> : <Products/>}/>
      <Route path="/customers" element={!isAuthenticated ? <Navigate to="/"/> : !admin?.companyId ? <Navigate to="/company/setup"/> : <Customers/>}/>
      <Route path="/invoices" element={!isAuthenticated ? <Navigate to="/"/> : !admin?.companyId ? <Navigate to="/company/setup"/> : <Invoices/>}/>
      <Route path="/analytics" element={!isAuthenticated ? <Navigate to="/"/> : !admin?.companyId ? <Navigate to="/company/setup"/> : <Analytics/>}/>
      <Route path="/notifications" element={!isAuthenticated ? <Navigate to="/"/> : !admin?.companyId ? <Navigate to="/company/setup"/> : <Notifications/>}/>
      <Route path="/settings" element={!isAuthenticated ? <Navigate to="/"/> : !admin?.companyId ? <Navigate to="/company/setup"/> : <Settings/>}/>
      <Route path="/products/add-product" element={!isAuthenticated ? <Navigate to="/"/> : !admin?.companyId ? <Navigate to="/company/setup"/> : <AddProduct/>}/>
        <Route path="/products/edit-product/:productId" element={!isAuthenticated ? <Navigate to="/"/> : !admin?.companyId ? <Navigate to="/company/setup"/> : <EditProduct/>}/>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App
