
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
  Printer,ChevronDown,Check
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import "./Billing.css";
import {setProductLoading,setProducts,setCategories,setSelectedProduct,addProduct,addCategory,updateProduct,deleteProduct,setProductError,clearProductError,clearProductSuccess,clearSelectedProduct,setRestockError,clearRestockError,stopProductLoading} from "../features/product/productSlice"
import {setBillingLoading,addToCart,removeFromCart, increaseQuantity,decreaseQuantity,clearCart,setCustomer,clearCustomer,setPaymentMethod,setDiscount,setBillingError,clearBillingError} from "../features/billing/billingSlice"
const Billing = () => {
    const [extended, setExtended] = useState(false);
    const [search,setSearch]=useState("")
    const [selectedCategory, setSelectedCategory] = useState("All categories");
    const [selectedStock, setSelectedStock] = useState("All Stock");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const { products,categories,selectedProduct,cart,customer,paymentMethod,discount,loading,error} = useSelector((state) => state.product);
    const navigate=useNavigate();
    const dispatch=useDispatch();
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
                  dispatch(setProductError(data.message));
                  return;
              }
  
              dispatch(setProducts(data.products));
          } catch (err) {
              dispatch(setProductError(err.message));
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
              dispatch(setProductError(err.message));
          }
      };
      useEffect(() => {
          fetchProducts();
          fetchCategories();
      },[]);

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

  return (
    <div className="billing-layout">
      <Sidebar extended={extended} setExtended={setExtended} />

      <main className={`billing-main ${extended ? "sidebar-open" : "sidebar-closed"}`}>
        <header className="billing-header">
          <div>
            <h2>Billing / POS</h2>
            <p>21 Jun 2026 · INV-2024-0285</p>
          </div>

          <div className="billing-header-actions">
            <button><ReceiptText size={15} /> New Invoice</button>
            <button><Clock size={15} /> Recent Invoices</button>
            <button><TrendingUp size={15} /> Today's Sales</button>
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
              <input placeholder="Search name, code, or HSN..."  value={search} onChange={(e)=> setSearch(e.target.value)}/>
            </div>

    <div className="custom-dropdown-billing">
      
        <button className="dropdown-trigger-billing" onClick={()=>setCategoryOpen(!categoryOpen)}>
          {selectedCategory}
            <ChevronDown size={18} />
        </button>

       { categoryOpen &&(
        <div className="dropdown-menu-billing">
             
            <div className="dropdown-option-billing" onClick={() => {setSelectedCategory("All categories");setCategoryOpen(false)}}>
                All categories
                {selectedCategory==="All categories" && <Check size={17} />}
                </div>

                    {categories.map((category)=>(
                        <div className="dropdown-option-billing" key={category._id} onClick={() => {setSelectedCategory(category.name);setCategoryOpen(false)}}>
                            {category.name}
                            {selectedCategory===category.name && <Check size={17} />}
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
                   const status=getProductStatus(product.quantity)
                   return (
                     <>
                       <div className= {`product-card ${product.quantity === 0 ? "disabled" : ""}`} key={product._id}>
                         <h4>{product.name}</h4>
                         <p>
                           {product.code} · {product.category}
                         </p>
                         <div className="price-row">
                           <strong>{product.sellingPrice.toFixed(2)}</strong>
                           <span className="billing-gst-rate">GST {product.gstRate===0?"Exempt":`${product.gstRate}%`} </span>
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

                           <button disabled={product.quantity === 0}>
                             <Plus size={14} />
                             Add
                           </button>
                         </div>
                       </div>
                     </>
                   );
                
            })}

              {/* <div className="product-card">
                <h4>Sunflower Oil 5L</h4>
                <p>SFO-5L · Grocery</p>
                <div className="price-row">
                  <strong>₹685.00</strong>
                  <span>GST 5%</span>
                </div>
                <div className="stock-row">
                  <p className="low-stock">● Low (4)</p>
                  <button><Plus size={14} /> Add</button>
                </div>
              </div> */}

              {/* <div className="product-card">
                <h4>Tata Salt 1kg</h4>
                <p>TSALT-1 · Grocery</p>
                <div className="price-row">
                  <strong>₹28.00</strong>
                  <span>GST Exempt</span>
                </div>
                <div className="stock-row">
                  <p className="in-stock">● 87 in stock</p>
                  <button><Plus size={14} /> Add</button>
                </div>
              </div> */}

              {/* <div className="product-card">
                <h4>Colgate Toothpaste 200g</h4>
                <p>COL-200 · Personal Care</p>
                <div className="price-row">
                  <strong>₹120.00</strong>
                  <span>GST 12%</span>
                </div>
                <div className="stock-row">
                  <p className="low-stock">● Low (6)</p>
                  <button><Plus size={14} /> Add</button>
                </div>
              </div> */}

              {/* <div className="product-card">
                <h4>Dettol Soap 75g × 4</h4>
                <p>DET-75X4 · Personal Care</p>
                <div className="price-row">
                  <strong>₹140.00</strong>
                  <span>GST 12%</span>
                </div>
                <div className="stock-row">
                  <p className="in-stock">● 33 in stock</p>
                  <button><Plus size={14} /> Add</button>
                </div>
              </div> */}

              {/* <div className="product-card">
                <h4>Amul Butter 500g</h4>
                <p>AMB-500 · Dairy</p>
                <div className="price-row">
                  <strong>₹290.00</strong>
                  <span>GST 5%</span>
                </div>
                <div className="stock-row">
                  <p className="in-stock">● 12 in stock</p>
                  <button><Plus size={14} /> Add</button>
                </div>
              </div> */}

              {/* <div className="product-card disabled">
                <h4>Harpic Toilet Cleaner 1L</h4>
                <p>HAR-1L · Home Care</p>
                <div className="price-row">
                  <strong>₹158.00</strong>
                  <span>GST 18%</span>
                </div>
                <div className="stock-row">
                  <p className="out-stock">● Out of Stock</p>
                  <button disabled><Plus size={14} /> Add</button>
                </div>
              </div> */}
            </div>
          </div>

          <div className="bill-panel">
            <div className="customer-box">
              <h3><User size={16} /> CUSTOMER INFORMATION</h3>

              <div className="customer-inputs">
                <div>
                  <User size={16} />
                  <input placeholder="Customer name" />
                </div>

                <div>
                  <Phone size={16} />
                  <input placeholder="Phone number" />
                </div>

                <button className="search-btn">Search</button>
                <button className="new-btn"><UserPlus size={15} /> New</button>
              </div>

              <p className="customer-error">
                Customer not found. Add as a new customer or continue as walk-in.
              </p>
            </div>

            <div className="current-bill">
              <h3><ShoppingCart size={17} /> Current Bill</h3>

              <div className="empty-cart">
                <div className="cart-icon-box">
                  <ShoppingCart size={34} />
                </div>
                <h4>No products added yet</h4>
                <p>Search and add products from the left panel</p>
                <span>→ Click “Add” on any product to begin billing</span>
              </div>
            </div>
          </div>

          <aside className="summary-panel">
            <div className="bill-preview">
              <h4>BILL PREVIEW</h4>

              <div className="preview-stats">
                <div>
                  <h2>0</h2>
                  <p>Items</p>
                </div>
                <div>
                  <h2>0</h2>
                  <p>Qty</p>
                </div>
                <div>
                  <h2>₹0.00</h2>
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
                <strong>₹0.00</strong>
              </div>

              <div className="summary-row">
                <span>GST Total</span>
                <strong>₹0.00</strong>
              </div>

              <div className="discount-row">
                <span>Discount (₹)</span>
                <input value="0" readOnly />
              </div>

              <div className="grand-total">
                <span>Grand Total</span>
                <strong>₹0.00</strong>
              </div>
            </div>

            <div className="summary-card">
              <h3>PAYMENT METHOD</h3>

              <div className="payment-methods">
                <button className="active"><CreditCard size={17} /> Cash</button>
                <button><Smartphone size={17} /> UPI</button>
                <button><CreditCard size={17} /> Card</button>
              </div>
            </div>

            <div className="summary-card">
              <h3>INVOICE ACTIONS</h3>

              <button className="generate-btn" disabled>
                <ReceiptText size={16} /> Generate Invoice
              </button>

              <div className="action-row">
                <button><Save size={15} /> Save Draft</button>
                <button className="clear-btn"><RotateCcw size={15} /> Clear Cart</button>
              </div>

              <button className="print-btn">
                <Printer size={15} /> Print Preview
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default Billing;