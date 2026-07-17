import { useState } from "react";
import {useDispatch,useSelector} from "react-redux"
import {setCompanyLoading,setCompany,setCompanyError,clearCompanyError,clearCompany} from "../features/company/companySlice"
import { ReceiptText, Building2, User, Hash, Mail, Phone, MapPin, ChevronRight,ReceiptIndianRupee  } from "lucide-react";
import { setAdmin } from "../features/auth/authSlice";

import {useNavigate} from "react-router-dom"
import "./CompanySetup.css";

const CompanySetup = () => {
    const dispatch = useDispatch();
     const navigate = useNavigate();
     const {error,loading}=useSelector((state)=>state.company)
    const [companyData, setCompanyData] = useState({
        companyName: "",
        ownerName: "",
        gstNo: "",
        email: "",
        phone: "",
        address: "",
    });

    const handleChange = (e) => {
        dispatch(clearCompanyError());
        setCompanyData({ ...companyData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(setCompanyLoading());
        
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/company/registerCompany`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(companyData),
                });
        
                const data = await res.json();
                console.log(data);
        
                if (!data.success) {
                    dispatch(setCompanyError(data.message || data.errors?.[0] || "Company SetUp failed"));
                    
                    return;
                }
        
                dispatch(setCompany(data.company));
                
                dispatch(clearCompanyError());
        
                setCompanyData({
                    companyName: "",
                    ownerName: "",
                    gstNo: "",
                    email: "",
                    phone: "",
                    address: "",
                });
        
                
                navigate("/company/setup/success", {replace: true,state: { fromSetup: true },});
                dispatch(setAdmin(data.admin));
                
        
            } catch (error) {
                dispatch(setCompanyError("Something went wrong"));
            }
    };

    return (
        <div className="setup-page">
            <div className="setup-topbar">
                <div className="setup-brand">
                    <div className="brand-icon"><ReceiptIndianRupee size={16} /></div>
                    <span>Smart Billing</span>
                </div>
                <p>Setup · Step 1 of 1</p>
            </div>

            <div className="setup-content">
                <div className="setup-badge">● Company Setup</div>
                <h1>Complete Your Business Profile</h1>
                <p className="setup-subtitle">Enter your company information to start billing and inventory management.</p>
                {error && <p className="company-error">{error}</p>}

                <form className="setup-card" onSubmit={handleSubmit}>
                    <div className="setup-section">
                        <h4>COMPANY INFORMATION</h4>

                        <div className="setup-grid">
                            <div className="setup-input-box">
                                <label><Building2 size={13}/> Company Name</label>
                                <input type="text" name="companyName" placeholder="Acme Traders Pvt. Ltd." value={companyData.companyName} onChange={handleChange}/>
                            </div>

                            <div className="setup-input-box">
                                <label><User size={13}/> Owner Name</label>
                                <input type="text" name="ownerName" placeholder="Rajesh Kumar" value={companyData.ownerName} onChange={handleChange}/>
                            </div>
                        </div>

                        <div className="setup-input-box">
                            <label><Hash size={13}/> GST Number </label>
                            <input type="text" name="gstNo" placeholder="22AAAAA0000A1Z5" value={companyData.gstNo} onChange={handleChange}/>
                        </div>
                    </div>

                    <div className="setup-section">
                        <h4>CONTACT INFORMATION</h4>

                        <div className="setup-grid">
                            <div className="setup-input-box">
                                <label><Mail size={13}/> Company Email</label>
                                <input type="email" name="email" placeholder="billing@acmetraders.in" value={companyData.email} onChange={handleChange}/>
                            </div>

                            <div className="setup-input-box">
                                <label><Phone size={13}/> Company Phone</label>
                                <input type="text" name="phone" placeholder="+91 98765 43210" value={companyData.phone} onChange={handleChange}/>
                            </div>
                        </div>
                    </div>

                    <div className="setup-section">
                        <h4>ADDRESS INFORMATION</h4>

                        <div className="setup-input-box">
                            <label><MapPin size={13}/> Full Address</label>
                            <textarea name="address" placeholder="Shop No. 12, Gandhi Market, Mumbai, Maharashtra — 400001" value={companyData.address} onChange={handleChange}/>
                        </div>
                    </div>

                    <div className="setup-footer">
                        <p>You can update these details anytime from your company settings.</p>
                        <button type="submit">Save & Continue <ChevronRight size={15}/></button>
                    </div>
                </form>

                <p className="support-text">Need help? <span>Contact support</span></p>
            </div>
        </div>
    );
};

export default CompanySetup;