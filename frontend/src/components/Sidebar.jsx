
import {ReceiptIndianRupee,LayoutDashboard,ShoppingCart,PackageOpen, Users,FileText,ChartColumn,Bell,Settings,Menu,LogOut} from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ extended, setExtended }) => {
    

    const menuBtnClicked=()=>{
        
        setExtended(!extended);
    }

    return (
        <div className={extended ? "side-bar expanded" : "side-bar collapsed"}>
            <div className="app-details">
                {extended ? (
                  <div className="sidebar-header">
                  <div className="sidebar-logo">
                        <div className="logo-icon">
                            <ReceiptIndianRupee />
                        </div>

                        <div className="logo-text">
                            <h2>SmartBill</h2>
                            <p>Business Suite</p>
                        </div>
                    </div>
                    <div className="menu-logo">
                        <button onClick={menuBtnClicked}><Menu /></button>
                        
                    </div>
                  </div>
                    
                    
                ) : (
                   <>
                   <div className="logo-icon">
                        <ReceiptIndianRupee />
                    </div>
                    <div className="menu-logo">
                        <button onClick={menuBtnClicked}><Menu /></button>
                        
                        
                    </div>
                   </>
                    
                    
                )}
            </div>

            <div className="sidebar-main-menu">
                {extended ? (
                    <div className="sidebar-btns">

                        <NavLink to="/dashboard" className="sidebar-item">
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </NavLink>

                        <NavLink to="/billing" className="sidebar-item">
                            <ShoppingCart size={18} />
                            <span>Billing / POS</span>
                        </NavLink>

                        <NavLink to="/products" className="sidebar-item">
                            <PackageOpen size={18} />
                            <span>Products</span>
                        </NavLink>

                        <NavLink to="/customers" className="sidebar-item">
                            <Users size={18} />
                            <span>Customers</span>
                        </NavLink>

                        <NavLink to="/invoices" className="sidebar-item">
                            <FileText size={18} />
                            <span>Invoices</span>
                        </NavLink>

                        <NavLink to="/analytics" className="sidebar-item">
                            <ChartColumn size={18} />
                            <span>Analytics</span>
                        </NavLink>

                        <NavLink to="/notifications" className="sidebar-item">
                            <Bell size={18} />
                            <span>Notifications</span>
                        </NavLink>

                        <NavLink to="/settings" className="sidebar-item">
                            <Settings size={18} />
                            <span>Settings</span>
                        </NavLink>

                    </div>
                ) : (
                    <div className="sidebar-btns">

                        <NavLink to="/dashboard" className="sidebar-item">
                            <LayoutDashboard size={18} />
                        </NavLink>

                        <NavLink to="/billing" className="sidebar-item">
                            <ShoppingCart size={18} />
                        </NavLink>

                        <NavLink to="/products" className="sidebar-item">
                            <PackageOpen size={18} />
                        </NavLink>

                        <NavLink to="/customers" className="sidebar-item">
                            <Users size={18} />
                        </NavLink>

                        <NavLink to="/invoices" className="sidebar-item">
                            <FileText size={18} />
                        </NavLink>

                        <NavLink to="/analytics" className="sidebar-item">
                            <ChartColumn size={18} />
                        </NavLink>

                        <NavLink to="/notifications" className="sidebar-item">
                            <Bell size={18} />
                        </NavLink>

                        <NavLink to="/settings" className="sidebar-item">
                            <Settings size={18} />
                        </NavLink>

                    </div>
                )}
            </div>
            <div className="sidebar-footer">
                {extended?(
                    <>
                    <div className="profile-sec">
                        <div className="initials">RK</div>
                        <div className="profile-info">
                            <h3>Rajesh Kumar</h3>
                            <p>Administrator</p>
                        </div>
                    </div>
                    <div className="logout-sec" >
                        <NavLink to="/" className="logout-link">
                            <LogOut size={18} />
                            <span>Logout</span>
                        </NavLink>

                    </div>
                    </>

                ):(
                    <>
                    <div className="profile-sec">
                        <div className="initials">RK</div>
                        
                    </div>
                    <div className="logout-sec">
                        <NavLink to="/" className="logout-link">
                            <LogOut size={18} />
                            
                        </NavLink>

                    </div>
                    </>

                )}
            </div>
        </div>
    );
};

export default Sidebar;