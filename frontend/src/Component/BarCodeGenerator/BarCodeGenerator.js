import React, { useState, useRef } from "react";
import Cookies from "js-cookie";
import Header from "../Header/Header";
import Barcode from "react-barcode";
import html2canvas from "html2canvas";
import "./BarCodeGenerator.css";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

const BarCodeGenerator = () => {
  const check = Cookies.get("user");

  const [productName, setProductName] = useState("");
  const [barcodeValue, setBarcodeValue] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [price,setPrice] = useState("")
  const notify = (msg) => toast.success(msg)
  const notifyError = (msg) => toast.error(msg)

  const barcodeRef = useRef(null);

  // Function to handle form submission
  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!image) {
      notifyError("Please upload an image before generating a barcode.");
      return;
    }

    setLoading(true); // Start loading

    const uniqueBarcode = uuidv4().slice(0, 8); // Generate a unique barcode value
    setBarcodeValue(uniqueBarcode);

    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "bar_codes");

      // Upload image to Cloudinary
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/dafmi9027/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await cloudinaryResponse.json();

      if (result.secure_url) {
        setImageUrl(result.secure_url); // Set the uploaded image URL

        // Prepare data for backend
        const data = {
          name: productName,
          imageUrl: result.secure_url,
          product_id: uniqueBarcode,
          price:price
        };

        // Send data to backend
        await axios.post("http://localhost:5000/barcodeGenerator", data);
        notify("Barcode generated and product saved successfully!");

        // Reset the form
        setProductName("");
        setImage(null);
        setPrice("")
      } else {
        notifyError("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image or generating barcode:", error);
      alert("Error uploading image or generating barcode. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5000000) {
      alert("File size exceeds the limit (5MB). Please upload a smaller image.");
      return;
    }
    if (!file.type.includes("image")) {
      alert("Please upload a valid image file.");
      return;
    }
    setImage(file);
    setImageUrl("");
  };

  // Function to handle download of the barcode
  const handlePrint = () => {
    const barcodeElement = barcodeRef.current;
    html2canvas(barcodeElement).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${barcodeValue}.png`;
      link.click();
    });
  };

  if (check === "Admin") {
    return (
      <div className="arrangeHeadBody">
        <Header />
        <div className="bodyPart">
          <h1>Bar Code Generator</h1>
          <div className="generatorFlex">
            <form className="formStyle" onSubmit={handleGenerate}>
              <label>Name of the Product</label>
              <input
                className="inputStyle"
                type="text"
                id="barcode"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter the product name"
                required
              />
              <label for="Price">Price</label>
              <input
              className="inputStyle"
              type="number"
              id="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter the price"
              required/>

              <label>Upload Picture</label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {image && (
                <div>
                  <p>Uploaded Image:</p>
                  <img src={URL.createObjectURL(image)} alt="Product" width="100" />
                </div>
              )}

              <button className="buttonStyle" type="submit" disabled={loading}>
                {loading ? "Generating..." : "Generate"}
              </button>
              <Toaster />
            </form>

      

            <div className="generatorDiv">
              {barcodeValue && imageUrl && ( // Show barcode only if image is uploaded successfully
                <>
                  <div ref={barcodeRef} className="barcodeContainer">
                    <Barcode
                      value={barcodeValue}
                      width={2}
                      height={100}
                      displayValue={true}
                      fontSize={16}
                      background="#ffffff"
                      lineColor="#000000"
                    />
                  </div>
                  <button className="buttonStyle" onClick={handlePrint}>
                    Download
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null; // If the user is not Admin, render nothing
};

export default BarCodeGenerator;
