import { useState } from "react"
import "./AuthPage.css";
import {ReceiptIndianRupee,FileText,ChartColumn,ShoppingCart,TrendingUp } from "lucide-react"
import {useDispatch,useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"
import {setLoading,setAdmin,setError,logoutAdmin,clearError} from "../features/auth/authSlice"
import MobileOnlyMessage from "../components/MobileOnlyMessage";


const AuthPage=()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {error,loading}=useSelector((state)=>state.auth)
    const [isSignup,setIsSignup]=useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }, []);

if (isMobile) {
    return <MobileOnlyMessage />;
}
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
         dispatch(clearError());
        setSignupData({
            ...signupData,
            [e.target.name]:e.target.value,

        })

    }
    const handleLoginChange=(e)=>{
         dispatch(clearError());
        setLoginData({
            ...loginData,
            [e.target.name]:e.target.value,

        })

    }
    const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
        dispatch(setLoading());

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(signupData),
        });

        const data = await res.json();
        console.log(data);

        if (!data.success) {
            dispatch(setError(data.message || data.errors?.[0] || "Signup failed"));
            return;
        }

        
        setSignupData({
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: ""
        });
       

        setIsSignup(false);
        dispatch(clearError());

    } catch (error) {
        dispatch(setError("Something went wrong"));
    }
};
    const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
        dispatch(setLoading());

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(loginData),
        });

        const data = await res.json();
        console.log(data);

        if (!data.success) {
            dispatch(setError(data.message || data.errors?.[0] || "Login failed"));
            setLoginData({
                email: "",
                password: "",
            });
            return;
        }

        dispatch(setAdmin(data.admin));
        

        setLoginData({
            email: "",
            password: "",
        });

        if (data.admin.companyId) {
            navigate("/dashboard");
        } else {
            navigate("/company/setup");
        }

    } catch (error) {
        dispatch(setError("Something went wrong"));
    }
};
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
                        <button type="button" className={!isSignup ? "active-tab" : "choose-btn"} onClick={() => {dispatch(clearError());setIsSignup(false)}}>Login</button>
                        <button type="button" className={isSignup ? "active-tab" : "choose-btn"} onClick={() => {dispatch(clearError()); setIsSignup(true)}}>Sign Up</button>
                    

                    </div>
                    {error && <p className="auth-error">{error}</p>}
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

export default AuthPage;