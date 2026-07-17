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
  TrendingDown,FileDown,Smartphone,CreditCard, Plus,
  PackagePlus,
  UserPlus,
  PackageSearch,Zap,ArchiveX, Package,CircleCheck,ArrowUpRight,Activity,TriangleAlert,PackageX,CircleX,Boxes,Percent
} from "lucide-react";

import {LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,PieChart, Pie, Cell,} from "recharts"

import Sidebar from "../components/Sidebar";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {setDashboardLoading,setDashboardError,clearDashboardError,setLowStockProducts,setDashboardSummary,setSalesTrend,setRecentInvoices,setTopSellingProducts,setPaymentMethodSummary, setBusinessInsights,setDeadStock,setCustomerMix,setBusinessHealth,setInventoryValue,setAdminName}from "../features/dashboard/dashboardSlice"
import { NavLink, useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [extended, setExtended] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("today");
    const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
    const periodOptions = [
        { label: "Today", value: "today" },
        { label: "Last 7 Days", value: "week" },
        { label: "This Month", value: "month" },
    ];

     

     const { loading, error,lowStockProducts,lowStockCount,summary,salesTrend,recentInvoices,topSellingProducts,paymentMethodSummary,businessInsights,deadStock,customerMix,businessHealth,inventoryValue,adminName} = useSelector((state) => state.dashboard);

     const dispatch=useDispatch();
     const navigate=useNavigate();

     const paymentData = [
       {
         name: "UPI",
         value: paymentMethodSummary.upi || 0,
         color: "#2563eb",
       },
       {
         name: "Card",
         value: paymentMethodSummary.card || 0,
         color: "#5fd0ad",
       },
       {
         name: "Cash",
         value: paymentMethodSummary.cash || 0,
         color: "#f9bd5c",
       },
     ];


    const hasPaymentData = paymentData.some((item) => item.value > 0);


    const paymentMethods = [
        {
            name: "UPI",
            value: paymentMethodSummary?.upi || 0,
        },
        {
            name: "Card",
            value: paymentMethodSummary?.card || 0,
        },
        {
            name: "Cash",
            value: paymentMethodSummary?.cash || 0,
        },
    ];

    const topPaymentMethod = paymentMethods.reduce((top, current) => {
        return current.value > top.value ? current : top;
    }, paymentMethods[0]);

    
    const formatDate = (date) => {
        if (!date) return "No sales yet";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };
    const {
      repeatCustomerCount = 0,
      newCustomerCount = 0,
      repeatCustomerPercent = 0,
      newCustomerPercent = 0,
    } = customerMix || {};

    const {
      totalProductCount = 0,
      lowStockCount2 = 0,
      outOfStockCount = 0,
      lowStockPercent = 0,
      outOfStockPercent = 0,
    } = businessHealth || {};

    const healthyStockCount = Math.max(
      totalProductCount - lowStockCount2 - outOfStockCount,
      0,
    );

    const healthyStockPercent =
      totalProductCount > 0
        ? Number(((healthyStockCount / totalProductCount) * 100).toFixed(1))
        : 0;


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
     const {
        purchaseValue = 0,
        sellingValue = 0,
        expectedProfit = 0,
        profitMargin = 0,
    } = inventoryValue || {};
    const fetchLowStockProducts = async () => {
            try {
                dispatch(setDashboardLoading());
                
    
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/products/getLowStockProducts`,
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

        const fetchAdminDetails=async()=>{
          try{
            dispatch(setDashboardLoading());

            const res = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/dashboard/getAdminDetails`,
              {
                credentials: "include",
              },
            );

            const data = await res.json();

            if (!data.success) {
              dispatch(setDashboardError("Error while fetching admin name"));
              
              
              return;
            }

            dispatch(
              setAdminName(data.adminName),
            );

          }catch(err){
            dispatch(setDashboardError("Error while fetching admin name"));

          }
        }
        const fetchInventoryValue = async () => {
          try {
            dispatch(setDashboardLoading());

            const res = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/dashboard/getInventoryValue`,
              {
                credentials: "include",
              },
            );

            const data = await res.json();

            if (!data.success) {
              dispatch(setDashboardError(data.message));
              return;
            }

            dispatch(
              setInventoryValue({
                purchaseValue: data.purchaseValue,
                sellingValue: data.sellingValue,
                expectedProfit: data.expectedProfit,
                profitMargin: data.profitMargin,
              }),
            );
          } catch (error) {
            dispatch(setDashboardError(error.message));
          }
        };
        const fetchBusinessInsights=async()=>{
          try{
            dispatch(setDashboardLoading());

            const res=await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/dashboard/getBusinessInsights`,{
              credentials:"include",
            })

            const data=await res.json();

            if(!data.success){
              dispatch(setDashboardError("Error while fetching business insights"));
            }
            dispatch(setBusinessInsights({
              topProduct: data.topProduct,
              avgInvoiceValue: data.avgInvoiceValue,
              totalGST: data.totalGST,
              highestSalesDate: data.highestSalesDate,
              highestSalesAmount: data.highestSalesAmount,
            }))
          }catch(err){
            dispatch(setDashboardError("Error while fetching business insights"));

          }
        }
        const fetchRecentInvoices = async () => {
            try {
                dispatch(setDashboardLoading());
                
    
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/dashboard/getRecentInvoices`,
                    {
                        credentials: "include",
                    }
                );
                const data = await res.json();
                if (!data.success) {
                    dispatch(setDashboardError(data.message));
                    return;
                }
                dispatch(setRecentInvoices(data.invoices));
                
            } catch (err) {
                dispatch(setDashboardError(err.message));
            }
        };

        const fetchCustomerMix = async () => {
          try {
            dispatch(setDashboardLoading());

            const res = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/dashboard/getCustomerMix`,
              {
                credentials: "include",
              },
            );

            const data = await res.json();

            if (!data.success) {
              dispatch(setDashboardError(data.message));
              return;
            }

            dispatch(
              setCustomerMix({
                repeatCustomerCount: data.repeatCustomerCount,
                newCustomerCount: data.newCustomerCount,
                repeatCustomerPercent: data.repeatCustomerPercent,
                newCustomerPercent: data.newCustomerPercent,
              }),
            );
          } catch (error) {
            dispatch(setDashboardError(error.message));
          }
        };

        const fetchDeadStock = async () => {
          try {
            dispatch(setDashboardLoading());

            const res = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/v1/dashboard/getDeadStock`,
              {
                credentials: "include",
              },
            );

            const data = await res.json();

            if (!data.success) {
              dispatch(setDashboardError("Error while fetching the data"));
            }

            dispatch(setDeadStock(data.deadStock));
          } catch (err) {
            dispatch(setDashboardError("Error while fetching the data"));
          }
        };

        const fetchPaymentMethodSummary=async()=>{
          try {
                dispatch(setDashboardLoading());
                
    
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/dashboard/getPaymentMethodSummary`,
                    {
                        credentials: "include",
                    }
                );
                const data = await res.json();
                if (!data.success) {
                    dispatch(setDashboardError(data.message));
                    return;
                }
                dispatch(
                    setPaymentMethodSummary({
                        cash: data.cashInvoicesPercent,
                        upi: data.upiInvoicesPercent,
                        card: data.cardInvoicesPercent,
                    })
                );
                
            } catch (err) {
                dispatch(setDashboardError(err.message));
            }

        }
        
        const fetchTopSellingProducts = async () => {
            try {
                dispatch(setDashboardLoading());
                
    
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/dashboard/getTopSellingProducts`,
                    {
                        credentials: "include",
                    }
                );
                const data = await res.json();
                if (!data.success) {
                    dispatch(setDashboardError(data.message));
                    return;
                }
                dispatch(setTopSellingProducts(data.topSellingProducts));
                
            } catch (err) {
                dispatch(setDashboardError(err.message));
            }
        };
        
        const fetchDashboardSummary=async (value)=>{
                try{
                    dispatch(setDashboardLoading());
                  value = value || "today";
        
                  const res = await fetch(
                    
                    `${import.meta.env.VITE_BACKEND_URL}/api/v1/dashboard/getDashboardSummary?period=${value}`,
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
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/dashboard/getSalesTrend`,
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

            const fetchBusinessHealth = async () => {
              try {
                dispatch(setDashboardLoading());

                const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/dashboard/getBusinessHealth`,
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
                dispatch(
                  setBusinessHealth({
                    totalProductCount: data.totalProductCount,
                    lowStockCount2: data.lowStockCount,
                    outOfStockCount: data.outOfStockCount,
                    lowStockPercent: data.lowStockPercent,
                    outOfStockPercent: data.outOfStockPercent,
                  }),
                );
              } catch (err) {
                dispatch(setDashboardError("Failed to get Sales Trend"));
              }
            };

        useEffect(()=>{
          fetchAdminDetails(),
          fetchInventoryValue(),
          fetchBusinessHealth(),
          fetchCustomerMix(),
          fetchDeadStock(),
          fetchBusinessInsights(),
          fetchPaymentMethodSummary(),
          fetchTopSellingProducts(),
          fetchRecentInvoices(),
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
            {/* <div className="dashboard-search">
              <Search size={17} />
              <input type="text" placeholder="Search invoices, products..." />
            </div> */}

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

            <div className="dashboard-avatar">{adminName.split(" ").map((word)=>word[0]).slice(0,2).join("").toUpperCase()}</div>
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

                <button type="button" className="dashboard-view-alerts-btn" onClick={()=>navigate("/products")}>
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

              <div className="dashboard-recent-invoices-card">
                <div className="invoice-catalogue">
                  <div className="invoice-catalogue-header">
                    <div>
                      <h3>All Invoices</h3>
                      {/* <p>
                    {filteredInvoices.length} of {invoices.length} invoices
                  </p> */}
                    </div>
                    <NavLink
                      to="/invoices"
                      className="dashboard-invoices-viewAll"
                    >
                      <h5>View All</h5>
                    </NavLink>
                  </div>

                  <div className="invoice-table-wrapper">
                    <table className="invoice-table">
                      <thead>
                        <tr>
                          <th>Invoice #</th>
                          <th>Customer</th>
                          <th>Amount</th>

                          <th>Payment</th>
                          <th>Date</th>

                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {recentInvoices.map((invoice) => {
                          return (
                            <tr key={invoice._id}>
                              <td className="invoiceNo-data">
                                {invoice.invoiceNo}
                              </td>

                              <td>
                                <div className="invoice-customer-info">
                                  {/* <span className="invoice-customer-avatar">
                                {invoice.customerDetails?.name
                                  ?.split(" ")
                                  .map((word) => word[0])
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase() || "NA"}
                              </span> */}
                                  <div>
                                    <h4>
                                      {invoice.customerDetails?.name?.toUpperCase() ||
                                        "WALK-IN CUSTOMER"}
                                    </h4>
                                    <p>
                                      {invoice.customerDetails?.phone ||
                                        "No phone"}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="invoiceAmount-data">
                                ₹{invoice.totalAmount || 0}
                              </td>

                              <td className="invoicePayment-data-dashboard">
                                <span className="dashboard-payment-icon">
                                  {invoice.paymentMethod === "Cash" && (
                                    <Wallet
                                      className="dashboard-wallet"
                                      size={14}
                                    />
                                  )}
                                  {invoice.paymentMethod === "UPI" && (
                                    <Smartphone
                                      className="dashboard-phone"
                                      size={14}
                                    />
                                  )}
                                  {invoice.paymentMethod === "Card" && (
                                    <CreditCard
                                      className="dashboard-card"
                                      size={14}
                                    />
                                  )}
                                </span>

                                {invoice.paymentMethod || "-"}
                              </td>

                              <td className="invoiceDate-data">
                                {invoice.createdAt
                                  ? new Date(
                                      invoice.createdAt,
                                    ).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "-"}
                              </td>

                              <td>
                                <div className="invoice-action-icons-dashboard">
                                  {/* <Eye
                                size={17}
                                className="eye-icon"
                                onClick={() =>
                                  dispatch(setSelectedInvoice(invoice))
                                }
                              /> */}

                                  <FileDown
                                    className="pencil-icon"
                                    size={17}
                                    onClick={() => {
                                      if (!invoice.pdfUrl) {
                                        alert(
                                          "PDF is not available for this invoice yet",
                                        );
                                        return;
                                      }

                                      window.open(invoice.pdfUrl, "_blank");
                                    }}
                                  />

                                  {/* <Trash2
                                className="delete-icon"
                                size={17}
                                onClick={() => {
                                  handleDeleteInvoice(invoice._id);
                                }}
                              /> */}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {recentInvoices.length === 0 && (
                      <div className="invoice-empty-state">
                        No invoices found
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Top Selling Products */}

              <div className="dashboard-top-products-card">
                <div className="products-catalogue">
                  <div className="catalogue-header">
                    <div>
                      <h3>Top Selling Products</h3>
                      <p>By number of units sold</p>
                    </div>
                  </div>
                  <div className="products-table-wrapper">
                    <table className="products-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Code</th>

                          <th>Units Sold</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>

                      <tbody>
                        {topSellingProducts.map((product) => {
                          return (
                            <tr key={product._id}>
                              <td>
                                <div className="product-info">
                                  <span className="product-avatar">
                                    {product.name
                                      ?.split(" ")
                                      .map((word) => word[0])
                                      .slice(0, 2)
                                      .join("")
                                      .toUpperCase()}
                                  </span>
                                  <div>
                                    <h4>{product.name?.toUpperCase()}</h4>
                                    <p>
                                      {product.manufacturer ||
                                        "No manufacturer"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>{product.productCode}</td>

                              <td className="dashboard-units-sold">
                                {product.totalSellings}
                              </td>
                              <td>
                                ₹{" "}
                                {(
                                  (product.sellingPrice || 0) *
                                  (product.totalSellings || 0)
                                ).toLocaleString("en-IN")}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

             

              
            </div>

            {/* RIGHT COLUMN */}

            <div className="dashboard-right-column">
              {/* Quick Actions */}

              <div className="dashboard-quick-actions-card">
                <h3>Quick Actions</h3>

                <div className="dashboard-quick-actions-grid">
                  <button
                    type="button"
                    className="dashboard-quick-action dashboard-new-invoice-action"
                    onClick={() => navigate("/billing")}
                  >
                    <Plus className="quick-actions-icon-1" size={22} />
                    <span>New Invoice</span>
                  </button>

                  <button
                    type="button"
                    className="dashboard-quick-action"
                    onClick={() => navigate("/products/add-product")}
                  >
                    <PackagePlus className="quick-actions-icon-2" size={20} />
                    <span>Add Product</span>
                  </button>

                  <button
                    type="button"
                    className="dashboard-quick-action"
                    onClick={() => navigate("/customers")}
                  >
                    <Users className="quick-actions-icon-3" size={20} />
                    <span>View Customers</span>
                  </button>

                  <button
                    type="button"
                    className="dashboard-quick-action"
                    onClick={() => navigate("/products")}
                  >
                    <PackageSearch className="quick-actions-icon-4" size={20} />
                    <span>View Inventory</span>
                  </button>
                </div>
              </div>

              {/* Payment Distribution */}

              <div className="dashboard-payment-card">
                <div className="payment-distribution-header">
                  <h3>Payment Distribution</h3>
                  <p>Share by payment method</p>
                </div>

                <div className="payment-chart-container">
                  {hasPaymentData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Percentage"]}
                          contentStyle={{
                            borderRadius: "10px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            fontSize: "13px",
                          }}
                          cursor={false}
                        />
                        <Pie
                          data={paymentData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={53}
                          outerRadius={76}
                          paddingAngle={1}
                          stroke="#ffffff"
                          strokeWidth={2}
                          startAngle={90}
                          endAngle={-270}
                        >
                          {paymentData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="payment-empty-chart">
                      <div className="payment-empty-donut"></div>
                      <p>No payment data yet</p>
                    </div>
                  )}
                </div>

                <div className="payment-distribution-legend">
                  {paymentData.map((item) => (
                    <div className="payment-legend-item" key={item.name}>
                      <span
                        className="payment-legend-dot"
                        style={{ backgroundColor: item.color }}
                      ></span>

                      <span className="payment-legend-name">{item.name}</span>

                      <span className="payment-legend-value">
                        {Number(item.value).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Insights */}

              <div className="dashboard-business-insights-card">
                <div className="business-insights-title">
                  <Zap size={17} fill="currentColor" />
                  <h3>Business Insights</h3>
                </div>

                <div className="business-insights-list">
                  <div className="business-insight-row">
                    <span className="business-insight-label">
                      Highest Sales Date
                    </span>

                    <span className="business-insight-value">
                      {businessInsights?.highestSalesDate}
                    </span>
                  </div>

                  <div className="business-insight-row">
                    <span className="business-insight-label">
                      Best-Selling Product
                    </span>

                    <span className="business-insight-value">
                      {businessInsights?.topProduct?.name || "No product yet"}
                    </span>
                  </div>

                  <div className="business-insight-row">
                    <span className="business-insight-label">
                      Avg Order Value
                    </span>

                    <span className="business-insight-value">
                      {businessInsights?.avgInvoiceValue}
                    </span>
                  </div>

                  <div className="business-insight-row">
                    <span className="business-insight-label">
                      Top Payment Method
                    </span>

                    <span className="business-insight-value">
                      {topPaymentMethod.value > 0
                        ? `${topPaymentMethod.name} (${topPaymentMethod.value.toFixed(1)}%)`
                        : "No payments yet"}
                    </span>
                  </div>

                  <div className="business-insight-row">
                    <span className="business-insight-label">
                      GST Collected
                    </span>

                    <span className="business-insight-value">
                      {businessInsights?.totalGST.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dead Stock */}

              <div className="dashboard-dead-stock-card">
                <div className="dead-stock-header">
                  <div className="dead-stock-heading">
                    <ArchiveX size={17} />
                    <h3>Dead Stock</h3>
                  </div>

                  <span className="dead-stock-count">
                    {deadStock?.length || 0} items
                  </span>
                </div>

                <div className="dead-stock-list">
                  {deadStock?.length > 0 ? (
                    deadStock.slice(0, 4).map((product) => (
                      <div className="dead-stock-item" key={product._id}>
                        <div className="dead-stock-product-info">
                          <h4>{product.name}</h4>

                          <p>Last sold: {formatDate(product.lastSoldAt)}</p>
                        </div>

                        <span className="dead-stock-quantity">
                          {product.quantity} left
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="dead-stock-empty">
                      <Package size={28} />
                      <p>No dead stock found</p>
                    </div>
                  )}
                </div>

                <NavLink to="/products" className="dead-stock-view-link">
                  <Package size={15} />
                  View Inventory
                </NavLink>
              </div>
            </div>
          </div>
          {/* =================================================
    BOTTOM ANALYTICS CARDS
================================================= */}

<div className="dashboard-bottom-cards">

    {/* ================= CUSTOMER MIX ================= */}

    <div className="dashboard-customer-mix-card">
        <div className="customer-mix-header">
            <h3>Customer Mix</h3>
            <p>Repeat vs. new customers</p>
        </div>

        <div className="customer-mix-progress-section">
            <div className="customer-mix-progress-item">
                <div className="customer-mix-progress-heading">
                    <span>Repeat Customers</span>

                    <strong className="customer-repeat-percentage">
                        {repeatCustomerPercent}%
                    </strong>
                </div>

                <div className="customer-mix-progress-track">
                    <div
                        className="customer-mix-progress-fill customer-repeat-fill"
                        style={{
                            width: `${Math.min(repeatCustomerPercent, 100)}%`,
                        }}
                    />
                </div>
            </div>

            <div className="customer-mix-progress-item">
                <div className="customer-mix-progress-heading">
                    <span>New Customers</span>

                    <strong className="customer-new-percentage">
                        {newCustomerPercent}%
                    </strong>
                </div>

                <div className="customer-mix-progress-track">
                    <div
                        className="customer-mix-progress-fill customer-new-fill"
                        style={{
                            width: `${Math.min(newCustomerPercent, 100)}%`,
                        }}
                    />
                </div>
            </div>
        </div>

        <div className="customer-mix-statistics">
            <div className="customer-mix-stat-box">
                <div className="customer-mix-stat-icon repeat-stat-icon">
                    <CircleCheck size={15} />
                </div>

                <div className="customer-mix-stat-content">
                    <strong>{repeatCustomerCount}</strong>
                    <span>Repeat Customers</span>
                </div>
            </div>

            <div className="customer-mix-stat-box">
                <div className="customer-mix-stat-icon new-stat-icon">
                    <ArrowUpRight size={15} />
                </div>

                <div className="customer-mix-stat-content">
                    <strong>{newCustomerCount}</strong>
                    <span>New This Month</span>
                </div>
            </div>
        </div>
    </div>

    {/* ================= INVENTORY HEALTH ================= */}

    <div className="dashboard-inventory-health-card">
        <div className="inventory-health-header">
            <h3>Inventory Health</h3>
            <p>Stock status overview</p>
        </div>

        <div className="inventory-health-grid">
            <div className="inventory-health-stat total-products-stat">
                <Package size={18} />
                <strong>{totalProductCount}</strong>
                <span>Total Products</span>
            </div>

            <div className="inventory-health-stat healthy-stock-stat">
                <CircleCheck size={18} />
                <strong>{healthyStockCount}</strong>
                <span>Healthy Stock</span>
            </div>

            <div className="inventory-health-stat low-stock-stat">
                <TriangleAlert size={18} />
                <strong>{lowStockCount2}</strong>
                <span>Low Stock</span>
            </div>

            <div className="inventory-health-stat out-stock-stat">
                <CircleX size={18} />
                <strong>{outOfStockCount}</strong>
                <span>Out of Stock</span>
            </div>
        </div>

        <div className="inventory-health-bar">
            {healthyStockPercent > 0 && (
                <div
                    className="inventory-health-bar-part healthy-bar-part"
                    style={{ width: `${healthyStockPercent}%` }}
                />
            )}

            {lowStockPercent > 0 && (
                <div
                    className="inventory-health-bar-part low-bar-part"
                    style={{ width: `${lowStockPercent}%` }}
                />
            )}

            {outOfStockPercent > 0 && (
                <div
                    className="inventory-health-bar-part out-bar-part"
                    style={{ width: `${outOfStockPercent}%` }}
                />
            )}
        </div>

        <div className="inventory-health-legend">
            <div className="inventory-health-legend-item">
                <span className="inventory-health-dot healthy-dot" />
                <p>Healthy {healthyStockPercent}%</p>
            </div>

            <div className="inventory-health-legend-item">
                <span className="inventory-health-dot low-dot" />
                <p>Low {lowStockPercent}%</p>
            </div>

            <div className="inventory-health-legend-item">
                <span className="inventory-health-dot out-dot" />
                <p>Out {outOfStockPercent}%</p>
            </div>
        </div>
    </div>

    {/* ================= INVENTORY VALUE ================= */}

    <div className="dashboard-inventory-value-card">
        <div className="inventory-value-header">
            <div>
                <h3>Inventory Value</h3>
                <p>Current value of available stock</p>
            </div>

            <div className="inventory-value-header-icon">
                <Boxes size={18} />
            </div>
        </div>

        <div className="inventory-value-grid">
            <div className="inventory-value-box purchase-value-box">
                <div className="inventory-value-icon purchase-value-icon">
                    <IndianRupee size={17} />
                </div>

                <div className="inventory-value-content">
                    <span>Purchase Value</span>
                    <strong>
                        ₹{Number(purchaseValue || 0).toLocaleString("en-IN")}
                    </strong>
                </div>
            </div>

            <div className="inventory-value-box selling-value-box">
                <div className="inventory-value-icon selling-value-icon">
                    <TrendingUp size={17} />
                </div>

                <div className="inventory-value-content">
                    <span>Selling Value</span>
                    <strong>
                        ₹{Number(sellingValue || 0).toLocaleString("en-IN")}
                    </strong>
                </div>
            </div>

            <div className="inventory-value-box profit-value-box">
                <div className="inventory-value-icon profit-value-icon">
                    <TrendingUp size={17} />
                </div>

                <div className="inventory-value-content">
                    <span>Expected Profit</span>
                    <strong>
                        ₹{Number(expectedProfit || 0).toLocaleString("en-IN")}
                    </strong>
                </div>
            </div>

            <div className="inventory-value-box margin-value-box">
                <div className="inventory-value-icon margin-value-icon">
                    <Percent size={17} />
                </div>

                <div className="inventory-value-content">
                    <span>Profit Margin</span>
                    <strong>{Number(profitMargin || 0).toFixed(1)}%</strong>
                </div>
            </div>
        </div>

        <div className="inventory-value-summary">
            <div className="inventory-value-summary-text">
                <span>Potential Stock Profit</span>
                <strong>
                    ₹{Number(expectedProfit || 0).toLocaleString("en-IN")}
                </strong>
            </div>

            <div className="inventory-value-summary-badge">
                {Number(profitMargin || 0).toFixed(1)}% margin
            </div>
        </div>
    </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;