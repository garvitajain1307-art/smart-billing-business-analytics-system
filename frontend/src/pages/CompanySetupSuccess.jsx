
import { ReceiptText, CircleCheckBig,ChevronRight } from "lucide-react";


import { useNavigate, useLocation, Navigate } from "react-router-dom";
import "./CompanySetupSuccess.css";

const CompanySetupSuccess = () => {

    const navigate=useNavigate();
    const location = useLocation();

    if (!location.state?.fromSetup) {
        return <Navigate to="/dashboard" replace />;
    }
    const btnClicked=()=>{
        navigate("/dashboard", { replace: true });
        
    }
    

    return (
        <div className="setup-success-page">
            <div className="setup-topbar">
                <div className="setup-brand">
                    <div className="brand-icon"><ReceiptText size={16}/></div>
                    <span>Smart Billing</span>
                </div>
                
            </div>

            <div className="setup-success-content">
                <div className="success-logo">
                    <CircleCheckBig size={40}/>
                    
                </div>
                <div className="success-msg">
                    <h2>Profile Complete</h2>
                    <p>
                    Your company profile has been saved successfully.
                    You're ready to start managing inventory and billing.
                    </p>
                </div>
                <div className="dashboard-btn">
                    <button onClick={btnClicked}>Go to Dashboard <ChevronRight size={13}/></button>
                    
                </div>

                
                
            </div>
        </div>
    );
};


export default CompanySetupSuccess