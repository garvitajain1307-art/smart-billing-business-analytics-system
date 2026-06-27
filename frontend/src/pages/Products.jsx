import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
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
    Check,Dot
} from "lucide-react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import {setProductLoading,setProducts,setCategories,setSelectedProduct,addProduct,addCategory,updateProduct,deleteProduct,setProductError,clearProductError,clearProductSuccess,clearSelectedProduct} from "../features/product/productSlice"

const Products = () => {
    const [extended, setExtended] = useState(false);
    const [search,setSearch]=useState("");
    const [selectedCategory, setSelectedCategory] = useState("All categories");
    const [selectedStock, setSelectedStock] = useState("All stock");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [stockOpen, setStockOpen] = useState(false);
    const dispatch=useDispatch();
    const { products, loading, error } = useSelector((state) => state.product);
    
    
    useEffect(() => {
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

    fetchProducts();
}, []);
    
    const filteredProducts=products.filter((product)=>{
      const searchText=search.trim().toLowerCase();
      return(
        product.name.toLowerCase().includes(searchText)||
        product.productCode.toLowerCase().includes(searchText)||
        product.hsnCode.toLowerCase().includes(searchText)
      );
    })

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
        <button className="dropdown-trigger">
            All categories
            <ChevronDown size={18} />
        </button>

        {/*
        <div className="dropdown-menu">
            <div className="dropdown-option active">
                All categories
                <Check size={18} />
            </div>
            <div className="dropdown-option">Personal Care</div>
            <div className="dropdown-option selected">Dairy</div>
            <div className="dropdown-option">Groceries</div>
            <div className="dropdown-option">Electronics</div>
            <div className="dropdown-option">Household</div>
        </div>
        */}
    </div>

    <div className="custom-dropdown">
        <button className="dropdown-trigger">
            All stock
            <ChevronDown size={18} />
        </button>

        {/*
        <div className="dropdown-menu">
            <div className="dropdown-option active">
                All stock
                <Check size={18} />
            </div>
            <div className="dropdown-option">In Stock</div>
            <div className="dropdown-option selected">Low Stock</div>
            <div className="dropdown-option">Out of Stock</div>
        </div>
        */}
    </div>

    <button className="add-product-btn">
        <Plus size={20} />
        Add Product
    </button>
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
                          <Eye size={17} />
                          <Pencil size={17} />
                          <RefreshCw size={17} />
                          <Trash2 size={17} />
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
                        <p>{product.quantity} {product.unit} {product.unitType} left</p>
                      </div>
                      <div className="alert-actions">
                        <button>Edit</button>
                        <button>Restock</button>
                      </div>
                    </div>
                    )
                   })}

                    {/* <div className="alert-item">
                      <div>
                        <h5>Surf Excel Matic Liquid</h5>
                        <p>9 2 L left · SE-MTC-2L</p>
                      </div>
                      <div className="alert-actions">
                        <button>Edit</button>
                        <button>Restock</button>
                      </div>
                    </div> */}

                    
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
                        <p>0 {product.quantity} {product.unitType} left</p>
                      </div>
                      <div className="alert-actions">
                        <button>Edit</button>
                        <button>Restock</button>
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
                    <h2>3</h2>
                  </div>

                  <div className="alert-list">
                    <div className="alert-item">
                      <div>
                        <h5>Himalaya Neem Face Wash</h5>
                        <p>84 100 ml left · HM-NFW-100</p>
                      </div>
                      <div className="alert-actions">
                        <button>Edit</button>
                        <button>Restock</button>
                      </div>
                    </div>

                    <div className="alert-item">
                      <div>
                        <h5>Maggi 2-Minute Noodles</h5>
                        <p>420 70 g left · MG-2MN-70</p>
                      </div>
                      <div className="alert-actions">
                        <button>Edit</button>
                        <button>Restock</button>
                      </div>
                    </div>

                    <div className="alert-item">
                      <div>
                        <h5>Parle-G Original Biscuits</h5>
                        <p>6 800 g left · PG-ORG-800</p>
                      </div>
                      <div className="alert-actions">
                        <button>Edit</button>
                        <button>Restock</button>
                      </div>
                    </div>
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
      </div>
    );
};

export default Products;