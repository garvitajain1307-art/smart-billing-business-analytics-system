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
    ChevronDown,Users,Calendar
} from "lucide-react";
import "./Invoices.css";
import { useDispatch, useSelector } from "react-redux";
import {
    setInvoiceLoading,
    setInvoices,
    setSelectedInvoice,
    deleteInvoice,
    setInvoiceError,
} from "../features/invoices/invoiceSlice";

const Invoices = () => {
    const [extended, setExtended] = useState(false);
    
    const [invoiceSearch, setInvoiceSearch] = useState("");
    const [customerSearch, setCustomerSearch] = useState("");
    const [dateSort, setDateSort] = useState("newest");

    // const [selectedCategory, setSelectedCategory] = useState("All categories");
    // const [selectedStock, setSelectedStock] = useState("All Stock");
    // const [categoryOpen, setCategoryOpen] = useState(false);
    // const [stockOpen, setStockOpen] = useState(false);
    // const [restockModalOpen, setRestockModalOpen] = useState(false);
    // const [restockModalData,setRestockModalData]=useState({
    //     quantity: "",
    //     productId: "",
    //     currentQuantity: "",
    // });

    const dispatch = useDispatch();
    const { invoices, selectedInvoice, loading, error, success } = useSelector((state) => state.invoice);
    const navigate = useNavigate();

    const fetchInvoices = async () => {
        try {
            dispatch(setInvoiceLoading());

            const res = await fetch(
                "http://localhost:4000/api/v1/invoice/getAllInvoices",
                {
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!data.success) {
                dispatch(setInvoiceError(data.message));
                return;
            }

            dispatch(setInvoices(data.invoices));
        } catch (err) {
            dispatch(setInvoiceError(err.message));
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const filteredInvoices = invoices.filter((invoice) => {
        const invoiceText = invoiceSearch.trim().toLowerCase();
        const customerText = customerSearch.trim().toLowerCase();

        const matchesInvoice =
            invoiceText === "" ||
            (invoice.invoiceNo || "").toLowerCase().includes(invoiceText);

        const matchesCustomer =
            customerText === "" ||
            (invoice.customerDetails?.name || "").toLowerCase().includes(customerText);

        return matchesInvoice && matchesCustomer;
    }).sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        if (dateSort === "newest") {
            return dateB - dateA;
        }

        return dateA - dateB;
    });

    // const totalRevenue = invoices.reduce((sum, invoice) => {
    //     return sum + (invoice.totalAmount || 0);
    // }, 0);

    // const today = new Date().toDateString();

    // const todayRevenue = invoices.reduce((sum, invoice) => {
    //     const invoiceDate = new Date(invoice.createdAt).toDateString();

    //     if (invoiceDate === today) {
    //         return sum + (invoice.totalAmount || 0);
    //     }

    //     return sum;
    // }, 0);

    // const avgInvoiceValue =
    //     invoices.length > 0 ? Math.round(totalRevenue / invoices.length) : 0;

    return (
      <div className={`invoices-page ${extended ? "extended" : ""}`}>
        <Sidebar extended={extended} setExtended={setExtended} />

        <div className="invoices-content">
          <div className="invoices-navbar">
            <div className="invoice-top-filters">
              <div className="invoice-filter-search">
                <Search size={19} className="invoice-filter-icon" />
                <input
                  type="text"
                  className="invoiceNo-search-input"
                  placeholder="Search invoice number..."
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                />
              </div>

              <div className="invoice-filter-search">
                <Users size={19} className="invoice-filter-icon" />
                <input
                  type="text"
                  placeholder="Search customer name..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
              </div>

              <div className="invoice-date-sort">
                <Calendar size={19} className="invoice-filter-icon" />
                <select
                  value={dateSort}
                  onChange={(e) => setDateSort(e.target.value)}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
                <ChevronDown size={18} className="invoice-select-arrow" />
              </div>
            </div>

            {/* <div className="invoice-custom-dropdown">
                        <button className="invoice-dropdown-trigger">
                            <ChevronDown size={18} />
                        </button> */}

            {/* { categoryOpen &&(
                        <div className="dropdown-menu">
                             
                                <div className="dropdown-option" onClick={() => {setSelectedCategory("All categories");setCategoryOpen(false)}}>
                                  All categories
                                  {selectedCategory==="All categories" && <Check size={17} />}
                                </div>

                                {categories.map((category)=>(
                                  <div className="dropdown-option" key={category._id} onClick={() => {setSelectedCategory(category.name);setCategoryOpen(false)}}>
                                     {category.name}
                                  {selectedCategory===category.name && <Check size={17} />}
                                  </div>
                                ))}
                            
                            
                        </div>
                      )}
                        */}
            {/* </div> */}

            {/* <div className="custom-dropdown">
                    <button
                        className="dropdown-trigger"
                        onClick={() => setStockOpen(!stockOpen)}
                    >
                        {selectedStock}
                        <ChevronDown size={18} />
                    </button>

                    {stockOpen && (
                        <div className="dropdown-menu">
                            <div
                                className="dropdown-option"
                                onClick={() => {
                                    setSelectedStock("All Stock");
                                    setStockOpen(false);
                                }}
                            >
                                All Stock
                                {selectedStock === "All Stock" && <Check size={17} />}
                            </div>

                            <div
                                className="dropdown-option"
                                onClick={() => {
                                    setSelectedStock("In Stock");
                                    setStockOpen(false);
                                }}
                            >
                                In Stock
                                {selectedStock === "In Stock" && <Check size={17} />}
                            </div>

                            <div
                                className="dropdown-option"
                                onClick={() => {
                                    setSelectedStock("Low Stock");
                                    setStockOpen(false);
                                }}
                            >
                                Low Stock
                                {selectedStock === "Low Stock" && <Check size={17} />}
                            </div>

                            <div
                                className="dropdown-option"
                                onClick={() => {
                                    setSelectedStock("Out of Stock");
                                    setStockOpen(false);
                                }}
                            >
                                Out of Stock
                                {selectedStock === "Out of Stock" && <Check size={17} />}
                            </div>
                        </div>
                    )}
                  </div> */}

            <NavLink to="/billing">
              <button className="new-invoice-btn">
                <Plus size={20} />
                New Invoice
              </button>
            </NavLink>
          </div>

          <div className="invoices-area">
            <div className="invoices-header">
              {/* <p className="section-label">Invoices</p> */}
              <h1>Invoices</h1>
              <p className="invoices-section-desc">
                Manage, send and track every bill from one place
              </p>
            </div>

            <div className="invoice-insights">
              <div className="invoice-insight-card">
                <div>
                  <p>Total Invoices</p>
                  <h2>{invoices.length}</h2>
                  <span className="invoice-green-text">
                    <ArrowUpRight size={15} /> All generated bills
                  </span>
                </div>
                <div className="invoice-insight-icon invoice-blue-icon">
                  <Package size={24} />
                </div>
              </div>

              <div className="invoice-insight-card">
                <div>
                  <p>Revenue Generated</p>
                  <h2>₹1000</h2>
                  <span className="invoice-green-text">
                    <ArrowUpRight size={15} /> Total paid revenue
                  </span>
                </div>
                <div className="invoice-insight-icon invoice-green-icon">
                  <Box size={24} />
                </div>
              </div>

              <div className="invoice-insight-card">
                <div>
                  <p>Today's Revenue</p>
                  <h2>₹5000</h2>
                  <span className="invoice-red-text">
                    <ArrowDownRight size={15} /> Today's sales
                  </span>
                </div>
                <div className="invoice-insight-icon invoice-orange-icon">
                  <AlertTriangle size={24} />
                </div>
              </div>

              <div className="invoice-insight-card">
                <div>
                  <p>Avg Invoice Value</p>
                  <h2>₹9000</h2>
                  <span className="invoice-red-text">
                    <ArrowDownRight size={15} /> Average bill size
                  </span>
                </div>
                <div className="invoice-insight-icon invoice-red-icon">
                  <PackageX size={24} />
                </div>
              </div>
            </div>

            <div className="invoice-catalogue">
              <div className="invoice-catalogue-header">
                <div>
                  <h3>All Invoices</h3>
                  <p>
                    {filteredInvoices.length} of {invoices.length} invoices
                  </p>
                </div>
                <button
                  className="invoice-live-sync-btn"
                  onClick={fetchInvoices}
                >
                  Live sync
                </button>
              </div>

              <div className="invoice-table-wrapper">
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Payment</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredInvoices.map((invoice) => {
                      return (
                        <tr key={invoice._id}>
                          <td className="invoiceNo-data">{invoice.invoiceNo}</td>

                          <td>
                            <div className="invoice-customer-info">
                              <span className="invoice-customer-avatar">
                                {invoice.customerDetails?.name
                                  ?.split(" ")
                                  .map((word) => word[0])
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase() || "NA"}
                              </span>
                              <div>
                                <h4>
                                  {invoice.customerDetails?.name?.toUpperCase() ||
                                    "WALK-IN CUSTOMER"}
                                </h4>
                                <p>
                                  {invoice.customerDetails?.phone || "No phone"}
                                </p>
                              </div>
                            </div>
                          </td>

                          

                          <td className="invoiceDate-data">
                            {invoice.createdAt
                              ? new Date(invoice.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "-"}
                          </td>

                          <td className="invoicePayment-data">{invoice.paymentMethod || "-"}</td>

                          <td className="invoiceAmount-data">₹{invoice.totalAmount || 0}</td>

                          <td>
                            <div className="invoice-action-icons">
                              <Eye
                                size={17}
                                onClick={() =>
                                  dispatch(setSelectedInvoice(invoice))
                                }
                              />
                              <Pencil size={17} />
                              <RefreshCw size={17} />
                              <Trash2 size={17} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredInvoices.length === 0 && (
                  <div className="invoice-empty-state">No invoices found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Invoices;