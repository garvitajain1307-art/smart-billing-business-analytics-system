import {
  Search,
  Bell,
  CalendarDays,
  ChevronDown,AlertTriangle,ArrowRight,RotateCcw,Check,
  IndianRupee,
  Wallet,
  ReceiptText,
  Users,
  TrendingUp,
  TrendingDown
} from "lucide-react";

import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,} from "recharts"

import Sidebar from "../components/Sidebar";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {setDashboardLoading,setDashboardError,clearDashboardError,setLowStockProducts,setDashboardSummary,setSalesTrend}from "../features/dashboard/dashboardSlice"
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [extended, setExtended] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("today");
    const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
    const periodOptions = [
        { label: "Today", value: "today" },
        { label: "Last 7 Days", value: "week" },
        { label: "This Month", value: "month" },
    ];

    const salesData = [
      { label: "Jul 1", revenue: 38000 },
      { label: "Jul 2", revenue: 42000 },
      { label: "Jul 3", revenue: 35000 },
      { label: "Jul 4", revenue: 51000 },
    ];

     const { loading, error,lowStockProducts,lowStockCount,summary,salesTrend} = useSelector((state) => state.dashboard);

     const dispatch=useDispatch();
     const navigate=useNavigate();

     const getComparisonText = (type, data) => {
       if (type === "percentage") {
         return `${Math.abs(data.change || 0)}%`;
       }

       return `${Math.abs(data.difference || 0)}`;
     };

     const getComparisonLabel = () => {
       if (selectedPeriod === "today") {
         return "vs yesterday";
       }

       if (selectedPeriod === "week") {
         return "vs previous 7 days";
       }

       return "vs previous month";
     };

    const fetchLowStockProducts = async () => {
            try {
                dispatch(setDashboardLoading());
                
    
                const res = await fetch(
                    "http://localhost:4000/api/v1/products/getLowStockProducts",
                    {
                        credentials: "include",
                    }
                );
                const data = await res.json();
                if (!data.success) {
                    dispatch(setDashboardError(data.message));
                    return;
                }
                dispatch(setLowStockProducts(data));
                
            } catch (err) {
                dispatch(setDashboardError(err.message));
            }
        };
        const fetchDashboardSummary=async (value)=>{
                try{
                    dispatch(setDashboardLoading());
                  value = value || "today";
        
                  const res = await fetch(
                    
                    `http://localhost:4000/api/v1/dashboard/getDashboardSummary?period=${value}`,
                    {
                      credentials: "include",
                    }
                 );
                 const data = await res.json();
                  if (!data.success) {
                      dispatch(setDashboardError(data.message||"Failed to get summary"));
                        return;
                  }
                  dispatch(setDashboardSummary(data.summary));
                  
                  
        
                }catch(err){
                  dispatch(setDashboardError("Failed to get summary"));
        
                }
              }
            const fetchSalesTrend = async () => {
              try {
                dispatch(setDashboardLoading());

                const res = await fetch(
                "http://localhost:4000/api/v1/dashboard/getSalesTrend",
                  {
                    credentials: "include",
                  },
                );
                const data = await res.json();
                if (!data.success) {
                  dispatch(
                    setDashboardError(data.message || "Failed to get Sales Trend"),
                  );
                  return;
                }
                dispatch(setSalesTrend(data.salesTrend));
              } catch (err) {
                dispatch(setDashboardError("Failed to get Sales Trend"));
              }
            };

        useEffect(()=>{
            fetchSalesTrend(),
            fetchLowStockProducts()

        },[])
        useEffect(()=>{
            fetchDashboardSummary(selectedPeriod)

        },[selectedPeriod])
  return (
    <div className={`dashboard-page ${extended ? "extended" : ""}`}>
      <Sidebar extended={extended} setExtended={setExtended} />

      <div className="dashboard-main">
        {/* Navbar  */}

        <div className="dashboard-navbar">
          <div className="dashboard-navbar-left">
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your business overview.</p>
          </div>

          <div className="dashboard-navbar-right">
            <div className="dashboard-search">
              <Search size={17} />
              <input type="text" placeholder="Search invoices, products..." />
            </div>

            <button className="dashboard-icon-btn">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </button>

            {/* <button className="dashboard-date-btn">
              <CalendarDays size={17} />
              <span>Today</span>
              <ChevronDown size={15} />
            </button> */}
            <div className="date-dropdown-wrapper">
              <div
                className="date-dropdown-btn"
                onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              >
                <span>
                  {
                    periodOptions.find(
                      (option) => option.value === selectedPeriod,
                    )?.label
                  }
                </span>

                <ChevronDown size={16} />
              </div>

              {dateDropdownOpen && (
                <div className="date-dropdown">
                  {periodOptions.map((period) => (
                    <div
                      key={period.value}
                      className="date-dropdown-item"
                      onClick={() => {
                        setSelectedPeriod(period.value);

                        setDateDropdownOpen(false);
                      }}
                    >
                      <div className="date-dropdown-item">
                        <strong>{period.label}</strong>

                        <div>
                          {selectedPeriod === period.value && (
                            <Check size={16} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="dashboard-avatar">RK</div>
          </div>
        </div>

        {/* ================= Content ================= */}

        <div className="dashboard-content">
          <div className="dashboard-low-stock-section">
            <div className="dashboard-low-stock-card">
              <div className="dashboard-low-stock-header">
                <div className="dashboard-low-stock-header-left">
                  <div className="dashboard-low-stock-icon">
                    <AlertTriangle size={18} />
                  </div>

                  <div className="dashboard-low-stock-heading">
                    <div className="dashboard-low-stock-title-row">
                      <h3>Low Stock Priority Alert</h3>

                      <span className="dashboard-low-stock-count">
                        {lowStockCount} {lowStockCount === 1 ? "item" : "items"}
                      </span>
                    </div>

                    <p>Immediate restocking required</p>
                  </div>
                </div>

                <button type="button" className="dashboard-view-alerts-btn">
                  View All Alerts
                  <ArrowRight size={14} />
                </button>
              </div>

              {error && (
                <div className="dashboard-low-stock-error">{error}</div>
              )}

              {!loading && !error && lowStockProducts.length === 0 && (
                <div className="dashboard-low-stock-empty">
                  <div className="dashboard-stock-safe-icon">✓</div>

                  <div>
                    <h4>Stock levels are healthy</h4>
                    <p>No products currently have 10 or fewer units.</p>
                  </div>
                </div>
              )}

              {!loading && !error && lowStockProducts.length > 0 && (
                <div className="dashboard-low-stock-table-wrapper">
                  <table className="dashboard-low-stock-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Product Code</th>
                        <th>Category</th>
                        <th>Current Stock</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {lowStockProducts.slice(0, 4).map((product) => (
                        <tr key={product._id}>
                          <td>
                            <div className="dashboard-low-stock-product">
                              <span className="dashboard-product-name">
                                {product.name}
                              </span>

                              {product.unit && product.unitType && (
                                <span className="dashboard-product-unit">
                                  {product.unit} {product.unitType}
                                </span>
                              )}
                            </div>
                          </td>

                          <td>{product.productCode || "—"}</td>

                          <td>{product.categoryId?.name || "Uncategorized"}</td>

                          <td>
                            <span className="dashboard-current-stock">
                              {product.quantity} units
                            </span>
                          </td>

                          <td>
                            <span
                              className={`dashboard-stock-status ${
                                product.quantity <= 3
                                  ? "dashboard-stock-critical"
                                  : "dashboard-stock-low"
                              }`}
                            >
                              {product.quantity <= 3 ? "Critical" : "Low Stock"}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="dashboard-restock-btn"
                              onClick={() => {
                                navigate("/products", {
                                  state: {
                                    openRestockModal: true,
                                    productId: product._id,
                                    currentQuantity: product.quantity,
                                  },
                                });
                              }}
                            >
                              <RotateCcw size={12} />
                              Restock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-summary-grid">
            {/* Revenue */}

            <div className="dashboard-summary-card">
              <div className="dashboard-summary-card-top">
                <div className="dashboard-summary-icon revenue-summary-icon">
                  <IndianRupee size={20} />
                </div>

                <div
                  className={`dashboard-summary-trend ${
                    summary?.revenue?.change >= 0
                      ? "positive-summary-trend"
                      : "negative-summary-trend"
                  }`}
                >
                  {summary?.revenue?.change >= 0 ? (
                    <TrendingUp size={13} />
                  ) : (
                    <TrendingDown size={13} />
                  )}

                  <div>
                    {getComparisonText("percentage", summary?.revenue || {})}
                  </div>
                  {getComparisonLabel()}
                </div>
              </div>

              <p className="dashboard-summary-label">Total Revenue</p>

              <h2>
                ₹
                {Number(summary?.revenue?.current || 0).toLocaleString("en-IN")}
              </h2>

              {/* <span className="dashboard-summary-comparison">
                {getComparisonLabel()}
              </span> */}
            </div>

            {/* Profit */}

            <div className="dashboard-summary-card">
              <div className="dashboard-summary-card-top">
                <div className="dashboard-summary-icon profit-summary-icon">
                  <Wallet size={20} />
                </div>

                <div
                  className={`dashboard-summary-trend ${
                    summary?.profit?.change >= 0
                      ? "positive-summary-trend"
                      : "negative-summary-trend"
                  }`}
                >
                  {summary?.profit?.change >= 0 ? (
                    <TrendingUp size={13} />
                  ) : (
                    <TrendingDown size={13} />
                  )}

                  <div>
                    {getComparisonText("percentage", summary?.profit || {})}
                  </div>
                  {getComparisonLabel()}
                </div>
              </div>

              <p className="dashboard-summary-label">Total Profit</p>

              <h2>
                ₹{Number(summary?.profit?.current || 0).toLocaleString("en-IN")}
              </h2>

              {/* <span className="dashboard-summary-comparison">
                {getComparisonLabel()}
              </span> */}
            </div>

            {/* Invoices */}

            <div className="dashboard-summary-card">
              <div className="dashboard-summary-card-top">
                <div className="dashboard-summary-icon invoice-summary-icon">
                  <ReceiptText size={20} />
                </div>

                <div
                  className={`dashboard-summary-trend ${
                    summary?.invoices?.difference >= 0
                      ? "positive-summary-trend"
                      : "negative-summary-trend"
                  }`}
                >
                  {summary?.invoices?.difference >= 0 ? (
                    <TrendingUp size={13} />
                  ) : (
                    <TrendingDown size={13} />
                  )}

                  <div>
                    {getComparisonText("difference", summary?.invoices || {})}
                  </div>

                  {getComparisonLabel()}
                </div>
              </div>

              <p className="dashboard-summary-label">Invoices Generated</p>

              <h2>{summary?.invoices?.current || 0}</h2>
            </div>

            {/* Customers */}

            <div className="dashboard-summary-card">
              <div className="dashboard-summary-card-top">
                <div className="dashboard-summary-icon customer-summary-icon">
                  <Users size={20} />
                </div>

                <div
                  className={`dashboard-summary-trend ${
                    summary?.customers?.difference >= 0
                      ? "positive-summary-trend"
                      : "negative-summary-trend"
                  }`}
                >
                  {summary?.customers?.difference >= 0 ? (
                    <TrendingUp size={13} />
                  ) : (
                    <TrendingDown size={13} />
                  )}

                  <div>
                    {getComparisonText("difference", summary?.customers || {})}
                  </div>
                  {getComparisonLabel()}
                </div>
              </div>

              <p className="dashboard-summary-label">Customers Served</p>

              <h2>{summary?.customers?.current || 0}</h2>

              {/* <span className="dashboard-summary-comparison">
                {getComparisonLabel()}
                
              </span> */}
            </div>
          </div>
          <div className="dashboard-middle-section">
            {/* LEFT COLUMN */}

            <div className="dashboard-left-column">
              {/* Sales Trend */}

              <div className="dashboard-sales-card">
                <div className="dashboard-sales-card-header">
                  <div>
                    <h3>Sales Trend</h3>
                    <p>Daily revenue — last 10 days</p>
                  </div>

                  <div className="dashboard-sales-legend">
                    <span></span>
                    Revenue
                  </div>
                </div>

                <div className="dashboard-sales-chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={salesTrend}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />

                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis axisLine={false} tickLine={false} />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Invoices */}

              <div className="dashboard-recent-invoices-card"></div>

              {/* Top Selling Products */}

              <div className="dashboard-top-products-card"></div>

              {/* Bottom Cards */}

              <div className="dashboard-bottom-cards">
                <div className="dashboard-customer-mix-card"></div>

                <div className="dashboard-inventory-health-card"></div>

                <div className="dashboard-monthly-revenue-card"></div>
              </div>
            </div>

            {/* RIGHT COLUMN */}

            <div className="dashboard-right-column">
              {/* Quick Actions */}

              <div className="dashboard-quick-actions-card"></div>

              {/* Payment Distribution */}

              <div className="dashboard-payment-card"></div>

              {/* Business Insights */}

              <div className="dashboard-business-insights-card"></div>

              {/* Dead Stock */}

              <div className="dashboard-dead-stock-card"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;