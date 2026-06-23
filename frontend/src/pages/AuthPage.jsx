import { useState } from "react"
import "./AuthPage.css";
import {ReceiptIndianRupee,FileText,ChartColumn,ShoppingCart,TrendingUp } from "lucide-react"


export const AuthPage=()=>{
    const [isSignup,setIsSignup]=useState(true);
    const [signupData, setSignupData] = useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

    const [loginData, setLoginData] = useState({
      email: "",
      password: "",
    });
    const handleSignupChange=(e)=>{
        setSignupData({
            ...signupData,
            [e.target.name]:e.target.value,

        })

    }
    const handleLoginChange=(e)=>{
        setLoginData({
            ...loginData,
            [e.target.name]:e.target.value,

        })

    }
    const handleSignupSubmit=(e)=>{
        e.preventDefault();
        console.log(signupData)
        
        setSignupData({
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: ""
        });
    }
    const handleLoginSubmit=(e)=>{
        e.preventDefault();
        console.log(loginData)
        
        setLoginData({
            email: "",
            password: "",
        });
    }
    return(
        <div className="auth-page">
            <div className="left-landing-page">
                
                    <div className="logo">
                        <ReceiptIndianRupee />
                        <h1>Smart Billing System</h1>
                    </div>
                
                
                <h2>Billing, GST Invoices, Inventory & Business Analytics in one place</h2>
                <p>Simplify your business with automated billing and smart insights</p>

                <div className="feature-grid">
                    <div className="feature-card">
                        <FileText />
                        <h3>Smart Invoicing</h3>
                        <p>Generate GST-compliant invoices instantly</p>
                    </div>

                    <div className="feature-card">
                        <ChartColumn />
                        <h3>Analytics Dashboard</h3>
                        <p>Real-time business insights & reports</p>
                    </div>

                    <div className="feature-card">
                        <ShoppingCart />
                        <h3>Inventory Control</h3>
                        <p>Track stock levels & manage products</p>
                    </div>

                    <div className="feature-card">
                        <TrendingUp />
                        <h3>Growth Tracking</h3>
                        <p>Monitor sales trends & performance</p>
                    </div>
                </div>
            </div>
            <div className="right-landing-page">
                <div className="signup-container">
                    <div className="choose-method">
                         {/* type="button" => normal click button (does not submit form) */}
                        <button type="button" className={!isSignup ? "active-tab" : "choose-btn"} onClick={() => setIsSignup(false)}>Login</button>
                        <button type="button" className={isSignup ? "active-tab" : "choose-btn"} onClick={() => setIsSignup(true)}>Sign Up</button>
                    

                    </div>
                    {isSignup?(
                        <form className="signup-form" onSubmit={handleSignupSubmit}>
                            
                            <input name="name" placeholder="Full Name" value={signupData.name} onChange={handleSignupChange} />
                            <input name="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} />
                            <input name="phone" placeholder="Phone" value={signupData.phone} onChange={handleSignupChange} />
                            <input name="password" type="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} />
                            <input name="confirmPassword" type="password" placeholder="Confirm Password" value={signupData.confirmPassword} onChange={handleSignupChange} />

                            <button type="submit">Create Account</button>
                        </form>
                    ):(
                        <form className="login-form" onSubmit={handleLoginSubmit}>
                            <input name="email" placeholder="Email" value={loginData.email} onChange={handleLoginChange} />
                            <input name="password" type="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} />

                            <button type="submit">Login</button>
                        </form>
                    )}

                </div>
            </div>
        </div>
        
    )
}