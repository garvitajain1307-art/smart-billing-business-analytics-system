import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { NavLink, useNavigate } from "react-router-dom";
import {
    Search,
    Plus,
    Package,
    Box,
    AlertTriangle,
    PackageX,
    Eye,
    Pencil,
    RefreshCw,
    Trash2,
    ArrowUpRight,
    ArrowDownRight,
    ChevronDown,Users,Calendar,Check, FileText, Download, Mail,TrendingUp,FileDown,MessageSquare,Crown,RefreshCcw,UserRoundPlus,Wallet 
} from "lucide-react";
import "./Customers.css";
import { useDispatch, useSelector } from "react-redux";
import {setCustomerLoading,setCustomers,setSelectedCustomer,addCustomer,updateCustomer,deleteCustomer,setCustomerError,clearCustomerError,clearCustomerSuccess,clearSelectedCustomer,stopCustomerLoading} from "../features/customers/customerSlice";

const Customers = () => {
  const [extended, setExtended] = useState(false);

  const [customerSearch, setCustomerSearch] = useState("");
  const [dateSort, setDateSort] = useState("newest");

  const [selectedTime, setSelectedTime] = useState("Newest First");
  // const [selectedStock, setSelectedStock] = useState("All Stock");
  const [timeOpen, setTimeOpen] = useState(false);

  const dispatch = useDispatch();
  const { customers, selectedCustomer, loading, error, success } = useSelector(
    (state) => state.customer,
  );
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      dispatch(setCustomerLoading());

      const res = await fetch(
        "http://localhost:4000/api/v1/customer/getAllCustomers",
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!data.success) {
        dispatch(setCustomerError(data.message));
        return;
      }

      dispatch(setCustomers(data.customers));
    } catch (err) {
      dispatch(setCustomerError(err.message));
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  //   const handleDeleteCustomer = async (customerId) => {
  //     if (!window.confirm("Delete this Customer?")) return;

  //     try {
  //       const res = await fetch(
  //         `http://localhost:4000/api/v1/invoice/deleteInvoice/${invoiceId}`,
  //         {
  //           method: "DELETE",
  //           credentials: "include",
  //         },
  //       );
  //       const data = await res.json();
  //       if (!data.success) {
  //         dispatch(setInvoiceError(data.message));
  //         return;
  //       }

  //       dispatch(removeInvoiceFromState(invoiceId));
  //     } catch (error) {
  //       dispatch(setInvoiceError(error.message));
  //     }
  //   };

  const filteredCustomers = customers.filter((customer) => {
  const searchText = customerSearch.trim().toLowerCase();

  if (!searchText) return true;

  const customerName = String(customer.name || "").toLowerCase();
  const customerPhone = String(customer.phone || "");

  return `${customerName} ${customerPhone}`.includes(searchText);
});
  // .sort((a, b) => {
  //   const dateA = new Date(a.createdAt);
  //   const dateB = new Date(b.createdAt);

  //   if (dateSort === "newest") {
  //     return dateB - dateA;
  //   }

  //   return dateA - dateB;
  // });

  const getRepeatCustomers = () => {
    return customers.filter((customer) => customer.timesServed > 1);
  };

  const totalRevenue = customers.reduce((sum, customer) => {
      return sum + (customer.totalRevenue || 0);
  }, 0);

  const getNewCustomersThisMonth = () => {
  const now = new Date();

  return customers.filter((customer) => {
    const createdDate = new Date(customer.createdAt);

    return (
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear()
    );
  });
};

  

  return (
    <div className={`invoices-page ${extended ? "extended" : ""}`}>
      <Sidebar extended={extended} setExtended={setExtended} />

      <div className="customers-content">
        <div className="customers-navbar">
          <div className="customers-top-filters">
            <div className="customers-filter-search">
              <Search size={19} className="customers-filter-icon" />
              <input
                type="text"
                className="customer-search-input"
                placeholder="Search customer by name or phone..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
              />
            </div>
          </div>

          {/* <div className="invoice-custom-select">
            <button 
              type="button"
              className="invoice-select-trigger"
              onClick={() => setTimeOpen(!timeOpen)}
            >
              {dateSort === "newest" ? "Newest first" : "Oldest first"}
              <ChevronDown size={18} />
            </button>

            {timeOpen && (
              <div className="invoice-select-menu">
                <div
                  className="invoice-select-option"
                  onClick={() => {
                    setDateSort("newest");
                    setTimeOpen(false);
                  }}
                >
                  Newest first
                  {dateSort === "newest" && <Check size={17} />}
                </div>

                <div
                  className="invoice-select-option"
                  onClick={() => {
                    setDateSort("oldest");
                    setTimeOpen(false);
                  }}
                >
                  Oldest first
                  {dateSort === "oldest" && <Check size={17} />}
                </div>
              </div>
            )}
          </div> */}

          <NavLink to="/billing">
            <button className="new-invoice-btn">
              <Plus size={20} />
              New Customer
            </button>
          </NavLink>
        </div>

        <div className="customers-area">
          <div className="customers-header">
            {/* <p className="section-label">Invoices</p> */}
            <h1>Customers</h1>
            <p className="customers-section-desc">
              Track relationships, purchase history, and revenue per customer
            </p>
          </div>

          <div className="customer-insights">
            <div className="customer-insight-card">
              <div>
                <p>Total Customers</p>
                <h2>{customers.length}</h2>
                <span className="invoice-green-text">
                  <ArrowUpRight size={15} /> vs last month
                </span>
              </div>
              <div className="customer-insight-icon customer-blue-icon">
                <Users size={24} />
              </div>
            </div>

            <div className="customer-insight-card">
              <div>
                <p>Repeat Customers</p>
                <h2>{getRepeatCustomers().length}</h2>
                <span className="customer-green-text">
                  <ArrowUpRight size={15} /> vs last month
                </span>
              </div>
              <div className="customer-insight-icon customer-green-icon">
                <RefreshCcw size={24} />
              </div>
            </div>

            <div className="customer-insight-card">
              <div>
                <p>New this month</p>
                <h2>{getNewCustomersThisMonth().length}</h2>
                <span className="customer-red-text">
                  <ArrowDownRight size={15} /> vs last month
                </span>
              </div>
              <div className="customer-insight-icon customer-orange-icon">
                <UserRoundPlus size={24} />
              </div>
            </div>

            <div className="customer-insight-card">
              <div>
                <p>Revenue From Customers </p>
                <h2>₹{totalRevenue}</h2>
                <span className="customer-red-text">
                  <ArrowDownRight size={15} /> vs last month
                </span>
              </div>
              <div className="customer-insight-icon customer-red-icon">
                <Wallet size={24} />
              </div>
            </div>
          </div>
          <div className="customer-main-layout">
            <div className="customer-catalogue">
              <div className="customer-catalogue-header">
                <div>
                  <h3>All Customers</h3>
                  <p>
                    {filteredCustomers.length} of {customers.length} customers
                  </p>
                </div>
                <button
                  className="customer-live-sync-btn"
                  onClick={fetchCustomers}
                  type="button"
                >
                  Live sync
                </button>
              </div>

              <div className="customer-table-wrapper">
                <table className="customer-table">
                  <thead>
                    <tr>
                      <th>CUSTOMER</th>
                      <th>PHONE</th>
                      <th>TIMES SERVED</th>
                      <th>REVENUE</th>
                      <th>LAST PURCHASE</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCustomers.map((customer) => {
                      return (
                        <tr key={customer._id}>
                          {/* <td className="invoiceNo-data">
                            {invoice.invoiceNo}
                          </td> */}

                          <td>
                            <div className="customer-info">
                              <span className="customer-avatar">
                                {customer.name
                                  ?.split(" ")
                                  .map((word) => word[0])
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase() || "NA"}
                              </span>
                              <div>
                                <div>
                                  <h4>
                                    {customer.name?.toUpperCase() ||
                                      "WALK-IN CUSTOMER"}
                                  </h4>
                                </div>

                                {/* <p>
                                  {invoice.customerDetails?.phone || "No phone"}
                                </p> */}
                              </div>
                            </div>
                          </td>

                          <td className="customer-phone-data">
                            {customer.phone}
                          </td>

                          <td className="customer-timesServed">
                            {customer.timesServed || "-"}
                          </td>

                          <td className="customer-totalRevenue">
                            ₹{customer.totalRevenue || 0}
                          </td>

                          <td className="customer-lastPurchase">11 Jun 2026</td>

                          <td className="customer-Status">VIP</td>

                          <td>
                            <div className="customer-action-icons">
                              <Eye
                                size={17}
                                className="eye-icon"
                                onClick={() =>
                                  dispatch(setSelectedCustomer(customer))
                                }
                              />

                              {/* <FileDown
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
                              /> */}

                              <Trash2
                                className="delete-icon"
                                size={17}
                                onClick={() => {
                                  handleDeleteCustomer(customer._id);
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredCustomers.length === 0 && (
                  <div className="customer-empty-state">No Customers found</div>
                )}
              </div>
            </div>
            <div></div>
            <div className="customer-rankings-row">
              <div className="customer-ranking-card">
                <div className="customer-ranking-title">
                  <div className="customer-ranking-title-icon"><Crown size={17} /></div>
                  
                  <h3>Top Revenue Customers</h3>
                </div>

                <div className="customer-ranking-list">
                  {[...customers]
                    .sort(
                      (a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0),
                    )
                    .slice(0, 5)
                    .map((customer, index) => (
                      <div className="customer-ranking-item" key={customer._id}>
                        <span className="customer-rank-number">
                          {index + 1}
                        </span>

                        <div className="customer-rank-info">
                          <h4>{customer.name}</h4>
                          <p>Profit ₹{customer.totalProfit || 0} </p>
                        </div>

                        <strong>₹{customer.totalRevenue || 0}</strong>
                      </div>
                    ))}
                </div>
              </div>

              <div className="customer-ranking-card">
                <div className="customer-ranking-title">
                  <div className="customer-ranking-title-icon"><Users size={16} /></div>
                  
                  <h3>Most Frequent Customers</h3>
                </div>

                <div className="customer-ranking-list">
                  {[...customers]
                    .sort((a, b) => (b.timesServed || 0) - (a.timesServed || 0))
                    .slice(0, 5)
                    .map((customer, index) => (
                      <div className="customer-ranking-item" key={customer._id}>
                        <span className="customer-rank-number">
                          {index + 1}
                        </span>

                        <div className="customer-rank-info">
                          <h4>{customer.name}</h4>
                          <p>₹{customer.totalRevenue || 0}</p>
                        </div>

                        <strong>{customer.timesServed || 0} visits</strong>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;