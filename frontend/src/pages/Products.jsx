import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { NavLink,Navigate, useNavigate } from "react-router-dom";
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
    CalendarClock,
    TrendingUp,
    TrendingDown,
    ChevronDown,
    Check,Dot,RefreshCcw,
    X
} from "lucide-react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import {setProductLoading,setProducts,setCategories,setSelectedProduct,addProduct,addCategory,updateProduct,deleteProduct,setProductError,clearProductError,clearProductSuccess,clearSelectedProduct,setRestockError,clearRestockError,stopProductLoading} from "../features/product/productSlice"

const Products = () => {
    const [extended, setExtended] = useState(false);
    const [search,setSearch]=useState("");
    const [selectedCategory, setSelectedCategory] = useState("All categories");
    const [selectedStock, setSelectedStock] = useState("All Stock");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [stockOpen, setStockOpen] = useState(false);
    const [restockModalOpen, setRestockModalOpen] = useState(false);
    const [restockModalData,setRestockModalData]=useState({
        quantity: "",
        productId: "",
        currentQuantity: "",
    });
    const dispatch=useDispatch();
    const { products, loading, error,categories,selectedProduct,restockError } = useSelector((state) => state.product);
    const navigate=useNavigate();
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

    const getProductStatus=(quantity)=>{
      if(quantity==0){
        
        return{
          label:"Out of Stock",
          className:"out-stock"
        }
      }else if(quantity<=10){
        
        
        return{
          label:"Low Stock",
          className:"low-stock"
        }
      }else{
        
    
        return{
          label:"In Stock",
          className:"in-stock"
        }
      }
    }

    let today=new Date();
    today.setHours(0,0,0,0);
    const expirySoonProducts=products.filter((product)=>{
        if (!product.expiry) return false;
        
        
        const target=new Date(product.expiry);
        target.setHours(0,0,0,0);

        const diffMs=target.getTime() - today.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        return diffDays >= 0 && diffDays <= 120;
      })

      const handleRestockModalChange = (e) => {
                dispatch(clearRestockError());
                setRestockModalData({ ...restockModalData, [e.target.name]: e.target.value });
      };
      const handleRestockModalSubmit = async(e) => {
          e.preventDefault();
          if (!restockModalData.quantity) {
              dispatch(setRestockError("Restock quantity is required"));
              return;
          }
            try {
                
                dispatch(setProductLoading());
          
                  const res = await fetch(`http://localhost:4000/api/v1/products/restockProduct/${restockModalData.productId}`, {
                      method: "PUT",
                      headers: {
                          "Content-Type": "application/json"
                      },
                      credentials: "include",
                      body: JSON.stringify({quantity: restockModalData.quantity}),
                  });
          
                  let data = {};
      
                  try {
                    data = await res.json();
                    
                  } catch (err) {
                      data = {};
                  }
          
                  if (!res.ok || !data.success) {
                    dispatch(
                    setRestockError(
                          data.message ||
                        data.error ||
                          data.errors?.[0]?.message ||
                       data.errors?.[0] ||
                        "Failed to restock product"
                      )
                    );
                   return;
                }
      
      
                
                dispatch(updateProduct(data.product));
                
                
                dispatch(clearRestockError());
      
                setRestockModalData({
                  quantity:"",
                   productId: "",
                   currentQuantity: "",
                });
                setRestockModalOpen(false);
                
                  
                
              } catch (error) {
                  console.log(error);
          dispatch(setRestockError(error.message));
              } finally{
                dispatch(stopProductLoading());
      
              }
        };
      
      const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            

            const res = await fetch(
                `http://localhost:4000/api/v1/products/deleteProduct/${productId}`,
                {
                  method: "DELETE",
                  credentials: "include",
                }
            );
            const data = await res.json();
            if (!data.success) {
                dispatch(setProductError(data.message));
                return;
            }
            dispatch(deleteProduct(productId));
            // dispatch(clearProductError());
        } catch (err) {
            dispatch(setProductError(err.message));
        }
    };

      
      
    
    
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

        const status=getProductStatus(product.quantity)
      const matchesStock=
        selectedStock=== "All Stock" ||
        status.label===selectedStock
    return matchesSearch && matchesCategory && matchesStock ;
   });

    

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
      <div className={`products-page ${extended ? "extended" : ""}`}>
        <Sidebar extended={extended} setExtended={setExtended} />

        <div className="products-content">
          <div className="products-navbar">
    <div className="searchProducts">
        <Search size={20} className="search-icon" />
        <input type="text" placeholder="Search by product name, code or HSN..." value={search} onChange={(e)=> setSearch(e.target.value)}/>
    </div>

    <div className="custom-dropdown">
      
        <button className="dropdown-trigger" onClick={()=>setCategoryOpen(!categoryOpen)}>
          {selectedCategory}
            <ChevronDown size={18} />
        </button>

       { categoryOpen &&(
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
       
    </div>
    

    <div className="custom-dropdown">
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
  </div>
     <NavLink to="/products/add-product" >
        <button className="add-product-btn">
           <Plus size={20} />
           Add Product
        </button>
    </NavLink>

    
</div>

          <div className="inventory-area">
            <div className="inventory-header">
              <p className="section-label">INVENTORY</p>
              <h1>Products</h1>
              <p className="section-desc">
                Manage stock, pricing, GST and performance across your
                catalogue.
              </p>
            </div>

            <div className="products-insights">
              <div className="insight-card">
                <div>
                  <p>Total Products</p>
                  <h2>{products.length}</h2>
                  <span className="green-text">
                    <ArrowUpRight size={15} /> +8 this month
                  </span>
                </div>
                <div className="insight-icon blue-icon">
                  <Package size={24} />
                </div>
              </div>

              <div className="insight-card">
                <div>
                  <p>In Stock</p>
                  <h2>{inStockTotal}</h2>
                  <span className="green-text">
                    <ArrowUpRight size={15} /> Healthy levels
                  </span>
                </div>
                <div className="insight-icon green-icon">
                  <Box size={24} />
                </div>
              </div>

              <div className="insight-card">
                <div>
                  <p>Low Stock</p>
                  <h2>{lowStockTotal}</h2>
                  <span className="red-text">
                    <ArrowDownRight size={15} /> Needs attention
                  </span>
                </div>
                <div className="insight-icon orange-icon">
                  <AlertTriangle size={24} />
                </div>
              </div>

              <div className="insight-card">
                <div>
                  <p>Out of Stock</p>
                  <h2>{outOfStockTotal}</h2>
                  <span className="red-text">
                    <ArrowDownRight size={15} /> Restock now
                  </span>
                </div>
                <div className="insight-icon red-icon">
                  <PackageX size={24} />
                </div>
              </div>
            </div>

            <div className="products-catalogue">
              <div className="catalogue-header">
                <div>
                  <h3>Product catalogue</h3>
                  <p>{filteredProducts.length} of {products.length} products</p>
                </div>
                <button className="live-sync-btn">Live sync</button>
              </div>
              <div className="products-table-wrapper">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Code</th>
                      <th>Category</th>
                      <th>HSN</th>
                      <th>Selling</th>
                      <th>Purchase</th>
                      <th>Stock</th>
                      <th>GST</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product)=>{
                      const status = getProductStatus(product.quantity);
                     return( 
                      <tr key={product._id}>
                        
                      <td>
                        <div className="product-info">
                          <span className="product-avatar">{product.name?.split(" ").map((word)=>word[0]).slice(0,2).join("").toUpperCase()}</span>
                          <div>
                            <h4>{product.name?.toUpperCase()}</h4>
                            <p>{product.manufacturer || "No manufacturer"}</p>
                          </div>
                        </div>
                      </td>
                      <td>{product.productCode}</td>
                      <td>
                        <span className="category-pill">{product.categoryId?.name || "Uncategorized"}</span>
                      </td>
                      <td>{product.hsnCode || "-"}</td>
                      <td>₹{product.sellingPrice}</td>
                      <td>₹{product.purchasePrice}</td>
                      <td>{product.quantity}</td>
                      <td>{product.gstRate}%</td>
                      <td>
                        
                    <span className={`status ${status.className}`}><Dot size={30}/>{status.label}</span>
                      </td>
                      <td>
                        <div className="action-icons">
                          <Eye size={17} onClick={()=>dispatch(setSelectedProduct(product))}/>
                          <Pencil size={17} onClick={()=>navigate(`/products/edit-product/${product._id}`)}/>
                          <RefreshCw size={17} />
                          <Trash2 size={17} onClick={() => handleDeleteProduct(product._id)} />
                        </div>
                      </td>
                    </tr>

                    )})}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="products-alerts">
              <h3>Inventory alerts</h3>
              <p>Items that need your attention this week.</p>

              <div className="alerts-card">
                <div className="alert-box low-alert-box">
                  <div className="alert-box-header">
                    <div className="alert-left">
                      <div className="alert-icon orange-icon">
                        <AlertTriangle size={22} />
                      </div>
                      <div>
                        <h4>Low Stock</h4>
                        <p>Stock below threshold</p>
                      </div>
                    </div>
                    <h2>{lowStockTotal}</h2>
                  </div>

                  <div className="alert-list">
                   {lowStock.map((product)=>{
                    return(
                    
                    <div className="alert-item" key={product._id}>
                      <div>
                        <h5>{product.name}</h5>
                        <p>{product.unit} {product.unitType}   ·   {product.quantity} left</p>
                      </div>
                      <div className="alert-actions">
                        <button onClick={()=>navigate(`/products/edit-product/${product._id}`)}>Edit</button>
                        <button onClick={() => {
                          setRestockModalData({
                          quantity: "",
                          productId: product._id,
                          currentQuantity: product.quantity,
                        });
                        setRestockModalOpen(true)}}>Restock</button>
                      </div>
                    </div>
                    )
                   })}

                   
                    
                  </div>
                </div>

                <div className="alert-box out-alert-box">
                  <div className="alert-box-header">
                    <div className="alert-left">
                      <div className="alert-icon red-icon">
                        <PackageX size={22} />
                      </div>
                      <div>
                        <h4>Out of Stock</h4>
                        <p>Sold out — restock urgently</p>
                      </div>
                    </div>
                    <h2>{outOfStockTotal}</h2>
                  </div>

                  <div className="alert-list">
                    {outOfStock.map((product)=>{
                      return(
                        <div className="alert-item">
                      <div>
                        <h5>{product.name}</h5>
                        <p>{product.unit} {product.unitType}</p>
                      </div>
                      <div className="alert-actions">
                        <button onClick={()=>navigate(`/products/edit-product/${product._id}`)}>Edit</button>
                        <button onClick={() => {
                          setRestockModalData({
                          quantity: "",
                          productId: product._id,
                          currentQuantity: product.quantity,
                        });
                        setRestockModalOpen(true)}}>Restock</button>
                      </div>
                    </div>
                        
                      ) 
                    })}
                    
                  </div>
                </div>

                <div className="alert-box expiring-alert-box">
                  <div className="alert-box-header">
                    <div className="alert-left">
                      <div className="alert-icon blue-icon">
                        <CalendarClock size={22} />
                      </div>
                      <div>
                        <h4>Expiring Soon</h4>
                        <p>Within next 120 days</p>
                      </div>
                    </div>
                    <h2>{expirySoonProducts.length}</h2>
                  </div>

                  <div className="alert-list">
                    {expirySoonProducts.map((product)=>{

                      return(
                      <>
                      <div className="alert-item">
                      <div>
                        <h5>{product.name}</h5>
                        <p>{product.quantity} left · {product.productCode}</p>
                        <p className="product-expiry-date">Expires on{" "}
                        {new Date(product.expiry).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })} </p>
                      </div>
                      <div className="alert-actions">
                        <button onClick={()=>navigate(`/products/edit-product/${product._id}`)}>Edit</button>
                        <button 
                        onClick={() => {
                          setRestockModalData({
                          quantity: "",
                          productId: product._id,
                          currentQuantity: product.quantity,
                        });
                        setRestockModalOpen(true)}}>Restock</button>
                      </div>
                    </div>
                      </>
                    
                    )})}

                  </div>
                </div>
              </div>
            </div>

            <div className="products-performance">
              <h3>Product performance</h3>
              <p>Movers, laggards and dead stock — last 90 days.</p>

              <div className="performance-card">
                <div className="performance-box">
                  <div className="performance-header">
                    <h4>Top Selling</h4>
                    <TrendingUp size={18} className="trend-green" />
                  </div>

                  <div className="performance-list">
                    <div className="performance-item">
                      <span>1</span>
                      <div>
                        <h5>Maggi 2-Minute Noodles</h5>
                        <p>8,800 units sold</p>
                      </div>
                      <strong>₹1,23,200</strong>
                    </div>

                    <div className="performance-item">
                      <span>2</span>
                      <div>
                        <h5>Amul Gold Full Cream Milk</h5>
                        <p>5,320 units sold</p>
                      </div>
                      <strong>₹3,83,040</strong>
                    </div>

                    <div className="performance-item">
                      <span>3</span>
                      <div>
                        <h5>Parle-G Original Biscuits</h5>
                        <p>2,100 units sold</p>
                      </div>
                      <strong>₹1,57,500</strong>
                    </div>
                  </div>
                </div>

                <div className="performance-box">
                  <div className="performance-header">
                    <h4>Slow Moving</h4>
                    <TrendingDown size={18} />
                  </div>

                  <div className="performance-list">
                    <div className="performance-item">
                      <span>1</span>
                      <div>
                        <h5>Mi Power Bank 20000mAh</h5>
                        <p>42 units sold</p>
                      </div>
                      <strong>₹79,758</strong>
                    </div>

                    <div className="performance-item">
                      <span>2</span>
                      <div>
                        <h5>Surf Excel Matic Liquid</h5>
                        <p>220 units sold</p>
                      </div>
                      <strong>₹1,15,500</strong>
                    </div>

                    <div className="performance-item">
                      <span>3</span>
                      <div>
                        <h5>Boat Rockerz 450 Headphones</h5>
                        <p>312 units sold</p>
                      </div>
                      <strong>₹4,67,688</strong>
                    </div>
                  </div>
                </div>

                <div className="performance-box">
                  <div className="performance-header">
                    <h4>Dead Stock</h4>
                    <PackageX size={18} className="trend-red" />
                  </div>

                  <div className="performance-list">
                    <div className="performance-item">
                      <span>1</span>
                      <div>
                        <h5>Mi Power Bank 20000mAh</h5>
                        <p>42 units sold</p>
                      </div>
                      <strong>₹79,758</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
       {selectedProduct && (
        <div className="product-drawer-overlay">
          <div className="product-drawer">
            <button className="drawer-close-btn" onClick={() => dispatch(clearSelectedProduct())}>×</button>
            <div className="drawer-product-header">
              <span className="product-avatar">
                  {selectedProduct.name?.split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase()}
              </span>
              <div>
                  <h3>{selectedProduct.name}</h3>
                  <p>
                    {selectedProduct.manufacturer || "No manufacturer"} ·{" "}
                    {selectedProduct.productCode}
                  </p>
              </div>

            </div>
            <p className="drawer-section-title">BASIC INFORMATION</p>
              <div className="drawer-card">
                <div>
                  <small>Product name</small>
                  <strong>{selectedProduct.name}</strong>
                </div>
                <div>
                  <small>Product code</small>
                  <strong>{selectedProduct.productCode}</strong>
                </div>
                <div>
                  <small>Category</small>
                  <strong>{selectedProduct.categoryId?.name || "Uncategorized"}</strong>
                </div>
                <div>
                  <small>Subcategory</small>
                  <strong>{selectedProduct.subCategory || "-"}</strong>
                </div>
                <div>
                  <small>Manufacturer</small>
                  <strong>{selectedProduct.manufacturer || "-"}</strong>
                </div>
                <div>
                  <small>Description</small>
                  <strong>{selectedProduct.description || "-"}</strong>
                </div>
              </div>

              <p className="drawer-section-title">PRICING</p>

              <div className="drawer-card two-col">
                <div>
                    <small>Purchase price</small>
                    <strong>₹{selectedProduct.purchasePrice}</strong>
                </div>
                <div>
                    <small>Selling price</small>
                    <strong>₹{selectedProduct.sellingPrice}</strong>
                </div>
                <div>
                    <small>Profit per unit</small>
                    <strong className="profit-text">
                        ₹{selectedProduct.sellingPrice - selectedProduct.purchasePrice}
                    </strong>
                </div>
              </div>

            <p className="drawer-section-title">TAX INFORMATION</p>

              <div className="drawer-card two-col">
                <div>
                    <small>HSN code</small>
                    <strong>{selectedProduct.hsnCode || "-"}</strong>
                </div>
                <div>
                    <small>GST rate</small>
                    <strong>{selectedProduct.gstRate}%</strong>
                </div>
              </div>

              <p className="drawer-section-title">INVENTORY</p>

                <div className="drawer-card two-col">
                  <div>
                    <small>Current quantity</small>
                    <strong>
                      {selectedProduct.quantity} 
                    </strong>
                  </div>
                  <div>
                    <small>Unit size</small>
                    <strong>
                        {selectedProduct.unit} {selectedProduct.unitType}
                    </strong>
                  </div>
                  <div>
                    <small>Expiry date</small>
                    <strong>
                        {selectedProduct.expiry
                            ? new Date(selectedProduct.expiry).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                              })
                            : "-"}
                    </strong>
                  </div>
                </div>

                <div className="drawer-actions">
                  <button className="drawer-restock-btn"  onClick={() => {
                          setRestockModalData({
                          quantity: "",
                          productId: selectedProduct._id,
                          currentQuantity: selectedProduct.quantity,
                        });
                        setRestockModalOpen(true)}}><RefreshCcw size={17}/>Restock</button>
                  <button className="drawer-edit-btn" onClick={()=>navigate(`/products/edit-product/${selectedProduct._id}`)}>
                    Edit product
                  </button>
                </div>

          </div>
        </div>
       )}


       {restockModalOpen && (
       
                
                 <div className="restock-modal-overlay">
                  <form onSubmit={handleRestockModalSubmit}>
                   <div className="restock-modal">
       
                     <div className="category-modal-header">
                       <div>
                         <p>RESTOCK</p>
                         <h2>Restock Product</h2>
                         <span>Update the quantity of this product in your inventory.</span>
                       </div>
       
                                             
                       <button type="button" className="restock-modal-close"
                         onClick={() => {
                          setRestockModalOpen(false);
                          dispatch(clearRestockError());
                          setRestockModalData({
                              quantity: "",
                               productId: "",
                        });
                       }}
                       >
                         <X size={18} />
                       </button>
                     </div>
       
                     {restockError && (
                   <div className="sticky-error">
                       {restockError}
                   </div>
                 )}
       
                    
                     <div className="restock-modal-body">

                      <div className="restock-field">
                           <label>Current Quantity </label>
                               <input type="number"  value={restockModalData.currentQuantity} disabled/>
                       </div>
       
                       <div className="restock-field">
                           <label>Increase Quantity By *</label>
                               <input type="number" name="quantity" placeholder="e.g. 100" value={restockModalData.quantity} onChange={handleRestockModalChange}/>
                       </div>
       
                       
       
                      </div>
       
                     <div className="restock-modal-footer">
       
                       <button className="restock-cancel-btn"
                       type="button"
                         onClick={() => {
                        // setRestockModalOpen(false);
                          dispatch(clearRestockError());
                          setRestockModalData({
                          quantity: "",
                            productId: "",
                          });
                       }}
                       >
                           Cancel
                       </button>
       
                       <button className="restock-save-btn" type="submit">
                             <Plus size={18} />
                             Restock Product
                       </button>
       
                     </div>
       
                   </div>
                 </form> 
               </div>
               )}

      </div>
    
    );
};

export default Products;