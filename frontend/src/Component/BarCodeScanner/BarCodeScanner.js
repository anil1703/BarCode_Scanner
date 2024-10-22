import "./BarCodeScanner.css";
import React, { useState } from "react";
import Cookies from "js-cookie";
import Header from "../Header/Header";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import tickSound from "../Sounds/tick.mp3"; // Importing tick sound
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const BarCodeScanner = () => {
  const isAdmin = Cookies.get("user");
  const [scannedData, setScannedData] = useState(""); // For storing scanned barcode
  const [cameraMode, setCameraMode] = useState("environment"); // Toggle between front and back camera
  const [processing, setProcessing] = useState(false); // Prevent multiple scans at once

  console.log("Current scanned data:", scannedData);

  // Function to switch camera modes
  const toggleCameraMode = () => {
    setCameraMode((prevMode) => (prevMode === "environment" ? "user" : "environment"));
  };

  const playSound = () => {
    const audio = new Audio(tickSound); // Play the tick sound
    audio.play();
  };

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const addToCart = async (text) => {
    const trimmedData = text.trim(); // Remove any whitespace from scanned data
    console.log("Scanned barcode:", trimmedData); // Log the scanned barcode

    try {
      const response = await axios.get(`https://joyful-yeot-66133c.netlify.app/.netlify/functions/api/getByBArCode/${trimmedData}`);
      const fetchedProduct = response.data.data; 
      console.log("neee",fetchedProduct); // Assuming the product data is returned directly

      if (fetchedProduct && fetchedProduct.product_id) {
        // Send product data to cart
        await axios.post("https://joyful-yeot-66133c.netlify.app/.netlify/functions/api/addToCart", { data: fetchedProduct.product_id }) // Send the product ID directly
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              notifySuccess("Product added to cart");
            } else {
              notifyError("Failed to add product to cart");
            }
          })
          .catch((error) => {
            notifyError("Error adding product to cart");
          });
      } else {
        notifyError("No product found with this barcode");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      notifyError("Error fetching product data");
    } finally {
      setProcessing(false); // Allow scanning again after processing
    }
  };

  return (
    <div className="arrangeHeadBody">
      <Header />
      <div className="bodyPart">
        <h1>Barcode Scanner</h1>
        <div className="body-part-dashboard">
          {isAdmin === "User" && (
            <>
              <div className="codeScannerDiv">
                <label>Enter the Barcode</label>
                <input
                  type="text"
                  className="inputStyle"
                  value={scannedData}
                  placeholder="Barcode value"
                  readOnly
                />
                <span>or</span>
                <label>Scan the Barcode</label>
                <div>
                  <BarcodeScannerComponent
                    width={400}
                    height={300}
                    onUpdate={(error, result) => {
                      if (result && !processing) {
                        playSound();
                        setProcessing(true); // Disable further scans while processing
                        setScannedData(result.text); // Update scanned data
                         // Play sound on successful scan
                        addToCart(result.text); // Add product to cart
                      }
                    }}
                    constraints={{ facingMode: cameraMode }} // Set camera mode
                  />
                </div>
                <button onClick={toggleCameraMode} className="toggle-camera-btn">
                  Switch to {cameraMode === "environment" ? "Front" : "Back"} Camera
                </button>
              </div>
              {scannedData && (
                <div>
                  <p>Scanned Barcode: {scannedData}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default BarCodeScanner;
