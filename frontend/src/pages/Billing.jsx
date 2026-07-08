
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { NavLink,Navigate, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Phone,
  UserPlus,
  ShoppingCart,
  Plus,
  ReceiptText,
  Clock,
  TrendingUp,
  Bell,
  CreditCard,
  Smartphone,
  Save,
  RotateCcw,
  Printer,ChevronDown,Check,Trash2,Mail,Eye
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import "./Billing.css";
import {setProductLoading,setProducts,setCategories,setSelectedProduct,addProduct,addCategory,updateProduct,deleteProduct,setProductError,clearProductError,clearProductSuccess,clearSelectedProduct,setRestockError,clearRestockError,stopProductLoading} from "../features/product/productSlice"
import {setBillingLoading,addToCart,removeFromCart, increaseQuantity,decreaseQuantity,clearCart,setCustomer,clearCustomer,setPaymentMethod,setDiscount,setBillingError,clearBillingError,setGeneratedInvoice,clearGeneratedInvoice} from "../features/billing/billingSlice"
const Billing = () => {
    const [extended, setExtended] = useState(false);
    const [search,setSearch]=useState("")
    const [selectedCategory, setSelectedCategory] = useState("All categories");
    const [selectedStock, setSelectedStock] = useState("All Stock");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerSuggestions, setCustomerSuggestions]=useState([]);
    const [customerOpen, setCustomerOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [invoiceNo,setInvoiceNo]=useState("");
    
    
    const { products,categories,selectedProduct} = useSelector((state) => state.product);
    const {cart,customer,paymentMethod,discount,loading,error,generatedInvoice}=useSelector((state) => state.billing);
    
    const totalItems = cart.length;

    const totalQty = cart.reduce((total, item) => {
        return total + item.cartQuantity;
    }, 0);

    const grandTotal= cart.reduce((total, item) => {
        return total + item.sellingPrice * item.cartQuantity;
    }, 0);

    const gstTotal = cart.reduce((total, item) => {
        const lineTotal =item.sellingPrice * item.cartQuantity;
        const gst =(lineTotal * item.gstRate) /(100 + item.gstRate);
        return total + gst;

    }, 0);

    const subTotal = cart.reduce((total, item) => {
        const lineTotal =item.sellingPrice * item.cartQuantity;
        const taxable =(lineTotal * 100) /(100 + item.gstRate);
        return total + taxable;
    }, 0);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const fetchNextInvoiceNo=async (value)=>{
        try{
          

          const res = await fetch("http://localhost:4000/api/v1/invoice/getNextInvoiceNo",
            {
              credentials: "include",
            }
         );
         const data = await res.json();
          if (!data.success) {
              dispatch(setBillingError(data.message||"Failed to fetch Invoice No. "));
                return;
          }

          setInvoiceNo(data.invoiceNo);
        }catch(err){
          dispatch(setBillingError("Failed to fetch customer suggestions"));

        }
      }

    const fetchProducts = async () => {
          try {
              dispatch(setProductLoading());
  
              const res = await fetch(
                  "http://localhost:4000/api/v1/products/getAllProducts",
                  {
                      credentials: "include",
                  }
              );
  
              const data = await res.json();
  
              if (!data.success) {
                  dispatch(setBillingError(data.message));
                  return;
              }
  
              dispatch(setProducts(data.products));
          } catch (err) {
              dispatch(setBillingError(err.message));
          }
      };
      const fetchCategories = async () => {
          try {
              
  
              const res = await fetch(
                  "http://localhost:4000/api/v1/category/getAllCategories",
                  {
                      credentials: "include",
                  }
              );
              const data = await res.json();
              if (!data.success) {
                  dispatch(setProductError(data.message));
                  return;
              }
              dispatch(setCategories(data.categories));
          } catch (err) {
              dispatch(setBillingError(err.message));
          }
      };
      useEffect(() => {
        fetchNextInvoiceNo();
          fetchProducts();
          fetchCategories();
      },[]);

      const handleGenerateInvoice=async()=>{
        try{
          dispatch(setBillingLoading());
          const invoiceData={
            customerId:customer.customerId,
            customerName:customer.name,
            customerPhone:customer.phone,
            paymentMethod:paymentMethod,
            items:cart.map((item)=>({
              productId:item._id,
              quantity:item.cartQuantity
            }))
          };

          const res = await fetch("http://localhost:4000/api/v1/invoice/generateInvoice",{
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    } ,
            credentials: "include",
            body: JSON.stringify(invoiceData),
                  
            });
              const data = await res.json();
              if (!data.success) {
                  dispatch(setBillingError(data.message || data.errors?.[0] || "Failed to generate invoice"));
                  return;
              }
              console.log("Generated invoice:", data.invoice);
              dispatch(setGeneratedInvoice(data.invoice));
              window.open(
                `http://localhost:4000/api/v1/invoice/downloadInvoicePDF/${data.invoice._id}`,
                "_blank"
              );
              dispatch(clearCart());
              dispatch(clearCustomer());
              fetchProducts();
              fetchNextInvoiceNo();
              dispatch(setPaymentMethod("Cash"));
              

              
        }catch(err){
          dispatch(setBillingError("Something went wrong while generating invoice"));

        }

      }
      
      const filteredProducts = products.filter((product) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        search.trim() === "" ||
        (product.name || "").toLowerCase().includes(searchText) ||
        (product.productCode || "").toLowerCase().includes(searchText) ||
        (product.hsnCode || "").toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "All categories" ||
        product.categoryId?.name === selectedCategory;

        
    return matchesSearch && matchesCategory  ;
   });
   const getProductStatus=(quantity)=>{
      if(quantity==0){
        
        return{
          label:"Out of Stock",
          className:"out-stock-billing"
        }
      }else if(quantity<=10){
        
        
        return{
          label:"Low Stock",
          className:"low-stock-billing"
        }
      }else{
        
    
        return{
          label:"In Stock",
          className:"in-stock-billing"
        }
      }
    }

    
    const fetchCustomerSuggestions=async (value)=>{
        try{
          if(!value.trim()){
            setCustomerSuggestions([]);
            
            setCustomerOpen(false);
            
            // setAddProductData(prev => ({
            //   ...prev,
            //   hsnCode: "",
            //   gstRate: "",
            // }));
            return;
          }

          const res = await fetch(
            
            `http://localhost:4000/api/v1/customer/searchCustomer?query=${value}`,
            {
              credentials: "include",
            }
         );
         const data = await res.json();
          if (!data.success) {
              dispatch(setBillingError(data.message||"Failed to search Customer"));
                return;
          }
          setCustomerSuggestions(data.customerList || []);
          setCustomerOpen((data.customerList || []).length > 0);
          

        }catch(err){
          dispatch(setBillingError("Failed to fetch customer suggestions"));

        }
      }

   const inStock=products.filter((product)=>{
      return getProductStatus(product.quantity).label==="In Stock"
    });
    const inStockTotal=inStock.length;

    const outOfStock=products.filter((product)=>{
      return getProductStatus(product.quantity).label==="Out of Stock"
    });
    const outOfStockTotal=outOfStock.length;

    const lowStock=products.filter((product)=>{
      return getProductStatus(product.quantity).label==="Low Stock"
    });
    const lowStockTotal=lowStock.length;

    const today=new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
    });

  return (
    <div className="billing-layout">
      <Sidebar extended={extended} setExtended={setExtended} />

      <main
        className={`billing-main ${extended ? "sidebar-open" : "sidebar-closed"}`}
      >
        <header className="billing-header">
          <div className="invoice-details">
            <h2>Billing / POS</h2>
            <p>
              {today} <span className="separator">·</span> {invoiceNo}
            </p>
          </div>

          <div className="billing-header-actions">
            <button
              type="button"
              onClick={() => {
                dispatch(clearCart());
                dispatch(clearCustomer());
                dispatch(clearBillingError());
                dispatch(clearGeneratedInvoice());
                dispatch(setPaymentMethod("Cash")); 
              }}
            >
              <ReceiptText size={15} /> New Invoice
            </button>

            <NavLink to="/invoices">
              <button type="button">
                <Clock size={15} /> Recent Invoices
              </button>
            </NavLink>

            <button type="button">
              <TrendingUp size={15} /> Today's Sales
            </button>
            <Bell size={20} className="bell-icon" />
          </div>
        </header>

        <section className="billing-content">
          <div className="products-panel">
            <div className="panel-title">
              <h3>Products</h3>
              <span>{filteredProducts.length}</span>
            </div>

            <div className="product-search">
              <Search size={17} />
              <input
                placeholder="Search name, code, or HSN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="custom-dropdown-billing">
              <button
                className="dropdown-trigger-billing"
                onClick={() => setCategoryOpen(!categoryOpen)}
              >
                {selectedCategory}
                <ChevronDown size={18} />
              </button>

              {categoryOpen && (
                <div className="dropdown-menu-billing">
                  <div
                    className="dropdown-option-billing"
                    onClick={() => {
                      setSelectedCategory("All categories");
                      setCategoryOpen(false);
                    }}
                  >
                    All categories
                    {selectedCategory === "All categories" && (
                      <Check size={17} />
                    )}
                  </div>

                  {categories.map((category) => (
                    <div
                      className="dropdown-option-billing"
                      key={category._id}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setCategoryOpen(false);
                      }}
                    >
                      {category.name}
                      {selectedCategory === category.name && (
                        <Check size={17} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* <div className="category-tabs">
              <button className="active">All</button>
              <button>FMCG</button>
              <button>Grocery</button>
              <button>Personal Care</button>
              <button>Home Care</button>
              <button>Dairy</button>
              <button>Beverages</button>
            </div> */}

            <div className="product-grid">
              {filteredProducts.map((product) => {
                const status = getProductStatus(product.quantity);
                return (
                  <>
                    <div
                      className={`product-card ${product.quantity === 0 ? "disabled" : ""}`}
                      key={product._id}
                    >
                      <h4>{product.name}</h4>
                      <p>
                        {product.code} · {product.category}
                      </p>
                      <div className="price-row">
                        <strong>{product.sellingPrice.toFixed(2)}</strong>
                        <span className="billing-gst-rate">
                          GST{" "}
                          {product.gstRate === 0
                            ? "Exempt"
                            : `${product.gstRate}%`}{" "}
                        </span>
                      </div>
                      <div className="stock-row">
                        <div className="stock-left">
                          <p className={`status ${status.className}`}>
                            {product.quantity}
                          </p>

                          <p className={`status ${status.className}`}>
                            {status.label}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={product.quantity === 0}
                          onClick={() => dispatch(addToCart(product))}
                        >
                          <Plus size={14} />
                          Add
                        </button>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>

          <div className="bill-panel">
            <div className="customer-box">
              <h3>
                <User size={16} /> CUSTOMER INFORMATION
              </h3>

              <div className="customer-inputs">
                <div className="customer-name-field">
                  <User size={16} />
                  <input
                    placeholder="Name"
                    value={customer?.name || ""}
                    onChange={(e) =>
                      dispatch(
                        setCustomer({
                          ...customer,
                          name: e.target.value,
                          customerId: null,
                        }),
                      )
                    }
                  />
                </div>

                <div className="customer-field">
                  <div className="customer-input-wrapper">
                    <Phone size={16} />
                    <input
                      placeholder="Phone"
                      value={customer?.phone || ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        dispatch(
                          setCustomer({
                            ...customer,
                            phone: value,
                            customerId: null,
                          }),
                        );

                        fetchCustomerSuggestions(value);
                      }}
                    />
                  </div>
                  {customerOpen && customerSuggestions.length > 0 && (
                    <div className="customer-suggestions">
                      {customerSuggestions.map((person) => (
                        <div
                          key={person._id}
                          className="customer-suggestion-item"
                          onClick={() => {
                            dispatch(
                              setCustomer({
                                customerId: person._id,
                                name: person.name,
                                phone: person.phone,
                              }),
                            );
                            setSelectedCustomer(person);

                            setCustomerOpen(false);
                            setCustomerSuggestions([]);
                          }}
                        >
                          <div className="customer-info">
                            <strong>{person.name}</strong>
                            <p>{person.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* <button className="search-btn">Search</button>
                <button className="new-btn">
                  <UserPlus size={15} /> New
                </button> */}
              </div>

              {/* <p className="customer-error">
                Customer not found. Add as a new customer or continue as
                walk-in.
              </p> */}
            </div>

            <div className="current-bill">
              <h3>
                <ShoppingCart size={17} /> Current Bill
              </h3>

              {cart.length === 0 ? (
                <div className="empty-cart">
                  <div className="cart-icon-box">
                    <ShoppingCart size={34} />
                  </div>

                  <h4>No products added yet</h4>

                  <p>Search and add products from the left panel</p>

                  <span>→ Click "Add" on any product to begin billing</span>
                </div>
              ) : (
                <div className="bill-items-table">
                  <div className="bill-table-header">
                    <span>PRODUCT</span>
                    <span>QTY</span>
                    <span>UNIT PRICE</span>
                    <span>GST %</span>
                    <span>GST AMT</span>
                    <span>LINE TOTAL</span>
                  </div>
                  {error && <div className="sticky-error">{error}</div>}
                  {cart.map((item) => (
                    <div className="bill-item-row" key={item._id}>
                      <div className="bill-product-info">
                        {/* <div className="bill-product-icon">🥛</div> */}

                        <div>
                          <h4>{item.name}</h4>
                          <p>
                            {item.manufacturer}-{item.productCode}
                          </p>
                        </div>
                      </div>

                      <div className="bill-qty-box">
                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              dispatch(decreaseQuantity(item._id));
                            }}
                          >
                            -
                          </button>
                          <strong>{item.cartQuantity}</strong>
                          <button
                            type="button"
                            onClick={() => {
                              dispatch(increaseQuantity(item._id));
                            }}
                          >
                            +
                          </button>
                        </div>

                        <p>{item.quantity - item.cartQuantity}</p>
                      </div>

                      <strong className="bill-price">
                        {item.sellingPrice}
                      </strong>

                      <span className="gst-badge">{item.gstRate}</span>

                      <span className="gst-amount">
                        ₹
                        {(
                          (item.sellingPrice *
                            item.cartQuantity *
                            item.gstRate) /
                          (100 + item.gstRate)
                        ).toFixed(2)}
                      </span>

                      <strong className="line-total">
                        ₹{(item.sellingPrice * item.cartQuantity).toFixed(2)}
                      </strong>
                      <span className="delete-item">
                        <Trash2
                          size={11}
                          onClick={() => {
                            dispatch(removeFromCart(item._id));
                          }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="summary-panel">
            <div className="bill-preview">
              <h4>BILL PREVIEW</h4>

              <div className="preview-stats">
                <div>
                  <h2>{totalItems}</h2>
                  <p>Items</p>
                </div>
                <div>
                  <h2>{totalQty}</h2>
                  <p>Qty</p>
                </div>
                <div>
                  <h2>₹{grandTotal.toFixed(2)}</h2>
                  <p>Total</p>
                </div>
              </div>

              <div className="preview-footer">
                <span>INV-2024-0285</span>
                <span>21 Jun 2026</span>
              </div>
            </div>

            <div className="summary-card">
              <h3>Bill Summary</h3>

              <div className="summary-row">
                <span>Subtotal (excl. GST)</span>
                <strong>₹{subTotal.toFixed(2)}</strong>
              </div>

              <div className="summary-row">
                <span>GST Total</span>
                <strong>₹{gstTotal.toFixed(2)}</strong>
              </div>

              {/* <div className="discount-row">
                <span>Discount (₹)</span>
                <input value="0" readOnly />
              </div> */}

              <div className="grand-total">
                <span>Grand Total</span>
                <strong>{grandTotal.toFixed(2)}</strong>
              </div>
            </div>

            <div className="summary-card">
              <h3>PAYMENT METHOD</h3>

              <div className="payment-methods">
                <button
                  className={paymentMethod === "Cash" ? "active" : ""}
                  onClick={() => {
                    dispatch(setPaymentMethod("Cash"));
                  }}
                >
                  <CreditCard size={17} /> Cash
                </button>
                <button
                  className={paymentMethod === "UPI" ? "active" : ""}
                  onClick={() => {
                    dispatch(setPaymentMethod("UPI"));
                  }}
                >
                  <Smartphone size={17} /> UPI
                </button>
                <button
                  className={paymentMethod === "Card" ? "active" : ""}
                  onClick={() => {
                    dispatch(setPaymentMethod("Card"));
                  }}
                >
                  <CreditCard size={17} /> Card
                </button>
              </div>
            </div>

            <div className="summary-card">
              <h3>INVOICE ACTIONS</h3>

              <button
                className={`generate-btn ${cart.length === 0 ? "disabled-invoice" : ""}`}
                disabled={cart.length === 0}
                onClick={handleGenerateInvoice}
              >
                <ReceiptText size={16} /> Generate Invoice
              </button>

              <div
                className={`action-row ${cart.length === 0 ? "disabled-invoice" : ""}`}
                disabled={cart.length === 0}
              >
                {/* <button className={`mail-btn ${generatedInvoice === null ? "disabled-invoice" : ""}`}
                disabled={generatedInvoice === null} >
                  <Mail  size={16} /> <span>Email</span>
                </button> */}
                <button
                  className={`clear-btn ${cart.length === 0 ? "disabled-invoice" : ""}`}
                  onClick={() => dispatch(clearCart())}
                  disabled={cart.length === 0}
                >
                  <RotateCcw size={15} /> Clear Cart
                </button>
              </div>
              <div></div>
              <button className="print-btn">
                <Eye size={15} /> <span>View all Invoices</span>
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default Billing;