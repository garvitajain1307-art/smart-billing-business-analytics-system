import Sidebar from "../components/Sidebar";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Check,
  ChevronRight,
  FileText,
  PackagePlus,
  Pencil,
  Search, ChevronDown
} from "lucide-react";
import { useState,useEffect } from "react";
import "./Notifications.css";
import { useSelector } from "react-redux";
import {setNotificationLoading,setNotificationError,clearNotificationError,setNotifications,markAllNotificationsRead,markNotificationRead} from "../features/notification/notificationSlice"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Notifications=()=>{
    const {notifications= [],unreadCount,loading,error} = useSelector((state) => state.notification);
    const [extended,setExtended]=useState(false);
    const [activeTab, setActiveTab] = useState("all");
   
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [timeOpen,setTimeOpen]=useState(false);
     const dispatch=useDispatch();
     const navigate=useNavigate();

  const activeStockAlerts = notifications.filter((notification) => {
    return (
      ["low_stock", "out_of_stock"].includes(notification.type) &&
      !notification.isResolved
    );
  }).length;

  const activityAlerts = notifications.filter((notification) => {
    return (
      ["product_added","product_updated","invoice_generated"].includes(notification.type) &&
      !notification.isResolved
    );
  }).length;

  const formatTimeAgo = (createdAt) => {
    if (!createdAt) return "";

    const createdDate = new Date(createdAt);
    const now = new Date();

    const differenceInSeconds = Math.floor(
      (now.getTime() - createdDate.getTime()) / 1000
    );

    if (differenceInSeconds < 60) {
      return "Just now";
    }

    const differenceInMinutes = Math.floor(differenceInSeconds / 60);

    if (differenceInMinutes < 60) {
      return `${differenceInMinutes} min ago`;
    }

    const differenceInHours = Math.floor(differenceInMinutes / 60);

    if (differenceInHours < 24) {
      return `${differenceInHours}h ago`;
    }

    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInDays < 7) {
      return `${differenceInDays}d ago`;
    }

    return createdDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchLabel=(type)=>{
    if(type==="low_stock"){
        return "Low Stock"
    }
    else if(type==="out_of_stock"){
        return "Out of Stock"
    }

    else if(type==="product_added"){
        return "Product"
    }
    else if(type==="product_updated"){
        return "Product"
    }
    else if(type==="invoice_generated"){
        return "Invoice"
    }else{
        return "";
    }
  }

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification._id);
    }

    if (notification.type === "invoice_generated") {
      navigate("/invoices");
      return;
    }

    if (
      notification.type === "low_stock" ||
      notification.type === "out_of_stock" ||
      notification.type === "product_added" ||
      notification.type === "product_updated"
    ) {
      navigate("/products");
    }
  };

  


 const getNotificationIcon = (type) => {
   if (type === "invoice_generated") return <FileText size={18} />;
   if (type === "low_stock") return <AlertTriangle size={18} />;
   if (type === "out_of_stock") return <AlertCircle size={18} />;
   if (type === "product_added") return <PackagePlus size={18} />;
   if (type === "product_updated") return <Pencil size={18} />;

   return <Bell size={18} />;
 };

 const filteredNotifications = notifications.filter((notification) => {
   const searchValue = searchTerm.toLowerCase().trim();

   const matchesSearch =
     notification.title?.toLowerCase().includes(searchValue) ||
     notification.message?.toLowerCase().includes(searchValue) ||
     notification.type?.toLowerCase().includes(searchValue);

   if (!matchesSearch) {
     return false;
   }

   if (activeTab === "unread") {
     return !notification.isRead;
   }

   if (activeTab === "stock") {
     return ["low_stock", "out_of_stock"].includes(notification.type);
   }

   if (activeTab === "activity") {
     return ["product_added", "product_updated", "invoice_generated"].includes(
       notification.type,
     );
   }

   return true;
 });

 const displayedNotifications = [...filteredNotifications].sort((a, b) => {
   const dateA = new Date(a.createdAt);
   const dateB = new Date(b.createdAt);

   if (sortOrder === "newest") {
     return dateB - dateA;
   }

   return dateA - dateB;
 });

    const fetchAllNotifications=async()=>{
        try{
            dispatch(setNotificationLoading());

            const res=await fetch("http://localhost:4000/api/v1/notification/getAllNotifications",{
                credentials:"include"
            })

            const data=await res.json();
            if(!data.success){
                return dispatch(setNotificationError(data.message));
            }

            dispatch(
              setNotifications({
                notifications: data.notifications,
                unreadCount: data.unreadCount,
              }),
            );
            
        }catch(error){
            dispatch(
              setNotificationError(
                error.message || "Failed to fetch notifications.",
              ),
            );

        }
    }
    const markNotificationAsRead=async(notificationId)=>{
        try{
             dispatch(setNotificationLoading());

            const res=await fetch(`http://localhost:4000/api/v1/notification/markRead/${notificationId}`,{
                 method: "PUT",
                credentials:"include"
            })

            const data=await res.json();
            if(!data.success){
                return dispatch(setNotificationError(data.message));
            }

           dispatch(markNotificationRead(notificationId));
            
        }catch(error){
            dispatch(
              setNotificationError(
                error.message || "Failed to read notifications.",
              ),
            );

        }
    }
    const markAllNotificationsAsRead = async () => {
      try {
        dispatch(setNotificationLoading());

        const res = await fetch(
          "http://localhost:4000/api/v1/notification/markAllRead",
          {
            method: "PUT",
            credentials: "include",
          },
        );

        const data = await res.json();

        if (!data.success) {
          return dispatch(setNotificationError(data.message));
        }

        dispatch(markAllNotificationsRead());
      } catch (error) {
        dispatch(setNotificationError(error.message));
      }
    };
    useEffect(()=>{
        fetchAllNotifications()
    },[]);
    return (
      <div
        className={`notifications-page ${extended ? "extended" : "collapsed"}`}
      >
        <Sidebar extended={extended} setExtended={setExtended} />

        <main className="notifications-main">
          <div className="notifications-content">
            <div className="notifications-page-header">
              <div className="notifications-heading-section">
                <div className="notifications-heading-icon">
                  <Bell size={22} />
                </div>

                <div>
                  <div className="notifications-title-row">
                    <h1>Notifications</h1>
                    <span>{unreadCount}</span>
                  </div>

                  <p>
                    Stay updated with inventory alerts and recent business
                    activity.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="notifications-mark-all"
                onClick={markAllNotificationsAsRead}
                disabled={unreadCount === 0}
              >
                <Check size={17} />
                Mark all as read
              </button>
            </div>

            <div className="notifications-summary">
              <div className="notification-summary-card">
                <div className="summary-icon total">
                  <Bell size={22} />
                </div>

                <div>
                  <p>Total Notifications</p>
                  <h2>{notifications.length}</h2>
                  <span>All time</span>
                </div>
              </div>

              <div className="notification-summary-card">
                <div className="summary-icon unread">
                  <AlertCircle size={22} />
                </div>

                <div>
                  <p>Unread Notifications</p>
                  <h2>{unreadCount}</h2>
                  <span>Requires attention</span>
                </div>
              </div>

              <div className="notification-summary-card">
                <div className="summary-icon alerts">
                  <AlertTriangle size={22} />
                </div>

                <div>
                  <p>Active Stock Alerts</p>
                  <h2>{activeStockAlerts}</h2>
                  <span>Low and out of stock</span>
                </div>
              </div>
            </div>

            <div className="notifications-toolbar">
              <div className="notifications-search">
                <Search size={17} />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="notifications-tabs">
                <button
                  className={activeTab === "all" ? "active" : ""}
                  onClick={() => setActiveTab("all")}
                >
                  <span>All</span> {notifications.length}
                </button>
                <button
                  className={activeTab === "unread" ? "active" : ""}
                  onClick={() => setActiveTab("unread")}
                >
                  <span>Unread</span>
                  {unreadCount}
                </button>
                <button
                  className={activeTab === "stock" ? "active" : ""}
                  onClick={() => setActiveTab("stock")}
                >
                  <span>Stock Alerts</span>
                  {activeStockAlerts}
                </button>
                <button
                  className={activeTab === "activity" ? "active" : ""}
                  onClick={() => setActiveTab("activity")}
                >
                  <span>Activity</span>
                  {activityAlerts}
                </button>
              </div>

              <div className="notification-custom-select">
                <button
                  type="button"
                  className="invoice-select-trigger"
                  onClick={() => setTimeOpen(!timeOpen)}
                >
                  {sortOrder === "newest" ? "newest" : "oldest"}
                  <ChevronDown size={18} />
                </button>

                {timeOpen && (
                  <div className="notification-select-menu">
                    <div
                      className="notification-select-option"
                      onClick={() => {
                        setSortOrder("newest");
                        setTimeOpen(false);
                      }}
                    >
                      Newest first
                      {sortOrder === "newest" && <Check size={17} />}
                    </div>

                    <div
                      className="notification-select-option"
                      onClick={() => {
                        setSortOrder("oldest");
                        setTimeOpen(false);
                      }}
                    >
                      Oldest first
                      {sortOrder === "oldest" && <Check size={17} />}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {notifications.length === 0 ? (
              <div className="notifications-empty-state">
                <div className="notifications-empty-icon">
                  <Bell size={36} />
                </div>

                <h2>You’re all caught up</h2>

                <p>
                  No notifications yet. Inventory alerts and recent business
                  activity will appear here as you use the system.
                </p>
              </div>
            ) : (
              <div className="notifications-list-card">
                {/* notification list */}

                <div className="notifications-list-header">
                  <h3>Notifications</h3>
                  <span>{displayedNotifications.length} notifications</span>
                </div>

                <div className="notifications-list">
                  {displayedNotifications.length === 0 ? (
                    <div className="notifications-filter-empty">
                      <Bell size={30} />

                      <h3>No matching notifications</h3>

                      <p>Try changing the selected tab or search text.</p>
                    </div>
                  ) : (
                    displayedNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`notification-item ${
                          notification.isRead ? "read" : "unread"
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div
                          className={`notification-icon ${notification.type}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="notification-details">
                          <div className="notification-title-line">
                            <h4>{notification.title}</h4>

                            {!notification.isRead && (
                              <span className="notification-dot" />
                            )}

                            <span
                              className={`notification-label ${notification.type}`}
                            >
                              {fetchLabel(notification.type)}
                            </span>
                          </div>

                          <p>{notification.message}</p>

                          <span className="notification-time">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                        </div>

                        <div className="notification-actions">
                          {!notification.isRead && (
                            <button
                              type="button"
                              onClick={(e) =>{
                                e.stopPropagation();
                                markNotificationAsRead(notification._id)}
                              }
                              
                            >
                              Mark read
                            </button>
                          )}

                          <ChevronRight size={18} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
}

export default Notifications