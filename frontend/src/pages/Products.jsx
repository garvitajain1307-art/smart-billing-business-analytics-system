import { useState } from "react";
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
    Check
} from "lucide-react";
import "./Products.css";

const Products = () => {
    const [extended, setExtended] = useState(false);

    return (
      <div className={`products-page ${extended ? "extended" : ""}`}>
        <Sidebar extended={extended} setExtended={setExtended} />

        <div className="products-content">
          <div className="products-navbar">
    <div className="searchProducts">
        <Search size={20} className="search-icon" />
        <input
            type="text"
            placeholder="Search by product name, code or HSN..."
        />
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
                  <h2>10</h2>
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
                  <h2>6</h2>
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
                  <h2>3</h2>
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
                  <h2>1</h2>
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
                  <p>10 of 10 products</p>
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
                    <tr>
                      <td>
                        <div className="product-info">
                          <span className="product-avatar">HN</span>
                          <div>
                            <h4>Himalaya Neem Face Wash</h4>
                            <p>Himalaya Wellness</p>
                          </div>
                        </div>
                      </td>
                      <td>HM-NFW-100</td>
                      <td>
                        <span className="category-pill">Personal Care</span>
                      </td>
                      <td>3304</td>
                      <td>₹165</td>
                      <td>₹110</td>
                      <td>84</td>
                      <td>18%</td>
                      <td>
                        <span className="status in-stock">In Stock</span>
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
                    <h2>3</h2>
                  </div>

                  <div className="alert-list">
                    <div className="alert-item">
                      <div>
                        <h5>Amul Gold Full Cream Milk</h5>
                        <p>12 1 L left · AM-GLD-1L</p>
                      </div>
                      <div className="alert-actions">
                        <button>Edit</button>
                        <button>Restock</button>
                      </div>
                    </div>

                    <div className="alert-item">
                      <div>
                        <h5>Surf Excel Matic Liquid</h5>
                        <p>9 2 L left · SE-MTC-2L</p>
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
                    <h2>1</h2>
                  </div>

                  <div className="alert-list">
                    <div className="alert-item">
                      <div>
                        <h5>Tata Salt Iodized</h5>
                        <p>0 1 kg left · TS-IOD-1KG</p>
                      </div>
                      <div className="alert-actions">
                        <button>Edit</button>
                        <button>Restock</button>
                      </div>
                    </div>
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