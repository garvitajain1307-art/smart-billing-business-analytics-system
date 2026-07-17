
import {ReceiptIndianRupee,LayoutDashboard,ShoppingCart,PackageOpen, Users,FileText,ChartColumn,Bell,Settings,Menu,LogOut} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useState,useEffect } from "react";
import {setLoading,setAdmin,setError,logoutAdmin,clearError} from "../features/auth/authSlice"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";


const Sidebar = ({ extended, setExtended }) => {

    const [adminName,setAdminName]=useState("");
    const [err,setError]=useState(null);
    const unreadCount = useSelector((state) => state.notification.unreadCount);

    const navigate=useNavigate();
    const dispatch=useDispatch();

    const menuBtnClicked=()=>{
        
        setExtended(!extended);
    }
    const fetchAdminDetails=async()=>{
              try{
               
    
                const res = await fetch(
                  `${import.meta.env.VITE_BACKEND_URL}/api/v1/dashboard/getAdminDetails`,
                  {
                    credentials: "include",
                  },
                );
    
                const data = await res.json();
                if(!data.success){
                    setError(data.message);
                }
                setAdminName(data.adminName)
                
    
              }catch(err){
                setError("Error while fetching admin name");
    
              }
            }
    useEffect(()=>{
        fetchAdminDetails()
    },[])

    const handleLogoutBtn = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/logout`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Error while logging out");
          return;
        }

        dispatch(logoutAdmin());

        navigate("/", {
          replace: true,
        });
      } catch (err) {
        setError("Error while logging out");
      }
    };

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
                <button onClick={menuBtnClicked}>
                  <Menu />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="logo-icon">
                <ReceiptIndianRupee />
              </div>
              <div className="menu-logo">
                <button onClick={menuBtnClicked}>
                  <Menu />
                </button>
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

              <NavLink
                to="/notifications"
                className="sidebar-item sidebar-link"
              >
                <div className="sidebar-notification-icon">
                  <Bell size={20} />

                  {unreadCount > 0 && <span className="sidebar-unread-dot" />}
                </div>

                {extended && (
                  <>
                    <span>Notifications</span>

                    {unreadCount > 0 && (
                      <span className="sidebar-unread-count">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>

              {/* <NavLink to="/settings" className="sidebar-item">
                <Settings size={18} />
                <span>Settings</span>
              </NavLink> */}
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

              {/* <NavLink to="/analytics" className="sidebar-item">
                            <ChartColumn size={18} />
                        </NavLink> */}

              <NavLink to="/notifications" className="sidebar-item">
                <div className="sidebar-notification-icon">
                  <Bell size={20} />

                  {unreadCount > 0 && <span className="sidebar-unread-dot" />}
                </div>
              </NavLink>

              {/* <NavLink to="/settings" className="sidebar-item">
                <Settings size={18} />
              </NavLink> */}
            </div>
          )}
        </div>
        <div className="sidebar-footer">
          {extended ? (
            <>
              <div className="profile-sec">
                <div className="initials">{adminName
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}</div>
                <div className="profile-info">
                  <h3>{adminName.toUpperCase()}</h3>
                  <p>Administrator</p>
                </div>
              </div>
              <div className="logout-sec">
                <button
                  type="button"
                  className="logout-link"
                  onClick={handleLogoutBtn}
                >
                  <LogOut size={18} />

                  {extended && <span>Logout</span>}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="profile-sec">
                <div className="initials">
                  {adminName
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
              </div>
              <div className="logout-sec">
                <button
                  type="button"
                  className="logout-link"
                  onClick={handleLogoutBtn}
                >
                  <LogOut size={18} />

                  {extended && <span>Logout</span>}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
};

export default Sidebar;