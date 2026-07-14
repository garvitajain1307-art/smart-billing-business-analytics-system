
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import {
  ArrowLeft,
  X,
  Plus,
  Save,
  Info,
  IndianRupee,
  Boxes,
  Search,
  Tag,
  CheckCircle2,
  Circle,
  Box,
  TrendingUp,
  CalendarDays,ChevronDown,Check,
} from "lucide-react";
import "./AddProduct.css";
import { useDispatch, useSelector } from "react-redux";
import {setProductLoading,setProducts,setCategories,setSelectedProduct,addProduct,addCategory,updateProduct,deleteProduct,setProductError,clearProductError,clearProductSuccess,clearSelectedProduct,stopProductLoading,setCategoryError,clearCategoryError} from "../features/product/productSlice"

const AddProduct = () => {
  const [extended, setExtended] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [hsnSuggestions, setHsnSuggestions]=useState([]);
  const [hsnDescription,setHsnDescription]=useState("");
  const [hsnOpen, setHsnOpen] = useState(false);
  const [categoryModalOpen,setCategoryModalOpen]=useState(false);
  const [categoryModalData,setCategoryModalData]=useState({
    name:"",
    description:""
  });
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const { products, loading, error,categories,selectedProduct,categoryError } = useSelector((state) => state.product);
  const [addProductData, setAddProductData] = useState({
        name: "",
        productCode: "",
        categoryId: "",
        subCategory: "",
        manufacturer: "",
        description: "",
        purchasePrice: "",
        sellingPrice: "",
        quantity: "",
        unit: "",
        unitType: "",
        expiry: "",
        hsnCode: "",
        gstRate: "",
    });

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

      const fetchHsnSuggestions=async (value)=>{
        try{
          if(!value.trim()){
            setHsnSuggestions([]);
            setHsnDescription("");
            setHsnOpen(false);
            setAddProductData(prev => ({
              ...prev,
              hsnCode: "",
              gstRate: "",
            }));
            return;
          }

          const res = await fetch(
            
            `http://localhost:4000/api/v1/hsn/searchHsn?query=${value}`,
            {
              credentials: "include",
            }
         );
         const data = await res.json();
          if (!data.success) {
              dispatch(setProductError(data.message||"Failed to search HSN"));
                return;
          }
          setHsnSuggestions(data.hsnList || []);
          setHsnOpen((data.hsnList || []).length > 0);
          

        }catch(err){
          dispatch(setProductError("Failed to fetch HSN suggestions"));

        }
      }
      
      useEffect(() => {
          fetchCategories();
      },[]);

    const handleChange = (e) => {
            dispatch(clearProductError());
            setAddProductData({ ...addProductData, [e.target.name]: e.target.value });
    };
    const handleModalChange = (e) => {
            dispatch(clearCategoryError());
            setCategoryModalData({ ...categoryModalData, [e.target.name]: e.target.value });
    };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!addProductData.name.trim()) {
        dispatch(setProductError("Product name is required"));
        return;
    }

    if (!addProductData.productCode.trim()) {
      dispatch(setProductError("Product code is required"));
      return;
    }

    if (!addProductData.categoryId) {
      dispatch(setProductError("Please select a category"));
      return;
    }

    if (Number(addProductData.sellingPrice) <= 0) {
      dispatch(setProductError("Selling price must be greater than 0"));
      return;
    }

    if (Number(addProductData.purchasePrice) < 0) {
      dispatch(setProductError("Purchase price cannot be negative"));
      return;
    }

    if (Number(addProductData.purchasePrice) > Number(addProductData.sellingPrice)) {
      dispatch(setProductError("Purchase price cannot be greater than selling price"));
      return;
    }

    if (Number(addProductData.quantity) < 0) {
        dispatch(setProductError("Quantity cannot be negative"));
        return;
    }
    if (!addProductData.hsnCode.trim()) {
        dispatch(setProductError("Please enter HSN code"));
        return;
    }
    
        try {
          
            dispatch(setProductLoading());
    
            const res = await fetch("http://localhost:4000/api/v1/products/addProduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(addProductData),
            });
    
            let data = {};

            try {
              data = await res.json();
              console.log("ADD PRODUCT RESPONSE:", data);
            } catch (err) {
                data = {};
            }
    
            if (!res.ok || !data.success) {
              dispatch(
              setProductError(
                    data.message ||
                  data.error ||
                    data.errors?.[0]?.message ||
                 data.errors?.[0] ||
                  "Failed to add product"
                )
              );
             return;
          }


            
            
           
    
            
            dispatch(addProduct(data.product));
            dispatch(clearProductError());
            setAddProductData({
                name: "",
                productCode: "",
                categoryId: "",
                subCategory: "",
                manufacturer: "",
                description: "",
                purchasePrice: "",
                sellingPrice: "",
                quantity: "",
                unit: "",
                unitType: "",
                expiry: "",
                hsnCode: "",
                gstRate: "",
            });
            setSelectedCategory(null);
            setCategoryOpen(false);
            setHsnSuggestions([]);
            setHsnDescription("");
            setHsnOpen(false);
            navigate("/products")
            
    
        } catch (error) {
            console.log(error);
    dispatch(setProductError(error.message));
        } finally{
          dispatch(stopProductLoading());

        }
  };

  const handleModalSubmit = async(e) => {
    e.preventDefault();
    if (!categoryModalData.name.trim()) {
        dispatch(setCategoryError("Category name is required"));
        return;
    }

    if (!categoryModalData.description.trim()) {
      dispatch(setCategoryError("Category Description is required"));
      return;
    }

    
    
        try {
          
            dispatch(setProductLoading());
    
            const res = await fetch("http://localhost:4000/api/v1/category/addCategory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(categoryModalData),
            });
    
            let data = {};

            try {
              data = await res.json();
              console.log("ADD CATEGORY RESPONSE:", data);
            } catch (err) {
                data = {};
            }
    
            if (!res.ok || !data.success) {
              dispatch(
              setCategoryError(
                    data.message ||
                  data.error ||
                    data.errors?.[0]?.message ||
                 data.errors?.[0] ||
                  "Failed to add category"
                )
              );
             return;
          }


          const newCategory=data.category
          dispatch(addCategory(newCategory));
          setSelectedCategory(newCategory);
          setAddProductData((prev) => ({
            ...prev,
            categoryId: newCategory._id,
          }));
          dispatch(clearCategoryError());

          setCategoryModalData({
            name: "",
            description:""
          });
          setCategoryModalOpen(false);
          setCategoryOpen(false);
            
          
        } catch (error) {
            console.log(error);
    dispatch(setCategoryError(error.message));
        } finally{
          dispatch(stopProductLoading());

        }
  };

  const cancelBtnClicked=()=>{
    
            dispatch(clearProductError());
            setAddProductData({
                name: "",
                productCode: "",
                categoryId: "",
                subCategory: "",
                manufacturer: "",
                description: "",
                purchasePrice: "",
                sellingPrice: "",
                quantity: "",
                unit: "",
                unitType: "",
                expiry: "",
                hsnCode: "",
                gstRate: "",
            });
            setSelectedCategory(null);
            setCategoryOpen(false);
            setHsnSuggestions([]);
          setHsnDescription("");
          setHsnOpen(false);
          
  }

  
  
    const purchasePrice = Number(addProductData.purchasePrice || 0);
    const sellingPrice = Number(addProductData.sellingPrice || 0);
    const quantity=Number(addProductData.quantity || 0);

    const profitPerUnit = sellingPrice - purchasePrice;

    const margin =sellingPrice > 0? ((profitPerUnit / sellingPrice) * 100).toFixed(1): "0.0";
    const currInvVal=quantity*purchasePrice;
  return (
    <div className="add-product-layout">
      <Sidebar extended={extended} setExtended={setExtended} />

      <main
        className={`add-product-main ${extended ? "extended" : "collapsed"}`}
      >
        <form className="add-product-form-page" onSubmit={handleSubmit}>
          <header
            className={`add-product-header ${extended ? "extended" : "collapsed"}`}
          >
            <div className="add-product-title">
              <ArrowLeft size={18} onClick={()=>navigate("/products")} className="left-arrow-back"/>
              <div>
                <p>INVENTORY · NEW ITEM</p>
                <h1>Add New Product</h1>
                <span>
                  Create and manage inventory items for billing and stock
                  tracking.
                </span>
              </div>
            </div>

            <div className="add-product-actions">
              <button type="button" className="cancel-btn" onClick={cancelBtnClicked}>
                <X size={15} />
                Cancel
              </button>

              {/* <button type="button" className="add-another-btn" onClick={addAnotherBtnClicked}>
                <Plus size={15} />
                Save & Add Another
              </button> */}

              <button type="submit" className="save-product-btn">
                <Save size={15} />
                Save Product
              </button>
            </div>
          </header>
          
          {error && (
            <div className="sticky-error">
                {error}
            </div>
          )}

    
          <div className="add-product-body">
            
            <div className="add-product-left">
              <section className="product-card">
                <div className="product-card-header">
                  <div className="product-section-icon">
                    <Info size={17} />
                  </div>
                  <div>
                    <h3>Product information</h3>
                    <p>
                      Basic details to identify the product across billing,
                      inventory and analytics.
                    </p>
                  </div>
                </div>

                <div className="product-form-grid">
                  <div className="product-field">
                    <label>Product name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Himalaya Neem Face Wash"
                      value={addProductData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="product-field">
                    <label>Product code *</label>
                    <input
                      type="text"
                      name="productCode"
                      placeholder="e.g. HM-NFW-100"
                      value={addProductData.productCode}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="product-field">
                    <label>Category *</label>
                    <div className="custom-dropdown">
                      <button
                        type="button"
                        className="dropdown-trigger"
                        onClick={() => setCategoryOpen(!categoryOpen)}
                      >
                        {selectedCategory?.name || "Select category"}
                        <ChevronDown size={18} />
                      </button>

                      {categoryOpen && (
                        <div className="dropdown-menu">
                          {categories.map((category) => (
                            <div
                              className="dropdown-option"
                              key={category._id}
                              onClick={() => {
                                dispatch(clearProductError());
                                setSelectedCategory(category);
                                setAddProductData({
                                  ...addProductData,
                                  categoryId: category._id,
                                });
                                setCategoryOpen(false);
                              }}
                            >
                              {category.name}
                              {selectedCategory?._id === category._id && (
                                <Check size={17} />
                              )}
                            </div>
                          ))}
                          
                            <button type="button" className="dropdown-option add-category-option"
                               onClick={()=>{
                                setCategoryModalOpen(true);
                                setCategoryOpen(false);
                               }}
                            >
                              <Plus size={20} />
                              <span>Add Category</span>
                            </button>

                        </div>
                      )}
                    </div>
                  </div>

                  <div className="product-field">
                    <label>Subcategory</label>
                    <input
                      type="text"
                      name="subCategory"
                      placeholder="SubCategory"
                      value={addProductData.subCategory}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="product-field">
                    <label>Manufacturer / Brand</label>
                    <input
                      type="text"
                      name="manufacturer"
                      placeholder="e.g. Himalaya Wellness"
                      value={addProductData.manufacturer}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="product-field full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      placeholder="Short description for invoices and product page..."
                      value={addProductData.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </section>

              <section className="product-card">
                <div className="product-card-header">
                  <div className="product-section-icon">
                    <IndianRupee size={17} />
                  </div>
                  <div>
                    <h3>Pricing</h3>
                    <p>
                      Set purchase and selling prices. Profit and margin update
                      automatically.
                    </p>
                  </div>
                </div>

                <div className="product-form-grid">
                  <div className="product-field">
                    <label>Purchase price (₹)</label>
                    <input
                      type="number"
                      name="purchasePrice"
                      placeholder="0.00"
                      value={addProductData.purchasePrice}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="product-field">
                    <label>Selling price (₹) *</label>
                    <input
                      type="number"
                      name="sellingPrice"
                      placeholder="0.00"
                      value={addProductData.sellingPrice}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="product-metric">
                    <p>PROFIT PER UNIT</p>

                    <h3>₹{profitPerUnit.toFixed(2)}</h3>
                    <TrendingUp size={17} />
                  </div>

                  <div className="product-metric">
                    <p>PROFIT MARGIN</p>
                    <h3>{margin}%</h3>
                    <TrendingUp size={17} />
                  </div>
                </div>
              </section>

              <section className="product-card">
                <div className="product-card-header">
                  <div className="product-section-icon">
                    <Boxes size={17} />
                  </div>
                  <div>
                    <h3>Inventory</h3>
                    <p>
                      Opening stock, packaging and shelf-life details for stock
                      tracking.
                    </p>
                  </div>
                </div>

                <div className="inventory-grid">
                  <div className="product-field">
                    <label>Opening quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      placeholder="0"
                      value={addProductData.quantity}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="product-field">
                    <label>Unit size</label>
                    <input
                      type="number"
                      name="unit"
                      placeholder="100"
                      value={addProductData.unit}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="product-field">
                    <label>Unit</label>
                    <select
                      name="unitType"
                      value={addProductData.unitType}
                      onChange={handleChange}
                    >
                      <option value="">unit</option>
                      <option value="pcs">pcs</option>
                      <option value="kg">kg</option>
                      <option value="gm">gm</option>
                      <option value="lit">lit</option>
                      <option value="ml">ml</option>
                    </select>
                  </div>

                  <div className="product-field">
                    <label>Expiry date</label>
                    <div className="input-with-icon">
                      <input
                        type="date"
                        name="expiry"
                        value={addProductData.expiry}
                        onChange={handleChange}
                      />
                      {/* <CalendarDays size={16} /> */}
                    </div>
                  </div>
                </div>

                <div className="inventory-value-box">
                  <p>CURRENT INVENTORY VALUE</p>
                  <h3>₹{currInvVal.toFixed(2)}</h3>
                  {currInvVal===0 && (<span>Enter quantity and purchase price</span>)}
                </div>
              </section>

              <section className="product-card">
                <div className="product-card-header">
                  <div className="product-section-icon">
                    <Tag size={17} />
                  </div>
                  <div>
                    <h3>GST & tax</h3>
                    <p>
                      Search the HSN registry — description and GST rate fill
                      automatically.
                    </p>
                  </div>
                </div>

                <div className="product-form-grid">
                  <div className="product-field">
                    <label>HSN code</label>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        name="hsnCode"
                        placeholder="Search HSN code or description..."
                        value={addProductData.hsnCode}
                        onChange={(e)=>{
                          const value=e.target.value;
                          dispatch(clearProductError());
                          setAddProductData({
                            ...addProductData,
                            hsnCode:value,
                            gstRate:""
                          });

                          setHsnDescription("");
                          fetchHsnSuggestions(value);
                        }}
                      />
                      <Search size={16} />
                    </div>
                    {hsnOpen && hsnSuggestions.length > 0 && (
                        <div className="hsn-suggestions">
                          {hsnSuggestions.map((hsn) => (
                              <div key={hsn._id} className="hsn-suggestion-item"
                                  onClick={() => {
                                  setAddProductData(prev => ({
                                      ...prev,
                                     hsnCode: hsn.hsnCode,
                                     gstRate: hsn.gstRate,
                                  }));

                        setHsnDescription(hsn.description);
                        setHsnOpen(false);
                        setHsnSuggestions([]);
                    }}>
                        <div>
                            <strong>{hsn.hsnCode}</strong>
                            <p>{hsn.description}</p>
                        </div>

                        <span>{hsn.gstRate}%</span>
                     </div>
                    ))}
                  </div>
                )}
                  </div>

                  <div className="product-field">
                    <label>GST rate   %</label>
                    <input type="text" disabled name="gstRate" placeholder="Pick HSN to detect" value={addProductData.gstRate } />
                  </div>

                  <div className="product-field full-width">
                    <label>HSN description</label>
                    <input
                      type="text"
                      placeholder="Select an HSN code to see its official description."
                      value={hsnDescription}
                      disabled
                    />
                  </div>
                </div>
              </section>
            </div>

            <aside className="add-product-right">
              <div className="side-card">
                <div className="side-card-top">
                  <p>LIVE PREVIEW</p>
                  <span>Draft</span>
                </div>

                <div className="preview-product">
                  <div className="preview-icon">
                    <Box size={19} />
                  </div>
                  <div>
                    <h3>{addProductData.name || "Untitled product"}</h3>
                    <p>
                      {addProductData.manufacturer || "Manufacturer / Brand"}
                    </p>
                  </div>
                </div>

                <div className="preview-grid">
                  <div>
                    <p>SELLING PRICE</p>
                    <h4>₹{sellingPrice.toFixed(2)}</h4>
                  </div>
                  <div>
                    <p>PURCHASE PRICE</p>
                    <h4>₹{purchasePrice.toFixed(2)}</h4>
                  </div>
                  <div>
                    <p>PROFIT / UNIT</p>
                    <h4>₹{profitPerUnit.toFixed(2)}</h4>
                  </div>
                  <div>
                    <p>MARGIN</p>
                    <h4>{margin}%</h4>
                  </div>
                  <div>
                    <p>QUANTITY</p>
                    <h4>
                      {" "}
                      {addProductData.quantity || 0} ×{" "}
                      {addProductData.unit || 1}{" "}
                      {addProductData.unitType || "unit"}
                    </h4>
                  </div>
                  <div>
                    <p>GST RATE</p>
                    <h4>{addProductData.gstRate || "—"}%</h4>
                  </div>
                </div>
              </div>

              <div className="side-card">
                <h3 className="check-title">Completion checklist</h3>

                <div className={addProductData.name?"check-row active":"check-row"}>
                  {addProductData.name ?<CheckCircle2 size={16} />:<Circle size={16} /> }
                  
                  <span>Product name</span>
                </div>

                <div className={addProductData.productCode?"check-row active":"check-row"}>
                  {addProductData.productCode ?<CheckCircle2 size={16} />:<Circle size={16} /> }
                  
                  <span>Unique product code</span>
                </div>

                <div className={addProductData.categoryId?"check-row active":"check-row"}>
                  {addProductData.categoryId ?<CheckCircle2 size={16} />:<Circle size={16} /> }
                  <span>Category selected</span>
                </div>

                <div className={addProductData.sellingPrice?"check-row active":"check-row"}>
                  {addProductData.sellingPrice ?<CheckCircle2 size={16} />:<Circle size={16} /> }
                  <span>Selling price set</span>
                </div>

                <div className={addProductData.hsnCode?"check-row active":"check-row"}>
                  {addProductData.hsnCode ?<CheckCircle2 size={16} />:<Circle size={16} /> }
                  <span>Valid HSN / GST</span>
                </div>

                <div className={addProductData.quantity?"check-row active":"check-row"}>
                  {addProductData.quantity ?<CheckCircle2 size={16} />:<Circle size={16} /> }
                  <span>Opening stock</span>
                </div>
              </div>
            </aside>
          </div>
        </form>
        {categoryModalOpen && (

         
          <div className="category-modal-overlay">
           <form onSubmit={handleModalSubmit}>
            <div className="category-modal">

              <div className="category-modal-header">
                <div>
                  <p>CATEGORY</p>
                  <h2>Add New Category</h2>
                  <span>Create a new category for organizing your inventory.</span>
                </div>

                                      
                <button type="button" className="category-modal-close"
                  onClick={() => {
                  setCategoryModalOpen(false);
                  clearCategoryError();
                  setCategoryModalData((prev) => ({
                  ...prev,
                  name: "",
                  description: "",
                  }));
                }}
                >
                  <X size={18} />
                </button>
              </div>

              {categoryError && (
            <div className="sticky-error">
                {categoryError}
            </div>
          )}

             
              <div className="category-modal-body">

                <div className="category-field">
                    <label>Category Name *</label>
                        <input type="text" name="name" placeholder="e.g. Dairy Products" value={categoryModalData.name} onChange={handleModalChange}/>
                </div>

                <div className="category-field">
                     <label>Description</label>
                       <textarea rows="4" name="description" placeholder="Short description for this category..." value={categoryModalData.description} onChange={handleModalChange}></textarea>
                </div>

               </div>

              <div className="category-modal-footer">

                <button className="category-cancel-btn"
                   type="button"
                  onClick={() => {
                  clearCategoryError()
                  setCategoryModalData({
                  
                  name: "",
                  description: "",
                  });
                }}
                >
                    Cancel
                </button>

                <button className="category-save-btn" type="submit">
                      <Plus size={18} />
                      Add Category
                </button>

              </div>

            </div>
          </form> 
        </div>
        )}
      </main>
    </div>
  );
};

export default AddProduct;

