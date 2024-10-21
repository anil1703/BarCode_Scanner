import Header from "../Header/Header";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import Barcode from "react-barcode";
import toast, { Toaster } from 'react-hot-toast';
import "./AllProducts.css";

const AllProducts = () => {
  const check = Cookies.get("user");

  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const barcodeRef = useRef(); // Ref for barcode

  const notify = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  useEffect(() => {
    fetchProducts();
  });

  const fetchProducts = () => {
    axios.get('http://localhost:5000/allProducts')
      .then((response) => {
        setAllProducts(response.data.data);
        notify("Products fetched successfully");
      })
      .catch((error) => {
        notifyError("There is an issue while fetching the products");
      });
  };

  // Filter products based on search term (checking both product_id and name)
  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_id.toString().includes(searchTerm) // Checking product_id as well
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const deletingProduct = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (confirmed) {
      axios.delete(`http://localhost:5000/deleteProduct/${id}`)
        .then(() => {
          notify("Product deleted successfully");
          // Update state to remove the deleted product
          setAllProducts(allProducts.filter(product => product.product_id !== id));
        })
        .catch(() => {
          notifyError("There was an issue deleting the product");
        });
    }
  };

  const handlePrint = (productId) => {
    const barcodeElement = document.querySelector(`#barcode-${productId} svg`);
    if (barcodeElement) {
      const svgData = new XMLSerializer().serializeToString(barcodeElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
  
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
  
      img.onload = () => {
        // Set canvas size to match the barcode's width and height
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the SVG image onto the canvas
        ctx.drawImage(img, 0, 0);
  
        // Convert canvas to PNG and trigger download
        const imageUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = imageUrl;
        downloadLink.download = `barcode_${productId}.png`;
        downloadLink.click();
  
        // Cleanup
        URL.revokeObjectURL(url);
      };
  
      img.src = url;
    }
  };


  if (check === "Admin") {
    return (
      <div className="arrangeHeadBody">
        <Header />
        <div className="bodyPart">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1>All Products</h1>
            <div style={{ display: "flex" }}>
              <input 
                className="inputStyle" 
                type="search" 
                placeholder="Search products by name or ID..." 
                value={searchTerm} 
                onChange={handleSearch} 
              />
              <button>Search</button>
            </div>
          </div> 

          <div className="body-part-allProducts">
            <table style={{ width: "80%",height:"fit-content" }}>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Product Image</th>
                  <th>Bar Code</th>
                  <th>Action</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.product_id}</td>
                    <td>{product.name}</td>
                    <td>{product.price || 'N/A'}</td>
                    <td>
                      <img 
                        style={{ height: "100px", width: "100px" }} 
                        alt="Product" 
                        src={product.imageUrl} 
                      />
                    </td>
                    <td id={`barcode-${product.product_id}`}>
                      <Barcode
                        value={product.product_id}
                        width={1}
                        height={50}
                        displayValue={true}
                        fontSize={16}
                        background="#ffffff"
                        lineColor="#000000"
                        ref={barcodeRef} // Add ref to barcode
                      />
                    </td>
                    <td>
                      <button onClick={() => handlePrint(product.product_id)}>Download Barcode</button>
                    </td>
                    <td>
                      <button onClick={() => deletingProduct(product.product_id)}>Delete</button>
                    </td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  return null; 
};

export default AllProducts;
