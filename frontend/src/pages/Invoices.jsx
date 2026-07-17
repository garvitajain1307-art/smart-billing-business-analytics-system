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
    ChevronDown,Users,Calendar,Check, FileText, Download, Mail,TrendingUp,FileDown,MessageSquare,ReceiptText,CircleDollarSign,ShoppingCart ,ChartColumn, 
    Wallet
} from "lucide-react";
import "./Invoices.css";
import { useDispatch, useSelector } from "react-redux";
import {setInvoiceLoading,setInvoices,setSelectedInvoice,addInvoice,removeInvoiceFromState,setInvoiceError,clearInvoiceError,clearInvoiceSuccess,clearSelectedInvoice,stopInvoiceLoading} from "../features/invoices/invoiceSlice";

const Invoices = () => {
  const [extended, setExtended] = useState(false);

  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [dateSort, setDateSort] = useState("newest");

  const [selectedTime, setSelectedTime] = useState("Newest First");
  // const [selectedStock, setSelectedStock] = useState("All Stock");
  const [timeOpen, setTimeOpen] = useState(false);
  // const [stockOpen, setStockOpen] = useState(false);
  // const [restockModalOpen, setRestockModalOpen] = useState(false);
  // const [restockModalData,setRestockModalData]=useState({
  //     quantity: "",
  //     productId: "",
  //     currentQuantity: "",
  // });

  const dispatch = useDispatch();
  const { invoices, selectedInvoice, loading, error, success } = useSelector(
    (state) => state.invoice,
  );
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    try {
      dispatch(setInvoiceLoading());

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/invoice/getAllInvoices`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!data.success) {
        dispatch(setInvoiceError(data.message));
        return;
      }
      console.log(data.invoices);
      dispatch(setInvoices(data.invoices));
    } catch (err) {
      dispatch(setInvoiceError(err.message));
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm("Delete this Invoice?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/invoice/deleteInvoice/${invoiceId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!data.success) {
        dispatch(setInvoiceError(data.message));
        return;
      }

      dispatch(removeInvoiceFromState(invoiceId));
    } catch (error) {
      dispatch(setInvoiceError(error.message));
    }
  };

  const filteredInvoices = invoices
    .filter((invoice) => {
      const invoiceText = invoiceSearch.trim().toLowerCase();
      const customerText = customerSearch.trim().toLowerCase();

      const matchesInvoice =
        invoiceText === "" ||
        (invoice.invoiceNo || "").toLowerCase().includes(invoiceText);

      const matchesCustomer =
        customerText === "" ||
        (invoice.customerDetails?.name || "")
          .toLowerCase()
          .includes(customerText);

      return matchesInvoice && matchesCustomer;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (dateSort === "newest") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });

  const totalRevenue = invoices.reduce((sum, invoice) => {
      return sum + (invoice.totalAmount || 0);
  }, 0);

  const today = new Date().toDateString();

  const todayRevenue = invoices.reduce((sum, invoice) => {
      const invoiceDate = new Date(invoice.createdAt).toDateString();

      if (invoiceDate === today) {
          return sum + (invoice.totalAmount || 0);
      }

      return sum;
  }, 0);

  const avgInvoiceValue =
      invoices.length > 0 ? Math.round(totalRevenue / invoices.length) : 0;

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
          </div>

          <div className="invoice-custom-select">
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
          </div>

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
                  <ReceiptText size={15} /> All generated bills
                </span>
              </div>
              <div className="invoice-insight-icon invoice-blue-icon">
                <Package size={24} />
              </div>
            </div>

            <div className="invoice-insight-card">
              <div>
                <p>Revenue Generated</p>
                <h2>₹{totalRevenue.toFixed(2)}</h2>
                <span className="invoice-green-text">
                  <CircleDollarSign size={15}/> Total paid revenue
                </span>
              </div>
              <div className="invoice-insight-icon invoice-green-icon">
                <Box size={24} />
              </div>
            </div>

            <div className="invoice-insight-card">
              <div>
                <p>Today's Revenue</p>
                <h2>₹{todayRevenue.toFixed(2)}</h2>
                <span className="invoice-red-text">
                  <ShoppingCart size={15}/> Today's sales
                </span>
              </div>
              <div className="invoice-insight-icon invoice-orange-icon">
                ₹
              </div>
            </div>

            <div className="invoice-insight-card">
              
              <div>
                <p>Avg Invoice Value</p>
                <h2>₹{avgInvoiceValue.toFixed(2)}</h2>
                <span className="invoice-red-text">
                  <ChartColumn size={15} /> Average bill size
                </span>
              </div>
              <div className="invoice-insight-icon invoice-red-icon">
                <Wallet size={24} />
              </div>
            </div>
          </div>
          <div className="invoice-main-layout">
            <div className="invoice-catalogue">
              <div className="invoice-catalogue-header">
                <div>
                  <h3>All Invoices</h3>
                  <p>
                    {filteredInvoices.length} of {invoices.length} invoices
                  </p>
                </div>
                {/* <button
                  className="invoice-live-sync-btn"
                  onClick={fetchInvoices} type="button"
                >
                  Live sync
                </button> */}
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
                          <td className="invoiceNo-data">
                            {invoice.invoiceNo}
                          </td>

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

                          <td className="invoicePayment-data">
                            {invoice.paymentMethod || "-"}
                          </td>

                          <td className="invoiceAmount-data">
                            ₹{invoice.totalAmount || 0}
                          </td>

                          <td>
                            <div className="invoice-action-icons">
                              <Eye
                                size={17}
                                className="eye-icon"
                                onClick={() =>
                                  dispatch(setSelectedInvoice(invoice))
                                }
                              />

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

                              <Trash2
                                className="delete-icon"
                                size={17}
                                onClick={() => {
                                  handleDeleteInvoice(invoice._id);
                                }}
                              />
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
            {/* <div className="invoice-recent-activity">
              <div className="activity-header">
                <div>
                  <div className="recent-activity-header">
                    <TrendingUp size={20} />
                    <h3>Recent Activity</h3>
                  </div>
                  <p>Latest invoice events</p>
                </div>
              </div>

              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon blue">
                    <FileText size={17} />
                  </div>
                  <div>
                    <h4>Invoice INV-2026-0142 generated</h4>
                    <p>Aarav Sharma • 2 min ago</p>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon cyan">
                    <Download size={17} />
                  </div>
                  <div>
                    <h4>PDF downloaded for INV-2026-0140</h4>
                    <p>Ramesh & Sons • 18 min ago</p>
                  </div>
                </div>

                <div className="activity-item">
                  <div className="activity-icon green">
                    <Mail size={17} />
                  </div>
                  <div>
                    <h4>Email sent for INV-2026-0138</h4>
                    <p>Vikram Joshi • 1 hr ago</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {selectedInvoice && (
        <div className="invoice-drawer-overlay">
          <div className="invoice-drawer">
            <button type="button"
              className="invoice-drawer-close"
              onClick={() => dispatch(clearSelectedInvoice())}
            >
              ×
            </button>

            <div className="invoice-drawer-header">
              <h2>{selectedInvoice.invoiceNo}</h2>

              <p>
                Issued on{" "}
                {selectedInvoice.createdAt
                  ? new Date(selectedInvoice.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )
                  : "-"}
              </p>

              {/* <span className="drawer-paid-badge">● Paid</span> */}
            </div>

            <p className="drawer-section-title">BILL TO</p>

            <div className="drawer-customer-card">
              <span className="drawer-customer-avatar">
                {selectedInvoice.customerDetails?.name
                  ?.split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "NA"}
              </span>

              <div>
                <h4>
                  {selectedInvoice.customerDetails?.name || "Walk-in Customer"}
                </h4>
                
                <p>{selectedInvoice.customerDetails?.phone || "No phone"}</p>
              </div>
            </div>

            <p className="drawer-section-title">ITEMS</p>

            <div className="drawer-items-box">
              <table className="drawer-items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedInvoice.items?.map((item) => (
                    <tr key={item.productId}>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.unitPrice}</td>
                      <td>₹{item.quantity * item.unitPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="drawer-total-card">
              <div>
                <span>Subtotal</span>
                <strong>₹{selectedInvoice.subTotal}</strong>
              </div>

              <div>
                <span>GST</span>
                <strong>₹{selectedInvoice.gstTotal}</strong>
              </div>

              <div>
                <span>Payment Method</span>
                <strong>{selectedInvoice.paymentMethod}</strong>
              </div>

              <div className="drawer-grand-total">
                <span>Grand Total</span>
                <strong>₹{selectedInvoice.totalAmount}</strong>
              </div>
            </div>

            <div className="invoice-drawer-actions">
              <div className="drawer-actions-one">
                <button type="button" onClick={() => {
                                  if (!selectedInvoice.pdfUrl) {
                                    alert(
                                      "PDF is not available for this invoice yet",
                                    );
                                    return;
                                  }

                                  window.open(selectedInvoice.pdfUrl, "_blank");
                }}><FileDown size={17} /><span>Download</span></button>
              </div>

              {/* <div className="drawer-actions-two">
                <button type="button"><MessageSquare size={17}/><span>Send SMS</span></button>
                
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;